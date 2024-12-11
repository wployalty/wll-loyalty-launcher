import React from 'react';
import {LaunchercontentContext} from "../../Context";

const LoadingIcon = () => {
    const {launcherState} = React.useContext(LaunchercontentContext);
    return <div
        className={`wll-loading-icon-container  text-primary space-y-4 wll-flex wll-flex-col items-center justify-center  w-full `}>
        <i className="wlr wlrf-spinner animate-spin  text-2xl  color-important "
           style={{
               color: `${launcherState.design.colors.theme.primary}`
           }}
        />
    </div>
};

export default LoadingIcon;