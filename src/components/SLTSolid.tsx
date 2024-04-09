import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { ICssSize } from "../types";
import SLTCloud, { forwardedSLTCloud } from "./SLTCloud";
import SLTSubView from "./SLTSubView";
import SLTView from "./SLTView";
import { useStore } from "../context";
import Cube from "./SLTCloud/Cube";
import { ICubeElement } from "../slt";
// import InteractiveBox from "./InteractiveBox";

const SLTSolid: React.FC<{ pcdUrl: string; } & Partial<ICssSize>> = observer(({
    width = '100%',
    height = '100%',
    pcdUrl
}) => {
    const mainCloudRef = useRef<forwardedSLTCloud>(null);
    const topCloudRef = useRef<forwardedSLTCloud>(null);
    const sideCloudRef = useRef<forwardedSLTCloud>(null);
    const frontCloudRef = useRef<forwardedSLTCloud>(null);

    const store = useStore();

    useEffect(() => {
        frontCloudRef.current!.cloud.controls.enableRotate = false;
        sideCloudRef.current!.cloud.controls.enableRotate = false;
        topCloudRef.current!.cloud.controls.enableRotate = false;
    }, []);

    return (
        <div className="slt-3d" style={{ width, height }}>
            <SLTView>
                <SLTCloud ref={mainCloudRef} pcdUrl={pcdUrl} cameraPosition="front" cameraMode="perspective" settings>
                    {store.elements.filter(el => el.type === "cube").map(el => {
                        return (
                            <Cube
                                key={el.uuid}
                                element={el as ICubeElement}
                                onMouseDown={() => {
                                    store.setSelectedElement(el.id);
                                    store.setMouseAction("select");
                                }}
                            ></Cube>
                        )
                    })}
                    {store.creatingElement?.type === "cube" && (
                        <Cube
                            key={store.creatingElement.uuid}
                            element={store.creatingElement as ICubeElement}
                        ></Cube>
                    )}
                </SLTCloud>

                <SLTSubView title="top view" style={{ width: 300, height: 200, left: 0, bottom: 0, border: '1px solid #fff' }}>
                    <SLTCloud ref={topCloudRef} pcdUrl={pcdUrl} cameraPosition="top" cameraMode="orthographic">
                        {/* <InteractiveBox
                            onResizeStart={e => onBoxResizeStart(e, "front", selectedBoxId)}
                            onResize={e => onBoxResize(e, "front", selectedBoxId)}
                            onResizeEnd={e => onBoxResizeEnd(e, "front", selectedBoxId)}
                            onDragStart={e => onBoxDragStart(e, "front", selectedBoxId)}
                            onDrag={e => onBoxDrag(e, "front", selectedBoxId)}
                            onDragEnd={e => onBoxDragEnd(e, "front", selectedBoxId)}
                        ></InteractiveBox> */}
                    </SLTCloud>
                </SLTSubView>

                <SLTSubView title="side view" style={{ width: 300, height: 200, left: 300, bottom: 0, border: '1px solid #fff' }}>
                    <SLTCloud ref={sideCloudRef} pcdUrl={pcdUrl} cameraPosition="side" cameraMode="orthographic"></SLTCloud>
                </SLTSubView>

                <SLTSubView title="front view" style={{ width: 300, height: 200, left: 600, bottom: 0, border: '1px solid #fff' }}>
                    <SLTCloud ref={frontCloudRef} pcdUrl={pcdUrl} cameraPosition="front" cameraMode="orthographic"></SLTCloud>
                </SLTSubView>
            </SLTView>
        </div>
    )
})

export default SLTSolid;
