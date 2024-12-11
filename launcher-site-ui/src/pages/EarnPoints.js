import React from 'react';
import PageHeader from "../components/Common/PageHeader";
import {LaunchercontentContext} from "../Context";
import EarnPointLists from "../components/earn_points/EarnPointLists";
import PreviewEarnPoint from "../components/earn_points/PreviewEarnPoint";
import PopupFooter from "../components/Common/PopupFooter";

const EarnPoints = ({activePage}) => {
    const {launcherState} = React.useContext(LaunchercontentContext);
    const {design, content} = launcherState;
    const [active, setActive] = React.useState("list");
    const [previewData, setPreviewData] = React.useState({});
    const {member, guest} = content;

    const getEarnPointsListAndPreview = (active) => {
        switch (active) {
            case `list`:
                return <EarnPointLists previewData={{value: previewData, set: setPreviewData}} setActive={setActive}
                />
            case `preview`:
                return <PreviewEarnPoint previewData={{value: previewData, set: setPreviewData}}/>
        }
    }

    return <div className={`wll-relative wll-flex wll-flex-col h-[63vh]   w-full `}>
        {/*header:*/}
        <PageHeader
            page_name={"earn-points"}
            title={launcherState.is_member ? member.points.earn.title : guest.points.earn.title}
            handleBackIcon={() => active === "preview" ? setActive("list") : activePage.set("home")}
        />
        {getEarnPointsListAndPreview(active)}
        {(!launcherState.is_member && active === "preview") &&
            <div
                className={`wll-stick-bottom-sign-in-container wll-absolute w-full bottom-1 wll-flex items-center justify-center earn_point_join_now_show`}
                style={{
                    bottom: design.branding.is_show === "show" ? "46px" : "12px",
                }}
            >
                <button
                    onClick={() => window.open(content.guest.welcome.button.url, launcherState.is_redirect_self ? "_self" : "_blank")}
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
        <PopupFooter design={design} active={active}/>
    </div>
};

export default EarnPoints;