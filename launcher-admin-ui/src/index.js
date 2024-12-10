import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tailwind.generated.css";
import App from "./App";

let target = document.getElementById("wll-admin-main");
if (target) {
    let root = ReactDOM.createRoot(target);
    root.render(<App/>);
} else {
    setTimeout(() => {
        target = document.getElementById("wll-admin-main");
        if (target) {
            const root = ReactDOM.createRoot(target);
            root.render(<App/>);
        }
    }, 1000)
}