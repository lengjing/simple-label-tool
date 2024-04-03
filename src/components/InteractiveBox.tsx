// import React, { createRef } from "react";
// import { PointerContext } from "./SubView";

// import "./interactiveBox.less";
// import Sash, { ISashEvent } from "./Sash";

// export type IDragEvent = {
//     target: any;
//     startX: number;
//     startY: number;
//     currentX: number;
//     currentY: number;
// };

// export type IResizeEvent = ISashEvent & {
//     dir: "n" | "s" | "w" | "e" | "nw" | "ne" | "sw" | "se";
// };

// export type IRotateEvent = {
//     rotation: number;
// };

// type IInteractiveBoxProps = {
//     size: { width: number; height: number };
//     position: { x: number; y: number };
//     rotation: number; //
//     // 车头
//     head?: "top" | "right" | "bottom" | "left";
//     onResizeStart?(e: IResizeEvent): any;
//     onResize?(e: IResizeEvent): any;
//     onResizeEnd?(e: IResizeEvent): any;
//     onDragStart?(e: IDragEvent): any;
//     onDrag?(e: IDragEvent): any;
//     onDragEnd?(e: IDragEvent): any;
//     onRotateStart?(e: IRotateEvent): any;
//     onRotate?(e: IRotateEvent): any;
//     onRotateEnd?(e: IRotateEvent): any;
//     knob?: boolean;
//     enableRotate?: boolean;
// };

// export default class InteractiveBox extends React.Component<IInteractiveBoxProps> {
//     static contextType = PointerContext;
//     declare context: React.ContextType<typeof PointerContext>;

//     static defaultProps = {
//         onResizeStart: () => { },
//         onResize: () => { },
//         onResizeEnd: () => { },
//         onDragStart: () => { },
//         onDrag: () => { },
//         onDragEnd: () => { },
//         onRotateStart: () => { },
//         onRotate: () => { },
//         onRotateEnd: () => { },
//         knob: true,
//         enableRotate: false
//     };

//     boxRect: DOMRect;

//     boxRef = createRef<HTMLDivElement>();

//     sashRefs = [
//         createRef<HTMLDivElement>(),
//         createRef<HTMLDivElement>(),
//         createRef<HTMLDivElement>(),
//         createRef<HTMLDivElement>()
//     ];

//     knobRefs = [
//         createRef<HTMLDivElement>(),
//         createRef<HTMLDivElement>(),
//         createRef<HTMLDivElement>(),
//         createRef<HTMLDivElement>()
//     ];

//     componentDidMount() {
//         this.updateBoundingRect();
//     }

//     onDragMouseDown = (e: React.MouseEvent) => {
//         const { onDragStart, onDrag, onDragEnd } = this.props;
//         const dragEvent = {
//             target: e.target,
//             startX: e.pageX,
//             startY: e.pageY,
//             currentX: e.pageX,
//             currentY: e.pageY
//         };

//         if (!this.isFromSash(e.target)) {
//             onDragStart(dragEvent);

//             addDragEvents();
//         }

//         function addDragEvents() {
//             window.addEventListener("mousemove", onWindowMouseMove);
//             window.addEventListener("mouseup", onWindowMouseUp);
//         }

//         function removeDragEvents() {
//             window.removeEventListener("mousemove", onWindowMouseMove);
//             window.removeEventListener("mouseup", onWindowMouseUp);
//         }

//         function onWindowMouseMove(e: MouseEvent) {
//             dragEvent.currentX = e.pageX;
//             dragEvent.currentY = e.pageY;
//             onDrag(dragEvent);
//         }

//         function onWindowMouseUp(e: MouseEvent) {
//             dragEvent.currentX = e.pageX;
//             dragEvent.currentY = e.pageY;
//             onDragEnd(dragEvent);
//             removeDragEvents();
//         }
//     };

//     onResizeMouseDown = (e: React.MouseEvent, dir: "nw" | "ne" | "sw" | "se") => {
//         const { onResizeStart, onResize, onResizeEnd } = this.props;

//         const resizeEvent = {
//             target: e.target,
//             startX: e.pageX,
//             startY: e.pageY,
//             currentX: e.pageX,
//             currentY: e.pageY,
//             type: "mouse",
//             dir
//         } as const;

//         onResizeStart({ ...resizeEvent });
//         addResizeEvents();

//         function addResizeEvents() {
//             window.addEventListener("mousemove", onWindowMouseMove);
//             window.addEventListener("mouseup", onWindowMouseUp);
//         }

//         function removeResizeEvents() {
//             window.removeEventListener("mousemove", onWindowMouseMove);
//             window.removeEventListener("mouseup", onWindowMouseUp);
//         }

//         function onWindowMouseMove(e: MouseEvent) {
//             onResize({ ...resizeEvent, currentX: e.pageX, currentY: e.pageY });
//         }

//         function onWindowMouseUp(e: MouseEvent) {
//             onResizeEnd({ ...resizeEvent, currentX: e.pageX, currentY: e.pageY });
//             removeResizeEvents();
//         }
//     };

//     onRotateMouseDown = (e: React.MouseEvent) => {
//         const { onRotateStart, onRotate, onRotateEnd, size, position } = this.props;

//         const center = {
//             x: position.x + size.width / 2,
//             y: position.y + size.height / 2
//         };

//         const getAngle = () => {
//             const pointer = this.context.pointer;
//             const angle = Math.atan2(pointer.y - center.y, pointer.x - center.x) + Math.PI / 2;
//             if (angle >= 2 * Math.PI) {
//                 return angle - 2 * Math.PI;
//             }
//             return angle;
//         };

