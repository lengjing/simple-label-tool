import { observer } from 'mobx-react';
import React, { PropsWithChildren } from 'react';

const SLTContainer: React.FC<PropsWithChildren> = observer(({
    children
}) => {
    return (
        <div className="slt-container" style={{ width: '100vw', height: '100vh' }}>
            {children}
        </div>
    )
})

export default SLTContainer;
