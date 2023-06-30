import React, { useEffect, useRef } from "react";
import PCDLoader from "../utils/pcdLoader";
import Cloud from "../utils/cloud";
import { useStore } from "../context";
import { observer } from "mobx-react";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { ICssSize } from "../types";

const pcdLoader = new PCDLoader();
const cloud = new Cloud();

const SLTCloud: React.FC<{ pcdUrl: string; } & Partial<ICssSize>> = observer(({
    width = '100%',
    height = '100%',
    pcdUrl
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const sourceCanvasRef = useRef<HTMLCanvasElement>(null)
    const mouseCanvasRef = useRef<HTMLCanvasElement>(null)

    const store = useStore();

    useEffect(() => {
        const { width, height } = containerRef.current!.getBoundingClientRect();

        cloud.init({
            canvas: sourceCanvasRef.current!,
            container: containerRef.current!,
            width,
            height,
        });
        pcdLoader.load(pcdUrl, (pcd) => {
            console.log(pcd);
            cloud.renderPCDFile(pcd);
            cloud.moveCamera();
            cloud.controls.addEventListener('change', () => {
                // console.log(cloud.controls.)
            })
        })
    }, []);

    return (
        <div className="cloud-view" style={{ width, height }}>
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
                        onChange={(ev, value) => cloud.setPointSize(value)}
                    />
                </Box>


            </div>
            <div className="cloud-canvas" ref={containerRef} style={{ height: 'calc(100% - 100px)', position: 'relative' }}>
                <canvas className="source-canvas" ref={sourceCanvasRef} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}></canvas>
                <canvas className="mouse-canvas" ref={mouseCanvasRef} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}></canvas>
            </div>
        </div>
    )
})

export default SLTCloud;
