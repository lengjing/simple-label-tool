import { createContext, useContext } from "react";
import { createStore } from "./models/store";

export const StoreContext = createContext(createStore());

export const useStore = () => {
  return useContext(StoreContext);
};
