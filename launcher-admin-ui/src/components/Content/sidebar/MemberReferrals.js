import React from 'react';
import SidebarHeaderTitle from "../../sidebar/SidebarHeaderTitle";
import SidebarInnerContainer from "../../Common/SidebarInnerContainer";
import LabelInputContainer from "../../Common/LabelInputContainer";
import {CommonContext, ContentContext, UiLabelContext} from "../../../Context";
import Icon from "../../Common/Icon";
import ShortCodeDetailContainer from "../../Common/ShortCodeDetailContainer";
import BackContainer from "../../Common/BackContainer";
import {getErrorMessage} from "../../../helpers/utilities";

const MemberReferrals = ({setActiveSidebar}) => {
    const labels = React.useContext(UiLabelContext)
    const {commonState, setCommonState, appState} = React.useContext(CommonContext);
    const {errors, errorList} = React.useContext(ContentContext)
    const [showShortCodes, setShowShortCodes] = React.useState(false);

    const {content} = commonState;
    let {member} = content;
    let {referrals} = member;


    const handleMemberTexts = (e, field) => {
        let data = {...commonState};
        data.content.member.referrals[field] = e.target.value;
        setCommonState(data);
    }
    return <div>
        <SidebarHeaderTitle title={labels.common.referrals} click={() => setActiveSidebar("member")}/>
        <div className={`flex flex-col w-full h-[475px] overflow-y-auto `}>
            <SidebarInnerContainer title={labels.common.texts}>
                <LabelInputContainer label={labels.common.title}
                                     value={referrals.title}
                                     error={errorList.includes("content.member.referrals.title")}
                                     error_message={errorList.includes("content.member.referrals.title") &&
                                         getErrorMessage(errors, "content.member.referrals.title")}
                                     onChange={(e) => handleMemberTexts(e, "title",)}
                />
                <LabelInputContainer label={labels.common.description}
                                     value={referrals.description}
                                     error={errorList.includes("content.member.referrals.description")}
                                     error_message={errorList.includes("content.member.referrals.description") &&
                                         getErrorMessage(errors, "content.member.referrals.description")}
                                     onChange={(e) => handleMemberTexts(e, "description")}
                                     type={"textarea"}
                />

                <div
                    className={`flex flex-col w-full ${showShortCodes ? "h-[252px]" : "h-10"} transition-all  ease-out overflow-hidden  
                    px-2
                    bg-grey_extra_light border border-card_border rounded-md `}>
                    <div className={'w-full flex items-center cursor-pointer justify-between  w-full p-1.5'}
                         onClick={() => setShowShortCodes(!showShortCodes)}>
                        <div className={`flex items-center p-1 gap-x-2`}>
                            <Icon icon={"info_circle"} color={"text-dark"}/>
                            <p className={`text-dark font-medium 2xl:text-md text-sm `}>{labels.member.banner.shortcodes}</p>
                        </div>
                        <Icon icon={"arrow-down"} color={"text-dark"}
                        />
                    </div>
                    <span className={`border-b border-light_border w-full`}/>
                    <div className={`flex flex-col w-full h-full overflow-y-auto `}>
                        {labels.shortcodes.content.member.referrals.shortcodes.map((shortcode, i) => {
                            return <ShortCodeDetailContainer key={i} label={shortcode.label} value={shortcode.value}/>
                        })}

                    </div>
                </div>
            </SidebarInnerContainer>
            <BackContainer click={() => setActiveSidebar("member")}/>
        </div>
    </div>
};

export default MemberReferrals;