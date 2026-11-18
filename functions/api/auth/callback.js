/**
 * Cloudflare Pages Function - GitHub OAuth callback for Decap CMS
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieHeader = request.headers.get('Cookie') || '';
  const storedState = cookieHeader.match(/oauth_state=([^;]+)/)?.[1];

  if (!code || !state || state !== storedState) {
    return new Response(
      `<html><body><script>
        window.opener && window.opener.postMessage('authorization:github:error:State mismatch or missing code', '*');
        window.close();
      </script><p>Authorization failed. You can close this window.</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('Missing OAuth credentials', { status: 500 });
  }

  // 用 code 换取 access_token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error || !tokenData.access_token) {
    return new Response(
      `<html><body><script>
        window.opener && window.opener.postMessage('authorization:github:error:${tokenData.error || 'no_token'}', '*');
        window.close();
      </script><p>Token exchange failed. You can close this window.</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  const token = tokenData.access_token;

  // 把 token 传回打开此窗口的 Decap CMS 页面
  return new Response(
    `<html><body><script>
      const receiveMessage = (event) => {
        if (event.origin !== window.location.origin && event.data !== 'authorizing:github') return;
        window.opener.postMessage('authorization:github:success:${JSON.stringify({ token, provider: 'github' })}', event.origin);
        window.removeEventListener('message', receiveMessage, false);
        window.close();
      };
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    </script>
    <p>授权成功，正在关闭窗口...</p>
    </body></html>`,
    {
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0',
      },
    }
  );
}
