import React from 'react';
import Icon from "./Icon";
import {LaunchercontentContext} from "../../Context";
import {getHexColor, getTextColor} from "../../helpers/utilities";

const PageHeader = ({title, handleBackIcon, page_name}) => {
    const {showLauncher, launcherState} = React.useContext(LaunchercontentContext);
    const {design} = launcherState;
    return <div
        className={`wll-${page_name}-header-container wll-flex lg:h-14 h-11  items-center  justify-between w-full px-4 lg:px-3 py-2 lg:py-3`}
        style={{backgroundColor: `${design.colors.theme.primary}`}}
    >
        <div className={`wll-${page_name}-header-back-icon wll-flex gap-x-3 items-center w-full`}>
            <Icon
                click={handleBackIcon}
                color={`${getHexColor(design.colors.theme.text)}`}
                icon={"back"}/>
            <p className={`wll-${page_name}-title text-md lg:text-sm  overflow-hidden overflow-ellipsis w-[78%] whitespace-nowrap ${getTextColor(design.colors.theme.text)} `}
               dangerouslySetInnerHTML={{__html: title}}/>
        </div>
        <div
            className={`wll-${page_name}-header-close-icon wll-flex items-center justify-center h-6 w-6 lg:h-8 lg:w-8 rounded-md `}
        >
            <Icon icon={"close"}
                  fontSize={"2xl:text-3xl text-2xl"}
                  color={`${getHexColor(design.colors.theme.text)}`}
                  click={() => showLauncher.set(false)}
            />
        </div>
    </div>
};

export default PageHeader;