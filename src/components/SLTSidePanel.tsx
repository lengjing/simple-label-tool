import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useStore } from '../context';
import { ICssSize } from '../types';
import Classification from './Classification';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const SLTSidePanel: React.FC<Partial<ICssSize>> = observer(({
    width = '100%',
    height = '100%',
}) => {
    const [open, setOpen] = useState(false);
    const store = useStore();

    return (
        <div className='side-panel' style={{ width, height, boxShadow: "-1px 0 #d0d7de" }}>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <h3>classifications</h3>
                <div className='classifications'>
                    {store.classifications.map(classification => {
                        return (
                            <Classification key={classification.name} {...classification}></Classification>
                        )
                    })}
                    <IconButton onClick={() => setOpen(true)}>
                        <AddIcon></AddIcon>
                    </IconButton>

                    {/* <Dialog
                        open={open}
                        onClose={() => {
                            setOpen(false)
                        }}
                        PaperProps={{
                            onSubmit: (event) => {
                                event.preventDefault();
                                const formData = new FormData(event.currentTarget);
                                const formJson = Object.fromEntries((formData as any).entries());
                                const email = formJson.email;
                                console.log(email)
                            },
                        }}
                    >
                        <DialogTitle>add classification</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="name"
                                name="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { }}>Cancel</Button>
                            <Button type="submit">Subscribe</Button>
                        </DialogActions>
                    </Dialog> */}
                </div>
            </Box>
        </div>
    )
})

export default SLTSidePanel;
