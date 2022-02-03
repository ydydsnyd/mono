export interface Bindings {
  server: DurableObjectNamespace;
}

async function fetch(request: Request, env: Bindings) {
  // Match route against pattern /:name/*action
  const url = new URL(request.url);

  if (url.pathname !== "/connect") {
    return new Response("unknown route", {
      status: 400,
    });
  }

  const roomID = url.searchParams.get("roomID");
  if (roomID === null || roomID === "") {
    return new Response("roomID parameter required", {
      status: 400,
    });
  }

  // Forward the request to the named Durable Object...
  const { server } = env;
  const id = server.idFromName(roomID);
  const stub = server.get(id);
  return stub.fetch(request);
}

export const worker: ExportedHandler<Bindings> = { fetch };
