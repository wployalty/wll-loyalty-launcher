import React from 'react';
import SidebarHeaderTitle from "../../sidebar/SidebarHeaderTitle";
import SidebarInnerContainer from "../../Common/SidebarInnerContainer";
import ToggleSwitch from "../../Common/ToggleSwitch";
import LabelInputContainer from "../../Common/LabelInputContainer";
import ShortCodeDetailContainer from "../../Common/ShortCodeDetailContainer";
import Icon from "../../Common/Icon";
import {CommonContext, ContentContext, UiLabelContext} from "../../../Context";
import BackContainer from "../../Common/BackContainer";
import {getErrorMessage} from "../../../helpers/utilities";

const Banner = ({setActiveSidebar}) => {
    const labels = React.useContext(UiLabelContext)
    const {commonState, appState, setCommonState} = React.useContext(CommonContext);
    const {errors, errorList} = React.useContext(ContentContext)
    const [showShortCodes, setShowShortCodes] = React.useState(false);
    const {content} = commonState;
    let {member} = content;
    let {banner} = member;

    const handleMemberTexts = (e, group, field) => {
        let data = {...commonState};
        data.content.member.banner[group][field] = e.target.value;
        setCommonState(data);
    }

    return <div>
        <SidebarHeaderTitle title={labels.common.banner} click={() => setActiveSidebar("member")}/>
        <div className={`flex flex-col w-full h-[488px] overflow-y-auto `}>
            <SidebarInnerContainer title={labels.member.banner.levels}>
                <div className={`flex items-center justify-between w-full`}>
                    <p className={`text-dark font-normal 2xl:text-sm text-xs tracking-wide`}>{banner.levels.is_show === "show" ? labels.common.enabled : labels.common.disabled}</p>
                    <div className={`flex items-center gap-x-2`}>
                        {
                            !appState.is_pro && <div className={`flex items-center  cursor-pointer   justify-center `}
                            >
                            <span className="bg-blue_primary text-white font-medium rounded text-xs px-1.5 py-1"
                                  onClick={(e) => {
                                      e.preventDefault();
                                      window.open(labels.common.buy_pro_url);
                                  }}
                            >
                             {labels.common.upgrade_text}
                            </span>
                            </div>
                        }


                        <ToggleSwitch
                            isActive={banner.levels.is_show === "show"}
                            click={appState.is_pro ? (e) => {
                                e.preventDefault();
                                let data = {...commonState};
                                banner.levels.is_show === "show" ? (() => {
                                        data.content.member.banner.levels.is_show = "none";
                                        setCommonState(data);
                                    })() :
                                    (() => {
                                        data.content.member.banner.levels.is_show = "show";
                                        setCommonState(data);
                                    })()
                            } : () => {
                            }
                            }
                            isPro={appState.is_pro}
                            activate_tooltip={labels.common.toggle.activate}
                            deactivate_tooltip={labels.common.toggle.deactivate}
                        />
                    </div>
                </div>
            </SidebarInnerContainer>
            <SidebarInnerContainer title={labels.common.text}>
                <LabelInputContainer label={labels.common.texts}
                                     value={banner.texts.welcome}
                                     error={errorList.includes("content.member.banner.texts.welcome")}
                                     error_message={errorList.includes("content.member.banner.texts.welcome") &&
                                         getErrorMessage(errors, "content.member.banner.texts.welcome")}
                                     onChange={(e) => handleMemberTexts(e, "texts", "welcome")}
                />
                <div className={`flex items-center justify-between w-full`}>
                    <p className={`text-light  text-xs 2xl:text-sm font-semibold tracking-wider`}>{labels.member.banner.points}</p>
                    <div className={`flex items-center gap-x-2`}>
                        <p className={`text-dark font-normal  text-xs tracking-wide`}>{banner.points.is_show === "show" ? labels.common.enabled : labels.common.disabled}</p>
                        <ToggleSwitch
                            isActive={banner.points.is_show === "show"}
                            click={(e) => {
                                e.preventDefault();
                                let data = {...commonState};
                                banner.points.is_show === "show" ? (() => {
                                        data.content.member.banner.points.is_show = "none";
                                        setCommonState(data);
                                    })() :
                                    (() => {
                                        data.content.member.banner.points.is_show = "show";
                                        setCommonState(data);
                                    })()
                            }}
                            activate_tooltip={labels.common.toggle.activate}
                            deactivate_tooltip={labels.common.toggle.deactivate}
                        />
                    </div>
                </div>
                <LabelInputContainer label={labels.member.banner.point_description}
                                     value={banner.texts.points_label}
                                     error={errorList.includes("content.member.banner.texts.points_label")}
                                     error_message={errorList.includes("content.member.banner.texts.points_label") &&
                                         getErrorMessage(errors, "content.member.banner.texts.points_label")}
                                     onChange={(e) => handleMemberTexts(e, "texts", "points_label")}
                                     type={"textarea"}
                />
            </SidebarInnerContainer>
            <SidebarInnerContainer>
                <div
                    className={`flex flex-col w-full ${showShortCodes ? "h-[252px]" : "h-10"} transition-all  ease-out overflow-hidden  bg-grey_extra_light border border-card_border rounded-md `}>
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
                        {labels.shortcodes.content.member.banner.shortcodes.map((shortcode, i) => {
                            return <ShortCodeDetailContainer key={i} label={shortcode.label} value={shortcode.value}/>
                        })}
                    </div>
                </div>
            </SidebarInnerContainer>
            <BackContainer click={() => setActiveSidebar("member")}/>
        </div>
    </div>
};

export default Banner;