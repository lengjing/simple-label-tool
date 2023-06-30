import { createRoot } from "react-dom/client";

import SLTApp from './components/SLTApp';
import SLTContainer from './components/SLTContainer';
import SLTWorkspace from './components/SLTWorkspace';
import SLTSidePanel from "./components/SLTSidePanel";
import SLTTopBar from "./components/SLTTopBar";
import SLTStatusBar from "./components/SLTStatusBar";
import SLTPlane from "./components/SLTPlane";
import SLTCloud from "./components/SLTCloud";
import Sash from "./components/Sash";
import SplitView from "./components/SplitView";

import { IStore } from './models/store';

export {
    SLTApp,
    SLTContainer,
    SLTWorkspace,
    SLTSidePanel,
    SLTTopBar,
    SLTStatusBar,
    SLTPlane,
    SLTCloud,
    Sash,
    SplitView,
}

export * from './models/store';

export * from './context';

export const createSLTApp: (opts: { container: HTMLElement, store: IStore }) => void = ({ container, store }) => {
    const root = createRoot(container);

    root.render(<SLTApp store={store}></SLTApp>);
}
