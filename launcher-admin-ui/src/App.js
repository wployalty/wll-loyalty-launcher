import React from "react";
import NavbarContentContainer from "./components/containers/NavbarContentContainer";
import {postRequest} from "./components/Common/postRequest";
import LoadingAnimation from "./components/Common/LoadingAnimation";
import {CommonContext, UiLabelContext} from "./Context";
import {alertifyToast, getJSONData, isValidJSON} from "./helpers/utilities";

const App = () => {

    const [appState, setAppState] = React.useState({})
    const [labels, setLabels] = React.useState({})
    const [loading, setLoading] = React.useState(true);

    const [commonState, setCommonState] = React.useState({
        design: {
            logo: {
                is_show: "show",
                image: "",
            },
            colors: {
                theme: {
                    primary: "#6F38C5",
                    text: "white"
                },
                buttons: {
                    background: "#e84545",
                    text: "white"
                },
            },
            branding: {
                is_show: "none"
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
                    icon: {
                        image: "",
                    }
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
                        is_show: "show",
                        level_data: {}
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
                    description: "Refer your friends and earn rewards. Your friend can get a reward as well!",
                    referral_url: "",
                    // social_share_list: []
                }
            }
        },
        launcher: {
            appearance: {
                selected: "icon_with_text",
                text: "My Rewards",
                icon: {
                    selected: "default",
                    image: "",
                    icon: "gift"
                },
            },
            placement: {
                position: "right",
                side_spacing: 0,
                bottom_spacing: 0
            },
            font_family: "inherit",
            view_option: "mobile_and_desktop",
            show_conditions: [],
            condition_relationship: "and",
        }
    });
    React.useLayoutEffect(() => {
        const params = {
            action: "wll_launcher_local_data",
            wll_nonce: wll_settings_form.local_data_nonce,
        }
        postRequest(params).then((json) => {
            let resJSON = getJSONData(json.data);
            if (resJSON.success === true && resJSON.data !== null && resJSON.data !== {}) {
                setAppState(resJSON.data);
                let labelParams = {
                    action: "wll_get_launcher_labels",
                    wll_nonce: resJSON.data.common_nonce,
                }
                postRequest(labelParams).then(json => {
                    let labelsJSON = getJSONData(json.data);
                    if (resJSON !== {}) setLabels(labelsJSON.data);
                    setLoading(false);
                })
            } else if (resJSON.success === false && resJSON.data !== null) {
                alertifyToast(resJSON.message, false);
                setLoading(false);
            }
        });
    }, []);

    return (<div
        className={"bg-grey_extra_light px-5 xl:px-10 py-5 h-full w-full flex items-start justify-start flex-col"}
        style={{
            fontFamily: `Helvetica`
        }}
    >
        {/* Heading Title and version*/}
        {loading ? <LoadingAnimation height={"h-[85vh]"}/>
            : (
                <div className={` w-full `}>
                    <div className={`flex items-baseline  gap-x-3`}>
                        <p className={`text-2xl text-dark font-bold`}>{appState.plugin_name}</p>
                        <span className={`text-base text-extra_light font-medium`}>{appState.version}</span>
                    </div>
                    <CommonContext.Provider value={
                        {
                            commonState, setCommonState,
                            appState, setAppState
                        }
                    }>
                        <UiLabelContext.Provider value={labels}>
                            <NavbarContentContainer/>
                        </UiLabelContext.Provider>
                    </CommonContext.Provider>
                </div>)
        }
    </div>)
};
export default App;
