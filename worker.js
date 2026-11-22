
import { onRequest as handleAuth } from "./functions/api/auth.js";
import { onRequest as handleCallback } from "./functions/api/auth/callback.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth") {
      return handleAuth({ request, env });
    }

    if (url.pathname === "/api/auth/callback") {
      return handleCallback({ request, env });
    }

    return env.ASSETS.fetch(request);
  },
};
