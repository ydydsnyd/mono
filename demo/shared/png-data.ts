import base64 from 'base-64';

export const encodePngData = (data: Uint8Array) => {
  let len = data.byteLength;
  let binary = '';
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return base64.encode(binary);
};

export const decodePngData = (png: string) => {
  const raw = base64.decode(png);
  let data = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    data[i] = raw[i].charCodeAt(0);
  }
  return data;
};
