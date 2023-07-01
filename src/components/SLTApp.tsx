import React, { PropsWithChildren } from 'react';
import SLTContainer from './SLTContainer';
import SLTWorkspace from './SLTWorkspace';
import SLTCloud from './SLTCloud';
import SLTPlane from './SLTPlane';
import { IStore } from '../models/store';
import { StoreContext } from '../context';
import SplitView from './SplitView';
import SLTSidePanel from './SLTSidePanel';
import Classification from './Classification';
import SLTStatusBar from './SLTStatusBar';
import SLTTopBar from './SLTTopBar';

const SLTApp: React.FC<PropsWithChildren<{ store: IStore }>> = ({
    store
}) => {
    return (
        <StoreContext.Provider value={store}>
            <div style={{ width: '100vw', height: '100vh' }}>
                <SLTTopBar></SLTTopBar>
                <SLTContainer>
                    <SplitView views={[
                        {
                            element: (
                                <SLTSidePanel key="slt-side-panel"></SLTSidePanel>
                            ),
                            init: 0.2
                        },
                        {
                            element: (
                                // <SLTWorkspace key="slt-workspace">
                                <SLTPlane></SLTPlane>
                                // <SLTCloud pcdUrl='https://www.stardust-ai.com/asset/annotationTool/pointCloud/PointCloudObjectRecognition/2/2022-02-27-12-23-00_frame_000002.pcd'></SLTCloud>
                                // </SLTWorkspace>
                            ),
                            init: 0.8,
                        },
                    ]}></SplitView>
                </SLTContainer>
                <SLTStatusBar></SLTStatusBar>
            </div>
        </StoreContext.Provider>
    )
}

export default SLTApp;
