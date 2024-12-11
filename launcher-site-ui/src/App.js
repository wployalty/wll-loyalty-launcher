import React from "react";
import PreviewLauncher from "./pages/PreviewLauncher";
import {postRequest} from "./components/Common/postRequest";
import {LaunchercontentContext} from "./Context";
import {getHexColor, getJSONData, handleVisibilityLauncher} from "./helpers/utilities";
import Icon from "./components/Common/Icon";


const App = () => {
    const [activePage, setActivePage] = React.useState("home");
    const [showLauncher, setShowLauncher] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [launcherState, setLauncherState] = React.useState({
        is_member: true,
        is_edit_after_birth_day_date: "no",
        design: {
            logo: {
                is_show: "show",
                image: "",
            },
            colors: {
                theme: {
                    primary: "#6F38C5",
                    secondary: "#FF8E3D",
                    text: "white",
                    background: "primary"
                },
                banner: {
                    background: "primary",
                    text: "white"
                },
                buttons: {
                    background: "primary",
                    text: "white"
                },
                links: "primary",
                icons: "primary",
                launcher: {
                    background: "primary",
                    text: "white"
                }
            },
            placement: {
                position: "right",
                side_spacing: 0,
                bottom_spacing: 0
            },
            branding: {
                is_show: "show"
            }
        },
        content: {
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
                },
                points: {
                    earn: {
                        title: "Earn Points",
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
                shortcodes: {
                    "{wlr_site_title}": "Displays site title",
                    "{wlr_signup_url}": "Sign-up URL (Registration URL)",
                    "{wlr_signin_url}": "Sign-in URL (The Login URL in your site)"
                }
            },
            member: {
                banner: {
                    levels: {
                        is_show: "show",
                        level_data: {},
                    },
                    points: {
                        is_show: "show",
                    },
                    texts: {
                        welcome: "Hello {wlr_user_name}",
                        points: "{wlr_user_points}",
                        points_label: "{wlr_point_label}",
                        points_text: "Treva Points",
                        points_content: "Your outstanding balance"
                    },
                    shortcodes: [],

                },
                points: {
                    earn: {
                        title: "Earn Points",
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
                    description: "Refer your friends and earn rewards. Your friend can get a reward as well!",
                    shortcodes: [],
                }
            },
        },
        launcher: {
            appearance: {
                selected: "icon_with_text",
                text: "Treva loyalty",
                icon: {
                    image: "",
                    icon: "gift"
                },
            },
            view_option: "mobile_and_desktop",
            font_family: "inherit",

        }
    });

    let {design, launcher} = launcherState;

    const getLauncherPopupDetails = async () => {
        let params = {
            action: "wll_get_launcher_popup_details",
        };
        setLoading(true)
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data != null && resJSON.data !== {}) {
            setLauncherState(resJSON.data);
            setLoading(false);
        } else if (resJSON.success === false && resJSON.data !== null) {
            setLoading(false);
        }
    };

    const handlePopupButton = () => {
        setShowLauncher(!showLauncher);
    };

    const showLauncherPopupLogo = (value) => {
        switch (value) {
            case "text_only": {
                return showLauncher ? "wll-flex" : "wll-flex lg:wll-hidden"
            }
            case "icon_only": {
                return "wll-flex"
            }
            case "icon_with_text": {
                return "wll-flex"
            }
        }
    }

    React.useEffect(() => {
        getLauncherPopupDetails();
    }, [])

    return (
        < LaunchercontentContext.Provider
            value={{launcherState, setLauncherState, showLauncher: {value: showLauncher, set: setShowLauncher}}}>

            {!loading
                && <div className={`wll-container wll-flex wll-flex-col gap-y-2 `}
                >
                    {/*launcher popup container*/}
                    {showLauncher &&
                        <PreviewLauncher
                            showLauncher={{value: showLauncher, set: setShowLauncher}}
                            activePage={{value: activePage, set: setActivePage}}/>

                    }
                    {/*popup button*/}
                    {["mobile_and_desktop", "desktop_only", "mobile_only"].includes(launcher.view_option) && <div
                        onClick={handlePopupButton}
                        className={`wll-launcher-button-container cursor-pointer text-white   ${handleVisibilityLauncher(launcher.view_option)}   transition duration-200 ease-in 
                        items-center gap-x-1.5 justify-center group p-2 
                          ${showLauncher ? "w-10" : "w-10  lg:w-auto"}
                        h-10  wll-fixed   rounded-md  `}
                        style={
                            launcher.placement.position === "left" ? {
                                left: `${+launcher.placement.side_spacing + 16}px`,
                                bottom: `${+launcher.placement.bottom_spacing + 16}px`,
                                backgroundColor: `${design.colors.theme.primary}`,
                                zIndex: 999999999,
                            } : {
                                right: `${+launcher.placement.side_spacing + 16}px`,
                                bottom: `${+launcher.placement.bottom_spacing + 16}px`,
                                backgroundColor: `${design.colors.theme.primary}`,
                                zIndex: 999999999,
                            }

                        }
                    >
                        {["icon_with_text", "icon_only", "text_only"].includes(launcher.appearance.selected) &&
                            <div
                                className={`wll-icon-text-container ${showLauncherPopupLogo(launcher.appearance.selected)}  items-center  justify-center rounded-md  h-8  group-hover:animate-swing`}>
                                {launcher.appearance.icon.image !== "" && launcher.appearance.icon.selected === "image" ?
                                    <img alt={"launcher_button_image"}
                                         src={launcher.appearance.icon.image}
                                         className={`object-contain rounded-md w-8 h-8   `}/> :
                                    <Icon icon={`${launcher.appearance.icon.icon}`}
                                          text={`2xl:text-3xl text-2xl `}
                                          color={`${getHexColor(design.colors.theme.text)}`}
                                        // show={`${(launcher.appearance.selected==="text_only" && showLauncher) ?"block" :"block lg:wll-hidden" }`}
                                    />
                                }
                            </div>}
                        {(["icon_with_text"].includes(launcher.appearance.selected) && !showLauncher) ?
                            <p
                                style={{
                                    fontFamily: `${launcher.font_family}`
                                }}
                                className={`wll-icon-with-text wll-hidden  lg:block ${design.colors.theme.text === "white" ? "text-white" : "text-black"}  
                                font-bold text-18px leading-6 `}
                                dangerouslySetInnerHTML={{__html: launcher.appearance.text}}/>

                            :
                            ["text_only"].includes(launcher.appearance.selected) &&
                            <p
                                style={{
                                    fontFamily: `${launcher.font_family}`
                                }}
                                className={` wll-text-only ${design.colors.theme.text === "white" ? "text-white" : "text-black"} 
                               ${showLauncher ? "wll-hidden" : "wll-hidden  lg:block"}    font-bold  text-sm lg:text-xs  `}
                                dangerouslySetInnerHTML={{__html: launcher.appearance.text}}/>
                        }
                    </div>}
                </div>}
        </LaunchercontentContext.Provider>)
};
export default App;
