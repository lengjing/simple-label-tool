import { createSLTApp, createStore } from "./slt";

createSLTApp({
  container: document.getElementById("app")!,
  store: createStore(),
});
