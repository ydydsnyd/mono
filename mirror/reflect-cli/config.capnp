# API
# https://github.com/cloudflare/workerd/blob/main/src/workerd/server/workerd.capnp

# Example usage here:
# https://github.com/cloudflare/workerd/tree/30f053b0a7154ad129460d296c59aeb823f336e7/samples/durable-objects-chat

# Build your own FaaS
# https://www.breakp.dev/blog/build-your-own-faas/
# https://github.com/giuseppelt/self-workerd

using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "worker", worker = .worker),
    # (name = "diskx", disk = .diskx),
  ],

  sockets = [(name = "http", address = "*:8080", http = (), service = "worker")],
);

const worker :Workerd.Worker = (
  compatibilityDate = "2023-02-28",
  modules = [(name = "worker.js", esModule = embed "_worker.js")],

  durableObjectNamespaces = [
    (className = "TestDO"),
  ],

  durableObjectStorage = (inMemory = void),
  # durableObjectStorage = (localDisk = "diskx"),

  bindings = [
    (name = "testDO", durableObjectNamespace = "TestDO"),
    (name = "meta", json = embed "_meta.json"),
  ],
);

# const diskx :Workerd.DiskDirectory = (
#   path = "???",
#   writable = true,
# );