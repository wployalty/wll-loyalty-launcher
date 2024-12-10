import React from 'react';
import CouponCard from "./CouponCard";
import {CommonContext} from "../../Context";
import {postRequest} from "../Common/postRequest";
import LauncherLoadingAnimation from "../Common/LauncherLoadingAnimation";
import {getJSONData} from "../../helpers/utilities";

const CouponsList = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [coupons, setCoupons] = React.useState([]);
    const {commonState} = React.useContext(CommonContext);
    const {design} = commonState;
    const [copied, setCopied] = React.useState("");
    const getCoupons = async () => {

        let params = {
            action: "wll_get_member_redeem_coupons",
            wll_nonce: wll_settings_form.render_page_nonce,
        }
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data !== null && resJSON.data !== {}) {
            setCoupons(resJSON.data.redeem_coupons)
            setLoading(false);
        } else if (resJSON.success === false && resJSON.data !== null) setLoading(false)
    }


    React.useEffect(() => {
        getCoupons();
        // setTimeout(() => setLoading(false), 200)
    }, [])

    return loading ? <LauncherLoadingAnimation height={`h-[320px]`}/> : <div
        className={`flex flex-col h-[320px] overflow-y-auto  w-full px-4 lg:px-3 py-2 lg:py-3 gap-y-2 lg:gap-y-3`}>
        {coupons.map((coupon, index) => {
            return <CouponCard key={index} coupon={coupon} design={design} copied={{val: copied, set: setCopied}}/>
        })}
    </div>
};

export default CouponsList;