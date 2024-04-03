import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Cloud from './SLTCloud/cloud';

const SLTCloudSettings: React.FC<{ cloud: Cloud }> = ({ cloud }) => {
    return (
        <div className="settings" style={{ height: 100 }}>
            <Box display={"inline-block"} marginRight={20}>
                <p>camera position</p>
                <ButtonGroup size="small" variant="contained">
                    <Button>front</Button>
                    <Button onClick={() => {
                        cloud.cameraPosition = "top";
                        cloud.moveCamera();
                    }}>top</Button>
                    <Button>side</Button>
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
                    <Button>height</Button>
                </ButtonGroup>
            </Box>

            <Box display={"inline-block"} marginRight={20}>
                <p>view mode</p>
                <ButtonGroup size="small" variant="contained">
                    <Button onClick={() => {
                        cloud.setViewMode('3d');
                    }}>3D view</Button>
                    <Button onClick={() => {
                        cloud.setViewMode('top');
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
}

export default SLTCloudSettings;
