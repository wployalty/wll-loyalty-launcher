import React from "react";
import {LaunchercontentContext} from "../../Context";

const LoadingAnimation = ({height = "h-full"}) => {
    const {launcherState} = React.useContext(LaunchercontentContext);
    const [text, setText] = React.useState(launcherState.labels.loading_text);

    React.useEffect(() => {
        let getText = setTimeout(() => {
            setText(launcherState.labels.loading_timer_text)
        }, 3000)
        return () => {
            clearInterval(getText)
        }
    }, [])

    return (
        <div
            className={`wll-loading-spinner-container bg-white  text-primary space-y-4 wll-flex wll-flex-col items-center justify-center  w-full ${height}`}>
            <i className="wlr wlrf-spinner animate-spin  text-2xl  color-important "
               style={{
                   color: `${launcherState.design.colors.theme.primary}`
               }}
            />
            <p className="wll-loading-spinner-text text-sm font-medium" style={{
                color: `${launcherState.design.colors.theme.primary}`
            }}>{text}</p>
        </div>
    );
};

export default LoadingAnimation;

