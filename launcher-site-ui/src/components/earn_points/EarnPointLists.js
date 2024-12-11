import React from 'react';
import Icon from "../Common/Icon";
import {postRequest} from "../Common/postRequest";
import LoadingAnimation from "../Common/LoadingAnimation";
import {LaunchercontentContext} from "../../Context";
import Image from "../Common/Image";
import {getJSONData} from "../../helpers/utilities";

const EarnPointLists = ({previewData, setActive}) => {
    const {launcherState} = React.useContext(LaunchercontentContext);
    const [earnPoints, setEarnPoints] = React.useState({
        message: "",
        earn_points: []
    });
    const [loading, setLoading] = React.useState(true);

    const getEarnPoints = async () => {
        let params = {
            wll_nonce: launcherState.nonces.render_page_nonce,
            action: launcherState.is_member === true ? "wll_get_member_earn_points" : "wll_get_guest_earn_points"
        }
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data != null && resJSON.data !== {}) {
            setEarnPoints(resJSON.data);
            setLoading(false);
        }
    }

    React.useEffect(() => {
        getEarnPoints();
    }, [previewData])

    return loading ? <LoadingAnimation/> :
        earnPoints.earn_points.length > 0 ?
            <div
                className={`wll-earn-points-list-container wll-flex wll-flex-col h-full overflow-y-auto w-full px-4 lg:px-3 py-2 lg:py-3 gap-y-2 lg:gap-y-3`}>
                {earnPoints.earn_points.map((earn_point) => {
                    return earn_point.is_show_way_to_earn == "1" &&
                        <div key={earn_point.id}
                             onClick={() => {
                                 previewData.set(earn_point);
                                 setActive("preview")
                             }}
                             className={`wll-earn-points-${earn_point.action_type}-container wll-flex cursor-pointer w-full shadow-card_1 rounded-xl items-center justify-between bg-white gap-x-2 lg:gap-x-3 px-2 lg:px-3 py-3 lg:py-4 `}>
                            <div
                                className={`wll-earn-points-${earn_point.action_type}-inner-container wll-flex items-center justify-start w-full lg:gap-x-4 gap-x-3`}>
                                <div
                                    className={`wll-earn-points-${earn_point.action_type}-icon-container lg:w-10 w-8 h-8 lg:h-8 wll-flex items-center justify-center`}>
                                    {["", null, undefined, "null", "undefined"].includes(earn_point.icon) ?
                                        <Icon icon={`${earn_point.action_type}`}
                                              fontSize={`text-3xl lg:text-4xl`}/> :
                                        <Image height={"h-8"} width={"w-8"}
                                               image={earn_point.icon}
                                        />
                                    }
                                </div>
                                <div
                                    className={`wll-earn-points-${earn_point.action_type}-title-desc-container wll-flex wll-flex-col gap-y-1.5 w-full `}>
                                    <p
                                        dangerouslySetInnerHTML={{__html: earn_point.name}}
                                        className={`wll-earn-points-${earn_point.action_type}-title text-sm lg:text-md font-bold text-dark `}
                                    />
                                    <p className={`wll-earn-points-${earn_point.action_type}-description text-xs lg:text-sm font-normal text-light`}
                                       dangerouslySetInnerHTML={{__html: earn_point.campaign_title_discount}}
                                    />
                                </div>
                            </div>
                            <div className={`wll-earn-points-${earn_point.action_type}-arrow-icon-container`}>
                                <Icon click={() => setActive("preview")} icon={"arrow_right"}/>
                            </div>
                        </div>
                })}
            </div> :
            <div
                className={`wll-earn-points-list-empty-container wll-flex wll-flex-col items-center justify-center gap-y-2 h-full`}>
                <Icon icon={`data-not-found`} fontSize={"text-4xl"}/>
                <p className={`wll-earn-points-list-empty-message text-xs lg:text-sm text-light font-normal`}>{earnPoints.message}</p>
            </div>
        ;
};

export default EarnPointLists;