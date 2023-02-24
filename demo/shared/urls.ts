export function getServiceHost(env: Record<string, string | undefined>) {
  return env.NEXT_PUBLIC_WORKER_HOST ?? 'http://127.0.0.1:8787';
}

export function getWorkerHost(env: Record<string, string>) {
  const sh = getServiceHost(env);
  return sh.replace(/^http/, 'ws');
}
