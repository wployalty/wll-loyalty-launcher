import React from 'react';
import SidebarHeaderTitle from "../../sidebar/SidebarHeaderTitle";
import SidebarInnerContainer from "../../Common/SidebarInnerContainer";
import LabelInputContainer from "../../Common/LabelInputContainer";
import {CommonContext, ContentContext, UiLabelContext} from "../../../Context";
import {getErrorMessage} from "../../../helpers/utilities";
import BackContainer from "../../Common/BackContainer";
import Icon from "../../Common/Icon";
import ShortCodeDetailContainer from "../../Common/ShortCodeDetailContainer";

const Welcome = ({setActiveSidebar}) => {
    const labels = React.useContext(UiLabelContext);
    const [showShortCodes, setShowShortCodes] = React.useState(false);
    const {errors, errorList} = React.useContext(ContentContext)
    const {commonState, setCommonState} = React.useContext(CommonContext);
    const {content} = commonState;
    let {guest} = content;
    let {welcome} = guest;

    const handleGuestTexts = (e, group, field) => {
        let data = {...commonState};
        data.content.guest.welcome[group][field] = e.target.value;
        setCommonState(data);
    };

    return <div className={`h-full w-full flex flex-col `} style={
        {transition: "all 0.5s ease-in-out"}
    }>
        <SidebarHeaderTitle title={labels.common.welcome} click={() => setActiveSidebar("guest")}/>
        <div className={`flex flex-col w-full h-[488px] overflow-y-auto `}>
            <SidebarInnerContainer title={labels.common.texts}>
                <LabelInputContainer label={labels.common.title}
                                     value={welcome.texts.title}
                                     error={errorList.includes("content.guest.welcome.texts.title")}
                                     error_message={errorList.includes("content.guest.welcome.texts.title") &&
                                         getErrorMessage(errors, "content.guest.welcome.texts.title")}
                                     onChange={(e) => handleGuestTexts(e, "texts", "title")}
                />
                <LabelInputContainer label={labels.common.description}
                                     value={welcome.texts.description}
                                     error={errorList.includes("content.guest.welcome.texts.description")}
                                     error_message={errorList.includes("content.guest.welcome.texts.description") && getErrorMessage(errors, "content.guest.welcome.texts.description")}
                                     onChange={(e) => handleGuestTexts(e, "texts", "description")}
                                     type={"textarea"}
                />
                <LabelInputContainer label={labels.guest.welcome.texts.have_account}
                                     value={welcome.texts.have_account}
                                     error={errorList.includes("content.guest.welcome.texts.have_account")}
                                     error_message={errorList.includes("content.guest.welcome.texts.have_account") && getErrorMessage(errors, "content.guest.welcome.texts.have_account")}
                                     onChange={(e) => handleGuestTexts(e, "texts", "have_account")}
                />
                <LabelInputContainer label={labels.guest.welcome.texts.sign_in}
                                     value={welcome.texts.sign_in}
                                     error={errorList.includes("content.guest.welcome.texts.sign_in")}
                                     error_message={errorList.includes("content.guest.welcome.texts.sign_in") && getErrorMessage(errors, "content.guest.welcome.texts.sign_in")}
                                     onChange={(e) => handleGuestTexts(e, "texts", "sign_in")}
                />
                <LabelInputContainer label={labels.common.link}
                                     value={welcome.texts.sign_in_url}
                                     error={errorList.includes("content.guest.welcome.texts.sign_in_url")}
                                     error_message={errorList.includes("content.guest.welcome.texts.sign_in_url") && getErrorMessage(errors, "content.guest.welcome.texts.sign_in_url")}
                                     onChange={(e) => handleGuestTexts(e, "texts", "sign_in_url")}
                />
            </SidebarInnerContainer>
            <SidebarInnerContainer title={labels.common.buttons}>
                <LabelInputContainer label={labels.guest.welcome.buttons.create_account}
                                     value={welcome.button.text}
                                     error={errorList.includes("content.guest.welcome.button.text")}
                                     error_message={errorList.includes("content.guest.welcome.button.text") && getErrorMessage(errors, "content.guest.welcome.button.text")}
                                     onChange={(e) => handleGuestTexts(e, "button", "text")}
                />
                <LabelInputContainer label={labels.common.link}
                                     value={welcome.button.url}
                                     error={errorList.includes("content.guest.welcome.button.url")}
                                     error_message={errorList.includes("content.guest.welcome.button.url") && getErrorMessage(errors, "content.guest.welcome.button.url")}
                                     onChange={(e) => handleGuestTexts(e, "button", "url")}
                />
            </SidebarInnerContainer>

            <SidebarInnerContainer>
                <div
                    className={`flex flex-col w-full ${showShortCodes ? "h-[200px]" : "h-10"} transition-all  ease-out overflow-hidden  bg-grey_extra_light border border-card_border rounded-md `}>
                    <div className={'w-full flex items-center cursor-pointer justify-between w-full p-1.5'}
                         onClick={() => setShowShortCodes(!showShortCodes)}
                    >
                        <div className={`flex items-center p-1 gap-x-2`}>
                            <Icon icon={"info_circle"} color={"text-dark"}/>
                            <p className={`text-dark font-medium 2xl:text-md text-sm `}>{labels.member.banner.shortcodes}</p>
                        </div>
                        <Icon icon={"arrow-down"} color={"text-dark"}
                        />
                    </div>
                    <span className={`border-b border-light_border w-full`}/>
                    <div className={`flex flex-col w-full h-full overflow-y-auto `}>
                        {labels.shortcodes.content.guest.welcome.shortcodes.map((shortcode, i) => {
                            return <ShortCodeDetailContainer key={i} label={shortcode.label} value={shortcode.value}/>
                        })}
                    </div>
                </div>
            </SidebarInnerContainer>
            <BackContainer click={() => setActiveSidebar("guest")}/>

        </div>
    </div>
};

export default Welcome;