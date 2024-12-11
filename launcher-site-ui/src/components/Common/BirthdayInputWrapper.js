import React from "react";

const BirthdayInputWrapper = ({
                                  label,
                                  field,
                                  placeHolder = null,
                                  type = "text",
                                  value,
                                  required,
                                  onChange,
                                  textColor = "text-dark",
                                  border = "border ",
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
                                  width = "w-full"
                              }) => {

    return <div className={`wll-preview-birthday-${field}-container wll-flex wll-flex-col gap-y-2 ${width}`}>
        <p className={`wll-preview-birthday-${field}-format-label`}>{label}</p>
        <input
            id={id}
            type={type}
            value={value}
            required={required}
            min={min}
            max={max}
            placeholder={placeHolder}
            className={`${padding} ${height}  wll-preview-birthday-${field}-input
                transition duration-200 ease-in focus:outline-none rounded-md focus:shadow-none antialiased bg-white ${border} border-solid
       w-full ${textColor} tracking-wider ${others} ${error && "input-error"} text-xs 2xl:text-sm`}
            onChange={onChange}
            onFocus={onfocus}
            onBlur={onblur}
            onKeyDown={onKeyDown}
        />
    </div>
}

export default BirthdayInputWrapper;