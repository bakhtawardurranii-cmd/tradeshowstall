/**
 * tradeshowstall.com — canonicalization Worker
 *
 * Use this if the site is hosted on GitHub Pages with the domain's
 * DNS/proxy running through Cloudflare (very common setup: GitHub
 * Pages can't run server-side redirects on its own, but Cloudflare
 * sitting in front of it can).
 *
 * Setup:
 *   1. Cloudflare dashboard -> Workers & Pages -> Create Worker.
 *   2. Paste this file as the Worker script.
 *   3. Add a Route for the zone: tradeshowstall.com/* and www.tradeshowstall.com/*
 *   4. Make sure "Always Use HTTPS" is ON for the zone (handles the
 *      http -> https leg at the edge before this Worker even runs).
 *
 * Every match below issues exactly ONE 301 — no chains, no loops.
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let host = url.hostname;
    let path = url.pathname;
    let needsRedirect = false;

    // www -> non-www
    if (host === "www.tradeshowstall.com") {
      host = "tradeshowstall.com";
      needsRedirect = true;
    }

    // /index.html (root or any folder) -> its directory root
    if (path === "/index.html") {
      path = "/";
      needsRedirect = true;
    } else if (path.endsWith("/index.html")) {
      path = path.slice(0, -"index.html".length);
      needsRedirect = true;
    }

    if (needsRedirect) {
      const target = `https://${host}${path}${url.search}`;
      return Response.redirect(target, 301);
    }

    return fetch(request);
  },
};
