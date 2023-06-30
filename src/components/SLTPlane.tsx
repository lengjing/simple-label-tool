import React, { useRef } from 'react';
import { useStore } from '../context';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import { observer } from "mobx-react";

const SLTPlane: React.FC<{ width?: number, height?: number }> = observer(({
    width,
    height,
}) => {
    const stageRef = useRef(null);

    const store = useStore();
    const onContextMenu = (e) => {
        // stageRef.current!.batchDraw()
    }

    return (
        <div className='slt-2d' style={{ width, height }}>
            <Stage
                style={{
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px',
                    backgroundImage: 'linear-gradient(45deg,#eee 25%,transparent 0,transparent 75%,#eee 0,#eee),linear-gradient(45deg, #eee 25%, #fff 0, #fff 75%, #eee 0, #eee)'
                }}
                width={width} height={height} ref={stageRef} onContextMenu={e => { }}>
                {/* <Layer><Image image={}></Image></Layer> */}
                <Layer>
                    {store.elements.map((v, idx) => {
                        if (v.type === "rect") {
                            const { position, value, color } = v;
                            return (
                                <Rect
                                    key={idx}
                                    {...value}
                                    fill={color}
                                    draggable
                                ></Rect>
                            )
                        }
                    })}
                </Layer>
            </Stage>
        </div>
    )
})

export default SLTPlane;
