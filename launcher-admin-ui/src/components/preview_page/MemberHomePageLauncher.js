import React from 'react';
import Icon from "../Common/Icon";
import {getHexColor, getReplacedString} from "../../helpers/utilities";
import Image from "../Common/Image";
import {CommonContext, UiLabelContext} from "../../Context";
import PopupFooter from "../Common/PopupFooter";

const MemberHomePageLauncher = ({activePage}) => {
    const {commonState, appState} = React.useContext(CommonContext);
    const {design, content} = commonState;
    let {member} = content;
    const labels = React.useContext(UiLabelContext);

    return <div className={`flex flex-col  relative  w-full h-full `}>

        {/*        header     */}
        <div className={`flex w-full items-center py-2 px-3 justify-between w-full`}>
            {design.logo.image == "" ? <Icon
                    // color={`${getHexColor(design.colors.theme.text)}`}
                    fontSize={"2xl:text-xl text-md"}
                    opactity={`${design.logo.is_show === "none" && "opacity-0"}`}
                    icon={"wployalty_logo"}
                />
                :
                <img loading={"lazy"}
                     className={`${design.logo.is_show === "none" && "opacity-0"} object-contain rounded-md h-8 w-12`}
                     src={design.logo.image}
                     alt={"logo_image"}
                />}
            <div className={`flex items-center justify-center h-8 w-8 rounded-md `}
                 style={{background: `${design.colors.theme.primary}`}}
            >
                <Icon icon={"close"}
                      fontSize={"2xl:text-2xl text-xl"}
                      color={`${getHexColor(design.colors.theme.text)}`}
                />
            </div>
        </div>
        <div className={`max-h-[360px] h-max flex flex-col py-2 px-3 gap-y-2 xl:gap-y-3 overflow-y-auto  w-full`}>
            {/*    join card*/}
            <div
                className={` rounded-xl flex flex-col  justify-start px-3 py-2 w-full  shadow-card_1 transition 200ms linear`}
                style={{backgroundColor: `${design.colors.theme.primary} `}}
            >
                <div className={'flex items-center justify-between w-full'}>
                    <p className={`2xl:text-sm text-xs font-semibold ${design.colors.theme.text === "white" ? "text-white" : "text-black"}`}
                       dangerouslySetInnerHTML={{__html: getReplacedString(content.member.banner.texts.welcome)}}
                    />
                    {(content.member.banner.levels.is_show === "show" && content.member.banner.levels.level_data.user_has_level && appState.is_pro) &&
                        <span
                            className={`flex items-center justify-between px-3 py-1  transition delay-150 ease ${design.colors.buttons.text === "white" ? "text-white" : "text-black"} rounded-md`}
                            style={{backgroundColor: `${design.colors.buttons.background} `}}
                        >
                   <p className={`2xl:text-sm text-xs font-semibold ${design.colors.buttons.text === "white" ? "text-white" : "text-black"}`}>
                       {content.member.banner.levels.level_data.current_level_name}</p>
               </span>}
                </div>
                {content.member.banner.points.is_show === "show" &&
                    <div className={`flex gap-1 justify-start items-baseline mt-1.5`}>
                        <p className={`${design.colors.theme.text === "white" ? "text-white" : "text-black"} 2xl:text-2.5xl text-2xl font-bold`}>{getReplacedString(content.member.banner.texts.points)}</p>
                        <p className={`2xl:text-sm text-xs font-medium ${design.colors.theme.text === "white" ? "text-white" : "text-black"}`}
                           dangerouslySetInnerHTML={{__html: getReplacedString(content.member.banner.texts.points_label)}}
                        />
                    </div>}
                {(content.member.banner.levels.is_show === "show" && content.member.banner.levels.level_data.user_has_level && appState.is_pro)
                    &&
                    <div className={`flex flex-col w-full gap-y-1.5 xl:gap-y-2 pt-1.5`}
                    >
                        {content.member.banner.levels.level_data.is_reached_final_level === false &&
                            <div className={`bg-[#afa3a3] h-2 w-full rounded-md relative`}>
                        <span
                            style={{
                                width: `${content.member.banner.levels.level_data.level_range}%`,
                            }}
                            className={`absolute ${design.colors.theme.text === "white" ? "bg-white" : "bg-black"} left-0 top-0 h-2 rounded-md w-[${content.member.banner.levels.level_data.level_range}%]`}/>
                            </div>
                        }
                        <p className={` text-xs font-normal ${design.colors.theme.text === "white" ? "text-white" : "text-black"}`}>
                            {member.banner.levels.level_data.progress_content}</p>
                    </div>

                }
            </div>
            {/*    points and redeem*/}
            <div className={`flex w-full gap-x-3 `}>

                {/* ************************ earn points ********************************** */}
                <div
                    onClick={() => activePage.set("earn_points")}
                    className={`flex flex-col cursor-pointer shadow-launcher px-3 py-2 w-1/2 gap-y-2 rounded-xl shadow-card_1`}>
                    <div className={`w-8 h-8 `}>
                        {["", undefined].includes(member.points.earn.icon.image) ?
                            <Icon icon={"fixed-discount"} fontSize={"2xl:text-3xl text-2xl"}/>
                            :
                            //data.guest.points.earn.icon.image
                            <Image width={'w-full'} height={`h-full`}
                                   image={member.points.earn.icon.image}
                            />
                        }
                    </div>
                    <div className={`flex items-center w-full justify-between `}>
                        <p className={`text-xs lg:text-sm text-dark  font-semibold `}
                           dangerouslySetInnerHTML={{__html: getReplacedString(member.points.earn.title)}}
                        />
                        <Icon icon={"arrow_right"}/>
                    </div>
                </div>
                {/*    redeem page*/}

                <div
                    onClick={() => activePage.set("redeem")}

                    className={`flex flex-col cursor-pointer shadow-launcher px-3 py-2 w-1/2 gap-y-2 rounded-xl shadow-card_1`}>
                    <div className={`w-8 h-8 `}>
                        {[""].includes(member.points.redeem.icon.image) ?
                            <Icon icon={"redeem"} fontSize={"2xl:text-3xl text-2xl"}/>
                            :
                            <Image width={'w-full'} height={`h-full`} image={member.points.redeem.icon.image}/>
                        }
                    </div>
                    <div className={`flex items-center w-full justify-between `}>
                        <p className={`text-xs lg:text-sm text-dark  font-semibold `}
                           dangerouslySetInnerHTML={{__html: getReplacedString(member.points.redeem.title)}}
                        />
                        <Icon icon={"arrow_right"}/>
                    </div>
                </div>

            </div>

            {/*  REferral*/}
            {(content.member.referrals.is_referral_action_available && appState.is_pro) &&
                <div className={`flex flex-col 2xl:gap-y-2 gap-y-1 w-full px-3 py-2.5 rounded-xl shadow-launcher `}>
                    <p className={`2xl:text-sm text-xs text-dark  font-semibold `}
                       dangerouslySetInnerHTML={{__html: getReplacedString(member.referrals.title)}}/>
                    <p className={`text-10px leading-4 text-light font-medium `}
                       dangerouslySetInnerHTML={{__html: getReplacedString(member.referrals.description)}}
                    />
                    <div className={`relative border border-card_border rounded-md w-full`}>
                        <p className={`p-2 h-8  whitespace-nowrap w-[87%] overflow-hidden overflow-ellipsis text-light 2xl:text-sm text-xs font-medium `}>{content.member.referrals.referral_url}</p>
                        <span
                            style={{backgroundColor: `${design.colors.theme.primary} `}}
                            className={` absolute bottom-0 flex h-8 items-center justify-center px-3 right-0 rounded-md w-8`}
                        >
                    <i className={`wlr wlrf-copy text-white font-medium `}
                    />
                </span>
                    </div>
                    <div className={`flex items-center justify-center gap-x-3 lg:gap-x-4`}>
                        {
                            labels.social_share_list.content.member.referrals.social_share_list.map((icon, i) => {
                                    return <Icon key={i}
                                                 icon={`${icon.action_type}`}
                                                 color={commonState.design.colors.theme.primary}
                                                 fontSize={"2xl:text-2xl text-xl"}/>
                                }
                            )}
                    </div>

                </div>}
        </div>
        <PopupFooter show={design.branding.is_show}/>
    </div>
};

export default MemberHomePageLauncher;