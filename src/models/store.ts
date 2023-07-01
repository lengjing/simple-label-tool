import { Instance, types } from "mobx-state-tree";

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
    name: types.identifier,
    color: types.string,
    properties: types.maybeNull(types.array(Property)),
});

const BaseElement = types.model({
    id: types.identifier,
    uuid: types.identifier,
    color: types.string,
    visible: types.boolean,
    // position: types.union(Vector2, Vector3),
    /**
     * classification key
     */
    key: types.maybeNull(types.string),
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

export const CubeElement = types.compose(
    BaseElement,
    types.model({
        position: Vector3,
        type: types.literal("cube"),
        value: types.model({
            vertexes: types.array(Vector2),
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

const ToolMenu = types.model({

});

const WorkspaceTheme = types.enumeration(["light", "dark"]);

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

        // mouse: 'selection' | ''

        // history
    })
    .views((self) => {
        return {
            get selectedElements() {
                return "1";
            },

            get selectedClassification() {
                return self.classifications.find(c => c.name === self.selectedClassificationKey)
            }
        };
    })
    .actions((self) => {
        return {
            getElementById(id: string) {
                return self.elements.find((el) => el.id === id);
            },
            getElementsByIds(ids: string[]) {
                return ids.map(id => this.getElementById);
            },
            moveElement(id: string, to: IVector2) {
                const el = this.getElementById(id);
                if (el) {
                    el.position = {
                        ...el.position,
                        ...to
                    }
                }
            },
        };
    });

export const createStore: (
    ...args: Parameters<typeof Store["create"]>
) => IStore = (...args) => {
    return Store.create(...args);
};

export type IClassification = Instance<typeof Classification>;

export type IRectElement = Instance<typeof RectElement>;

export type ICircleElement = Instance<typeof CircleElement>;

export type ICubeElement = Instance<typeof CubeElement>;

export type IVector2 = Instance<typeof Vector2>;

export type IVector3 = Instance<typeof Vector3>;

export type IStore = Instance<typeof Store>;
