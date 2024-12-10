import React from 'react';
import TitleActionContainer from "../components/Common/TitleActionContainer";
import SidebarTabContainer from "../components/Common/SidebarTabContainer";
import PreviewLauncher from "../components/launcher_preview/PreviewLauncher";
import LogoEdit from "../components/sidebar/LogoEdit";
import ColorsEdit from "../components/sidebar/ColorsEdit";
import Visibility from "../components/sidebar/Visibility";
import {CommonContext, DesignContext, UiLabelContext} from "../Context";
import LoadingAnimation from "../components/Common/LoadingAnimation";
import {postRequest} from "../components/Common/postRequest";
import {alertifyToast, confirmAlert, errorDisplayer, getHexColor, getJSONData} from "../helpers/utilities";
import Icon from "../components/Common/Icon";
import PreviewContainerHeader from "../components/launcher_preview/PreviewContainerHeader";

const Design = () => {
    const {appState, commonState, setCommonState} = React.useContext(CommonContext);
    const {design, launcher} = commonState;
    const labels = React.useContext(UiLabelContext);

    const [activeSidebar, setActiveSidebar] = React.useState("all");
    const [loading, setLoading] = React.useState(true);
    const [errorList, setErrorList] = React.useState([]);
    const [errors, setErrors] = React.useState({});

    const saveDesign = async (wll_nonce = appState.design_nonce, isReset, design_value) => {
        let params = {
            wll_nonce,
            action: "wll_launcher_save_design",
        };
        /*params.design = btoa(JSON.stringify(design_value));*/
        params.design = btoa(unescape(encodeURIComponent(JSON.stringify(design_value))));
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data != null && resJSON.data !== {}) {
            alertifyToast(isReset ? labels.common.reset_message : resJSON.data.message);
            setErrorList([])
        } else {
            setErrors(resJSON.data)
            errorDisplayer(resJSON.data, {setErrorList})
        }
    }
    const resetAction = () => {
        let data = {...commonState};
        data.design = {
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
                    background: "#FF6B00",
                    text: "white"
                },
            },
            placement: {
                position: "right",
                side_spacing: 0,
                bottom_spacing: 0
            },
            branding: {
                is_show: "none"
            }
        };

        confirmAlert(() => {
                setCommonState(data);
                saveDesign(appState.design_nonce, true, data.design);
            },
            labels.common.confirm_description, labels.common.ok_text, labels.common.cancel_text, labels.common.confirm_title)
    }

    const getEditorDetails = (wll_nonce = appState.settings_nonce) => {
        let params = {
            action: "wll_launcher_settings",
            wll_nonce,
        };
        postRequest(params).then((json) => {
            let resJSON = getJSONData(json.data);
            if (resJSON.success === true && resJSON.data !== null && resJSON.data !== {}) {
                setCommonState(resJSON.data)
                setLoading(false)
            } else if (resJSON.success === false && resJSON.data !== null) {
                alertifyToast(resJSON.data.message, false);
                setLoading(false);
            }
        })
    }

    React.useEffect(() => {
        getEditorDetails();
    }, [])

    const EditStyle = () => {
        return <div>
            <div
                className={`bg-primary_extra_light  border border-t-0 border-r-0 border-l-0 rounded-t-xl border-b-card_border`}>
                <p className={`text-dark text-md font-medium tracking-wide px-2.5 2xl:px-4 py-3 `}>{labels.common.edit_styles}</p>
            </div>
            <SidebarTabContainer label={labels.design.logo.title} tabIcon={"logo"}
                                 click={() => setActiveSidebar("logo")}/>
            <SidebarTabContainer label={labels.design.colors.title} tabIcon={"color"}
                                 click={() => setActiveSidebar("colors")}/>
            <SidebarTabContainer label={labels.design.branding} tabIcon={"brand"}
                                 click={() => setActiveSidebar("visibility")}
            />
        </div>
    };


    const getSidebarContent = () => {
        switch (activeSidebar) {
            case `all`:
                return <EditStyle/>;

            case "logo":
                return <LogoEdit setActiveSidebar={setActiveSidebar}/>;
            case "colors":
                return <ColorsEdit setActiveSidebar={setActiveSidebar}/>;
            case "visibility":
                return <Visibility setActiveSidebar={setActiveSidebar}/>;
        }
    }

    return loading ? (<LoadingAnimation/>) :
        <DesignContext.Provider value={{errors, setErrors, errorList, setErrorList}}>
            <div className={`w-full flex flex-col gap-y-2 items-start h-full `}
            >
                {/* ************************ Title and action ********************************** */}
                <TitleActionContainer title={labels.common.design} resetAction={resetAction}
                                      saveAction={() => saveDesign(appState.design_nonce, false, design)}/>
                {/* ************************ Design Edit and preview container ********************************** */}
                <div className={`flex gap-x-6 items-start w-full h-[590px]`}>
                    {/*    left div*/}
                    <div className={`2xl:w-[30%] w-[40%]  h-full flex flex-col border border-card_border rounded-xl`}>
                        {/*    title*/}
                        {getSidebarContent(setActiveSidebar)}
                    </div>

                    {/* ************************ Design Preview here ********************************** */}
                    <div className={`2xl:w-[70%] w-[60%] h-[590px] flex flex-col border border-card_border rounded-xl`}>
                        <PreviewContainerHeader/>

                        {/* ************************ preview content here ********************************** */}
                        <div
                            className={`flex  items-start ${launcher.placement.position === "left" ? "justify-start" : "justify-end"} relative 
                            w-full h-full  2xl:px-5 md:px-3 px-2 overflow-hidden `}>

                            {/* ************************ launcher home page ********************************** */}
                            <div
                                className={`flex flex-col  py-3 gap-y-1  w-[300px]    absolute  `}
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
                                <PreviewLauncher/>
                                {/* launcher popup icon*/}
                                <div
                                    className={` h-10 cursor-pointer group flex items-center justify-center gap-x-2 w-10 absolute 
                                    ${launcher.placement.position === "right" && "right-0"} bottom-1.5 rounded-md`}
                                    style={{backgroundColor: `${design.colors.theme.primary}`}}
                                >
                                    <div
                                        className={` flex h-8 items-center justify-center rounded-md w-8  group-hover:animate-swing`}>
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
        </DesignContext.Provider>


};

export default Design;