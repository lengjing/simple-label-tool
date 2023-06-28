import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../context';

const SLTWorkspace: React.FC<PropsWithChildren> = observer(({
    children
}) => {
    const store = useStore();

    return (
        <div className="slt-workspace" style={{ height: '100%' }}>
            {store.workspaceTheme}
            {children}
        </div>
    )
})

export default SLTWorkspace;
