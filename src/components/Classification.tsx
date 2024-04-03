import { observer } from 'mobx-react';
import React from 'react';
import { IClassification } from '../models/store'

const Classification: React.FC<IClassification> = observer(({name, id, color, properties}) => {

    return (
        <div className='classification'>
            <div style={{ backgroundColor: color }}>{name || id}</div>
            <div></div>
        </div>
    )
})

export default Classification;
