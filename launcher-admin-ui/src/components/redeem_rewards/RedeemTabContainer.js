import React from 'react';
import {CommonContext} from "../../Context";

const RedeemTabContainer = ({click, active, name}) => {
    const {commonState} = React.useContext(CommonContext);

    return <div onClick={click}
                className={`flex p-2 items-center cursor-pointer justify-center w-1/2 h-12 border-b-2 `}
                style={{
                    borderColor: `${active ? `${commonState.design.colors.theme.primary}` : `transparent`} `,
                    color: `${active ? `${commonState.design.colors.theme.primary}` : `#161F31`}`
                }}
    >
        <p className={`lg:text-sm text-xs font-medium`}>
            {name}</p>
    </div>
};

export default RedeemTabContainer;