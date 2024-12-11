import React from 'react';
import {LaunchercontentContext} from "../../Context";

const Icon = ({
                  icon,
                  fontSize = "text-md 2xl:text-xl",
                  fontWeight = "font-medium",
                  color,
                  click,
                  show = "",
                  extraStyle = "",
              }) => {
    const {launcherState,} = React.useContext(LaunchercontentContext);
    let icon_color = ["", undefined, "undefined"].includes(color) ? launcherState.design.colors.theme.primary : color;

    return <i
        onClick={click}
        style={{color: `${icon_color}`}}
        className={` wlr wlrf-${icon} cursor-pointer  ${fontSize} ${show} ${extraStyle}
   ${fontWeight}
    `}/>
};
export default Icon;