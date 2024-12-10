import React from 'react';
import SidebarHeaderTitle from "../../sidebar/SidebarHeaderTitle";
import LabelInputContainer from "../../Common/LabelInputContainer";
import ImageContainer from "../../Common/ImageContainer";
import SidebarInnerContainer from "../../Common/SidebarInnerContainer";
import {CommonContext, ContentContext, UiLabelContext} from "../../../Context";
import BackContainer from "../../Common/BackContainer";
import {getErrorMessage} from "../../../helpers/utilities";

const Points = ({setActiveSidebar}) => {
    const labels = React.useContext(UiLabelContext);
    const {commonState, setCommonState} = React.useContext(CommonContext);
    const {content} = commonState;
    const {errors, errorList} = React.useContext(ContentContext)
    let {guest} = content;
    let {points} = guest;

    /*remove image*/
    const handleRemoveImage = (type) => {
        let data = {...commonState};
        data.content.guest.points[type].icon.image = ""
        setCommonState(data);
    }
    /* image uploader  */
    const handleChooseImage = (type) => {
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
                data.content.guest.points[type].icon.image = url;
                setCommonState(data);
            });
        });
        media.open();
        return false;
    }

    const handleGuestTexts = (e, group, field) => {
        let data = {...commonState};
        data.content.guest.points[group][field] = e.target.value;
        setCommonState(data);
    }
    return <div>
        <SidebarHeaderTitle title={labels.common.points} click={() => setActiveSidebar("guest")}/>
        <div className={`flex flex-col w-full h-[488px] overflow-y-auto `}>
            <SidebarInnerContainer title={labels.common.earn}>
                <LabelInputContainer label={labels.common.title}
                                     value={points.earn.title}
                                     error={errorList.includes("content.guest.points.earn.title")}
                                     error_message={errorList.includes("content.guest.points.earn.title") &&
                                         getErrorMessage(errors, "content.guest.points.earn.title")}
                                     onChange={(e) => handleGuestTexts(e, "earn", "title")}
                />
                <p className={`text-light text-xs 2xl:text-sm font-semibold tracking-wider`}>
                    Icon
                </p>
                <ImageContainer
                    value={points.earn.icon.image}
                    handleChooseImage={() => handleChooseImage("earn")}
                    handleRemoveImage={() => handleRemoveImage("earn")}
                />
            </SidebarInnerContainer>
            <SidebarInnerContainer title={labels.common.redeem}>
                <LabelInputContainer label={labels.common.title}
                                     value={points.redeem.title}
                                     error={errorList.includes("content.guest.points.redeem.title")}
                                     error_message={errorList.includes("content.guest.points.redeem.title") &&
                                         getErrorMessage(errors, "content.guest.points.redeem.title")}
                                     onChange={(e) => handleGuestTexts(e, "redeem", "title")}
                />
                <p className={`text-light text-xs 2xl:text-sm font-semibold tracking-wider`}>
                    {labels.common.icon}
                </p>
                <ImageContainer
                    value={points.redeem.icon.image}
                    handleChooseImage={() => handleChooseImage("redeem")}
                    handleRemoveImage={() => handleRemoveImage("redeem")}
                />
            </SidebarInnerContainer>
            <BackContainer click={() => setActiveSidebar("guest")}/>
        </div>
    </div>
};

export default Points;