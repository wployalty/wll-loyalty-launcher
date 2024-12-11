import React, {useEffect} from 'react';
import Icon from "../Common/Icon";
import Input from "../Common/Input";
import Button from "../Common/Button";
import {LaunchercontentContext} from "../../Context";
import {postRequest} from "../Common/postRequest";
import Image from "../Common/Image";
import {getJSONData, isNaNValidate, validateNumber} from "../../helpers/utilities";
import LoadingIcon from "../Common/LoadingIcon";

const PreviewReward = ({previewData}) => {
    const {launcherState} = React.useContext(LaunchercontentContext);
    const [applyRewardId, setApplyRewardId] = React.useState("");
    const [applyRewardLoading, setApplyRewardLoading] = React.useState(false);
    const [availablePoint, setAvailablePoint] = React.useState(previewData.value.input_point);
    const [pointConvertionErrorMessage, setPointConvertionErrorMessage] = React.useState("");
    const {design} = launcherState;
    const {colors} = design;
    let {value} = previewData;
    const {
        discount_type,
        discount_value,
        available_point,
        require_point,
        conversion_price_format,
        id,
        coupon_type,
        max_allowed_point,
        min_allowed_point,
        min_message,
        max_message,
        is_max_changed
    } = value;

    const handlePointConversionReward = async ({id, reward_table}, available_point) => {
        setApplyRewardId(id);
        let params = {
            reward_id: id,
            type: reward_table,
            points: available_point,
            wlr_nonce: launcherState.nonces.wlr_reward_nonce,
            action: "wlr_apply_reward",
        }
        setApplyRewardLoading(true);
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success) {
            location.reload();
        } else if (resJSON.success === false) {
            setApplyRewardLoading(false)
        }
    }

    React.useEffect(() => {
        if (discount_type === "points_conversion" && parseInt(max_allowed_point) < 0) {
            if (previewData.value.input_point > parseInt(max_allowed_point)) {
                setAvailablePoint(max_allowed_point)
            }
        }
    }, [])

    const getErrorMessage = () => {
        if (parseInt(min_allowed_point) > 0 && (availablePoint < min_allowed_point)) {
            return setPointConvertionErrorMessage(min_message);
        }
        if (parseInt(max_allowed_point) > 0 && (availablePoint > max_allowed_point)) {
            return setPointConvertionErrorMessage(max_message);
        }
        // if(is_max_changed && parseInt(max_allowed_point)===0){
        //     setPointConvertionErrorMessage("")
        // }
        return setPointConvertionErrorMessage("")
    }
    useEffect(() => {
        getErrorMessage()
    }, [availablePoint]);

    const calculatePointsAmount = () => {
        const fractionDigits = isNaNValidate(launcherState.points_conversion_round);
        if (fractionDigits > 0) {
            return ((parseInt(availablePoint === "" ? 0 : availablePoint) / require_point) * isNaNValidate(parseFloat(discount_value))).toFixed(fractionDigits);
        } else {
            return Math.round((parseInt(availablePoint === "" ? 0 : availablePoint) / require_point) * isNaNValidate(parseFloat(discount_value)));
        }
    };

    return <div
        className={`wll-${discount_type}-reward-container wll-flex w-full h-full wll-relative wll-flex-col gap-y-4 px-5  lg:gap-y-5 overflow-y-auto`}
        style={{
            padding: "24px",
        }}
    >
        <div className={`wll-${discount_type}-reward-inner-container wll-flex items-center gap-x-3 lg:gap-x-4 `}>
            <div className={`wll-${discount_type}-reward-icon-container w-8 h-8 wll-flex items-center justify-center `}>
                {
                    ["", null, undefined, "null", "undefined"].includes(value.icon) ?
                        <Icon icon={`${value.discount_type}`} fontSize={`text-3xl lg:text-4xl`}/>
                        :
                        <Image height={"h-8"} width={"w-8"}
                               image={value.icon}
                        />
                }
            </div>
            <div className={`wll-${discount_type}-reward-name-container wll-flex wll-flex-col gap-y-1.5 w-full `}>
                <p className={`wll-${discount_type}-reward-name text-sm lg:text-md font-bold text-dark`}
                   dangerouslySetInnerHTML={{__html: value.name}}
                />
                <p className={`wll-${discount_type}-reward-action-text text-sm lg:text-md font-normal text-light`}
                   dangerouslySetInnerHTML={{__html: value.action_text}}/>
            </div>
        </div>
        <div className={`wll-${discount_type}-points-container w-full  wll-flex items-center justify-start space-x-2 `}>
            <div
                className={`wll-${discount_type}-points-inputs-container wll-relative wll-flex w-full items-center w-[80%]`}>
                {value.is_point_convertion_reward === true &&
                    <Input
                        id={`wll-${discount_type}-reward-input`}
                        height={"h-9"} value={parseInt(availablePoint)} type="number"
                        onChange={(e) => setAvailablePoint(validateNumber(e.target.value))}
                        error={parseInt(availablePoint) > parseInt(available_point) || parseInt(availablePoint) < 1 || !availablePoint || (is_max_changed && parseInt(max_allowed_point) === 0)}
                        width={"w-1/3"}
                        borderRadius={"6px 0 0 6px"}
                    />}
                <div
                    className={`wll-${discount_type}-points-amount-text-container wll-flex items-center  h-9 p-1.5 2xl:2.5 bg-grey_extra_light border border-solid border-light_border w-2/3 wll-relative`}
                    style={{
                        borderRadius: "0 6px 6px 0"
                    }}
                >
                    <span style={{
                        paddingLeft: "8px"
                    }} className={`text-xs  wll-${discount_type}-points-amount-text`}
                          dangerouslySetInnerHTML={{
                              __html: `${conversion_price_format} ${calculatePointsAmount()}`
                          }}

                    />
                    {coupon_type === "percent" && <span className={"text-xs text-light"}>%</span>}
                </div>
                {/*(parseInt(availablePoint) > parseInt(max_allowed_point) && parseInt(max_allowed_point)!==0) || (parseInt(availablePoint) > parseInt(max_allowed_point) && parseInt(min_allowed_point!==0))*/}
                {pointConvertionErrorMessage && <p
                    style={{
                        position: "absolute",
                        bottom: "-18px",
                        left: "0",
                        color: "#E96464FF",
                    }}
                    className={`wll-max-allowed-point-message  text-sm wll-flex justify-center lg:text-md font-normal`}>{pointConvertionErrorMessage}</p>}
            </div>
            {launcherState.is_member === true &&
                <div
                    className={`wll-${discount_type}-points-redeem-button-container wll-flex items-center justify-center w-[20%]`}>
                    {(applyRewardId === id && applyRewardLoading) ? <LoadingIcon/> :
                        <Button
                            height={"h-9"}
                            disabled={parseInt(availablePoint) > parseInt(available_point) || parseInt(availablePoint) < 1 || !availablePoint || applyRewardLoading || pointConvertionErrorMessage || (is_max_changed && parseInt(max_allowed_point) === 0)}
                            id={`wll-${discount_type}-reward-button`}
                            click={() => handlePointConversionReward(value, availablePoint)}
                            textColor={`${colors.buttons.text}`}
                            bgColor={`${colors.buttons.background}`}
                        >{value.button_text}
                        </Button>
                    }
                </div>
            }

        </div>

        <p className={`wll-${discount_type}-reward-description text-sm lg:text-md font-normal text-light`}
           style={{
               textIndent: "32px"
           }}
           dangerouslySetInnerHTML={{__html: value.description}}
        />
    </div>
};

export default PreviewReward;