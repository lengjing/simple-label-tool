import react from 'react';
import { createRoot } from "react-dom/client";

const Test = ()=>{
    return (
        <div>hello word</div>
    )
}

const container = document.getElementById("app");
const root = createRoot(container!);

root.render(<Test></Test>);
