import React from "react";
import { useStore } from "../context";
import { observer } from "mobx-react";

const SLTStatusBar: React.FC = observer(() => {
    const store = useStore();

    return (
        <div className="slt-status-bar" style={{height: 40, lineHeight: '40px', boxShadow: "0 -1px #d0d7de", paddingLeft: 20}}>
            scale: {store.scale}
            mouse action: {store.mouseAction}
            <span style={{color: 'red', marginLeft: 20}}>左键标注，右键控制点云</span>
        </div>
    )
})

export default SLTStatusBar;
