import {resolver} from '@rocicorp/resolver';
import {
  PatchOperation,
  Puller,
  PullerResultV1,
  PullResponseOKV1,
  Replicache,
  TEST_LICENSE_KEY,
} from 'replicache';
import './style.css';

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `;

const numberOfKeys = 4_000;
const stringLength = 20_000;
const reset = false;

function randomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function log(s: string) {
  document.querySelector<HTMLDivElement>('#app')!.append('\n' + s);
}

let didPull = false;

const puller: Puller = async () => {
  if (didPull) {
    return Promise.resolve({
      httpRequestInfo: {errorMessage: '', httpStatusCode: 200},
    } satisfies PullerResultV1);
  }
  let patch: PatchOperation[];

  if (reset) {
    log('reset');
    patch = [
      {
        op: 'clear',
      },
    ];
  } else if (await hasInitP) {
    patch = [];
    log('has IDB. Empty patch in pull.');
    log('Data will be loaded from IDB.');
  } else {
    log('No IDB. Returning patch in pull...');
    log('...but this will have all the data in memory');
    patch = Array.from({length: numberOfKeys}, (_, i) => ({
      op: 'put',
      key: `key${i}`,
      value: randomString(stringLength),
    }));
    patch.push({
      op: 'put',
      key: '.init',
      value: true,
    });
  }

  const response: PullResponseOKV1 = {
    cookie: Date.now(),
    lastMutationIDChanges: {},
    patch,
  };

  didPull = true;
  return Promise.resolve({
    httpRequestInfo: {errorMessage: '', httpStatusCode: 200},
    response,
  } satisfies PullerResultV1);
};

const rep = new Replicache({
  name: 'fika-perf',
  pullURL: '',
  pushURL: '',
  licenseKey: TEST_LICENSE_KEY,
  mutators: {},
  puller,
});

const {promise, resolve} = resolver<void>();

const hasInitP = rep.query(tx => tx.has('.init'));
const hasInit = await hasInitP;
log('hasInit: ' + hasInit);

const cancel = rep.subscribe(
  tx => tx.has('.init'),
  v => {
    if (v) {
      cancel();
      resolve();
    }
  },
);

await promise;

log('Done');
log('Starting watch');
const startTime = performance.now();

const cancel2 = rep.experimentalWatch(
  diffs => {
    log(
      `${diffs.length} diffs in ${Math.round(performance.now() - startTime)}ms`,
    );
    performance.mark('Done');
    cancel2();
  },
  {initialValuesInFirstDiff: true},
);
