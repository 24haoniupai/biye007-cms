
/**
 * Cloudflare Pages Function
 * GitHub OAuth callback for Decap CMS
 */

function htmlResponse(script, status = 200) {
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>GitHub Authorization</title></head>
      <body>
        <p>GitHub 授权处理中，请稍候...</p>
        <script>${script}</script>
      </body>
    </html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
        'Set-Cookie': 'oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
      }
    }
  );
}

function sendError(message, status = 400) {
  const payload = JSON.stringify(
    `authorization:github:error:${message}`
  ).replace(/</g, '\\u003c');

  return htmlResponse(`
    const message = ${payload};
    if (window.opener) {
      window.opener.postMessage(message, window.location.origin);
    }
    window.close();
  `, status);
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauthError = url.searchParams.get('error');

  if (oauthError) {
    return sendError('GitHub authorization was denied');
  }

  const cookieHeader = request.headers.get('Cookie') || '';
  const storedState = cookieHeader
    .split(';')
    .map(item => item.trim())
    .find(item => item.startsWith('oauth_state='))
    ?.slice('oauth_state='.length);

  if (!code || !state || !storedState || state !== storedState) {
    return sendError('State mismatch or missing code');
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return sendError('Missing OAuth credentials', 500);
  }

  const redirectUri = `${url.origin}/api/auth/callback`;

  try {
    const tokenRes = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri
        })
      }
    );

    if (!tokenRes.ok) {
      return sendError('GitHub token request failed', 502);
    }

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return sendError('GitHub did not return an access token', 502);
    }

    const token = tokenData.access_token;

    const payload = JSON.stringify(
      `authorization:github:success:${JSON.stringify({
        token,
        provider: 'github'
      })}`
    ).replace(/</g, '\\u003c');

    return htmlResponse(`
      if (!window.opener) {
        document.body.textContent = '无法找到 CMS 登录窗口，请重新登录。';
      } else {
        const receiveMessage = (event) => {
          if (
            event.origin !== window.location.origin ||
            event.data !== 'authorizing:github'
          ) {
            return;
          }

          window.opener.postMessage(
            ${payload},
            event.origin
          );

          window.removeEventListener('message', receiveMessage);
          window.close();
        };

        window.addEventListener('message', receiveMessage);
        window.opener.postMessage(
          'authorizing:github',
          window.location.origin
        );
      }
    `);

  } catch (error) {
    return sendError('OAuth callback processing failed', 500);
  }
}
