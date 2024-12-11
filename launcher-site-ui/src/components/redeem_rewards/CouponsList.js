import React from 'react';
import LoadingAnimation from "../Common/LoadingAnimation";
import {LaunchercontentContext} from "../../Context";
import {postRequest} from "../Common/postRequest";
import Icon from "../Common/Icon";
import CouponCard from "./CouponCard";
import {getJSONData} from "../../helpers/utilities";

const CouponsList = () => {
    const [loading, setLoading] = React.useState(true);
    const {launcherState} = React.useContext(LaunchercontentContext);
    const [coupons, setCoupons] = React.useState({
        redeem_coupons: [],
        message: ""
    });
    const [copied, setCopied] = React.useState("");
    const [applyCouponId, setApplyCouponId] = React.useState("");
    const [applyLoading, setApplyLoading] = React.useState(false);
    const getCoupons = async () => {
        let params = {
            action: "wll_get_member_redeem_coupons",
            wll_nonce: launcherState.nonces.render_page_nonce,
        }
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data !== null && resJSON.data !== {}) {
            setCoupons(resJSON.data)
            setLoading(false);
        } else if (resJSON.success === false && resJSON.data !== null) {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        getCoupons()
    }, [])

    return loading ? <LoadingAnimation/> :
        coupons.redeem_coupons.length > 0 ? <div
                className={`wll-coupon-list-container wll-flex wll-flex-col h-full overflow-y-auto  w-full px-4 lg:px-3 py-2 lg:py-3 gap-y-2 lg:gap-y-3`}>
                {coupons.redeem_coupons.map((coupon) => <CouponCard
                        key={coupon.id}
                        setCopied={setCopied}
                        copied={copied}
                        coupon={coupon}
                        apply={{value: applyCouponId, set: setApplyCouponId}}
                        applyLoading={{value: applyLoading, set: setApplyLoading}}
                    />
                )}
            </div> :
            <div
                className={`wll-empty-coupon-list-container wll-flex wll-flex-col items-center justify-center gap-y-2 h-full`}>
                <Icon icon={`data-not-found`} fontSize={"text-4xl"}/>
                <p className={`wll-empty-coupon-list-text text-xs lg:text-sm text-light font-normal`}
                   dangerouslySetInnerHTML={{__html: coupons.message}}
                />
            </div>
};

export default CouponsList;