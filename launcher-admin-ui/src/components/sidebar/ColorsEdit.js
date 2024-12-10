import React from 'react';
import SidebarHeaderTitle from "./SidebarHeaderTitle";
import SidebarInnerContainer from "../Common/SidebarInnerContainer";
import ColorContainer from "../Common/ColorContainer";
import {CommonContext, UiLabelContext} from "../../Context";
import ColorChooseContainer from "../Common/ColorChooseContainer";
import BackContainer from "../Common/BackContainer";

const ColorsEdit = ({setActiveSidebar}) => {
    const labels = React.useContext(UiLabelContext);
    const {commonState, setCommonState} = React.useContext(CommonContext);
    const {design} = commonState;
    const [themeText, setThemeText] = React.useState(false);
    const [buttonText, setButtonText] = React.useState(false);

    const handleColorChange = (e, field) => {
        e.preventDefault();
        let data = {...commonState};
        data.design.colors.theme[field] = e.target.value;
        setCommonState(data);
    };

    const handleButtonColor = (e, field) => {
        e.preventDefault();
        let data = {...commonState};
        data.design.colors[field].background = e.target.value;
        setCommonState(data);
    }

    let text_color_options = [
        {label: labels.common.white, value: "white"},
        {label: labels.common.black, value: "black"},

    ];
    return <div className={``}>
        <SidebarHeaderTitle title={labels.design.colors.title} click={() => setActiveSidebar("all")}/>
        <div className={`flex flex-col w-full h-[520px] overflow-y-auto `}>
            <SidebarInnerContainer title={labels.design.colors.theme_title}>
                <div className={`w-full flex flex-col  gap-y-3`}>
                    <div className={`w-full flex items-center gap-x-4`}>
                        <ColorContainer value={design.colors.theme.primary}
                                        onChange={(e) => handleColorChange(e, "primary")}
                                        label={labels.design.colors.theme_color}
                                        disabled={true}
                                        reset_id={"theme_color_reset_id"}
                                        handleResetColor={() => {
                                            let data = {...commonState};
                                            data.design.colors.theme.primary = "#6F38C5";
                                            setCommonState(data);
                                        }}
                        />
                        {/*-----------secondary color -------------*/}
                        <ColorChooseContainer
                            options={text_color_options}
                            label={labels.common.text}
                            active={themeText}
                            setActive={setThemeText}
                            activeColor={design.colors.theme.text}
                            selectedColorName={design.colors.theme.text === "white" ? labels.common.white : labels.common.black}
                            backgroundColor={design.colors.theme.text === "white" ? "#FFFFFF" : "#000000"}
                            setActiveState={(value) => {
                                let data = {...commonState};
                                data.design.colors.theme.text = value;
                                setCommonState(data)
                            }}
                        />
                    </div>

                </div>
            </SidebarInnerContainer>

            <SidebarInnerContainer title={labels.design.colors.buttons}>
                <div className={`w-full flex items-center gap-x-4`}>

                    <ColorContainer value={design.colors.buttons.background}
                                    onChange={(e) => handleButtonColor(e, "buttons")}
                                    label={labels.common.background}
                                    disabled={true}
                                    reset_id={"button_color_reset_id"}
                                    handleResetColor={() => {
                                        let data = {...commonState};
                                        data.design.colors.buttons.background = "#FF6B00";
                                        setCommonState(data);
                                    }}
                    />
                    <ColorChooseContainer
                        options={text_color_options}
                        label={labels.common.text}
                        active={buttonText}
                        setActive={setButtonText}
                        activeColor={design.colors.buttons.text}
                        selectedColorName={design.colors.buttons.text === "white" ? labels.common.white : labels.common.black}
                        backgroundColor={design.colors.buttons.text === "white" ? "#FFFFFF" : "#000000"}
                        setActiveState={(value) => {
                            let data = {...commonState};
                            data.design.colors.buttons.text = value;
                            setCommonState(data)
                        }}
                    />
                </div>
            </SidebarInnerContainer>

            <BackContainer click={() => setActiveSidebar("all")}/>
        </div>

    </div>
};

export default ColorsEdit;