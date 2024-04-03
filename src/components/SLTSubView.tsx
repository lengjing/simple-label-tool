import React, { PropsWithChildren, ReactNode } from "react";

type ISubViewProps = {
    title: ReactNode;
    onResize?: (width: number, height: number, left: number, top: number) => any;
    onReposition?: (left: number, top: number) => any;
    style?: React.CSSProperties
};

const pointer = {
    x: 0, // view x
    y: 0, // view y
    pageX: 0,
    pageY: 0
};

export const PointerContext = React.createContext({ pointer });

const SLTSubView: React.FC<PropsWithChildren<ISubViewProps>> = ({ style, children, title }) => {
    const { height, ...rest } = style || {}
    return (
        <PointerContext.Provider value={{ pointer }}>
            <div
                className="slt-sub-view"
                style={{ ...rest, position: 'absolute' }}
            >
                <div
                    className="header"
                    style={{ color: '#fff' }}
                >{title}</div>
                <div className="content" style={{ height }}>
                    {children}
                </div>
            </div>
        </PointerContext.Provider>
    )
}

export default SLTSubView;
