import { observer } from 'mobx-react';
import React, { PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';
import { ICssSize } from '../types';

const SLTContainer: React.FC<PropsWithChildren & Partial<ICssSize>> = observer(({
    children,
    width = '100vw',
    height = '100vh',
}) => {
    const [size, setSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const onResize = () => {
            const { width, height } = containerRef.current!.getBoundingClientRect();

            setSize({ width, height });
        }
        window.addEventListener('resize', onResize);

        onResize();

        return () => window.removeEventListener('resize', onResize);
    }, [width, height]);

    const child = React.Children.only(children);

    return (
        <div ref={containerRef} className="slt-container" style={{ width, height }}>
            {size.width && size.height && React.isValidElement(child) && React.cloneElement(child, { ...size })}
        </div>
    )
})

export default SLTContainer;
