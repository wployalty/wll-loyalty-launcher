import React from 'react';
import LoadingAnimation from "../Common/LoadingAnimation";

import Icon from "../Common/Icon";
import RewardCard from "./RewardCard";
import {postRequest} from "../Common/postRequest";
import {LaunchercontentContext} from "../../Context";
import {getJSONData} from "../../helpers/utilities";

const RewardOpportunityList = (props) => {
    const [loading, setLoading] = React.useState(true);
    // const [isReadMore, setIsReadMore] = React.useState("");
    const {launcherState} = React.useContext(LaunchercontentContext);
    const [rewardOpportunities, setRewardOpportunities] = React.useState({
        reward_opportunity: [],
        message: "No rewards found...!"
    });


    const getRewardOpportunityRewards = async () => {
        let params = {
            action: "wll_get_reward_opportunity_rewards",
            wll_nonce: launcherState.nonces.render_page_nonce,
        }
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data !== null && resJSON.data !== {}) {
            setRewardOpportunities(resJSON.data)
            setLoading(false);
        } else if (resJSON.success === false && resJSON.data !== null) {
            setLoading(false);
        }
    }


    React.useEffect(() => {
        getRewardOpportunityRewards();
    }, [])

    return loading ? <LoadingAnimation/> :
        rewardOpportunities.reward_opportunity.length > 0 ? <div
            className={`wll-reward-opportunity-container wll-flex wll-flex-col h-full overflow-y-auto  w-full px-4 lg:px-3 py-2 lg:py-3 gap-y-2 lg:gap-y-3`}>
            {rewardOpportunities.reward_opportunity.map((reward) => <RewardCard isRewardOpportunity={true}
                                                                                key={reward.id}
                                                                                reward={reward}
                    // isReadMore={{
                    //     val: isReadMore,
                    //     set: setIsReadMore
                    // }}
                />
            )}
        </div> : <div
            className={`wll-reward-opportunity-empty-message-container wll-flex wll-flex-col items-center justify-center gap-y-2 h-full`}>
            <Icon icon={`data-not-found`} fontSize={"text-4xl"}/>
            <p className={`wll-reward-opportunity-empty-message-text text-xs lg:text-sm text-light font-normal`}>{rewardOpportunities.message}</p>
        </div>
};

export default RewardOpportunityList;