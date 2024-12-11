import React from 'react';
import Icon from "../Common/Icon";
import {CopyTOClipBoard, getJSONData} from "../../helpers/utilities";
import {LaunchercontentContext} from "../../Context";
import Image from "../Common/Image";
import Button from "../Common/Button";
import LoadingIcon from "../Common/LoadingIcon";
import {postRequest} from "../Common/postRequest";

const CouponCard = ({coupon, copied, setCopied, apply, applyLoading}) => {
    const {launcherState} = React.useContext(LaunchercontentContext);
    const {design, labels} = launcherState;
    const {colors} = design;

    const {discount_type} = coupon;

    const handleCopyIcon = (id) => {
        setCopied(id)
        CopyTOClipBoard(coupon.discount_code);
    }
    const handleApplyCoupon = async (id, reward_table) => {
        applyLoading.set(true);
        apply.set(id);
        let params = {
            reward_id: id,
            type: reward_table,
            wlr_nonce: launcherState.nonces.wlr_reward_nonce,
            action: "wlr_apply_reward",
        }
        let res = await postRequest(params);
        let resJSON = getJSONData(res.data);
        if (resJSON.success && resJSON.data !== null) {
            location.reload();
        } else if (resJSON.success === false && resJSON.data !== null) {
            applyLoading.set(false);
        }
    }
    return <div key={coupon.id}
                style={coupon.is_out_of_stock ? {
                    background: "#ceced1",
                    cursor: 'not-allowed'
                } : {
                    cursor: "text",
                }}
                className={`wll-coupon-${discount_type}-container wll-relative wll-flex wll-flex-col w-full shadow-card_1 rounded-xl  bg-white  px-2 lg:px-3 py-3 lg:py-4 gap-y-2.5 lg:gap-y-3 `}>
        {coupon.is_out_of_stock &&
            <div className={"wll-flex items-center gap-x-1 bg-white px-2.5 py-1 rounded-md wll-absolute w-max"}
                 style={{
                     top: "16px",
                     right: "16px",
                 }}
            ><Icon color={"#777777"} extraStyle={""} icon={`lock`} fontSize={`text-2xl`}/>
                <span style={{color: "#777777", fontSize: "14px"}}>{coupon.out_of_stock_message}</span>
            </div>}
        {
            coupon?.expiry_date_text &&
            <p className={`wll-coupon-${discount_type}-expiry-date text-light font-medium text-xs lg:text-sm `}>{coupon.expiry_date_text}</p>}
        <div className={`wll-coupon-${discount_type}-inner-container wll-flex items-center gap-x-3 lg:gap-4 `}>

            <div
                className={`wll-coupon-${discount_type}-icon-container lg:w-10 w-8 h-8 wll-flex items-center justify-center`}>
                {["", null, undefined, "null", "undefined"].includes(coupon.icon) ?
                    <Icon icon={`${coupon.discount_type}`} fontSize={`text-3xl lg:text-4xl`}/>
                    :
                    <Image height={"h-8"} width={"w-8"}
                           image={coupon.icon}
                    />
                }
            </div>
            <div className={`wll-coupon-${discount_type}-name-container wll-flex wll-flex-col gap-y-1.5 w-full `}>
                <p className={`wll-coupon-${discount_type}-name text-sm lg:text-md font-bold text-dark`}
                   dangerouslySetInnerHTML={{__html: coupon.name}}
                />
                <p className={`wll-coupon-${discount_type}-action-text text-sm lg:text-md font-normal text-light`}
                   dangerouslySetInnerHTML={{__html: coupon.action_text}}
                />
            </div>
        </div>
        <div className={`wll-coupon-${discount_type}-coupon-code-wrapper wll-flex gap-x-2 items-center w-full`}>
            <div
                className={`wll-coupon-${discount_type}-coupon-code-container overflow-hidden  wll-flex w-full h-8   py-2.5 items-center justify-between border-2 border-dashed rounded-md ${!coupon.is_out_of_stock && "bg-primary_extra_light"}`}
                style={{borderColor: `${design.colors.theme.primary}`}}
            >
                <p className={`wll-coupon-${discount_type}-discount-code-text text-light whitespace-nowrap overflow-hidden px-2 w-full overflow-ellipsis uppercase font-semibold text-xs lg:text-sm`}
                   style={{
                       textTransform: "uppercase",
                       borderRight: `2px dashed ${design.colors.theme.primary}`
                   }}
                >
                    {coupon.discount_code}
                </p>
                <Icon extraStyle={`px-2 ${coupon.is_out_of_stock ? "not-allowed" : "cursor-pointer"}}`}
                      click={() => coupon.is_out_of_stock ? () => {
                      } : handleCopyIcon(coupon.id)} icon={`${copied == coupon.id ? "tick" : "copy"}`}/>

            </div>
            <div
                className={`wll-coupon-${discount_type}-apply-button-container wll-flex  items-center justify-center w-[20%]`}>
                {(applyLoading.value && coupon.id === apply.value) ? <LoadingIcon/> :
                    <Button
                        id={`wll-coupon-${discount_type}-apply`}
                        click={() => handleApplyCoupon(coupon.id, coupon.reward_table)}
                        textColor={`${colors.buttons.text}`}
                        bgColor={`${colors.buttons.background}`}
                        height={"h-8"}
                        disabled={applyLoading.value || coupon.is_out_of_stock}
                        wllCommonButtonClass={"wll-apply-coupon-button"}
                    >
                        {labels.apply_button_text}
                    </Button>
                }
            </div>
        </div>
    </div>
};

export default CouponCard;