import React, { PropsWithChildren, createContext, forwardRef, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef } from "react";
import Stage, { DrawEvent, forwardedStage } from './Stage';
import { useStore } from "../../context";
import { ICubeElement } from "../../slt";
import Cloud from "./cloud";
import { observer } from "mobx-react";
import PCDLoader from "../../utils/pcdLoader";
import { IPCD } from "../../types";
import * as THREE from 'three';

const pcdLoader = new PCDLoader(false);

export const CloudContext = createContext(new Cloud());

export const useCloud = () => {
    return useContext(CloudContext);
};

export type forwardedSLTCloud = {
    cloud: Cloud;
}

type SLTCloudProps = PropsWithChildren<{
    pcdUrl: string;
    cameraPosition?: "top" | "side" | "front";
    cameraMode?: "perspective" | "orthographic"
}>

const SLTCloud = observer(forwardRef<forwardedSLTCloud, SLTCloudProps>(({
    pcdUrl,
    children,
    cameraPosition,
    cameraMode,
}, ref) => {
    const store = useStore();

    const stageRef = useRef<forwardedStage>(null)

    const cloudRef = useRef(new Cloud());

    const cloud = cloudRef.current;

    useImperativeHandle(ref, () => {
        return {
            cloud: cloudRef.current
        }
    });

    useLayoutEffect(() => {
        cloud.init({
            canvas: stageRef.current!.sourceCanvasRef.current!,
            container: stageRef.current!.containerRef.current!,
            width: stageRef.current!.width,
            height: stageRef.current!.height,
        });

        cloud.setViewMode(cameraMode === "perspective" ? "3d" : "top");
        cloud.cameraPreset(cameraPosition);
    }, []);

    useEffect(() => {
        if (pcdUrl) {
            pcdLoader.load(pcdUrl, (pcd: IPCD) => {
                cloud.renderPCDFile(pcd);
                cloud.moveCamera();
            })
        }
    }, [pcdUrl]);

    return (
        <CloudContext.Provider value={cloud}>
            <Stage
                ref={stageRef}
                width={'100%'}
                height={'100%'}
                onMouseDown={(e) => {
                    if (e.button === 0) {
                        if (store.mouseAction === "unknown") {
                            if (store.selectedClassification) {
                                store.setMouseAction("draw")
                            }
                        }
                    }
                }}
                onDrawStart={({ offset, startX, startY }) => {
                    const { selectedClassification } = store;

                    const x = (startX / offset.width) * 2 - 1;
                    const y = -(startY / offset.height) * 2 + 1;
                    const z = 0;

                    const startVector3 = cloud.unproject(new THREE.Vector3(x, y, z), cloud.camera)

                    store.createElement({
                        type: "cube",
                        position: { x: startVector3.x, y: startVector3.y, z: startVector3.y },
                        color: selectedClassification!.color,
                        key: selectedClassification!.id,
                        value: {
                            size: {
                                "width": 0.01,
                                "height": 1,
                                "depth": 0.01,
                            },
                            rotation: { x: 0, y: 0, z: 0 },
                            position: { x: startVector3.x, y: startVector3.y, z: startVector3.z },
                        }
                    })
                }}
                onDraw={({ offset, startX, startY, currentX, currentY }) => {
                    const start = {
                        x: (startX / offset.width) * 2 - 1,
                        y: -(startY / offset.height) * 2 + 1,
                        z: 0
                    }

                    const current = {
                        x: (currentX / offset.width) * 2 - 1,
                        y: -(currentY / offset.height) * 2 + 1,
                        z: 0
                    }

                    const startVector3 = cloud.unproject(new THREE.Vector3(start.x, start.y, start.z), cloud.camera);
                    const currentVector3 = cloud.unproject(new THREE.Vector3(current.x, current.y, current.z), cloud.camera);

                    const deltaX = currentVector3.x - startVector3.x;
                    const deltaY = currentVector3.y - startVector3.y;

                    const yaw = cloud.camera.rotation.z;
                    const theta = Math.atan((deltaX / deltaY) * -1);
                    const angle = Math.PI / 2 - theta + yaw;

                    const distance = currentVector3.distanceTo(startVector3);

                    const size = {
                        width: Math.abs(distance * Math.cos(angle)),
                        length: Math.abs(distance * Math.sin(angle)),
                        height: 1
                    };

                    const position = startVector3
                        .clone()
                        .add(currentVector3)
                        .divideScalar(2)
                        .setZ(size.height / 2);

                    const orientation = current.y - start.y > 0 ? 1 : -1;

                    const rotation = {
                        x: 0,
                        y: 0,
                        z: cloud.camera.rotation.z + (orientation === -1 ? Math.PI : 0)
                    };

                    const creatingElement = (store.creatingElement as ICubeElement)

                    creatingElement.resizeX(size.width);
                    creatingElement.resizeY(size.length);

                    creatingElement.reposition(position.x, position.y, position.z);

                    creatingElement.rotateZ(rotation.z);
                }}
                onDrawEnd={() => {
                    store.setMouseAction('unknown');
                    store.createdElement();
                }}
            >
                {children}
            </Stage>
        </CloudContext.Provider>
    )
}))

export default SLTCloud;
