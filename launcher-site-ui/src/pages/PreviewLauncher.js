import React from 'react';
import Home from "./Home";
import EarnPoints from "./EarnPoints";
import RedeemRewards from "./RedeemRewards";
import {LaunchercontentContext} from "../Context";
import {handleVisibilityLauncher} from "../helpers/utilities";

const PreviewLauncher = ({activePage}) => {
    const {launcherState} = React.useContext(LaunchercontentContext);
    let {launcher} = launcherState;

    const getActiveLauncherPage = (activePage) => {
        switch (activePage.value) {
            case `home`:
                return <Home activePage={activePage}/>;
            case `earn_points`:
                return <EarnPoints activePage={activePage}/>;
            case `redeem`:
                return <RedeemRewards activePage={activePage}/>;
        }
    };

    return <div
        className={` wll-content-container bg-white ${handleVisibilityLauncher(launcher.view_option)} wll-flex-col 2xl:gap-y-3 gap-y-2    shadow-launcher overflow-hidden rounded-3xl wll-fixed w-[300px] sm:w-[340px] min-w-[300px]`}
        style={
            launcher.placement.position === "left" ? {
                left: `${+launcher.placement.side_spacing + 16}px`,
                bottom: `${+launcher.placement.bottom_spacing + 66}px`,
                fontFamily: `${launcher.font_family}`,
                zIndex: 999999999,
            } : {
                right: `${+launcher.placement.side_spacing + 16}px`,
                bottom: `${+launcher.placement.bottom_spacing + 66}px`,
                fontFamily: `${launcher.font_family}`,
                zIndex: 999999999,
            }
        }
    >
        {/* ************************ Headers ********************************** */}
        {
            getActiveLauncherPage(activePage)
        }
    </div>
};
export default PreviewLauncher;