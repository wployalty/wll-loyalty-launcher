import React from 'react';
import RewardCard from "./RewardCard";
import {postRequest} from "../Common/postRequest";
import LauncherLoadingAnimation from "../Common/LauncherLoadingAnimation";
import {getJSONData} from "../../helpers/utilities";

const RewardsList = ({is_member}) => {
    const [loading, setLoading] = React.useState(true);
    const [rewards, setRewards] = React.useState([]);

    const getRewards = async () => {
        let params = {
            action: "wll_get_member_redeem_rewards",
            wll_nonce: wll_settings_form.render_page_nonce,
        }
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data !== null && resJSON.data !== {}) {
            setRewards(resJSON.data.redeem_data)
            setLoading(false);
        } else if (resJSON.success === false && resJSON.data !== null) setLoading(false)

    }

    React.useEffect(() => {
        getRewards();
    }, [])
    return loading ? <LauncherLoadingAnimation height={`h-[320px]`}/> :
        <div
            className={`flex flex-col ${is_member ? "h-[320px]" : "h-[360px]"}  overflow-y-auto  w-full px-4 lg:px-3 py-2 lg:py-3 gap-y-2 lg:gap-y-3`}>
            {
                rewards.map((reward, index) => {
                    return <RewardCard is_member={is_member} key={index} reward={reward}/>
                })
            }
        </div>
};

export default RewardsList;