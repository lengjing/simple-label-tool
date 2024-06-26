import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../context';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import SLTTool from './SLTTool';
import { Box, Divider, Grid } from '@mui/material';

const SLTTopBar: React.FC = observer(() => {
    const store = useStore();
    const [open, setOpen] = useState(false);

    return (
        <div className='slt-title-bar' style={{ height: 60, paddingRight: 20, boxShadow: "inset 0 -1px #d0d7de"}}>
            <Grid container>
                <Grid item xs={4}>
                
                </Grid>
                <Grid item xs={4} display={'flex'} alignItems={"center"}>
                    <SLTTool></SLTTool>
                </Grid>
                <Grid item xs={4}>
                    <Stack spacing={2} direction="row" justifyContent="end" alignItems="center">
                        {/* <Button size="small" variant="contained" color="secondary" disabled={!store.canRedo} onClick={() => store.redo()}>redo</Button>
                        <Button size="small" variant="contained" color="secondary" disabled={!store.canUndo} onClick={() => store.undo()}>undo</Button> */}
                        <Button size="small" variant="contained" color="primary" onClick={() => setOpen(true)}>annotation</Button>
                    </Stack>
                </Grid>
            </Grid>
            <Drawer
                anchor={"right"}
                open={open}
                onClose={() => setOpen(false)}
            >
                <div className='annotations' style={{ width: 400 }}>
                    <pre>
                        {JSON.stringify(store.elements.map(el => {
                            const { id, value, key } = el;

                            return { id, value, key }
                        }), null, 2)}
                    </pre>
                </div>
            </Drawer>
        </div>
    )
})

export default SLTTopBar;
