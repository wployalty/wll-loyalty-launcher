import React from 'react';
import Icon from "../Common/Icon";
import Button from "../Common/Button";
import {postRequest} from "../Common/postRequest";
import {LaunchercontentContext} from "../../Context";
import Image from "../Common/Image";
import LoadingIcon from "../Common/LoadingIcon";
import {getJSONData} from "../../helpers/utilities";

const RewardCard = ({
                        reward,
                        previewData,
                        setActive,
                        isRewardOpportunity = false,
                        applyRewardLoading,
                        applyRewardId,
                    }) => {
    const [isReadMore, setIsReadMore] = React.useState(false);
    const [showReadMore, setShowReadMore] = React.useState(false);
    const descriptionRef = React.useRef(null);
    const {launcherState} = React.useContext(LaunchercontentContext);
    const {design} = launcherState;
    const {colors} = design;
    const {discount_type} = reward;

    const lastLine = descriptionRef.current?.getClientRects()[0]?.bottom;

    const handleApplyReward = async ({id, reward_table}) => {
        applyRewardId.set(id);
        applyRewardLoading.set(true);
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
            applyRewardLoading.set(false);
        }
    }

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    // const getDescription = () => {
    //     if (isReadMore || reward.description.length <= 90) {
    //         return reward.description;
    //     } else {
    //         return <div>{reward.description.slice(0, 90)}...} <span
    //             style={{
    //                 color: launcherState.design.colors.theme.primary,
    //                 // left:isReadMore?"": "153px",
    //                 bottom:0
    //             }}
    //             onClick={toggleReadMore}
    //             className={`wll-read-more-less-text cursor-pointer wll-flex   text-xs  font-semibold wll-absolute}`}>
    //             {isReadMore ? launcherState.labels.read_less_text : launcherState.labels.read_more_text}
    //         </span>
    //         </div>;
    //     }
    // }

    const getDescription = () => {
        if (isReadMore) {
            return `${reward.description} <span
                style="color:${launcherState.design.colors.theme.primary}"
                class="wll-read-more-less-text cursor-pointer  text-xs  "
            >${reward.description.length >= 90 ? launcherState.labels.read_less_text : ""}</span>`;
        } else {
            return `${reward.description.slice(0, 90)} <span
                    style="color:${launcherState.design.colors.theme.primary}"
                    class="wll-read-more-less-text cursor-pointer  text-xs  "
                    >${!isReadMore && reward.description.length <= 90 ? "" : "..." + launcherState.labels.read_more_text}</span>`;
        }
    };

    React.useEffect(() => {
        const descriptionElement = descriptionRef.current;
        if (descriptionElement) {
            const isOverflowing = descriptionElement.offsetHeight < descriptionElement.scrollHeight;
            setShowReadMore(isOverflowing);
        }
    }, []);

    // reward.is_out_of_stock && {
    //                     background:"#ceced1",
    //                     cursor:'not-allowed'
    //                 }
    return <div key={reward.id}
                style={reward.is_out_of_stock ? {
                    background: "#ceced1",
                    cursor: 'not-allowed'
                } : {
                    cursor: "text"
                }}
                className={`wll-${discount_type}-container wll-flex wll-flex-col w-full wll-relative shadow-card_1 rounded-xl  bg-white  px-2 lg:px-3 py-3 lg:py-4 gap-y-2.5 lg:gap-y-3 `}
    >
        {/*----------------------------out of stock UI card-------------------------*/}
        {reward.is_out_of_stock &&
            <div className={"wll-flex items-center gap-x-1 bg-white px-2.5 py-1 rounded-md wll-absolute w-max"}
                 style={{
                     top: "16px",
                     right: "16px",
                 }}
            ><Icon color={"#777777"} extraStyle={""} icon={`lock`} fontSize={`text-2xl`}/>
                <span style={{color: "#777777", fontSize: "14px"}}>{reward.out_of_stock_message}</span>
            </div>}

        <div className={`wll-${discount_type}-inner-container wll-flex items-center gap-x-2  w-full justify-between `}>
            <div className={`wll-${discount_type}-icon-text-container wll-flex items-center gap-x-3 lg:gap-x-4 w-full`}>
                <div
                    className={`wll-${discount_type}-icon-container lg:w-10 w-8 h-8 lg:h-8 wll-flex items-center justify-center`}>
                    {["", null, undefined, "null", "undefined"].includes(reward.icon) ?
                        <Icon icon={`${reward.discount_type}`} fontSize={`text-3xl lg:text-4xl`}/> :
                        <Image height={"h-8"} width={"w-8"}
                               image={reward.icon}
                        />
                    }
                </div>
                <div className={`wll-${discount_type}-name-action-container wll-flex wll-flex-col gap-y-1.5 w-full `}>
                    <p className={`wll-${discount_type}-name text-sm lg:text-md font-bold text-dark `}
                        // title={reward.name.length >45 ? reward.name:null}
                       dangerouslySetInnerHTML={{__html: reward.name}}
                    />
                    <p className={`wll-${discount_type}-action-text text-sm lg:text-md font-normal text-light`}
                       dangerouslySetInnerHTML={{__html: reward.action_text}}
                    />
                </div>
            </div>
            {(reward.discount_type === "points_conversion" && !isRewardOpportunity && launcherState.is_member) &&
                <div className={`wll-${discount_type}-arrow-icon-container`}>
                    <Icon click={() => {
                        previewData.set(reward);
                        setActive("preview")
                    }} icon={"arrow_right"}/>
                </div>
            }
        </div>
        <div className={`wll-desc-read-more-container w-full  wll-relative`}
            // style={{
            //     height:`${isReadMore || !showReadMore ?"100%":"60px"}`
            // }}
        >
            <p className={`wll-${discount_type}-description text-sm lg:text-md font-normal text-light `}
               ref={descriptionRef}
               onClick={toggleReadMore}
               dangerouslySetInnerHTML={{__html: getDescription()}}
            ></p>
            {reward.is_out_of_stock && reward.is_stock_empty_products.map((details) => {
                return <p key={details.product_id}
                          className={`wll-${discount_type}-out-of-stock text-sm lg:text-md font-normal text-light `}
                >{reward.out_of_stock_message} : {details.product_name}</p>
            })}

        </div>

        {(launcherState.is_member && !isRewardOpportunity) &&
            <div className={`wll-${discount_type}-redeem-button-container wll-flex items-center justify-center`}>
                {(applyRewardId.value === reward.id && applyRewardLoading.value) ? <LoadingIcon/> :
                    <Button
                        id={`wll-${discount_type}-redeem-button`}
                        click={reward.is_out_of_stock ? () => {
                        } : reward.is_point_convertion_reward ? () => {
                                previewData.set(reward);
                                setActive("preview")
                            }
                            :
                            () => handleApplyReward(reward)}
                        disabled={applyRewardLoading.value || reward.is_out_of_stock}
                        textColor={`${colors.buttons.text}`}
                        bgColor={`${colors.buttons.background}`}
                        height={"h-8"}
                    >
                        {reward.button_text}
                    </Button>}
            </div>
        }
    </div>
};

export default RewardCard;




