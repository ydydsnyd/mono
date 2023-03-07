import base64 from 'base-64';

export const encode = (data: Uint8Array) => {
  let len = data.byteLength;
  let binary = '';
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return base64.encode(binary);
};

export const decode = (b64: string) => {
  let raw: string | undefined;
  try {
    raw = base64.decode(b64);
  } catch (e) {
    console.error('attempted to decode invalid base64 string:', b64);
    return new Uint8Array();
  }
  let data = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    data[i] = raw[i].charCodeAt(0);
  }
  return data;
};
