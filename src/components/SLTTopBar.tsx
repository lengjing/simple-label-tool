import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../context';
import Button from '@mui/material/Button';

const SLTTopBar: React.FC = observer(() => {
    const store = useStore();

    return (
        <div className='slt-title-bar' style={{ height: 60, backgroundColor: "MenuText" }}>
            <Button size="small" variant="contained" color="primary">annotation</Button>
            <Button size="small" variant="contained" color="secondary">forward</Button>
            <Button size="small" variant="contained" color="secondary">backward</Button>
        </div>
    )
})

export default SLTTopBar;
