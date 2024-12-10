import React from 'react';
import {CommonContext} from "../../Context";
import EarnPageLauncher from "./EarnPageLauncher";
import RedeemPageLauncher from "./RedeemPageLauncher";
import MemberHomePageLauncher from "../preview_page/MemberHomePageLauncher";

const MemberLauncherPreview = ({activeSidebar}) => {
    const {commonState,} = React.useContext(CommonContext);
    const {launcher} = commonState;
    const [activePage, setActivePage] = React.useState("home");

    const getActiveLauncherPage = (activePage) => {
        switch (activePage) {
            case `home`:
                return <MemberHomePageLauncher activePage={{value: activePage, set: setActivePage}}/>;
            case `earn_points`:
                return <EarnPageLauncher activePage={{value: activePage, set: setActivePage}}/>;
            case `redeem`:
                return <RedeemPageLauncher activeSidebar={activeSidebar}
                                           activePage={{value: activePage, set: setActivePage}}/>;
        }
    }

    return <div
        className={`  h-full flex flex-col gap-3  shadow-launcher overflow-hidden rounded-3xl relative`}
        style={{
            fontFamily: `${launcher.font_family}`,
            bottom: "44px",
        }}
    >
        {getActiveLauncherPage(activePage)}
    </div>
};

export default MemberLauncherPreview;