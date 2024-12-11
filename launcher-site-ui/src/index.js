import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

let target = document.getElementById("wll-site-launcher");
if (target) {
    let root = ReactDOM.createRoot(target);
    root.render(<App/>);
} else {
    let count = 0;
    const interval = setInterval(() => {
        const target = document.getElementById("wll-site-launcher");
        if (target) {
            const root = ReactDOM.createRoot(target);
            root.render(<App />);
            clearInterval(interval);
        } else {
            count += 1;
            if (count >= 5) {
                clearInterval(interval);
            }
        }
    }, 1000);

}
