import React from 'react';
import Icon from "../Common/Icon";
import {UiLabelContext} from "../../Context";

const CouponCard = ({coupon, design, copied}) => {
    const handleCopyIcon = (id) => {
        copied.set(id)
    }
    const labels = React.useContext(UiLabelContext);
    return <div key={coupon.id}
                className={`flex flex-col w-full shadow-card_1 rounded-xl  bg-white  px-2 lg:px-3 py-2 xl:py-3 gap-y-2 xl:gap-y-2.5 `}>
        <p className={`text-light font-medium text-xs lg:text-sm `}>{coupon.expired_text}</p>
        <div className={`flex items-center gap-x-3 lg:gap-4 `}>
            <Icon icon={`${coupon.icon}`} fontSize={`text-3xl lg:text-4xl`}/>
            <div className={`flex flex-col gap-y-1 w-full `}>
                <p className={'text-xs xl:text-sm font-bold text-dark'}>
                    {coupon.title}
                </p>
                <p className={`text-xs xl:text-sm font-normal text-light`}>
                    {coupon.action_text}
                </p>
            </div>
        </div>
        <div
            className={`flex w-full h-8 gap-x-1.5 items-center justify-between `}
            style={{borderColor: `${design.colors.theme.primary}`}}
        >
            {/*<div*/}
            {/*    style={{width: "75%"}}*/}

            {/*    className={` flex  h-8 px-3 py-2.5 items-center justify-between border-2 border-dashed rounded-md bg-primary_extra_light`}>*/}
            {/*    <p className={`text-light font-medium text-xs xl:text-sm uppercase`}>*/}
            {/*        {coupon.coupon_code}*/}
            {/*    </p>*/}
            {/*    <Icon icon={"copy"}/>*/}
            {/*</div>*/}
            <div
                className={` overflow-hidden  flex w-full h-8   py-2.5 items-center justify-between border-2 border-dashed rounded-md bg-primary_extra_light`}
                style={{borderColor: `${design.colors.theme.primary}`}}
            >
                <p className={` text-light whitespace-nowrap overflow-hidden px-2 w-full overflow-ellipsis uppercase font-semibold text-xs lg:text-sm`}
                   style={{
                       textTransform: "uppercase",
                       borderRight: `2px dashed ${design.colors.theme.primary}`
                   }}
                   title={coupon.coupon_code}
                >
                    {coupon.coupon_code}
                </p>
                <Icon extraStyles={"px-2"} click={() => handleCopyIcon(coupon.id)}
                      icon={`${copied.val == coupon.id ? "tick" : "copy"}`}/>

            </div>

            <div className={`flex  items-center justify-center w-[20%]`}>

                <button className={`${design.colors.buttons.text === "white" ? "text-white" : "text-black"}
             w-max h-8 px-2 rounded-md
             `}
                        style={{
                            background: `${design.colors.buttons.background}`,
                            // color: `${design.colors.buttons.text}`
                        }}
                >
                    {labels.common.apply_button_text}
                </button>
            </div>
        </div>
    </div>
};

export default CouponCard;