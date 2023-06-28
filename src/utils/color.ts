import Color from "color";

export const genHslColorMap = (size = 360) => {
  const obj:{[k: string]: any} = {};
  Array.from(Array(size)).map((v, i) => {
    obj[i] = Color.hsl([i, 50, 50]).hex();
  });
  return obj;
};

export const hex2rgb = (hex: string) => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 256;
  const g = parseInt(hex.substring(2, 4), 16) / 256;
  const b = parseInt(hex.substring(4, 6), 16) / 256;
  return [r, g, b];
};
