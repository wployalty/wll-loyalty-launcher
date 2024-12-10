import React from 'react';
import SidebarHeaderTitle from "./SidebarHeaderTitle";
import SidebarInnerContainer from "../Common/SidebarInnerContainer";
import {getErrorMessage, split_content} from "../../helpers/utilities";
import ChooseButtonContainer from "../Common/ChooseButtonContainer";
import InputWrapper from "../Common/InputWrapper";
import {CommonContext, DesignContext, UiLabelContext} from "../../Context";
import BackContainer from "../Common/BackContainer";

const Placement = ({setActiveSidebar}) => {
    const labels = React.useContext(UiLabelContext);
    const {commonState, setCommonState} = React.useContext(CommonContext);
    const {errors, errorList} = React.useContext(DesignContext)
    const {design} = commonState;
    const {placement} = design;
    const handlePosition = (value) => {
        let data = {...commonState};
        data.design.placement.position = value;
        setCommonState(data);
    }
    const handleSidePositions = (e, field) => {
        let data = {...commonState};
        data.design.placement[field] = e.target.value;
        setCommonState(data);
    }
    return <div className={``}>
        <SidebarHeaderTitle title={labels.design.placement.title}
                            click={() => setActiveSidebar("all")}/>
        <div className={`flex flex-col w-full h-[520px] overflow-y-auto `}>
            <SidebarInnerContainer title={labels.design.placement.position.title}>
                <div className={`${split_content}`}>
                    <ChooseButtonContainer label={labels.common.left} click={() => handlePosition("left")}
                                           activated={design.placement.position === "left"}/>
                    <ChooseButtonContainer label={labels.common.right} click={() => handlePosition("right")}
                                           activated={design.placement.position === "right"}/>
                </div>
            </SidebarInnerContainer>
            <SidebarInnerContainer title={labels.design.placement.spacing.title}>
                <p className={`text-light 2xl:text-sm text-xs font-normal  `}
                >{labels.design.placement.spacing.description}
                </p>
                <div className={`${split_content}`}>
                    <InputWrapper label={labels.design.placement.spacing.side_space}
                                  value={placement.side_spacing}
                                  type={"number"}
                                  error={errorList.includes("design.placement.side_spacing")}
                                  error_message={errorList.includes("design.placement.side_spacing") &&
                                      getErrorMessage(errors, "design.placement.side_spacing")}
                                  onChange={(e) => handleSidePositions(e, "side_spacing")}
                                  border={"border-none"}/>
                    <InputWrapper label={labels.design.placement.spacing.bottom_space}
                                  type={"number"}
                                  error={errorList.includes("design.placement.bottom_spacing")}
                                  error_message={errorList.includes("design.placement.bottom_spacing") &&
                                      getErrorMessage(errors, "design.placement.bottom_spacing")}
                                  onChange={(e) => handleSidePositions(e, "bottom_spacing")}
                                  value={placement.bottom_spacing}
                                  border={"border-none"}/>
                </div>
            </SidebarInnerContainer>
            <BackContainer click={() => setActiveSidebar("all")}/>
        </div>
    </div>

};

export default Placement;