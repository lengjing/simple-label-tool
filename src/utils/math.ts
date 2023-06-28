export const PI = Math.PI;

export const DOUBLEPI = PI * 2;

export const modulo = (x: number) => ((x % DOUBLEPI) + DOUBLEPI) % DOUBLEPI;

export const moduloHalfPI = (x: number) => modulo(x + PI) - PI;
