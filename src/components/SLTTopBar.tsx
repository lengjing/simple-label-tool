import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../context';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';

const SLTTopBar: React.FC = observer(() => {
    const store = useStore();
    const [open, setOpen] = useState(false);

    return (
        <div className='slt-title-bar' style={{ height: 60, backgroundColor: "MenuText" }}>
            <Stack spacing={2} direction="row" justifyContent="end" alignItems="center" height={'100%'}>
                <Button size="small" variant="contained" color="secondary">forward</Button>
                <Button size="small" variant="contained" color="secondary">backward</Button>
                <Button size="small" variant="contained" color="primary" onClick={() => setOpen(true)}>annotation</Button>
            </Stack>
            <Drawer
                anchor={"right"}
                open={open}
                onClose={() => setOpen(false)}
            >
                <div className='annotations' style={{ width: 400 }}>
                    <pre>
                        {JSON.stringify({
                            annotations: store.elements.map(el => {
                                const { id, value, key } = el;

                                return { id, value, key }
                            })
                        }, null, 2)}
                    </pre>
                </div>
            </Drawer>
        </div>
    )
})

export default SLTTopBar;
