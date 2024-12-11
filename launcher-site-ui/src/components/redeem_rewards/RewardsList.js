import React from 'react';
import LoadingAnimation from "../Common/LoadingAnimation";
import {postRequest} from "../Common/postRequest";
import {LaunchercontentContext} from "../../Context";

import RewardCard from "./RewardCard";
import Icon from "../Common/Icon";
import {getJSONData} from "../../helpers/utilities";

const RewardsList = ({previewData, setActive}) => {
    const [loading, setLoading] = React.useState(true);
    const [applyRewardId, setApplyRewardId] = React.useState("");
    const [applyRewardLoading, setApplyRewardLoading] = React.useState(false);
    const [rewards, setRewards] = React.useState({
        redeem_data: [],
        message: ""
    });
    const {launcherState} = React.useContext(LaunchercontentContext);

    const getRewards = async () => {
        let params = {
            wll_nonce: launcherState.nonces.render_page_nonce,
            action: launcherState.is_member === true ? "wll_get_member_redeem_rewards" : "wll_get_guest_redeem_rewards",
        }
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data !== null && resJSON.data !== {}) {
            setRewards(resJSON.data);
            setLoading(false);
        } else if (resJSON.success === false && resJSON.data !== null) {
            setLoading(false);
        }
    }


    React.useEffect(() => {
        getRewards();
    }, []);

    return loading ? <LoadingAnimation/> :
        rewards.redeem_data.length > 0 ? <div
                className={`wll-rewards-list-container wll-flex wll-flex-col h-full overflow-y-auto  w-full px-4 lg:px-3 py-2 lg:py-3 gap-y-2 lg:gap-y-3`}>
                {rewards.redeem_data.map((reward) => {
                        return reward.is_show_reward == "1" &&
                            <RewardCard
                                key={reward.id}
                                previewData={previewData}
                                setActive={setActive}
                                reward={reward}
                                applyRewardId={{value: applyRewardId, set: setApplyRewardId}}
                                applyRewardLoading={{value: applyRewardLoading, set: setApplyRewardLoading}}
                            />
                    }
                )}
            </div> :
            <div
                className={`wll-rewards-list-empty-container wll-flex wll-flex-col items-center justify-center gap-y-2 h-full`}>
                <Icon icon={`data-not-found`} fontSize={"text-4xl"}/>
                <p className={`wll-rewards-list-empty-text text-xs lg:text-sm text-light font-normal`}>{rewards.message}</p>
            </div>
};

export default RewardsList;