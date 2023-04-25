import type {MutatorDefs, Reflect} from '@rocicorp/reflect';

export function closeReflect<M extends MutatorDefs>(r: Reflect<M>) {
  // TODO(reflect): improve this inside Reflect.
  // Need to give any outstanding operations time to complete or else get IDB closing error.
  window.setTimeout(() => r.close(), 1000);
}
