import { Instance, types } from "mobx-state-tree";

const Vector2 = types.model({
  x: types.number,
  y: types.number,
});

const Vector3 = types.model({
  x: types.number,
  y: types.number,
  z: types.number,
});

const Property = types.model({});

const Classification = types.model({
  key: types.identifier,
  color: types.string,
  properties: types.maybeNull(types.array(Property)),
});

const BaseElement = types.model({
  id: types.string,
  color: types.string,
  visible: types.boolean,
  // position: types.union(Vector2, Vector3),
});
// .actions((self) => {
//   return {
//     remove() {},
//     hide() {
//       self.visible = false;
//     },
//     show() {
//       self.visible = true;
//     },
//   };
// });

const RectElement = types.compose(
  BaseElement,
  types.model({
    position: Vector2,
    type: types.enumeration(["rect"]),
    value: types.model({
      width: types.number,
      height: types.number,
      x: types.number,
      y: types.number,
    }),
  })
);

const CircleElement = types.compose(
  BaseElement,
  types.model({
    position: Vector2,
    type: types.enumeration(["circle"]),
    value: types.model({
      x: types.number,
      y: types.number,
    }),
  })
);

const CubeElement = types.compose(
  BaseElement,
  types.model({
    position: Vector3,
    type: types.enumeration(["cube"]),
    value: types.model({
      vertexes: types.array(types.model({ x: types.number, y: types.number })),
      position: Vector3,
      size: types.model({
        deepth: types.number,
        width: types.number,
        height: types.number,
      }),
      rotation: Vector3,
    }),
  })
);

const Element = types.union(RectElement, CircleElement, CubeElement);

const Menu = types.model({
  key: types.string,
  title: types.string,
  // children: types.maybeNull(types.)
});

const ContextMenu = types.model("ContextMenu", {
  position: Vector2,
  visible: types.boolean,
  menus: types.array(Menu),
});

const WorkspaceTheme = types.enumeration(["light", "dark"]);

export const Store = types
  .model("Store", {
    scale: 1,

    selectedElementIds: types.array(types.string),

    elements: types.array(Element),

    creatingElement: types.maybeNull(Element),

    contextMenu: types.optional(ContextMenu, {
      visible: false,
      position: { x: 0, y: 0 },
    }),

    workspaceTheme: types.optional(WorkspaceTheme, "light"),

    classifications: types.array(Classification),

    // history
  })
  .views((self) => {
    return {
      get selectedElements() {
        return "1";
      },
    };
  })
  .actions((self) => {
    return {
      getElementById(id: string) {
        return self.elements.find((el) => el.id === id);
      },
      moveElement(id: string) {
        if (self.elements[0].type === "cube") {
          // self.elements[0].value.
        }
      },
      moveElements(ids: string[]) {},
    };
  });

export const createStore: (
  ...args: Parameters<typeof Store["create"]>
) => IStore = (...args) => {
  return Store.create(...args);
};

export type IStore = Instance<typeof Store>;

// let a: IStore;
