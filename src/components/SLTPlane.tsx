import React, { useRef } from 'react';
import { useStore } from '../context';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import { observer } from "mobx-react";
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Navigation from '@mui/icons-material/Navigation';
import Cloud from '@mui/icons-material/Cloud';
import { KonvaEventObject } from 'konva/lib/Node';

const SLTPlane: React.FC<{ width?: number, height?: number }> = observer(({
    width,
    height,
}) => {
    const stageRef = useRef(null);

    const store = useStore();
    const onContextMenu = (e) => {
        // stageRef.current!.batchDraw()
    }

    const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const start = {
            startX: e.evt.pageX
        }
        const onMouseMove = () => {
            
        }

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    return (
        <div className='slt-2d' style={{ width, height }}>
            <MenuList>
                <MenuItem>
                    <ListItemIcon>
                        <Navigation fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>selection</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        ⌘v
                    </Typography>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cut</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        ⌘X
                    </Typography>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        ⌘C
                    </Typography>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <ContentPaste fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Paste</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        ⌘V
                    </Typography>
                </MenuItem>
                {/* <Divider /> */}
                <MenuItem>
                    <ListItemIcon>
                        <Cloud fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Web Clipboard</ListItemText>
                </MenuItem>
            </MenuList>
            <Stage
                ref={stageRef}
                style={{
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px',
                    backgroundImage: 'linear-gradient(45deg,#eee 25%,transparent 0,transparent 75%,#eee 0,#eee),linear-gradient(45deg, #eee 25%, #fff 0, #fff 75%, #eee 0, #eee)'
                }}
                width={width}
                height={height}
                onDragStart={() => console.log('drag start')}
                onDragMove={() => console.log('drag move')}
                onDragEnd={() => console.log('drag end')}
                onMouseDown={(e) => onMouseDown(e)}

                onContextMenu={e => { }
                }>
                {/* <Layer><Image image={}></Image></Layer> */}
                <Layer>
                    {store.elements.map((v, idx) => {
                        if (v.type === "rect") {
                            const { position, value, color } = v;
                            return (
                                <Rect
                                    key={idx}
                                    {...value}
                                    fill={color}
                                    draggable
                                ></Rect>
                            )
                        }
                    })}
                </Layer>
            </Stage>
        </div>
    )
})

export default SLTPlane;
