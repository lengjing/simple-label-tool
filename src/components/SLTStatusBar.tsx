import React from "react";
import { useStore } from "../context";
import { observer } from "mobx-react";

const SLTStatusBar: React.FC = observer(() => {
    const store = useStore();

    return (
        <div className="slt-status-bar" style={{height: 80}}>
            scale: {store.scale}
        </div>
    )
})

export default SLTStatusBar;
