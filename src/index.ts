import { createSLTApp, createStore } from "./slt";

createSLTApp({
  container: document.getElementById("app")!,
  store: createStore({
    classifications: [
      { id: "car", color: "aliceblue" },
      { id: "person", color: "antiquewhite" },
      { id: "bicycle", color: "aqua", properties: [] },
      { id: "motorcycle", color: "#7914ee" },
      { id: "airplane", color: "#b10555" },
      { id: "bus", color: "#c35b4c" },
      { id: "train", color: "#89bed2" },
      { id: "truck", color: "#6bfbe3" },
      { id: "boat", color: "#575cde" },
      { id: "traffic_light", color: "#780161" },
      { id: "fire_hydrant", color: "#ab92b0" },
      { id: "stop_sign", color: "#ffaa36" },
      { id: "parking_meter", color: "#27bb6a" },
      { id: "bench", color: "#714c70" },
    ],
  }),
});
