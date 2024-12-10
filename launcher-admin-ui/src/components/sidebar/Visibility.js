import React from 'react';
import SidebarHeaderTitle from "./SidebarHeaderTitle";
import ChooseButtonContainer from "../Common/ChooseButtonContainer";
import SidebarInnerContainer from "../Common/SidebarInnerContainer";
import {split_content} from "../../helpers/utilities";
import {CommonContext, DesignContext, UiLabelContext} from "../../Context";
import BackContainer from "../Common/BackContainer";

const Visibility = ({setActiveSidebar}) => {
    const {commonState, setCommonState} = React.useContext(CommonContext);
    const labels = React.useContext(UiLabelContext);
    const {design} = commonState;
    const handleBrand = (value) => {
        let data = {...commonState};
        data.design.branding.is_show = value;
        setCommonState(data);
    }
    return <div className={``}>
        <SidebarHeaderTitle title={labels.design.branding} click={() => setActiveSidebar("all")}/>
        <div className={`flex flex-col w-full h-[520px] overflow-y-auto wll_no-scrollbar`}>
            <SidebarInnerContainer title={labels.design.logo.visibility}>
                <div className={`${split_content}`}>
                    <ChooseButtonContainer click={() => handleBrand("show")} label={labels.common.show}
                                           activated={design.branding.is_show === "show"}/>
                    <ChooseButtonContainer label={labels.common.none} click={() => handleBrand("none")}
                                           activated={design.branding.is_show === "none"}/>
                </div>
            </SidebarInnerContainer>
            <BackContainer click={() => setActiveSidebar("all")}/>
        </div>
    </div>
};

export default Visibility;
