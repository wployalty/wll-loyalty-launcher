import React from 'react';
import {CommonContext,} from "../../Context";
import EarnPageLauncher from "./EarnPageLauncher";
import RedeemPageLauncher from "./RedeemPageLauncher";
import HomePageLauncher from "./HomePageLauncher";

const PreviewLauncher = () => {
    const [activePage, setActivePage] = React.useState("home");
    const {commonState} = React.useContext(CommonContext);
    const {launcher} = commonState;

    const getActiveLauncherPage = (activePage) => {
        switch (activePage) {
            case `home`:
                return <HomePageLauncher activePage={{value: activePage, set: setActivePage}}/>;
            case `earn_points`:
                return <EarnPageLauncher activePage={{value: activePage, set: setActivePage}}/>;
            case `redeem`:
                return <RedeemPageLauncher activePage={{value: activePage, set: setActivePage}}/>;
        }
    }
    return <div
        className={` h-max h-full flex flex-col gap-3  shadow-launcher overflow-hidden rounded-3xl relative`}
        style={{
            fontFamily: `${launcher.font_family}`,

            bottom: "44px",
        }}
    >
        {getActiveLauncherPage(activePage)}
    </div>
};

export default PreviewLauncher;