import { pull } from "lodash";
import {
  Instance,
  applySnapshot,
  clone,
  getSnapshot,
  onAction,
  types,
} from "mobx-state-tree";
import { v4 as uuid } from "uuid";

export const Vector2 = types.model({
  x: types.number,
  y: types.number,
});

export const Vector3 = types.model({
  x: types.number,
  y: types.number,
  z: types.number,
});

export const Property = types.model({});

export const Classification = types.model({
  name: types.maybeNull(types.string),
  id: types.identifier,
  color: types.string,
  properties: types.maybeNull(types.array(Property)),
});

const BaseElement = types
  .model({
    id: types.identifier,
    uuid: types.string,
    color: types.string,
    visible: types.boolean,
    /**
     * classification id
     */
    key: types.maybeNull(types.string),
  })
  .actions((self) => {
    return {
      hide() {
        self.visible = false;
      },

      show() {
        self.visible = true;
      },
    };
  });

export const RectElement = types.compose(
  BaseElement,
  types.model({
    position: Vector2,
    type: types.literal("rect"),
    value: types.model({
      width: types.number,
      height: types.number,
    }),
  })
);

export const CircleElement = types.compose(
  BaseElement,
  types.model({
    position: Vector2,
    type: types.literal("circle"),
    value: types.model({
      x: types.number,
      y: types.number,
    }),
  })
);

/**
 *
 *   6 ---- 4 max
 *   |\     |\
 *   | \    | \
 *   7 -\-- 5  \ --> length (y)
 *    \  \ * ---\--> position
 *     \  2 ---- 0
 *      \ |front |
 *       \|      | --> height (z)
 *    min 3 ---- 1
 *           |--> width (x)
 */
export const CubeElement = types
  .compose(
    BaseElement,
    types.model({
      position: Vector3,
      type: types.literal("cube"),
      value: types.model({
        position: Vector3,
        size: types.model({
          depth: types.number,
          width: types.number,
          height: types.number,
        }),
        rotation: Vector3,
      }),
    })
  )
  .actions((self) => {
    return {
      reposition(x: number, y: number, z: number) {
        self.position.x = self.value.position.x = x;
        self.position.y = self.value.position.y = y;
        self.position.z = self.value.position.z = z;
      },

      resizeX(val: number) {
        self.value.size.width = val;
      },

      resizeY(val: number) {
        self.value.size.depth = val;
      },

      resizeZ(val: number) {
        self.value.size.height = val;
      },

      resize(x: number, y: number, z: number) {
        this.resizeX(x);
        this.resizeY(y);
        this.resizeZ(z);
      },

      rotateX(val: number) {
        self.value.rotation.x = val;
      },

      rotateY(val: number) {
        self.value.rotation.y = val;
      },

      rotateZ(val: number) {
        self.value.rotation.z = val;
      },

      rotate(x: number, y: number, z: number) {
        this.rotateX(x);
        this.resizeY(y);
        this.rotateZ(z);
      },
    };
  });

export const Element = types.union(RectElement, CircleElement, CubeElement);

const Menu = types.model({
  key: types.string,
  title: types.string,
  // children: types.maybeNull(types.)
});

const ContextMenu = types.model({
  position: Vector2,
  visible: types.boolean,
  menus: types.array(Menu),
});

const WorkspaceTheme = types.enumeration(["light", "dark"]);

const MouseAction = types.enumeration(["select", "draw", "drag", "unknown"]);

const Tool = types.enumeration(["cube", "rect", "selection", "lasso"]);

let elementId = 0;

