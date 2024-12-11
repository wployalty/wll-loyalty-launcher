import React from 'react';

const Button = ({
                    bgColor = "bg-primary",
                    textStyle = "text-white text-xs 2xl:text-sm_14_l_20 ",
                    padding = "px-2.5 py-2",
                    children,
                    icon = null,
                    others = "",
                    click = null,
                    outline = false,
                    outlineStyle = "border-primary",
                    disabled = false,
                    title = "",
                    shadow = false,
                    id = id,
                    textColor = "text-white",
                    width = "w-max",
                    height = "h-8",
                    wllCommonButtonClass = "",
                    minWidth = "min-h-20",
                    border = "wll-border-none"
                }) => {
    const outlineStyles = outline ? `border ${outlineStyle}` : "";
    return (
        <button
            id={id}
            className={`antialiased no-underline  font-medium  wll-flex items-center justify-center space-x-2 outline-none tracking-normal
             whitespace-nowrap wpl-loyalty-button   ${textStyle} ${padding} ${others}  
            ${outlineStyles}   rounded-md ${border}
             ${disabled ? `cursor-not-allowed opacity-80` : "cursor-pointer opacity-100"} ${width} ${height} ${wllCommonButtonClass} ${minWidth}`}
            onClick={disabled ? () => {
            } : click}
            title={title}
            style={{
                backgroundColor: `${bgColor} `,
            }}
        >
            {icon}
            <span className="text-xs"
                  style={{
                      color: `${textColor}`
                  }}
            >{children}</span>
        </button>
    );
};

export default Button;

