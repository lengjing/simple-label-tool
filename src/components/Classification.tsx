import React from 'react';
import { useStore } from '../context';

const Classification = () => {
    const store = useStore();

    return (
        <div className='classifications'>
            {store.classifications.map(classification => {
                return (
                    <div key={classification.key} style={{ backgroundColor: classification.color }}>{classification.key}</div>
                )
            })}
        </div>
    )
}

export default Classification;
