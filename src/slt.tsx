import { createRoot } from "react-dom/client";

import SLTApp from './components/SLTApp';
import SLTContainer from './components/SLTContainer';
import SLTWorkspace from './components/SLTWorkspace';

import { IStore } from './models/store';

export {
    SLTApp,
    SLTContainer,
    SLTWorkspace,
}

export * from './models/store';

export * from './context';

export const createSLTApp: (opts: { container: HTMLElement, store: IStore }) => void = ({ container, store }) => {
    const root = createRoot(container);

    root.render(<SLTApp store={store}></SLTApp>);
}
