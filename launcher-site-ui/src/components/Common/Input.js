import React from 'react';

const Input = ({
                   placeHolder = null,
                   type = "text",
                   value,
                   required,
                   onChange,
                   textColor = "text-dark",
                   border = "border border-solid  focus:border-primary  focus:border-1  focus:border-opacity-100",
                   others = "",
                   onfocus = null,
                   onblur = null,
                   min = null,
                   max = null,
                   error = false,
                   id,
                   padding = "2xl:p-2.5 p-1.5",
                   onKeyDown,
                   height = `${["text", "number", "date"].includes(type) ? "h-11" : "h-20"}`,
                   width = "w-full",
                   readOnly = false,
                   borderRadius,
               }) => {
    return type === "textarea" ? (
            <textarea
                id={id}
                value={value}
                required={required}
                placeholder={placeHolder}
                className={`${padding} ${height} transition duration-200 ease-in
                  rounded-md focus:shadow-none antialiased
                  bg-white ${border}   ${width}  ${textColor} ${others} ${error && "input-error"}`}
                onChange={onChange}
                onFocus={onfocus}
            />
        ) :
        (
            <input
                id={id}
                type={type}
                value={value}
                required={required}
                min={type == "number" ? 0 && !min : min}
                max={max}
                readOnly={readOnly}
                placeholder={placeHolder}
                className={`${padding} ${height} ${width}
                transition duration-200 ease-in focus:outline-none rounded-md focus:shadow-none antialiased  bg-white ${border}
                 ${textColor} tracking-wider ${others} ${error ? "input-error" : "border-light_border"} text-xs 2xl:text-sm`}
                onChange={onChange}
                onFocus={onfocus}
                onBlur={onblur}
                onKeyDown={onKeyDown}
                style={{
                    borderRadius: borderRadius,
                }}
            />
        );
};

export default Input;