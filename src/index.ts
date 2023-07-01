import { createSLTApp, createStore } from "./slt";

createSLTApp({
  container: document.getElementById("app")!,
  store: createStore({
    classifications: [
      { name: "car", color: "aliceblue" },
      { name: "person", color: "antiquewhite" },
      { name: "bicycle", color: "aqua", properties: [] },
    ],
    elements: [
      {
        type: "rect",
        position: { x: 10, y: 10 },
        value: { width: 100, height: 100 },
        id: "a",
        color: "red",
        visible: true,
        key: 'car',
        uuid: '1111',
      },
    ],
  }),
});
