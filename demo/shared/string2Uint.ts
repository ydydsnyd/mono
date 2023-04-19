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
