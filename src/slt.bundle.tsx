import { createRoot } from "react-dom/client";
import SLTApp from "./components/SLTApp";

export const createSLTApp = () => {
    const container = document.getElementById("app");
    const root = createRoot(container!);

    root.render(<SLTApp></SLTApp>);
}