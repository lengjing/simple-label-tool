import { observer } from 'mobx-react';
import React, { PropsWithChildren } from 'react';
import { useStore } from '../context';
import { ICssSize } from '../types';
import Classification from './Classification';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const SLTSidePanel: React.FC<Partial<ICssSize>> = observer(({
    width = '100%',
    height = '100%',
}) => {
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
                </div>
            </Box>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <h3>tools</h3>
                <List component="nav">
                    <ListItemButton
                        selected={store._selectedTool === "rect"}
                        onClick={e => store.setSelectedTool('rect')}
                    >
                        {/* <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon> */}
                        <ListItemText inset primary="rect" />
                    </ListItemButton>
                    <ListItemButton
                        selected={store._selectedTool === "cube"}
                        onClick={e => store.setSelectedTool("cube")}
                    >
                        {/* <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon> */}
                        <ListItemText inset primary="cube" />
                    </ListItemButton>
                </List>
            </Box>
        </div>
    )
})

export default SLTSidePanel;
