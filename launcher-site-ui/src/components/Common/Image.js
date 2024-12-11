import React from "react";

const Image = ({
                   image,
                   height = "h-6",
                   width = "w-6",
                   objectFit = "object-contain",
                   wllClassName = "",
               }) => {
    return <img className={`${wllClassName} ${height} ${width} ${objectFit} rounded-md`}
                src={image}
                alt={"image"}
    />
}
export default Image;