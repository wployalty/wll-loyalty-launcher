import React from 'react';
import {LaunchercontentContext} from "../../Context";
import Icon from "./Icon";

const PopupFooter = ({design, active}) => {
    const {launcherState} = React.useContext(LaunchercontentContext)
    const {content} = launcherState;
    return (design.branding.is_show === "show") && <div
        className={`wll-footer-container wll-flex items-center justify-center h-11 w-full shadow-card_top 
         bg-white gap-x-1  text-extra_light 
         text-xs_13_16 font-medium py-1 px-5`}>
        <p className={`wll-powered-by-text p-1  text-extra_light text-sm lg:text-md font-medium`}>{launcherState.labels.footer.powered_by}</p>
        <Icon icon={"wployalty_logo"}/>
        <p onClick={() => window.open(launcherState.labels.footer.launcher_power_by_url)}
           style={{color: `#5850ec`}}
           className={`wll-wployalty-branding-text cursor-pointer text-sm lg:text-md font-medium `}>
            {launcherState.labels.footer.title}
        </p>

        {(!launcherState.is_member && active === "preview") &&
            <div
                className={`wll-stick-bottom-sign-in-container wll-absolute bottom-1 wll-flex items-center justify-center earn_point_join_now_show`}
                style={{
                    bottom: "46px"
                }}
            >
                <button
                    onClick={() => window.open(content.guest.welcome.button.url)}
                    className={`wll-stick-bottom-sign-in-button antialiased font-medium wll-flex items-center justify-center space-x-2 outline-none tracking-normal whitespace-nowrap 
                                    wp-loyalty-button text-primary px-6 py-2 cursor-pointer min-w-max rounded-md cursor-pointer`}
                    style={{backgroundColor: `${design.colors.buttons.background} `}}
                >
                             <span
                                 className={`wll-stick-bottom-sign-in-text ${design.colors.buttons.text === "white" ? "text-white" : "text-black"} 2xl:text-sm text-xs font-semibold `}>
                            {content.guest.welcome.button.text}
                             </span>
                </button>
            </div>}
    </div>

};

export default PopupFooter;