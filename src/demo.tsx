import React from 'react';
import { SLTCloud, SLTSidePanel, SLTWorkspace, SplitView, StoreContext, createStore } from './slt';

const store = createStore({
    classifications: [
        { key: 'car', color: 'aliceblue' },
        { key: 'person', color: 'antiquewhite' },
        { key: 'bicycle', color: 'aqua', props: [] }
    ]
});

const Demo = () => {

    return (
        <div id='demo'>
            <StoreContext.Provider value={store}>
                <SplitView views={[
                    {
                        element: <SLTSidePanel key="slt-side-panel">
                            
                        </SLTSidePanel>,
                        init: 0.2
                    },
                    {
                        element: (
                            <SLTWorkspace key="slt-workspace">
                                <SLTCloud pcdUrl='https://www.stardust-ai.com/asset/annotationTool/pointCloud/PointCloudObjectRecognition/2/2022-02-27-12-23-00_frame_000002.pcd'></SLTCloud>
                            </SLTWorkspace>
                        ),
                        init: 0.8,
                    },
                ]}></SplitView>
            </StoreContext.Provider>
        </div>
    )
}

document.getElementById('app')