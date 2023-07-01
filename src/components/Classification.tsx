import { observer } from 'mobx-react';
import React from 'react';
import { IClassification } from '../models/store'

const Classification: React.FC<IClassification> = observer(({name, color, properties}) => {

    return (
        <div className='classification'>
            <div style={{ backgroundColor: color }}>{name}</div>
            <div></div>
        </div>
    )
})

export default Classification;
