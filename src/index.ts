import { createSLTApp, createStore } from "./slt";

createSLTApp({
  container: document.getElementById("app")!,
  store: createStore({
    classifications: [
      { key: "car", color: "aliceblue" },
      { key: "person", color: "antiquewhite" },
      { key: "bicycle", color: "aqua", properties: [] },
    ],
    elements: [
      {
        type: "rect",
        position: { x: 10, y: 10 },
        value: { x: 10, y: 10, width: 100, height: 100 },
        id: "a",
        color: "red",
        visible: true,
      },
    ],
  }),
});
