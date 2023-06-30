import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../context';

type SLTWorkspaceProps = {
    width?: number | string
    height?: number | string
} & PropsWithChildren;
const SLTWorkspace: React.FC<SLTWorkspaceProps> = observer(({
    width = '100%',
    height = '100%',
    children
}) => {
    const store = useStore();

    return (
        <div className="slt-workspace" style={{ width, height }}>
            {store.workspaceTheme}
            {children}
        </div>
    )
})

export default SLTWorkspace;
