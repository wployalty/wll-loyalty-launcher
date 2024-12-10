import React from "react";
import SidebarHeaderTitle from "./SidebarHeaderTitle";
import SidebarInnerContainer from "../Common/SidebarInnerContainer";
import ChooseButtonContainer from "../Common/ChooseButtonContainer";
import {CommonContext, UiLabelContext} from "../../Context";
import BackContainer from "../Common/BackContainer";

const LogoEdit = ({setActiveSidebar}) => {
    const {commonState, setCommonState} = React.useContext(CommonContext);
    const {design} = commonState;
    const labels = React.useContext(UiLabelContext);

    const handleLogoShow = (value) => {
        let data = {...commonState};
        data.design.logo.is_show = value;
        setCommonState(data);
    };

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
                data.design.logo.image = url;
                setCommonState(data);
            });
        });
        media.open();
        return false;
    }

    /*remove image*/
    const handleRemoveImage = () => {
        let data = {...commonState};
        data.design.logo.image = ""
        setCommonState(data);
    }

    return <div className={`relative h-[590px] overflow-y-auto`}>
        <SidebarHeaderTitle title={labels.design.logo.title} click={() => setActiveSidebar("all")}/>
        <SidebarInnerContainer title={labels.design.logo.visibility}>
            <div className={`flex w-full gap-4 items-center`}>
                <ChooseButtonContainer label={labels.common.show}
                                       activated={design.logo.is_show === "show"}
                                       click={() => handleLogoShow("show")}/>
                <ChooseButtonContainer label={labels.common.none}
                                       activated={design.logo.is_show === "none"}
                                       click={() => handleLogoShow("none")}/>
            </div>
        </SidebarInnerContainer>
        <SidebarInnerContainer title={labels.common.logo_image}>

            {/* ************************ image container ********************************** */}
            <p className={`text-light 2xl:text-sm text-xs font-normal  `}
            >{labels.design.logo.image.description}
            </p>
            <div
                className={`flex items-center justify-center w-full h-50 border-2 border-light_border border-dashed rounded-md`}>
                {["", undefined].includes(design.logo.image) ?
                    <div className={`flex flex-col items-center gap-y-3`}>
                        <i className={`wlr wlrf-image-upload text-light text-3xl`}/>
                        <p className={`text-xs 2xl:text-sm text-light font-medium`}>{labels.common.image_description}</p>
                    </div> :
                    <img src={design.logo.image}
                         alt={"logo image"}
                         className={`object-contain h-full w-full  p-2 `}
                    />}
            </div>
            <div className={`flex w-full gap-4 items-center gap-x-3`}>
                <div
                    onClick={handleRemoveImage}
                    className={`flex items-center cursor-pointer justify-center w-full rounded-md py-3 border border-light_border `}>
                    <p className={`text-light 2xl:text-sm text-xs`}

                    >{labels.common.restore_default}</p>
                </div>
                <div
                    className={`flex items-center cursor-pointer justify-center w-full rounded-md py-3 bg-blue_primary `}
                    onClick={handleChooseImage}>
                    <p className={`text-white 2xl:text-sm text-xs`}
                    >{labels.common.browse_image}</p>
                </div>
            </div>
        </SidebarInnerContainer>
        <BackContainer click={() => setActiveSidebar("all")}/>

    </div>
}

export default LogoEdit;
