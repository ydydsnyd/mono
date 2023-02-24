export const SERVICE_HOST =
  process.env.NEXT_PUBLIC_WORKER_HOST || 'http://127.0.0.1:8787';

export const WORKER_HOST = SERVICE_HOST.replace(/^http/, 'ws');
