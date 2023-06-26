import { types } from "mobx-state-tree";

const Pager = types.model("Pager", {
  page: 0,
  pageSize: 10,
});

const Element = types
  .model("Element", {
    id: "",
  })
  .actions((self) => {
    return {
      setValue() {},
      toggleDisplay() {},
      toggleVisible() {},
      move() {},
      resize() {},
      addPoint() {},
      movePoint() {},
    };
  });

const Resource = types.model("Resource", { a: 1 });

const ContextMenu = types.model("ContextMenu", {
  position: types.model({ left: 0, top: 0 }),
  visible: false,
  // menus: types.array(types.model({}))
});

const WorkspaceTheme = types.enumeration(["light", "dark"]);

export const Store = types
  .model("Store", {
    scale: 1,

    selectedElementIds: types.array(types.string),

    elements: types.array(Element),

    creatingElement: types.maybeNull(Element),

    contextMenu: ContextMenu,

    resources: types.array(Resource),

    WorkspaceTheme: WorkspaceTheme,

    pager: Pager,
  })
  .views((self) => {
    return {
      get selectedElements() {
        return "1";
      },

      get resource() {
        return 1;
      },
    };
  })
  .actions((self) => {
    return {};
  });

export const createStore = () => {
  return Store.create();
};
