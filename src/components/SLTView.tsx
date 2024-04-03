import React, { PropsWithChildren } from "react";
import { ICssSize } from "../types";

const SLTView: React.FC<PropsWithChildren<Partial<ICssSize>>> = ({ children, height = '100%' }) => {
    return (
        <div
            className="slt-view"
            style={{ position: "relative", height }}
        >
            {children}
        </div>
    )
}

export default SLTView;
