import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useCloud } from './SLTCloud';
import { ICubeElement } from '../../slt';

type CubeProps = {
    onMouseDown?: () => any;
    onDragStart?: () => any;
    onDrag?: () => any;
    onDragEnd?: () => any;
    draggable?: boolean;
    element: ICubeElement
}

const Cube: React.FC<CubeProps> = observer(({ element, draggable = false }) => {
    const cloud = useCloud();
    // Error: [mobx-state-tree] You are trying to read or write to an object that is no longer part of a state tree. 
    const id = element.id;

    useEffect(() => {
        cloud.renderCube(element);
        const cube = cloud.getCube(element.id);

        const disposer = [
            reaction(
                () => element.color,
                () => {
                    // 
                }
            ),

            reaction(
                () => element.value.position.x,
                (v) => {
                    cube?.position.setX(v);
                    cloud.render()
                }
            ),

            reaction(
                () => element.value.position.y,
                (v) => {
                    cube?.position.setY(v);
                    cloud.render()
                }
            ),

            reaction(
                () => element.value.position.z,
                (v) => {
                    cube?.position.setZ(v);
                    cloud.render()
                }
            ),

            reaction(
                () => element.value.size.width,
                (v) => {
                    cube?.scale.setX(v / 0.01)
                    cloud.render()
                }
            ),

            reaction(
                () => element.value.size.depth,
                (v) => {
                    cube?.scale.setY(v / 0.01)
                    cloud.render()
                }
            ),

            reaction(
                () => element.value.size.height,
                (v) => {
                    cube?.scale.setZ(v / 0.01)
                    cloud.render()
                }
            ),

            reaction(
                () => element.value.rotation.x,
                (v) => {
                    cube?.rotateX(v)
                    cloud.render()
                }
            ),

            reaction(
                () => element.value.rotation.y,
                (v) => {
                    cube?.rotateY(v)
                    cloud.render()
                }
            ),

            reaction(
                () => element.value.rotation.z,
                (v) => {
                    cube?.rotateZ(v)
                    cloud.render()
                }
            )
        ]

        return () => {
            cloud.removeCube(id);

            disposer.forEach(d => d());
        }
    }, [])

    return null;
})

export default Cube;
