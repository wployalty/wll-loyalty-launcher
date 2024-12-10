import React from 'react';
import {CommonContext, UiLabelContext} from "../Context";
import LoadingAnimation from "../components/Common/LoadingAnimation";
import TitleActionContainer from "../components/Common/TitleActionContainer";
import {postRequest} from "../components/Common/postRequest";
import SidebarInnerContainer from "../components/Common/SidebarInnerContainer";
import ChooseButtonContainer from "../components/Common/ChooseButtonContainer";
import LabelInputContainer from "../components/Common/LabelInputContainer";
import ImageContainer from "../components/Common/ImageContainer";
import Icon from "../components/Common/Icon";
import {
    alertifyToast, confirmAlert,
    errorDisplayer,
    getErrorMessage,
    getHexColor, getJSONData,
    getTextColor, split_content
} from "../helpers/utilities";
import PreviewContainerHeader from "../components/launcher_preview/PreviewContainerHeader";
import InputWrapper from "../components/Common/InputWrapper";
import PageCondition from "../components/launcher/PageCondition";
import Button from "../components/Common/Button";
import AndOrMatchRuleContainer from "../components/Common/AndOrMatchRuleContainer";

const Launcher = () => {
    const labels = React.useContext(UiLabelContext)
    const {appState, commonState, setCommonState} = React.useContext(CommonContext);
    const {design, launcher} = commonState;
    const {colors} = design;
    const [loading, setLoading] = React.useState(true);
    const [selectedIcon, setSelectedIcon] = React.useState(commonState.launcher.appearance.icon.icon)
    const [showFonts, setShowFonts] = React.useState(false);
    const [fontFamily, setFontFamily] = React.useState(launcher.font_family);
    const [errorList, setErrorList] = React.useState([]);
    const [errors, setErrors] = React.useState({});
    const [conditions, setConditions] = React.useState([])

    const launcherButtonIcons = [
        {
            name: "gift",
        },
        {
            name: "trophy",
        },
        {
            name: "badge",
        },
        {
            name: "star",
        },
        {
            name: "crown",
        },
        {
            name: "loyalty",
        },
    ]

    const handlePosition = (value) => {
        let data = {...commonState};
        data.launcher.placement.position = value;
        setCommonState(data);
    }
    const handleSidePositions = (e, field) => {
        let data = {...commonState};
        data.launcher.placement[field] = e.target.value;
        setCommonState(data);
    }


    const handleSelectedIcon = (icon_name) => {
        let data = {...commonState};
        data.launcher.appearance.icon.icon = icon_name;
        setCommonState(data);
        setSelectedIcon(icon_name);
    }

    const getEditorDetails = async (wll_nonce = appState.settings_nonce) => {
        let params = {
            action: "wll_launcher_settings",
            wll_nonce,
        };
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data !== null && resJSON.data !== {}) {
            let newCommonState = {
                ...commonState,
                launcher: {
                    ...launcher, ...resJSON.data.launcher
                },
            }
            setCommonState(newCommonState)
            getDisplayConditionList(newCommonState.launcher.show_conditions)
            setLoading(false)
        } else if (resJSON.success === false && resJSON.data !== null) {
            alertifyToast(resJSON.data.message, false);
            setLoading(false);
        }
    };

    const handleLauncherButtonContents = (value) => {
        let data = {...commonState};
        data.launcher.appearance.selected = value;
        setCommonState(data);
    };

    const handleLauncherButtonText = (e) => {
        let data = {...commonState};
        data.launcher.appearance.text = e.target.value;
        setCommonState(data);
    };
    const handleLauncherView = (value) => {
        let data = {...commonState};
        data.launcher.view_option = value;
        setCommonState(data);
    };

    const handleLauncherIcon = (value) => {
        let data = {...commonState};
        data.launcher.appearance.icon.selected = value;
        setCommonState(data);
    }

    const handleChooseImage = () => {
        let media = wp.media({
            title: "Select media",
            multiple: false,
            library: {
                type: "image",
            }
        });
        media.on("select", () => {
            let selection = media.state().get("selection");
            selection.each((attachment) => {
                let url = attachment["attributes"]["url"];
                let data = {...commonState};
                data.launcher.appearance.icon.image = url;
                setCommonState(data);
            });
        });
        media.open();
        return false;
    };

    /*remove image*/
    const handleRemoveImage = () => {
        let data = {...commonState};
        data.launcher.appearance.icon.image = ""
        setCommonState(data);
    }

    const resetAction = () => {
        let data = {...commonState};
        data.launcher = {
            ...launcher,
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
        };
        confirmAlert(() => {
                setCommonState(data);
                saveLauncherButtonDetails(appState.launcher_nonce, true, data.launcher);
            },
            labels.common.confirm_description,
            labels.common.ok_text,
            labels.common.cancel_text,
            labels.common.confirm_title)
    }

    const saveLauncherButtonDetails = async (wll_nonce = appState.launcher_nonce, isReset, launcher_value) => {
        let params = {
            action: "wll_launcher_save_launcher",
            wll_nonce,
        }
        /*params.launcher = btoa(JSON.stringify(launcher_value));*/
        params.launcher = btoa(unescape(encodeURIComponent(JSON.stringify(launcher_value))));

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

    const showPreviewPopupButton = (view) => {
        switch (view) {
            case `mobile_and_desktop`:
                return `flex`;
            case `mobile_only`:
                return `lg:hidden flex`;
            case `desktop_only`:
                return `lg:flex hidden`;
        }
    }

    const getFontFamilyLabel = (label) => {
        let font_label;
        labels.popup_button.font_families.filter((font) => {
            if (font.value === label) font_label = font.label;
        })
        return font_label;
    }

    const updateConditionFields = (index, data) => {
        let updateState = {...commonState};
        updateState.launcher.show_conditions[index] = data;
        setCommonState(updateState);
    }

    const deleteCondition = (index) => {

        let updatedConditionList = commonState.launcher.show_conditions;
        updatedConditionList.splice(index, 1);
        let updateState = {...commonState};
        updateState.launcher.show_conditions = updatedConditionList;
        setCommonState(updateState)
        getDisplayConditionList(updatedConditionList);
    }


    const handleAddCondition = () => {
        let newConditionList = [...launcher.show_conditions];
        newConditionList.push({
            operator: {value: "home_page", label: "Home Page"},
            url_path: "",
        });
        let data = {...commonState};
        data.launcher.show_conditions = newConditionList;
        setCommonState(data);
    }

    const getDisplayConditionList = (conditions) => {
        let display = [];
        conditions.map((item, index) => {
            display.push(item)
        })
        setConditions(display);
    }


    React.useEffect(() => {
        if (commonState.launcher.show_conditions !== undefined) {
            getDisplayConditionList(commonState.launcher.show_conditions);
        }
    }, [commonState.launcher.show_conditions])

    React.useEffect(() => {
        getEditorDetails()
    }, [])

    return loading ? (<LoadingAnimation/>) : (<div className={` w-full flex flex-col gap-y-2 items-start h-full`}>
        <TitleActionContainer title={labels.popup_button.title} resetAction={resetAction}
                              saveAction={() => saveLauncherButtonDetails(appState.launcher_nonce, false, launcher)}/>
        {/* ************************ Launcher Edit and preview container ********************************** */}
        <div className={`flex gap-x-6 items-start w-full h-[590px]`}>

            <div className={`2xl:w-[30%] w-[40%] h-full flex flex-col border border-card_border rounded-xl`}>
                <div
                    className={`bg-primary_extra_light  border border-t-0 border-r-0 border-l-0 rounded-t-xl border-b-card_border`}>
                    <p className={`text-dark text-md font-medium tracking-wide px-2.5 2xl:px-4 py-3 `}>
                        {labels.popup_button.edit_launcher}
                    </p>
                </div>
                <div className={`flex flex-col w-full h-[520px] overflow-y-auto `}>

                    <SidebarInnerContainer title={labels.popup_button.appearance_text}>
                        <p className={`text-light text-xs 2xl:text-sm font-semibold tracking-wider`}>{labels.common.visibility}</p>
                        <div className={`flex w-full gap-4 items-center`}>
                            <ChooseButtonContainer label={labels.popup_button.icon_with_text}
                                                   activated={launcher.appearance.selected === "icon_with_text"}
                                                   click={() => handleLauncherButtonContents("icon_with_text")}/>
                            <ChooseButtonContainer label={labels.popup_button.icon_only}
                                                   activated={launcher.appearance.selected === "icon_only"}
                                                   click={() => handleLauncherButtonContents("icon_only")}/>
                        </div>
                        <div className={`flex  mr-4  items-center`}>
                            <ChooseButtonContainer label={labels.popup_button.text_only}
                                                   activated={launcher.appearance.selected === "text_only"}
                                                   click={() => handleLauncherButtonContents("text_only")}
                            />
                        </div>
                        {/*----------------show launcher page conditions-------*/}
                        <p className={`text-light text-xs 2xl:text-sm font-semibold tracking-wider`}>{labels.common.show_launcher_condition_text}</p>
                        <div className={`flex w-full items-center justify-between`}>

                            <p className={`text-light text-xs 2xl:text-sm font-semibold tracking-wider`}>{labels.common.conditions_text}</p>
                            {/*    match rule container*/}
                            <div className={`flex items-center gap-x-2`}>
                                <AndOrMatchRuleContainer
                                    textColor={`${launcher.condition_relationship === "and" ? "text-blue_primary" : "text-light"}`}
                                    label={labels.common.match_all}
                                    Icon={<i
                                        className={`wlr ${launcher.condition_relationship === "and" ? "wlrf-radio-on" : "wlrf-radio-off"} text-md ${launcher.condition_relationship === "and" ? "text-blue_primary" : "text-light"} font-medium `}/>}
                                    click={() => {
                                        let data = {...commonState};
                                        data.launcher.condition_relationship = "and";
                                        setCommonState(data);
                                    }}
                                />
                                <AndOrMatchRuleContainer
                                    textColor={`${launcher.condition_relationship === "or" ? "text-blue_primary" : "text-light"}`}
                                    label={labels.common.match_any}
                                    Icon={<i
                                        className={`wlr ${launcher.condition_relationship === "or" ? "wlrf-radio-on" : "wlrf-radio-off"} text-md ${launcher.condition_relationship === "or" ? "text-blue_primary" : "text-light"} font-medium `}/>}
                                    click={() => {
                                        let data = {...commonState};
                                        data.launcher.condition_relationship = "or";
                                        setCommonState(data);
                                    }}
                                />
                            </div>

                        </div>
                        <div className={`flex flex-col  w-full gap-2   `}>
                            {
                                launcher.show_conditions.map((item, key_value) => {
                                    return <PageCondition
                                        key={(key_value + launcher.show_conditions.length) * launcher.show_conditions.length}
                                        key_value={key_value}
                                        item={item}
                                        updateConditionFields={updateConditionFields}
                                        deleteCondition={deleteCondition}
                                        errors={errors}
                                        errorList={errorList}
                                    />;
                                })
                            }
                            {/*    ---------------add condition button--------------*/}
                            <div className={`flex w-full items-center justify-end mt-2`}>
                                <Button
                                    click={handleAddCondition}
                                    padding={"py-1 px-2"}
                                    icon={<i className={`wlr wlrf-add-circle text-xl font-medium `}/>}
                                >
                                    {labels.common.add_condition_text}
                                </Button>
                            </div>
                        </div>
                        <LabelInputContainer label={labels.common.text}
                                             value={launcher.appearance.text}
                                             onChange={(e) => handleLauncherButtonText(e)}
                                             error={errorList.includes("launcher.appearance.text")}
                                             error_message={errorList.includes("launcher.appearance.text") && getErrorMessage(errors, "launcher.appearance.text")}
                        />

                        <p className={`text-light text-xs 2xl:text-sm font-semibold tracking-wider`}>{labels.common.font_family}</p>

                        <div
                            onClick={() => setShowFonts(!showFonts)}
                            className={`border border-card_border relative rounded-md flex items-center h-11 justify-between 2xl:p-2 p-1.5`}>
                            <p className={`text-dark text-xs 2xl:text-sm font-medium tracking-wide`}>{getFontFamilyLabel(launcher.font_family)}</p>
                            <Icon icon={"arrow-down"} color={"text-dark"}
                            />
                            {showFonts && <div
                                className={`flex   flex-col border rounded-lg bg-white w-full text-light border-light_border z-10 absolute top-11.5 left-0 overflow-hidden`}>
                                {
                                    labels.popup_button.font_families.map((item, index) => {
                                        return <p
                                            key={index}
                                            onClick={() => {
                                                setFontFamily(item.value);
                                                let data = {...commonState};
                                                data.launcher.font_family = item.value;
                                                setCommonState(data)

                                            }}
                                            className={`flex items-center  px-4 py-2 justify-between 
                                            ${item.value === launcher.font_family ? "bg-primary_extra_light text-primary" : "bg-white text-dark "} 
                                            hover:bg-primary_extra_light cursor-pointer hover:bg-opacity-50`}
                                        >
                                            {item.label}
                                            {item.value === launcher.font_family &&
                                                <span className='flex items-center'>
                                                <i
                                                    className=" wlr wlrf-tick color-important font-medium  text-lg 2xl:text-xl leading-0 cursor-pointer "
                                                />
                                                 </span>
                                            }
                                        </p>
                                    })
                                }
                            </div>

                            }
                        </div>

                        <p className={`text-light text-xs 2xl:text-sm font-semibold tracking-wider`}>{labels.common.icon}</p>
                        <div className={`flex w-full gap-4 items-center`}>
                            <ChooseButtonContainer label={labels.common.default}
                                                   activated={launcher.appearance.icon.selected == "default"}
                                                   click={() => handleLauncherIcon("default")}/>
                            <ChooseButtonContainer label={labels.common.upload_icon}
                                                   activated={launcher.appearance.icon.selected == "image"}
                                                   click={() => handleLauncherIcon("image")}/>
                        </div>


                        {launcher.appearance.icon.selected == "default" ?

                            <div className={`w-full flex gap-2 justify-between `}>
                                {launcherButtonIcons.map((icon, i) => {

                                    return <div
                                        key={i}
                                        onClick={() => {
                                            handleSelectedIcon(icon.name)
                                        }}
                                        className={`flex w-2/12 h-12 cursor-pointer justify-center items-center py-3 px-2.5 xl:px-3  border transition duration-200 ease-in ${launcher.appearance.icon.icon === icon.name ? "border-2 border-blue_primary " : " border border-card_border"} rounded-md`}>
                                        <Icon icon={icon.name}
                                              color={selectedIcon === icon.name ? "text-dark" : "text-light"}
                                              fontSize={"2xl:text-xl text-lg "}

                                        />
                                    </div>
                                })}
                            </div> :
                            <ImageContainer
                                value={commonState.launcher.appearance.icon.image}
                                handleChooseImage={handleChooseImage}
                                handleRemoveImage={handleRemoveImage}
                            />
                        }

                        <p className={`text-light text-xs 2xl:text-sm font-semibold tracking-wider`}>{labels.common.visibility}</p>
                        <div className={`flex w-full gap-4 items-center`}>
                            <ChooseButtonContainer label={labels.common.mobile_only}
                                                   activated={launcher.view_option === "mobile_only"}
                                                   click={() => handleLauncherView("mobile_only")}
                                                   width={'w-1/2'}
                            />
                            <ChooseButtonContainer label={labels.common.desktop_only}
                                                   activated={launcher.view_option === "desktop_only"}
                                                   click={() => handleLauncherView("desktop_only")}
                                                   width={'w-1/2'}
                            />
                        </div>
                        <div className={`flex w-full gap-4 items-center`}>
                            <ChooseButtonContainer label={labels.common.mobile_and_desktop}
                                                   activated={launcher.view_option === "mobile_and_desktop"}
                                                   click={() => handleLauncherView("mobile_and_desktop")}
                                                   width={'w-1/2'}
                            />
                            <ChooseButtonContainer label={labels.common.display_none}
                                                   activated={launcher.view_option === "display_none"}
                                                   click={() => handleLauncherView("display_none")}
                                                   width={'w-1/2'}

                            />
                        </div>
                    </SidebarInnerContainer>
                    <SidebarInnerContainer title={labels.design.placement.position.title}>
                        <div className={`${split_content}`}>
                            <ChooseButtonContainer label={labels.common.left} click={() => handlePosition("left")}
                                                   activated={launcher.placement.position === "left"}/>
                            <ChooseButtonContainer label={labels.common.right} click={() => handlePosition("right")}
                                                   activated={launcher.placement.position === "right"}/>
                        </div>
                    </SidebarInnerContainer>
                    <SidebarInnerContainer title={labels.design.placement.spacing.title}>
                        <p className={`text-light 2xl:text-sm text-xs font-normal  `}
                        >{labels.design.placement.spacing.description}
                        </p>
                        <div className={`${split_content}`}>
                            <InputWrapper label={labels.design.placement.spacing.side_space}
                                          value={launcher.placement.side_spacing}
                                          type={"number"}
                                          error={errorList.includes("launcher.placement.side_spacing")}
                                          error_message={errorList.includes("launcher.placement.side_spacing") &&
                                              getErrorMessage(errors, "launcher.placement.side_spacing")}
                                          onChange={(e) => handleSidePositions(e, "side_spacing")}
                                          border={"border-none"}/>
                            <InputWrapper label={labels.design.placement.spacing.bottom_space}
                                          type={"number"}
                                          error={errorList.includes("launcher.placement.bottom_spacing")}
                                          error_message={errorList.includes("launcher.placement.bottom_spacing") &&
                                              getErrorMessage(errors, "launcher.placement.bottom_spacing")}
                                          onChange={(e) => handleSidePositions(e, "bottom_spacing")}
                                          value={launcher.placement.bottom_spacing}
                                          border={"border-none"}/>
                        </div>
                    </SidebarInnerContainer>
                </div>
            </div>

            {/* ************************ Design Preview here ********************************** */}
            <div className={`2xl:w-[70%] w-[60%] h-[590px] flex flex-col border border-card_border rounded-xl`}>

                <PreviewContainerHeader/>

                {/* ************************ preview content here ********************************** */}
                <div
                    className={`flex overflow-hidden items-start ${launcher.placement.position === "left" ? "justify-start" : "justify-end"} w-full h-full 2xl:px-5 md:px-3 px-2 `}>

                    {/* ************************ launcher home page ********************************** */}
                    <div className={`flex flex-col py-3 gap-y-1  w-[300px] h-full   relative`}
                         style={
                             launcher.placement.position === "left" ? {
                                 left: `${launcher.placement.side_spacing}px`,
                                 bottom: `${launcher.placement.bottom_spacing}px`,
                             } : {
                                 right: `${launcher.placement.side_spacing}px`,
                                 bottom: `${launcher.placement.bottom_spacing}px`
                             }
                         }
                    >
                        {/*<PreviewLauncher/>*/}
                        {/* launcher popup icon*/}
                        {["mobile_and_desktop", "desktop_only", "mobile_only",].includes(launcher.view_option) &&
                            <div
                                className={`text-white p-1.5 h-10 group cursor-pointer ${showPreviewPopupButton(launcher.view_option)}  transition duration-200 ease-in  items-center justify-center 
                            w-10 lg:w-auto gap-x-1.5
                              rounded-md  absolute ${launcher.placement.position === "right" && "right-0"} bottom-1.5 `}
                                style={{
                                    backgroundColor: `${colors.theme.primary}`,
                                    fontFamily: `${launcher.font_family}`
                                }}
                            >
                                {["icon_with_text", "icon_only", "text_only"].includes(launcher.appearance.selected) &&
                                    <div
                                        className={` rounded-md  h-8 flex  items-center justify-center group-hover:animate-swing`}>
                                        {(launcher.appearance.icon.selected == "image" && launcher.appearance.icon.image !== "") ?
                                            <img alt={"image"}
                                                 src={launcher.appearance.icon.image}
                                                 className={`object-contain rounded-md w-8 h-8  ${launcher.appearance.selected === "text_only" && "block lg:hidden"}`}/> :
                                            <Icon icon={`${launcher.appearance.icon.icon}`}
                                                  text={`2xl:text-2xl text-xl  `}
                                                  width={" text-center"}
                                                  color={getHexColor(design.colors.theme.text)}
                                                  show={`${launcher.appearance.selected === "text_only" && "block lg:hidden "}`}
                                            />
                                        }
                                    </div>}
                                {["icon_with_text", "text_only"].includes(launcher.appearance.selected) &&
                                    <p
                                        style={{
                                            fontFamily: `${launcher.font_family}`
                                        }}
                                        className={`${getTextColor(colors.theme.text)} hidden lg:block  font-bold text-18px leading-6`}
                                        dangerouslySetInnerHTML={{__html: launcher.appearance.text}}
                                    />}
                            </div>}
                    </div>
                </div>

            </div>

        </div>


    </div>)
};

export default Launcher;