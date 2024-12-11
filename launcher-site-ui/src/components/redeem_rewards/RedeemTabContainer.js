import React from 'react';
import {LaunchercontentContext} from "../../Context";

const RedeemTabContainer = ({click, active, name, tab_name}) => {
    const {launcherState} = React.useContext(LaunchercontentContext);

    return <div onClick={click}
                className={`wll-${tab_name}-container wll-flex p-2 items-center cursor-pointer justify-center w-1/2 h-11  `}
                style={{
                    // borderColor: `${active ? `${launcherState.design.colors.theme.primary}` : `transparent`}`,
                    color: `${active ? `${launcherState.design.colors.theme.primary} ` : "#161F31"}`,
                    borderBottom: `${active ? `2px solid ${launcherState.design.colors.theme.primary}` : `2px solid transparent`}`,

                }}
    >
        <p className={`wll-${tab_name}-title lg:text-md text-sm`}>
            {name}
        </p>
    </div>
};

export default RedeemTabContainer;
