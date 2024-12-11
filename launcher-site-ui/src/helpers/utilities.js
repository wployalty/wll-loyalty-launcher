import React from "react";
import {postRequest} from "../components/Common/postRequest";

export const responsive = {
    text: {
        md: "text-sm 2xl:text-md",
        sm: "text-xs 2xl:text-sm",
    }
}

export const getHexColor = (color) => {
    return color === "white" ? "#ffffff" : "#000000";
}

export const getTextColor = (color) => {
    return color === "white" ? "text-white" : "text-black";
}

export const CopyTOClipBoard = (str, message) => {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
};

export const handleVisibilityLauncher = (view) => {
    switch (view) {
        case `mobile_and_desktop`:
            return `wll-flex`;
        case `mobile_only`:
            return ` lg:wll-hidden wll-flex`;
        case `desktop_only`:
            return ` lg:wll-flex wll-hidden`;
    }
}

export const getDateFormat = (date) => {
    return date.toISOString().substring(0, 10)
}

export const getDatePadStart = (value) => {
    return value.toString().padStart(2, "0");

}

export const getSiteDirection = () => {
    let element = document.getElementById('wll-site-launcher');
    if (window.getComputedStyle) { // all browsers
        return window.getComputedStyle(element, null).getPropertyValue('direction');
    } else {
        return element.currentStyle.direction; // IE5-8
    }
}

export const getDateValue = (dateString) => new Date(dateString).getDate().toString().padStart(2, '0');
export const getMonthValue = (dateString) => (new Date(dateString).getMonth() + 1).toString().padStart(2, '0');
export const getFullYearValue = (dateString) => new Date(dateString).getFullYear().toString().padStart(4, '0');


export const validateNumber = (targetValue, length) => {
    let value = targetValue.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1')
    return value.slice(0, length)
}

export const getHtmlDecodeString = (value) => {
    let doc = new DOMParser().parseFromString(value, "text/html"); // returns html document
    return doc.documentElement.textContent;
}

export const isNaNValidate = (value) => {
    return isNaN(value) ? 0 : value;
}

export const isString = (data) => {
    if (typeof data === "string") {
        return data.trim();
    } else {
        return JSON.stringify(data);
    }
}

export const isValidJSON = (jsonString) => {
    try {
        JSON.parse(isString(jsonString));
        return true;
    } catch (error) {
        return false;
    }
}

export const getJSONData = (json, start = "{", end = "}") => {
    if (isValidJSON(json)) {
        return JSON.parse(isString(json));
    } else {
        let startIndex = json.indexOf(start);
        let endIndex = json.lastIndexOf(end) + end.length;
        let resSubString = json.substring(startIndex, endIndex);
        if (isValidJSON(resSubString)) {
            return JSON.parse(isString(resSubString));
        }
        return {};
    }
}

export const getReadableDateFormat = (date) => {
    const options = {month: "short", day: "numeric", year: "numeric"};
    return new Date(date).toLocaleDateString("en-US", options); // ex: Feb 14, 2014
}