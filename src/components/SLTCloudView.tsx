import React, { useEffect, useRef } from "react";
import PCDLoader from "../utils/pcdLoader";
import Cloud from "../utils/cloud";
import { useStore } from "../context";
import { observer } from "mobx-react";

const pcdLoader = new PCDLoader();
const cloud = new Cloud();

const SLTCloudView: React.FC = observer(() => {
    const containerRef = useRef<HTMLDivElement>(null)
    const sourceCanvasRef = useRef<HTMLCanvasElement>(null)
    const mouseCanvasRef = useRef<HTMLCanvasElement>(null)

    const store = useStore();

    useEffect(() => {
        cloud.init({
            canvas: sourceCanvasRef.current!,
            container: containerRef.current!,
            width: 100,
            height: 100,
        });
    }, []);

    useEffect(() => {
        pcdLoader.load(store.resource.url, (pcd) => {
            cloud.renderPCDFile(pcd);
            cloud.moveCamera();
        })
    }, [store.resource])

    return (
        <div className="cloud-view" style={{ height: '100%' }}>
            <div className="cloud-canvas" ref={containerRef} style={{ height: '100%', position: 'relative' }}>
                <canvas className="source-canvas" ref={sourceCanvasRef} style={{ position: 'absolute', left: 0, top: 0 }}></canvas>
                <canvas className="mouse-canvas" ref={mouseCanvasRef} style={{ position: 'absolute', left: 0, top: 0 }}></canvas>
            </div>
        </div>
    )
})

export default SLTCloudView;
