import base64 from 'base-64';

export const encode = (data: Uint8Array) => {
  return base64.encode(uint8Array2String(data));
};

export const decode = (b64: string) => {
  let raw: string | undefined;
  try {
    raw = base64.decode(b64);
  } catch (e) {
    console.error('attempted to decode invalid base64 string:', b64);
    return;
  }
  return string2Uint8Array(raw);
};

export const string2Uint8Array = (raw: string) => {
  let data = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    data[i] = raw[i].charCodeAt(0);
  }
  return data;
};
export const uint8Array2String = (data: Uint8Array) => {
  let len = data.byteLength;
  let binary = '';
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return binary;
};
