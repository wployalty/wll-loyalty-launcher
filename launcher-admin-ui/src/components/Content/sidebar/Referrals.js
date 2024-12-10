import React from 'react';
import SidebarHeaderTitle from "../../sidebar/SidebarHeaderTitle";
import LabelInputContainer from "../../Common/LabelInputContainer";
import SidebarInnerContainer from "../../Common/SidebarInnerContainer";
import {CommonContext, ContentContext, UiLabelContext} from "../../../Context";
import BackContainer from "../../Common/BackContainer";
import {getErrorMessage} from "../../../helpers/utilities";

const Referrals = ({setActiveSidebar}) => {
    const labels = React.useContext(UiLabelContext);
    const {commonState, setCommonState} = React.useContext(CommonContext);
    const {errors, errorList} = React.useContext(ContentContext)
    const {content} = commonState;
    let {guest} = content;
    let {referrals} = guest;

    const handleGuestTexts = (e, field) => {
        let data = {...commonState};
        data.content.guest.referrals[field] = e.target.value;
        setCommonState(data);
    }
    return <div>
        <SidebarHeaderTitle title={labels.common.referrals} click={() => setActiveSidebar("guest")}/>
        <div className={`flex flex-col w-full h-[520px] overflow-y-auto `}>
            <SidebarInnerContainer title={labels.common.texts}>
                <LabelInputContainer label={labels.common.title}
                                     value={referrals.title}
                                     error={errorList.includes("content.guest.referrals.title")}
                                     error_message={errorList.includes("content.guest.referrals.title") &&
                                         getErrorMessage(errors, "content.guest.referrals.title")}
                                     onChange={(e) => handleGuestTexts(e, "title",)}
                />
                <LabelInputContainer label={labels.common.description}
                                     value={referrals.description}
                                     error={errorList.includes("content.guest.referrals.description")}
                                     error_message={errorList.includes("content.guest.referrals.description") &&
                                         getErrorMessage(errors, "content.guest.referrals.description")}
                                     onChange={(e) => handleGuestTexts(e, "description")}
                                     type={"textarea"}
                />
            </SidebarInnerContainer>
            <BackContainer click={() => setActiveSidebar("guest")}/>
        </div>
    </div>
};
export default Referrals;