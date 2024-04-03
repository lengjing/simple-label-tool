import React, { PropsWithChildren, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { EventType, ICssSize } from '../../types';
import { observer } from 'mobx-react';
import { useStore } from '../../context';
import { useCloud } from './SLTCloud';

export type DrawEvent = {
    evt: MouseEvent;
    offset: { left: number, top: number, width: number, height: number }
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
}

export type forwardedStage = {
    containerRef: React.RefObject<HTMLDivElement>;
    sourceCanvasRef: React.RefObject<HTMLCanvasElement>;
    mouseCanvasRef: React.RefObject<HTMLCanvasElement>;
    width: number;
    height: number;
}

type StageProps = PropsWithChildren<Partial<ICssSize>> & {
    onMouseDown?: (e: MouseEvent) => any,
    onMouseMove?: (e: MouseEvent) => any,
    onMouseUp?: (e: MouseEvent) => any,
    onDrawStart?: (e: DrawEvent) => any,
    onDraw?: (e: DrawEvent) => any,
    onDrawEnd?: (e: DrawEvent) => any,
}

const Stage = observer(forwardRef<{}, StageProps>(({
    width = '100%',
    height = '100%',
    onMouseDown = () => { },
    onMouseMove = () => { },
    onMouseUp = () => { },
    onDrawStart = () => { },
    onDraw = () => { },
    onDrawEnd = () => { },
    children
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
    const mouseCanvasRef = useRef<HTMLCanvasElement>(null);

    const store = useStore();

    const cloud = useCloud();

    useImperativeHandle(ref, () => {
        return {
            containerRef,
            sourceCanvasRef,
            mouseCanvasRef,
            get width() {
                return containerRef.current?.offsetWidth
            },
            get height() {
                return containerRef.current?.offsetHeight
            }
        }
    })

    const _onMouseDown = (e: MouseEvent) => {
        fireEvent("mouseDown", e);

        onMouseDown(e);

        if (store.mouseAction === "draw") {
            const containerBounding = containerRef.current!.getBoundingClientRect();
            const startX = e.pageX - containerBounding.left;
            const startY = e.pageY - containerBounding.top;

            onDrawStart({
                evt: e,
                offset: containerBounding,
                startX,
                startY,
                currentX: startX,
                currentY: startY
            });


            const onMouseMove = (e: MouseEvent) => {
                const currentX = e.pageX - containerBounding.left;
                const currentY = e.pageY - containerBounding.top;

                onDraw({ evt: e, offset: containerBounding, startX, startY, currentX, currentY });
            };

            const onMouseUp = (e: MouseEvent) => {
                const currentX = e.pageX - containerBounding.left;
                const currentY = e.pageY - containerBounding.top;

                onDrawEnd({ evt: e, offset: containerBounding, startX, startY, currentX, currentY });

                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
            };

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        }
    }

    const _onMouseMove = (e: MouseEvent) => {
        onMouseMove(e)
    }

    const _onMouseUp = (e: MouseEvent) => {
        onMouseUp(e)
    }

    const fireEvent = (type: EventType, e: MouseEvent) => {
        cloud.intersects.forEach(o => {
            const el = React.Children.toArray(children).find(child => {
                if (React.isValidElement(child)) {
                    if (child.props['element'] && child.props['element'].id === cloud.objectUUIDMaps.get(o.object.uuid)) {
                        return true
                    }
                }
            })

            const handler = (el as React.ReactElement)?.props['on' + type.toLocaleUpperCase()];

            if (handler) {
                handler(e)
            }
        })
    }

    useEffect(() => {
        containerRef.current!.addEventListener("mousedown", _onMouseDown);
        containerRef.current!.addEventListener('mousemove', _onMouseMove);
        containerRef.current!.addEventListener('mouseup', _onMouseUp);

        return () => {
            containerRef.current!.removeEventListener("mousedown", _onMouseDown);
            containerRef.current!.removeEventListener('mousemove', _onMouseMove);
            containerRef.current!.removeEventListener('mouseup', _onMouseUp);
        }
    }, [])

    return (
        <div className="cloud-canvas" ref={containerRef} style={{ position: "relative", width, height }}>
            <canvas className="source-canvas" ref={sourceCanvasRef} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}></canvas>
            <canvas className="mouse-canvas" ref={mouseCanvasRef} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}></canvas>
            {children}
        </div>
    )
}))

export default Stage;
