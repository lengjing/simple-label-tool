import React, { useLayoutEffect, useRef, useState } from 'react';
import classNames from "classnames";
import Sash, { ISashEvent } from './Sash';

import './SplitView.less';
import { ICssSize } from '../types';

type ISplitViewProps = {
    views: {
        element: React.ReactElement,
        init?: number,
        max?: number,
        min?: number,
    }[],
    orientation?: 'vertical' | 'horizontal'
} & Partial<ICssSize>;
const SplitView: React.FC<ISplitViewProps> = ({ views, orientation = 'horizontal', width = '100%', height = '100%' }) => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [viewSizes, setViewSize] = useState<number[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const saved = useRef<number[]>([]);

    const target = orientation === 'horizontal' ? 'width' : 'height';

    const onStart = (e: ISashEvent) => {
        saved.current = [...viewSizes];
    };

    const onChange = (e: ISashEvent, idx: number) => {
        const deltaX = e.currentX - e.startX;
        const deltaY = e.currentY - e.startY;
        const delta = orientation === "horizontal" ? deltaX : deltaY;
        const view = views[idx];
        const maxSize = view.max
            ? view.max * size[target]
            : viewSizes[idx] + viewSizes[idx + 1];
        const minSize = view.min || 0;

        const diff =
            delta > 0
                ? Math.min(delta, maxSize - viewSizes[idx])
                : Math.max(delta, minSize - viewSizes[0]);

        viewSizes[idx] = saved.current[idx] + diff;
        viewSizes[idx + 1] = saved.current[idx + 1] - diff;
        setViewSize([...viewSizes]);
    };

    const getPosition = (idx: number) => {
        let position = 0;
        for (let i = 0; i <= idx; i++) {
            position += viewSizes[i] || 0;
        }
        return position - 2;
    };

    useLayoutEffect(() => {
        if (typeof width === 'number' && typeof height === 'number') {
            setSize({ width, height });
        } else {
            const { width, height } = containerRef.current!.getBoundingClientRect();

            setSize({ width, height });
        }
    }, [width, height]);

    useLayoutEffect(() => {
        if (size.width && size.height) {
            setViewSize(views.reduce<number[]>((s, view) => {
                return s.concat((view.init || 1 / views.length) * size[target])
            }, []));
        }
    }, [views, size]);

    return (
        <div className='split-view' ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <div className="sash-container">
                {viewSizes.length && views.slice(0, -1).map((el, idx) => (
                    <Sash
                        key={idx}
                        position={getPosition(idx)}
                        onStart={(e) => onStart(e)}
                        onChange={(e) => onChange(e, idx)}
                        orientation={"vertical"}
                    />
                ))}
            </div>
            <div className={classNames(["view-container", orientation])}>
                {viewSizes.length && views.map(({ element }, idx) => {
                    const key = element.key || idx;
                    return React.cloneElement(element, {
                        key,
                        width: target === 'width' ? viewSizes[idx] : size.width,
                        height: target === 'height' ? viewSizes[idx] : size.height,
                    })
                })}
            </div>
        </div>
    )
}

export default SplitView;
