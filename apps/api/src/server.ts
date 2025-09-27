import { Server } from "bun";
import { registerHealth } from "./routes/health";
import { registerJudge } from "./routes/judge";
import { PORT } from "./config";

interface Route {
  path: string;
  handler: (req: Request) => Promise<Response> | Response;
}

export type RouteHandler = (req: Request) => Promise<Response> | Response;

const routes: Route[] = [];

function matchRoute(routePath: string, requestPath: string): boolean {
  const routeParts = routePath.split("/");
  const requestParts = requestPath.split("/");

  console.log(`Matching: "${routePath}" vs "${requestPath}"`);
  console.log(`Route parts:`, routeParts);
  console.log(`Request parts:`, requestParts);

  if (routeParts.length !== requestParts.length) {
    console.log(
      `Length mismatch: ${routeParts.length} vs ${requestParts.length}`
    );
    return false;
  }

  const matches = routeParts.every((routePart, i) => {
    const isMatch = routePart.startsWith(":") || routePart === requestParts[i];
    console.log(
      `Part ${i}: "${routePart}" vs "${requestParts[i]}" = ${isMatch}`
    );
    return isMatch;
  });
  console.log(`Final match result:`, matches);
  return matches;
}

export function registerRoute(path: string, handler: RouteHandler) {
  console.log(`Registering route: ${path}`);
  routes.push({ path, handler });
}

const server = Bun.serve({
  port: process.env.PORT || 3000,
  fetch(req) {
    const url = new URL(req.url);
    console.log(`Incoming request: ${url.pathname}`);
    const route = routes.find((r) => matchRoute(r.path, url.pathname));

    if (route) {
      console.log(`Matched route: ${route.path} for request: ${url.pathname}`);
      return route.handler(req);
    }
    console.log(`No route matched for: ${url.pathname}`);
    console.log(
      `Available routes:`,
      routes.map((r) => r.path)
    );
    return new Response("Not Found", { status: 404 });
  },
});

registerHealth();
registerJudge();

console.log(`Server running at http://localhost:${server.port}`);
console.log(`Total registered routes:`, routes.length);
routes.forEach((route) => console.log(`  - ${route.path}`));