//         const onWindowMouseMove = (e: MouseEvent) => {
//             onRotate({ rotation: getAngle() });
//         };

//         const onWindowMouseUp = (e: MouseEvent) => {
//             onRotateEnd({ rotation: getAngle() });
//             removeRotateEvents();
//         };

//         function addRotateEvents() {
//             window.addEventListener("mousemove", onWindowMouseMove);
//             window.addEventListener("mouseup", onWindowMouseUp);
//         }

//         function removeRotateEvents() {
//             window.removeEventListener("mousemove", onWindowMouseMove);
//             window.removeEventListener("mouseup", onWindowMouseUp);
//         }

//         onRotateStart({ rotation: getAngle() });
//         addRotateEvents();
//     };

//     isFromSash(target: any) {
//         return this.sashRefs.map(v => v.current).some(el => el.contains(target));
//     }

//     isFromKnob(target: any) {
//         return this.knobRefs.map(v => v.current).some(el => el.contains(target));
//     }

//     updateBoundingRect() {
//         this.boxRect = this.boxRef.current?.getBoundingClientRect();
//     }

//     render() {
//         const {
//             size: { width, height },
//             position,
//             rotation,
//             head,
//             onResizeStart = () => { },
//             onResize = () => { },
//             onResizeEnd = () => { },
//             knob,
//             enableRotate
//         } = this.props;

//         let headPosStyle = {};
//         switch (head) {
//             case "top":
//                 headPosStyle = { bottom: "100%", left: "50%" };
//                 break;
//             case "right":
//                 headPosStyle = { left: "100%", top: "50%" };
//                 break;
//             case "bottom":
//                 headPosStyle = { top: "100%", left: "50%" };
//                 break;
//             case "left":
//                 headPosStyle = { right: "100%", top: "50%" };
//                 break;
//             default:
//                 headPosStyle = { bottom: "100%", left: "50%" };
//         }

//         let headStyle = {};
//         if (head === "top" || head === "bottom") {
//             headStyle = { width: 0, height: 10, borderRight: "1px solid #fff" };
//         } else {
//             headStyle = { width: 10, height: 0, borderBottom: "1px solid #fff" };
//         }

//         const rotationDeg = (rotation * 180) / Math.PI;

//         return (
//             <div
//                 ref={this.boxRef}
//                 className="interactive-box"
//                 style={{ width, height, left: position.x, top: position.y, transform: `rotate(${rotationDeg}deg)` }}
//             >
//                 <div className="content" style={{ width, height }} onMouseDown={this.onDragMouseDown}></div>

//                 <div style={{ position: "absolute", ...headPosStyle }}>
//                     {enableRotate && <div className="circle" onMouseDown={this.onRotateMouseDown}></div>}
//                     {head && <div className="orientation" style={{ ...headStyle }}></div>}
//                 </div>
//                 <div className="sashes">
//                     <Sash
//                         size={3}
//                         onStart={e => onResizeStart({ ...e, dir: "n" })}
//                         onChange={e => onResize({ ...e, dir: "n" })}
//                         onEnd={e => onResizeEnd({ ...e, dir: "n" })}
//                         ref={this.sashRefs[0]}
//                         orientation={"horizontal"}
//                         position={-2}
//                     ></Sash>
//                     <Sash
//                         size={3}
//                         onStart={e => onResizeStart({ ...e, dir: "s" })}
//                         onChange={e => onResize({ ...e, dir: "s" })}
//                         onEnd={e => onResizeEnd({ ...e, dir: "s" })}
//                         ref={this.sashRefs[1]}
//                         orientation={"horizontal"}
//                         position={height - 2}
//                     ></Sash>
//                     <Sash
//                         size={3}
//                         onStart={e => onResizeStart({ ...e, dir: "w" })}
//                         onChange={e => onResize({ ...e, dir: "w" })}
//                         onEnd={e => onResizeEnd({ ...e, dir: "w" })}
//                         ref={this.sashRefs[2]}
//                         orientation={"vertical"}
//                         position={-2}
//                     ></Sash>
//                     <Sash
//                         size={3}
//                         onStart={e => onResizeStart({ ...e, dir: "e" })}
//                         onChange={e => onResize({ ...e, dir: "e" })}
//                         onEnd={e => onResizeEnd({ ...e, dir: "e" })}
//                         ref={this.sashRefs[3]}
//                         orientation={"vertical"}
//                         position={width - 2}
//                     ></Sash>
//                 </div>
//                 {knob && (
//                     <div className="knobs">
//                         <div
//                             className="knob knob-nw"
//                             ref={this.knobRefs[0]}
//                             onMouseDown={e => this.onResizeMouseDown(e, "nw")}
//                         ></div>
//                         <div
//                             className="knob knob-ne"
//                             ref={this.knobRefs[1]}
//                             onMouseDown={e => this.onResizeMouseDown(e, "ne")}
//                         ></div>
//                         <div
//                             className="knob knob-sw"
//                             ref={this.knobRefs[2]}
//                             onMouseDown={e => this.onResizeMouseDown(e, "sw")}
//                         ></div>
//                         <div
//                             className="knob knob-se"
//                             ref={this.knobRefs[3]}
//                             onMouseDown={e => this.onResizeMouseDown(e, "se")}
//                         ></div>
//                     </div>
//                 )}
//             </div>
//         );
//     }
// }
