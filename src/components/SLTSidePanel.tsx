import { observer } from 'mobx-react';
import React, { PropsWithChildren } from 'react';


type SLTSidePanelProps = {
    width?: number | string
    height?: number | string
} & PropsWithChildren
const SLTSidePanel: React.FC<SLTSidePanelProps> = observer(({
    width = '100%',
    height = '100%',
    children
}) => {
    return (
        <div className='side-panel' style={{ width, height }}>
            {children}
        </div>
    )
})

export default SLTSidePanel;