export const Store = types
  .model("Store", {
    scale: 1,

    selectedElementIds: types.array(types.string),

    elements: types.array(Element),

    creatingElement: types.maybeNull(Element),

    workspaceTheme: types.optional(WorkspaceTheme, "light"),

    selectedClassificationKey: types.maybeNull(types.string),

    classifications: types.array(Classification),

    contextMenu: types.optional(ContextMenu, {
      visible: false,
      position: { x: 0, y: 0 },
    }),

    mouseAction: types.optional(MouseAction, "unknown"),

    selectedTool: types.optional(Tool, "cube"),
  })
  .views((self) => {
    return {
      get selectedElements() {
        return "1";
      },

      get selectedClassification() {
        return self.classifications.find(
          (c) => c.name === self.selectedClassificationKey
        );
      },

      get cubeElements() {
        return self.elements.filter(
          (el) => el.type === "cube"
        ) as ICubeElement[];
      },
    };
  })
  .actions((self) => {
    return {
      reset() {
        elementId = 0;
      },

      getElementById(id: string) {
        return self.elements.find((el) => el.id === id);
      },

      getElementsByIds(ids: string[]) {
        return ids.map((id) => this.getElementById);
      },

      moveElement(id: string, to: IVector2 | IVector3) {
        const el = this.getElementById(id);

        if (el) {
          el.position = {
            ...el.position,
            ...to,
          };
        }
      },

      deleteElement(id: string) {
        const el = this.getElementById(id);

        if (el) {
          pull(self.elements, el);
        }
      },

      createElement(element: Partial<IElement>) {
        const extra = {
          id: `${elementId++}`,
          uuid: uuid(),
          visible: true,
        };

        let creatingElement: IElement | null = null;

        if (element.type === "cube") {
          creatingElement = CubeElement.create({
            ...(element as ICubeElement),
            ...extra,
          });
        } else if (element.type === "circle") {
          creatingElement = CircleElement.create({
            ...(element as ICircleElement),
            ...extra,
          });
        } else if (element.type === "rect") {
          creatingElement = RectElement.create({
            ...(element as IRectElement),
            ...extra,
          });
        }

        self.creatingElement = creatingElement;
      },

      createdElement() {
        if (self.creatingElement) {
          self.elements.push(clone(self.creatingElement));
          self.creatingElement = null;
        }
      },

      setMouseAction(action: IMouseAction) {
        self.mouseAction = action;
      },

      setSelectedElement(id: string, multi = false) {
        if (multi) {
          self.selectedElementIds.push(id);
        } else {
          self.selectedElementIds.clear().push(id);
        }
      },

      setSelectedTool(tool: ITool) {
        self.selectedTool = tool;
      },

      updateCubeFaceProjection() {},
    };
  });

// redo undo
const UndoableStore = Store.volatile(() => {
  return {
    history: [] as any[],
    currentStateIndex: -1,
  };
})
  .views((self) => {
    return {
      get canUndo() {
        return self.currentStateIndex > 0;
      },

      get canRedo() {
        return self.currentStateIndex < self.history.length - 1;
      },
    };
  })
  .actions((self) => ({
    undo() {
      if (self.canUndo) {
        self.currentStateIndex -= 1;
        applySnapshot(self, self.history[self.currentStateIndex]);
      }
    },

    redo() {
      if (self.canRedo) {
        self.currentStateIndex += 1;
        applySnapshot(self, self.history[self.currentStateIndex]);
      }
    },

    afterCreate() {
      self.history.push(getSnapshot(self));
      self.currentStateIndex += 1;

      onAction(self, (event) => {
        if (/^(delete)|(move)|(created)/.test(event.name)) {
          const currentState = getSnapshot(self);
          if (currentState !== self.history[self.currentStateIndex + 1]) {
            self.history.splice(self.currentStateIndex + 1);
          }
          self.history.push(currentState);
          self.currentStateIndex += 1;
        }
      });
    },
  }));

export const createStore: (
  ...args: Parameters<typeof Store["create"]>
) => IStore = (...args) => {
  return UndoableStore.create(...args);
};

export type IClassification = Instance<typeof Classification>;

export type IRectElement = Instance<typeof RectElement>;

export type ICircleElement = Instance<typeof CircleElement>;

export type ICubeElement = Instance<typeof CubeElement>;

export type IElement = Instance<typeof Element>;

type IVector2 = Instance<typeof Vector2>;

type IVector3 = Instance<typeof Vector3>;

export type IStore = Instance<typeof UndoableStore>;

export type IMouseAction = Instance<typeof MouseAction>;

export type ITool = Instance<typeof Tool>;
