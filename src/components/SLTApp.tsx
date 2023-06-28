import React, { PropsWithChildren } from 'react';
import SLTContainer from './SLTContainer';
import SLTWorkspace from './SLTWorkspace';
import SLTCloudView from './SLTCloudView';
import { IStore } from '../models/store';
import { StoreContext } from '../context';

const SLTApp: React.FC<PropsWithChildren<{ store: IStore }>> = ({
    store
}) => {
    return (
        <StoreContext.Provider value={store}>
            <SLTContainer>
                <SLTWorkspace>
                    <SLTCloudView></SLTCloudView>
                </SLTWorkspace>
            </SLTContainer>
        </StoreContext.Provider>
    )
}

export default SLTApp;
