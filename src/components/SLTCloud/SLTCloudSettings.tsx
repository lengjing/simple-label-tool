import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { useCloud } from './SLTCloud';

const SLTCloudSettings: React.FC<{}> = observer(() => {
    const cloud = useCloud();

    return (
        <div className="cloud-settings" style={{ color: "#fff", position: "absolute", top: 0, left: 20 }}>
            <Box display={"inline-block"} marginRight={20}>
                <p>camera position</p>
                <ButtonGroup size="small" variant="contained">
                    <Button onClick={() => {
                        cloud.cameraPosition = "front";
                        cloud.moveCamera();
                    }}>front</Button>
                    <Button onClick={() => {
                        cloud.cameraPosition = "side";
                        cloud.moveCamera();
                    }}>side</Button>
                    <Button onClick={() => {
                        cloud.cameraPosition = "top";
                        cloud.moveCamera();
                    }}>top</Button>
                </ButtonGroup>
            </Box>

            <Box display={"inline-block"} marginRight={20}>
                <p>shader mode</p>
                <ButtonGroup size="small" variant="contained">
                    <Button onClick={() => {
                        cloud.setShaderMode('gray');
                    }}>gray</Button>
                    <Button onClick={() => {
                        cloud.setShaderMode('intensity');
                    }}>intensity</Button>
                    <Button disabled>height</Button>
                </ButtonGroup>
            </Box>

            <Box display={"inline-block"} marginRight={20}>
                <p>view mode</p>
                <ButtonGroup size="small" variant="contained">
                    <Button onClick={() => {
                        cloud.setViewMode('3d');
                        cloud.moveCamera();
                    }}>3D view</Button>
                    <Button onClick={() => {
                        cloud.setViewMode('top');
                        cloud.moveCamera();
                    }}>top view</Button>
                </ButtonGroup>
            </Box>

            <Box display={"inline-block"} width={200} marginRight={20}>
                <p>point size</p>
                <Slider
                    size="small"
                    valueLabelDisplay="auto"
                    min={1}
                    max={10}
                    onChange={(ev, value) => cloud.setPointSize(value as number)}
                />
            </Box>
        </div>
    )
})

export default SLTCloudSettings;
