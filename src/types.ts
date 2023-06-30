export type IPCD = {
  header: {
    count: number[];
    data: "binary" | "ascii";
    fields: ["x", "y", "z", "intensity"];
    headerLen: number;
    height: number;
    offset: { x: number; y: number; z: number; intensity: number };
    points: number;
    rowSize: number;
    size: [number, number, number, number];
    str: string;
    type: ["F", "F", "F", "F"];
    version: number;
    viewpoint: {
      tx: number;
      ty: number;
      tz: number;
      qw: number;
      qx: number;
      qy: number;
      qz: number;
    };
    width: number;
  };
  label: number[];
  object: number[];
  position: number[];
  intensity: number[];
};

export type IPosition = {
  x: number;
  y: number;
};

export type IPoint = [x: number, y: number];

export type ICloudPosition = {
  x: number;
  y: number;
  z: number;
  labelIndex: number;
};

export type IShaderMode = "gray" | "intensity" | "height";

export type ICssSize = {
  width: number | string;
  height: number | string;
};
