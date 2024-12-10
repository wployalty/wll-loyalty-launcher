import React from "react";
import LoadingAnimation from "../Common/LoadingAnimation";
import RewardCard from "./RewardCard";
import Icon from "../Common/Icon";
import {postRequest} from "../Common/postRequest";
import LauncherLoadingAnimation from "../Common/LauncherLoadingAnimation";
import {UiLabelContext} from "../../Context";
import {getJSONData} from "../../helpers/utilities";

const RewardOpportunityList = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [rewardOpportunities, setRewardOpportunities] = React.useState([]);
    const labels = React.useContext(UiLabelContext);
    const getRewardOpportunityRewards = async () => {
        let params = {
            action: "wll_get_reward_opportunity_rewards",
            wll_nonce: wll_settings_form.render_page_nonce,
        }
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data !== null && resJSON.data !== {}) {
            setRewardOpportunities(resJSON.data.reward_opportunity)
            setLoading(false);
        } else if (resJSON.success === false && resJSON.data !== null) setLoading(false)

    }

    React.useEffect(() => {
        // let timeInterval=setTimeout(()=>setLoading(false),2000);
        // return ()=>{
        //     clearInterval(timeInterval);
        // }
        getRewardOpportunityRewards();
    }, [])

    return loading ? <LauncherLoadingAnimation height={`h-[320px]`}/> :
        rewardOpportunities.length > 0 ? <div
                className={`flex flex-col h-[320px]  overflow-y-auto  w-full px-4 lg:px-3 py-2 lg:py-3 gap-y-2 lg:gap-y-3`}>
                {
                    rewardOpportunities.map((reward, index) => {
                        return <RewardCard key={index} reward={reward} isRewardOppertunity={true}/>
                    })
                }
            </div>
            : <div
                className={`wll-rewards-list-empty-container h-[320px] flex flex-col items-center justify-center gap-y-2 `}>
                <Icon icon={`data-not-found`} fontSize={"text-4xl"}/>
                <p className={`wll-rewards-list-empty-text text-xs lg:text-sm text-light font-normal`}>{labels.common.no_result_found}</p>
            </div>
};

export default RewardOpportunityList;