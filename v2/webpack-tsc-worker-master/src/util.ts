const imul = (opA: number, opB: number) => {
  opB |= 0;
  var result = (opA & 0x003fffff) * opB;
  if (opA & 0xffc00000 /*!== 0*/) result += ((opA & 0xffc00000) * opB) | 0;
  return result | 0;
};

export const cyrb53 = function (str: string, seed: number = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = imul(h1 ^ ch, 2654435761);
    h2 = imul(h2 ^ ch, 1597334677);
  }
  h1 = imul(h1 ^ (h1 >>> 16), 2246822507) ^ imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = imul(h2 ^ (h2 >>> 16), 2246822507) ^ imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const setContentHtml = (html: string) => {
  document.getElementsByClassName("content")[0].innerHTML = html;
};
