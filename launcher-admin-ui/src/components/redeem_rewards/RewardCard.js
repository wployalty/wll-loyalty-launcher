import React from 'react';
import {CommonContext, UiLabelContext} from "../../Context";
import Icon from "../Common/Icon";

const RewardCard = ({reward, is_member, isRewardOppertunity = false}) => {
    const {commonState} = React.useContext(CommonContext);
    const labels = React.useContext(UiLabelContext)
    let {design} = commonState;
    return <div key={reward.id}
                className={`flex flex-col w-full shadow-card_1 rounded-xl  bg-white  px-2 lg:px-3 py-2 xl:py-3 gap-y-2 xl:gap-y-3 `}>
        <div className={` flex items-center gap-x-2  w-full justify-between`}>
            <div className={`flex items-center gap-x-3 lg:gap-x-4 `}>
                <Icon icon={`${reward.icon}`} fontSize={`text-3xl lg:text-4xl`}/>
                <div className={`flex flex-col gap-y-1 w-full `}>
                    <p className={'text-xs xl:text-sm font-bold text-dark'}>
                        {reward.title}
                    </p>
                    <p className={`text-xs xl:text-sm font-normal text-light`}
                       dangerouslySetInnerHTML={{__html: reward.action_text}}
                    />
                </div>
            </div>

        </div>
        <p className={`text-xs xl:text-sm font-normal text-light`}>
            {reward.description}
        </p>
        {is_member && !isRewardOppertunity && <div className={`flex items-center justify-center w-full  `}>
            <button className={`${design.colors.buttons.text === "white" ? "text-white" : "text-black"}
             w-max h-8 px-3 py-2 rounded-md
             `}
                    style={{
                        background: `${design.colors.buttons.background}`,
                        // color: `${design.colors.buttons.text}`
                    }}
            >
                {labels.common.redeem}
            </button>

        </div>}
    </div>
};

export default RewardCard;