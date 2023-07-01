import { observer } from 'mobx-react';
import React, { PropsWithChildren } from 'react';
import { useStore } from '../context';
import { ICssSize } from '../types';
import Classification from './Classification';


const SLTSidePanel: React.FC<Partial<ICssSize>> = observer(({
    width = '100%',
    height = '100%',
}) => {
    const store = useStore();

    return (
        <div className='side-panel' style={{ width, height }}>
            <div className='classifications'>
                {store.classifications.map(classification => {
                    return (
                        <Classification key={classification.name} {...classification}></Classification>
                    )
                })}
            </div>
        </div>
    )
})

export default SLTSidePanel;
