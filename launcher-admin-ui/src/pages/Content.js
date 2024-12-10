import React from 'react';
import TitleActionContainer from "../components/Common/TitleActionContainer";
//import SidebarTabContainer from "../components/Common/SidebarTabContainer";
import Welcome from "../components/Content/sidebar/Welcome";
import PreviewLauncher from "../components/launcher_preview/PreviewLauncher";
import Points from "../components/Content/sidebar/Points";
import Referrals from "../components/Content/sidebar/Referrals";
import MemberReferrals from "../components/Content/sidebar/MemberReferrals";
//import Banner from "../components/Content/sidebar/Banner";
import {CommonContext, ContentContext, UiLabelContext} from "../Context";
import {postRequest} from "../components/Common/postRequest";
import LoadingAnimation from "../components/Common/LoadingAnimation";
import MemberLauncherPreview from "../components/launcher_preview/MemberLauncherPreview";
import MemberPoints from "../components/Content/sidebar/MemberPoints";
import {
    alertifyToast,
    confirmAlert,
    errorDisplayer,
    getHexColor, getJSONData,
} from "../helpers/utilities";
import Icon from "../components/Common/Icon";
import PreviewContainerHeader from "../components/launcher_preview/PreviewContainerHeader";

const SidebarTabContainer = React.lazy(() => import(/* webpackChunkName: "SidebarTabContainer" */"../components/Common/SidebarTabContainer"))
const Banner = React.lazy(() => import(/* webpackChunkName: "Banner" */"../components/Content/sidebar/Banner"))
const Content = () => {
    const labels = React.useContext(UiLabelContext);
    const [activeSidebar, setActiveSidebar] = React.useState("guest");
    const {appState, commonState, setCommonState} = React.useContext(CommonContext);
    const {design, content, launcher} = commonState;
    const {member, guest} = content;
    const [loading, setLoading] = React.useState(true);
    const [errorList, setErrorList] = React.useState([]);
    const [errors, setErrors] = React.useState({});
    const [choosedTypeUser, setChoosedTypeUser] = React.useState("guest")

    const saveAction = async (wll_nonce = appState.content_nonce, isReset = false, content_value) => {
        let params = {
            wll_nonce,
            action: "wll_launcher_save_content",
        };
        //params.content = JSON.stringify(content_value)
        params.content = btoa(unescape(encodeURIComponent(JSON.stringify(content_value))));
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data != null && resJSON.data !== {}) {
            alertifyToast(isReset ? labels.common.reset_message : resJSON.data.message);
            setErrorList([])
        } else if (resJSON.success === false && resJSON.data !== null) {
            setErrors(resJSON.data)
            errorDisplayer(resJSON.data, {setErrorList})
        }
    }
    const resetAction = () => {
        let data = {...commonState};
        data.content = {
            guest: {
                welcome: {
                    texts: {
                        title: "Join and Earn Rewards",
                        description: "Get exclusive perks by becoming a member of our rewards program.",
                        have_account: "Already have an account?",
                        sign_in: "Sign in",
                        sign_in_url: "{wlr_signin_url}"
                    },
                    button: {
                        text: "Join Now!",
                        url: "{wlr_signup_url}"
                    },
                    // shortcodes: [...guest.welcome.shortcodes],
                },
                points: {
                    earn: {
                        title: "Earn",
                        icon: {
                            image: "",
                        }
                    },
                    redeem: {
                        title: "Redeem",
                        icon: {
                            image: "",
                        }
                    }
                },
                referrals: {
                    title: "Refer and earn",
                    description: "Refer your friends and earn rewards. Your friend can get a reward as well!"
                },
            },
            member: {
                banner: {
                    levels: {
                        ...content.member.banner.levels,
                        is_show: "show",
                    },
                    points: {
                        is_show: "show",
                    },
                    texts: {
                        welcome: "Hello {wlr_user_name}",
                        points: "{wlr_user_points}",
                        points_label: "{wlr_point_label}",
                        points_text: "Points",
                        points_content: "Your outstanding balance"
                    },
                    // shortcodes: [...member.banner.shortcodes]
                },
                points: {
                    earn: {
                        title: "Earn",
                        icon: {
                            image: "",
                        }
                    },
                    redeem: {
                        title: "Redeem",
                        icon: {
                            image: "",
                        }
                    }
                },
                referrals: {
                    ...member.referrals,
                    title: "Refer and earn",
                    description: "Refer your friends and earn rewards. Your friend can get a reward as well!",
                    // shortcodes: [...member.referrals.shortcodes],
                    // referral_url: "http://localhost:5313?wlr_ref=dummy",
                    // social_share_list: [...content.member.referrals.social_share_list],
                }
            }
        }
        confirmAlert(() => {
                setCommonState(data);
                saveAction(appState.content_nonce, true, data.content);
            },
            labels.common.confirm_description,
            labels.common.ok_text,
            labels.common.cancel_text,
            labels.common.confirm_title)
    };

    const getEditorDetails = async (wll_nonce = appState.settings_nonce) => {
        let params = {
            wll_nonce,
            action: "wll_launcher_settings"
        };
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data != null && resJSON.data !== {}) {
            setCommonState(resJSON.data)
            setLoading(false)
        } else if (resJSON.success === false && resJSON.data !== null) {
            alertifyToast(resJSON.data.message, false);
            setLoading(false);
        }
    }


    const getSidebarContent = () => {
        switch (activeSidebar) {

            case "guest":
                return <div>
                    <SidebarTabContainer label={labels.common.welcome} tabIcon={"grammerly"}
                                         click={() => setActiveSidebar("welcome")}/>
                    <SidebarTabContainer label={labels.common.points} tabIcon={"coin"}
                                         click={() => setActiveSidebar("points")}/>
                    <SidebarTabContainer label={labels.common.referrals} tabIcon={"rocket"}
                                         click={appState.is_pro ? () => setActiveSidebar("referrals") : () => {
                                         }}
                                         isPro={appState.is_pro}
                    />
                </div>;
            case "member":
                return <div>
                    <SidebarTabContainer label={labels.common.banner} tabIcon={"document_text"}
                                         click={() => setActiveSidebar("banner")}/>
                    <SidebarTabContainer label={labels.common.points} tabIcon={"coin"}
                                         click={() => setActiveSidebar("member_points")}/>
                    <SidebarTabContainer label={labels.common.referrals} tabIcon={"rocket"}
                                         click={appState.is_pro ? () => setActiveSidebar("member_referrals") : () => {
                                         }}
                                         isPro={appState.is_pro}
                    />
                </div>
            case "welcome":
                return <Welcome
                    choosedTypeUser={choosedTypeUser}
                    setActiveSidebar={setActiveSidebar}
                    setChoosedTypeUser={setChoosedTypeUser}
                />
            case "points":
                return <Points
                    setActiveSidebar={setActiveSidebar}/>
            case "referrals":
                return <Referrals
                    setActiveSidebar={setActiveSidebar}/>
            case "banner":
                return <Banner
                    setActiveSidebar={setActiveSidebar}/>
            case "member_points":
                return <MemberPoints
                    setActiveSidebar={setActiveSidebar}/>
            case "member_referrals":
                return <MemberReferrals
                    setActiveSidebar={setActiveSidebar}/>
        }
    };

    React.useEffect(() => {

        getEditorDetails();
    }, [])

    return loading ? <LoadingAnimation/> :
        <ContentContext.Provider value={{errors, setErrors, errorList, setErrorList}}>
            <div className={`w-full flex flex-col gap-y-2 items-start  `}>
                <TitleActionContainer title={labels.common.content} resetAction={resetAction}
                                      saveAction={() => saveAction(appState.content_nonce, false, content)}/>
                <div className={`flex gap-x-6 items-start w-full h-[590px]`}>

                    {/*  ------------------  side bar for guest and member ---------*/}
                    <div
                        className={`2xl:w-[30%] w-[40%]  h-full flex flex-col border border-card_border rounded-xl`}>
                        {/* *******************tabs************* */}
                        <div
                            className={`bg-primary_extra_light border border-t-0 border-r-0 border-l-0 rounded-t-xl border-b-card_border`}>
                            <div className={`flex w-full items-center `}>
                                <div
                                    onClick={() => {
                                        setChoosedTypeUser("guest")
                                        setActiveSidebar("guest")
                                    }}
                                    className={`flex cursor-pointer items-center justify-center px-6 py-3 w-1/2 border-b-2 ${["guest", "referrals", "points", "welcome"].includes(activeSidebar) ? "border-b-blue_primary text-dark" : "border-b-transparent text-light"}`}>
                                    <p className={` text-sm 2xl:text-md  font-medium tracking-wide  `}>
                                        {labels.guest.title}
                                    </p>
                                </div>
                                <div
                                    onClick={() => {
                                        setChoosedTypeUser("member")
                                        setActiveSidebar("member")
                                    }}
                                    className={`flex cursor-pointer items-center justify-center px-6 py-3 w-1/2 border-b-2 ${["member", "member_referrals", "banner", "member_points"].includes(activeSidebar) ? "border-b-blue_primary text-dark" : "border-b-transparent text-light"}`}>
                                    <p className={`  text-sm 2xl:text-md  font-medium tracking-wide  `}>
                                        {labels.member.title}
                                    </p>
                                </div>
                            </div>

                        </div>
                        <React.Suspense fallback={<div></div>}>
                            {getSidebarContent()}
                        </React.Suspense>
                    </div>

                    {/* ************************ Design Preview here ********************************** */}
                    <div
                        className={`2xl:w-[70%] w-[60%]  h-[590px] flex flex-col border border-card_border rounded-xl`}>
                        <PreviewContainerHeader/>

                        {/* ************************ preview content here ********************************** */}
                        <div
                            className={`flex  items-start ${launcher.placement.position === "left" ? "justify-start" : "justify-end"}
                             w-full h-full  relative 2xl:px-5 md:px-3 px-2 overflow-hidden`}>

                            {/* ************************ launcher home page ********************************** */}
                            <div className={`flex flex-col py-3 gap-y-1  w-[300px]  absolute`}
                                 style={
                                     launcher.placement.position === "left" ? {
                                         left: `${+launcher.placement.side_spacing + 16}px`,
                                         bottom: `${+launcher.placement.bottom_spacing + 8}px`,
                                     } : {
                                         right: `${+launcher.placement.side_spacing + 16}px`,
                                         bottom: `${+launcher.placement.bottom_spacing + 8}px`
                                     }
                                 }
                            >
                                {choosedTypeUser === "guest" ?
                                    <PreviewLauncher/> : <MemberLauncherPreview activeSidebar={activeSidebar}/>}
                                {/* launcher popup icon*/}
                                <div
                                    className={`text-white h-10 group cursor-pointer  flex items-center justify-center gap-x-2 p-1.5 ${false ? "w-[150px]" : "w-10"} absolute 
                                    ${launcher.placement.position === "right" && "right-0"} bottom-1.5 rounded-md`}
                                    style={{backgroundColor: `${design.colors.theme.primary}`}}
                                >
                                    <div
                                        className={`flex h-8 items-center justify-center rounded-md  group-hover:animate-swing `}>
                                        {(launcher.appearance.icon.selected == "image" && launcher.appearance.icon.image !== "") ?
                                            <img
                                                src={launcher.appearance.icon.image}
                                                className={`object-contain rounded-md w-8 h-8  `}/> :
                                            <Icon icon={`${launcher.appearance.icon.icon}`}
                                                  text={`2xl:text-2xl text-xl`}
                                                  color={getHexColor(design.colors.theme.text)}
                                            />
                                        }
                                    </div>

                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            </div>
        </ContentContext.Provider>

};

export default Content;