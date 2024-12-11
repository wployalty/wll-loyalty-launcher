import React from 'react';
import Icon from "../components/Common/Icon";
import {LaunchercontentContext} from "../Context";
import Image from "../components/Common/Image";
import {
    CopyTOClipBoard,
    getHexColor,
    getHtmlDecodeString,
    getJSONData,
    getSiteDirection,
    getTextColor
} from "../helpers/utilities";
import PopupFooter from "../components/Common/PopupFooter";
import {postRequest} from "../components/Common/postRequest";
import LoadingIcon from "../components/Common/LoadingIcon";


const Home = ({activePage}) => {
    const [copy, setCopy] = React.useState(false);
    const [loadingIcon, setLoadingIcon] = React.useState(false);
    const {launcherState, showLauncher} = React.useContext(LaunchercontentContext);
    const {design, content, launcher} = launcherState;
    const {member, guest} = content;
    const {welcome} = guest;

    const handleCopyReferralCode = () => {
        const referralUrl = launcherState.content.member.referrals.referral_url;

        const event = new CustomEvent('wlr_copy_link_custom_url', {
            detail: {
                referralUrl: referralUrl,
            }
        });

        document.dispatchEvent(event)
        if(window.wlr_updated_referral_code){
            CopyTOClipBoard(window.wlr_updated_referral_code);
        }else{
            CopyTOClipBoard(referralUrl);
        }
        setCopy(true);
    };



    const handleSocialIcon = async (url, action) => {
        let click_social_status = [];
        let params = {
            action: `wlr_social_${action}`,
            wlr_nonce: launcherState.nonces.apply_share_nonce,
        };
        setLoadingIcon(true)
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success) {
            window.open(url, action, 'width=626,height=436');
            if (!click_social_status.includes(action)) {
                click_social_status.push(action);
            }
            setLoadingIcon(false)
        } else if (resJSON.success === false) {
            setLoadingIcon(false);
        }
    }

    const getImageFromPointsGuestAndMember = (field) => {
        return launcherState.is_member ? ["", undefined].includes(member.points[field].icon.image) : ["", undefined].includes(guest.points[field].icon.image)
    }

    const getClassName = (field) => {
        return field.replaceAll(".", "-")
    }

    return <div
        style={{
            fontFamily: `${launcher.font_family}`
        }}
        className={`wll-home-container h-max wll-flex wll-flex-col wll-relative w-full`}>
        {/*header*/}
        <div className={`wll-home-header-container wll-flex lg:h-14 h-11    items-center justify-between w-full p-3`}>
            {design.logo.image == "" ? <i
                    style={{color: `${design.colors.theme.primary}`}}
                    className={`wll-default-logo wlr wlrf-wployalty_logo cursor-pointer  ${design.logo.is_show === "none" && "opacity-0"} 
                    text-md lg:text-xl font-medium`}/>
                :
                <img loading={"lazy"}
                     className={`${design.logo.is_show === "none" && "opacity-0"} object-contain rounded-md h-8 w-12`}
                     src={design.logo.image}
                     alt={"logo_image"}
                />}
            <div
                className={`wll-home-close-icon-container wll-flex items-center justify-center h-6 w-6 lg:h-8 lg:w-8 h-8 w-8 rounded-md `}
                style={{background: `${design.colors.theme.primary}`}}
            >
                <Icon icon={"close"}
                      color={`${getHexColor(design.colors.theme.text)}`}
                      fontSize={"2xl:text-3xl text-2xl"}
                      click={() => showLauncher.set(false)}
                />
            </div>
        </div>
        {/*contents*/}
        <div
            className={`wll-home-card-container wll-flex wll-flex-col overflow-y-auto  lg:px-3 px-4 py-2  gap-y-3 w-full max-h-[49vh] h-max`}>
            {/*------- guest welcome card------*/}
            <div
                className={`wll-banner-container rounded-xl  wll-flex wll-flex-col items-center justify-start px-3 lg:px-4 py-3 lg:py-4 w-full  shadow-card_1`}
                style={{backgroundColor: `${design.colors.theme.primary} `}}
            >
                {launcherState.is_member === true ?
                    <div className={'wll-member-banner-container wll-flex wll-flex-col w-full lg:gap-y-5 gap-y-4 '}>
                        <div
                            className={`wll-member-welcome-text-level-container wll-flex items-center ${getTextColor(design.colors.theme.text)} justify-between w-full`}>
                            <p className={`wll-member-welcome-text text-sm lg:text-md font-semibold`}
                               dangerouslySetInnerHTML={{__html: content.member.banner.texts.welcome}}></p>
                            {(content.member.banner.levels.is_show === "show" && content.member.banner.levels.level_data.user_has_level && launcherState.is_pro) &&
                                <span
                                    style={{background: `${design.colors.buttons.background}`}}
                                    className={`wll-level-name wll-flex items-center text-xs lg:text-sm  justify-center px-3 py-1 rounded-md ${getTextColor(design.colors.buttons.text)}`}>
                                {content.member.banner.levels.level_data.current_level_name}
                            </span>}
                        </div>
                        {member.banner.points.is_show === "show" && <div
                            className={`wll-points-label-container ${getTextColor(design.colors.theme.text)} wll-flex gap-x-2 items-baseline w-full `}>
                            <p className={`wll-points-text text-3xl  `}>{content.member.banner.texts.points} </p>
                            <span className={`wll-points-label text-xs lg:text-sm`}
                                  dangerouslySetInnerHTML={{__html: content.member.banner.texts.points_label}}/>
                        </div>}
                        {(content.member.banner.levels.is_show === "show" && content.member.banner.levels.level_data.user_has_level && launcherState.is_pro) &&
                            <div
                                className={`wll-level-progress-container wll-flex wll-flex-col w-full gap-y-1.5 lg:gap-y-2`}>
                                {content.member.banner.levels.level_data.is_reached_final_level === false &&
                                    <div
                                        className={`wll-level-range-progressbar bg-[#afa3a3] h-2 w-full rounded-md wll-relative`}>
                                        <span
                                            style={{
                                                width: `${content.member.banner.levels.level_data.level_range}%`,
                                            }}
                                            className={`wll-level-progress wll-absolute ${design.colors.theme.text === "white" ? "bg-white" : "bg-black"} ${getSiteDirection() == "ltf" && "left-0"}  top-0 h-2 rounded-md w-[${content.member.banner.levels.level_data.level_range}%]`}/>
                                    </div>
                                }
                                <p className={`wll-level-progres-content text-xs font-normal ${getTextColor(design.colors.theme.text)}`}>
                                    {content.member.banner.levels.level_data.progress_content}
                                </p>
                            </div>}
                    </div>
                    :
                    <div
                        className={`wll-guest-banner-container wll-flex wll-flex-col items-center justify-center w-full gap-y-2 md:gap-y-3`}>

                        <div
                            className={`wll-guest-tile-description-container wll-flex wll-flex-col text-center gap-y-1.5`}>
                            <p className={`wll-guest-title text-md ${design.colors.theme.text === "white" ? "text-white" : "text-black"} font-bold`}
                               dangerouslySetInnerHTML={{__html: welcome.texts.title}}/>
                            <p className={`wll-guest-description ${design.colors.theme.text === "white" ? "text-white" : "text-black"}  text-sm_14_l_20 font-normal `}
                               dangerouslySetInnerHTML={{__html: welcome.texts.description}}/>
                        </div>
                        <button
                            onClick={() => window.open(welcome.button.url, launcherState.is_redirect_self ? "_self" : "_blank")}
                            className={`wll-welcome-signup-button antialiased font-medium wll-flex items-center justify-center space-x-2 outline-none tracking-normal whitespace-nowrap wp-loyalty-button text-primary px-6 py-2 cursor-pointer min-w-max rounded-md cursor-pointer`}
                            style={{backgroundColor: `${design.colors.buttons.background} `}}
                        >
                             <span
                                 className={`wll-signup-text ${design.colors.buttons.text === "white" ? "text-white" : "text-black"} 2xl:text-sm text-xs font-semibold `}
                                 dangerouslySetInnerHTML={{__html: welcome.button.text}}>
                             </span>
                        </button>

                        <div
                            className={`wll-login-container wll-flex items-center  text-ultra_light text-sm font-medium gap-y-1.5 gap-x-1.5`}>
                            <p className={`wll-already-account-text ${design.colors.theme.text === "white" ? "text-white" : "text-black"} `}
                               dangerouslySetInnerHTML={{__html: welcome.texts.have_account}}/>
                            <span
                                onClick={() => window.open(content.guest.welcome.texts.sign_in_url, launcherState.is_redirect_self ? "_self" : "_blank")}
                                className={`wll-sign-in-link-text font-semibold ${design.colors.theme.text === "white" ? "text-white" : "text-black"} cursor-pointer`}
                                dangerouslySetInnerHTML={{__html: welcome.texts.sign_in}}
                            />
                        </div>
                    </div>

                }
            </div>

            {/*    points and redeem*/}
            <div className={`wll-points-rewards-container wll-flex w-full lg:gap-x-3 gap-x-2  `}>
                {/* ************************ earn points ********************************** */}
                <div
                    onClick={() => activePage.set("earn_points")}
                    className={`wll-earn-points-container wll-flex wll-flex-col cursor-pointer  p-3 lg:p-4  w-1/2 gap-y-3 lg:gap-y-4 rounded-xl shadow-launcher`}>
                    <div className={`wll-points-icon-image-container h-8 w-8`}>
                        {getImageFromPointsGuestAndMember("earn") ?
                            <Icon icon={"fixed-discount"} fontSize={"2xl:text-3xl text-2xl"}/>
                            :
                            <Image wllClassName={"wll-points-image"} height={"h-8"} width={"w-8"}
                                   image={launcherState.is_member ? member.points.earn.icon.image : guest.points.earn.icon.image}
                            />
                        }
                    </div>
                    <div className={`wll-earn-points-text-container wll-flex items-center w-full justify-between `}>
                        <p className={`text-xs lg:text-sm text-dark  font-semibold  `}
                           dangerouslySetInnerHTML={{__html: launcherState.is_member ? member.points.earn.title : guest.points.earn.title}}/>
                        <Icon icon={"arrow_right"}/>
                    </div>
                </div>
                {/*    redeem page*/}
                <div
                    onClick={() => activePage.set("redeem")}
                    className={`wll-rewards-container wll-flex wll-flex-col cursor-pointer  p-3 lg:p-4  w-1/2 gap-y-3 lg:gap-y-4   rounded-xl shadow-launcher`}>
                    <div className={`wll-rewards-icon-image-container h-8 w-8`}>
                        {getImageFromPointsGuestAndMember("redeem") ?
                            <Icon icon={"redeem"} fontSize={"2xl:text-3xl text-2xl"}/>
                            :
                            <Image wllClassName={"wll-redeem-icon"} height={"h-8"} width={"w-8"}
                                   image={launcherState.is_member ? member.points.redeem.icon.image : guest.points.redeem.icon.image}/>
                        }
                    </div>
                    <div className={`wll-rewards-text-container wll-flex items-center w-full justify-between `}>
                        <p className={`text-xs lg:text-sm text-dark  font-semibold `}
                           dangerouslySetInnerHTML={{__html: launcherState.is_member ? member.points.redeem.title : guest.points.redeem.title}}/>
                        <Icon icon={"arrow_right"}/>
                    </div>
                </div>
            </div>

            {/* Referral card*/}
            {/*--------------------------------member referral--------------------------------*/}
            {(launcherState.is_member && launcherState.content.member.referrals.is_referral_action_available && launcherState.is_pro) &&
                <div
                    className={`wll-member-referral-container wll-flex wll-flex-col w-full  p-3 lg:p-4    rounded-xl shadow-launcher `}>
                    <div className={`wll-member-referral-inner-container wll-flex wll-flex-col gap-y-3 lg:gap-y-4`}>
                        <p className={`wll-member-referral-title lg:text-sm text-xs text-dark  font-semibold `}
                           dangerouslySetInnerHTML={{__html: member.referrals.title}}/>
                        <p className={`wll-member-referral-title text-xs lg:text-sm text-light font-medium `}
                           dangerouslySetInnerHTML={{__html: member.referrals.description}}/>
                        <div
                            className={`wll-member-referral-url-container border border-solid border-card_border wll-flex items-center justify-between  rounded-md w-full h-8 `}>
                            <p className={`wll-member-referral-url p-2  whitespace-nowrap w-[90%] overflow-hidden overflow-ellipsis text-light 2xl:text-sm text-xs font-medium `}
                               style={{
                                   direction: "ltr"
                               }}
                            >
                                {launcherState.content.member.referrals.referral_url}</p>
                            <span
                                className={`wll-member-referral-icon-container px-3 wll-flex items-center justify-center  h-8 w-8 rounded-md`}
                                style={{background: `${design.colors.theme.primary}`}}
                            >
                                        <Icon click={handleCopyReferralCode}
                                              fontSize={"text-md"}
                                              icon={`${copy ? "tick" : "copy"}`} color={"#ffffff"}/>
                                     </span>
                        </div>

                        <div
                            className={`wll-member-referral-social-icons-container wll-flex items-center justify-center gap-x-4 lg:gap-x-5`}>
                            {content.member.referrals.social_share_list.map((icon, i) => {
                                return <div key={i}
                                            className={`wll-member-referral-social-${icon.action_type}-container w-8 h-8 ${loadingIcon ? "cursor-not-allowed" : "cursor-pointer"} `}
                                            onClick={() => !loadingIcon && handleSocialIcon(getHtmlDecodeString(icon.url), icon.action_type)}>
                                    {icon.image_icon !== "" ?
                                        <Image wllClassName={"wll" + icon.action_type} height={"h-8"} width={"w-8"}
                                               image={icon.image_icon}/> :
                                        <Icon icon={`${icon.action_type}`} key={i}
                                              fontSize={"2xl:text-3xl text-2xl"}/>
                                    }
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            }

            {/*-------------------------guest referral--------------------------*/}
            {
                (!launcherState.is_member && launcherState.content.guest.referrals.is_referral_action_available) &&
                <div
                    className={`wll-guest-referral-container wll-flex wll-flex-col w-full  p-3 lg:p-4    rounded-xl shadow-launcher `}>
                    <div className={`wll-guest-referral-inner-container wll-flex wll-flex-col gap-y-3 lg:gap-y-4`}>
                        <p className={`wll-guest-referral-title lg:text-sm text-xs text-dark  font-semibold `}
                           dangerouslySetInnerHTML={{__html: guest.referrals.title}}/>
                        <p className={`wll-guest-referral-description text-xs lg:text-sm text-light font-medium `}
                           dangerouslySetInnerHTML={{__html: guest.referrals.description}}/>
                    </div>
                </div>
            }
        </div>
        <PopupFooter design={design} show={design.branding.is_show}/>
    </div>
};

export default Home;