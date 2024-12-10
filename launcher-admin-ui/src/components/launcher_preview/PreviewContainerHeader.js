import React from 'react';
import {UiLabelContext} from "../../Context";

const PreviewContainerHeader = (props) => {
    const labels = React.useContext(UiLabelContext);
    return <div
        className={`flex items-center justify-between w-full py-4 px-5 rounded-t-lg border border-x-0 border-t-0 border-b-card_border`}>
        <div className={`flex items-center gap-x-2`}>
            <span className={`rounded-full h-3 w-3 bg-redd `}/>
            <span className={`rounded-full h-3 w-3 bg-yellow-400 `}/>
            <span className={`rounded-full h-3 w-3 bg-active_green `}/>
        </div>

        <p className={`text-sm xl:text-md font-medium text-primary`}>
            {labels.common.dummy_preview_message}
        </p>
    </div>
};

export default PreviewContainerHeader;