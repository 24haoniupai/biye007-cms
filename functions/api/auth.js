/**
 * Cloudflare Pages Function - GitHub OAuth for Decap CMS
 * 基于 https://github.com/i40west/netlify-cms-cloudflare-pages
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 开始 OAuth 流程
  if (url.pathname === '/api/auth') {
    const clientId = env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return new Response('Missing GITHUB_CLIENT_ID', { status: 500 });
    }

    const redirectUri = `${url.origin}/api/auth/callback`;
    const scope = 'repo,user';
    const state = crypto.randomUUID();

    // 把 state 存到 cookie
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: githubAuthUrl,
        'Set-Cookie': `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      },
    });
  }

  return new Response('Not Found', { status: 404 });
}
