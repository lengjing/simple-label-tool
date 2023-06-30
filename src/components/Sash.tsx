import classNames from "classnames";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";

export type ISashEvent = ISashMouseEvent;

type ISashMouseEvent = {
    target: any;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    type: "mouse";
};

type ISashProps = {
    orientation?: "vertical" | "horizontal";
    size?: number;
    position?: number;
    color?: string;
    onStart?(e: ISashEvent): any;
    onChange?(e: ISashEvent, value?: any): any;
    onEnd?(e: ISashEvent, value: any): any;
};

const Sash = forwardRef<HTMLDivElement, ISashProps>(({
    orientation = "horizontal",
    size = 4,
    position = 0,
    color,
    onStart = () => { },
    onChange = () => { },
    onEnd = () => { },
}, forwardedRef) => {
    const sashRef = useRef<HTMLDivElement>();
    const savedMouseEvent = useRef<ISashMouseEvent>({
        type: "mouse",
        target: null,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
    });
    const savedValue = useRef<any>();

    const backgroundColor = color;

    const computedStyle = useMemo(() => {
        return orientation === "vertical"
            ? {
                width: size,
                height: "100%",
                left: position,
                backgroundColor,
            }
            : {
                width: "100%",
                height: size,
                top: position,
                backgroundColor,
            };
    }, [orientation, position, size, backgroundColor]);

    const addEvents = () => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }

    const removeEvents = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }

    const onMouseDown = (e: React.MouseEvent) => {
        addEvents();
        savedMouseEvent.current.target = e.target;
        savedMouseEvent.current.startX = e.pageX;
        savedMouseEvent.current.startY = e.pageY;

        savedValue.current = onStart(savedMouseEvent.current);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (savedMouseEvent.current.target) {
            savedMouseEvent.current.currentX = e.pageX;
            savedMouseEvent.current.currentY = e.pageY;

            onChange(savedMouseEvent.current, savedValue.current);
        }
    };

    const onMouseUp = (e: MouseEvent) => {
        if (savedMouseEvent.current.target) {
            savedMouseEvent.current.currentX = e.pageX;
            savedMouseEvent.current.currentY = e.pageY;

            onEnd(savedMouseEvent.current, savedValue.current);

            savedMouseEvent.current.target = null;
            savedValue.current = undefined;
        }
        removeEvents();
    };

    return (
        <div
            ref={(inst) => {
                sashRef.current = inst!;
                if (forwardedRef) {
                    if (typeof forwardedRef === "function") {
                        forwardedRef(inst);
                    } else {
                        forwardedRef.current = inst;
                    }
                }
            }}
            className={classNames({ sash: true })}
            style={computedStyle}

            onMouseDown={onMouseDown}
        >
        </div>
    );
});

export default Sash;
