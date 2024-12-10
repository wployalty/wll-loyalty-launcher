import React from 'react';
import {postRequest} from "../Common/postRequest";
import PageHeader from "../Common/PageHeader";
import {CommonContext, UiLabelContext} from "../../Context";
import EarnPointCard from "../Common/EarnPointCard";
import PopupFooter from "../Common/PopupFooter";
import LauncherLoadingAnimation from "../Common/LauncherLoadingAnimation";
import {getJSONData} from "../../helpers/utilities";

const EarnPageLauncher = ({activePage}) => {
    const {commonState} = React.useContext(CommonContext);
    let labels = React.useContext(UiLabelContext);
    const {design,} = commonState;
    const [earnPoints, setEarnPoints] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const getEarnPoints = async () => {
        let params = {
            action: "wll_get_member_earn_points",
            wll_nonce: wll_settings_form.render_page_nonce,
        }
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data != null && resJSON.data !== {}) {
            setEarnPoints(resJSON.data.earn_points);
            setLoading(false);
        }
    }

    React.useEffect(() => {
        getEarnPoints();
    }, [])
    return <div className={`h-full flex flex-col relative w-full  `}>
        {/*header:*/}
        <PageHeader title={labels.common.earn}
                    handleBackIcon={() => activePage.set("home")}
        />
        {loading ? <LauncherLoadingAnimation height={"h-[360px]"}/> :
            <div
                className={`flex flex-col overflow-y-auto h-[360px] w-full px-4 lg:px-3 py-2 lg:py-3 gap-y-2 lg:gap-y-3`}>
                {earnPoints.map((earn_point, index) => {
                    return <EarnPointCard key={index} earn_point={earn_point}/>
                })
                }
            </div>}
        <PopupFooter show={design.branding.is_show}/>
    </div>
};

export default EarnPageLauncher;