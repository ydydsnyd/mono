export default {
  fetch(request, env) {
    // const id = env.testDO.newUniqueId();
    const id = env.testDO.idFromName('test');
    const durableObject = env.testDO.get(id);
    return durableObject.fetch(request.url, request);
  },
};

export class TestDO {
  constructor(controller, env) {
    this.storage = controller.storage;
    this.env = env;
  }

  async fetch(request) {
    let c = (await this.storage.get('counter')) ?? 0;
    c++;
    await this.storage.put('counter', c);

    return new Response(
      JSON.stringify(
        {
          url: request.url,
          env: this.env,
          counter: c,
        },
        null,
        2,
      ),
      {headers: {'content-type': 'application/json'}},
    );
  }
}
