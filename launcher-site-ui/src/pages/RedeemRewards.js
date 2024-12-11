import React from 'react';
import {LaunchercontentContext} from "../Context";
import PageHeader from "../components/Common/PageHeader";
import RewardsList from "../components/redeem_rewards/RewardsList";
import CouponsList from "../components/redeem_rewards/CouponsList";
import RedeemTabContainer from "../components/redeem_rewards/RedeemTabContainer";
import PopupFooter from "../components/Common/PopupFooter";
import PreviewReward from "../components/redeem_rewards/PreviewReward";
import RewardOpportunityList from "../components/redeem_rewards/RewardOpportunityList";

const RedeemRewards = ({activePage}) => {
    const {launcherState} = React.useContext(LaunchercontentContext);
    const {design, content} = launcherState;
    const [activeRewards, setActiveRewards] = React.useState(launcherState.is_reward_opportunities_show ? "reward_opportunities" : "my_rewards");
    const [active, setActive] = React.useState(launcherState.is_reward_opportunities_show ? "reward_opportunities" : "rewards");
    const [previewData, setPreviewData] = React.useState({});
    const {member, guest} = content;

    const getActiveRedeemRewards = (active) => {
        switch (active) {
            case `rewards`:
                return <RewardsList previewData={{value: previewData, set: setPreviewData}} setActive={setActive}/>;
            case `coupons`:
                return <CouponsList/>;
            case `reward_opportunities`:
                return <RewardOpportunityList/>;
            case `preview`:
                return <PreviewReward previewData={{value: previewData, set: setPreviewData}}/>
        }
    }

    const handleActiveRewards = (tab) => {
        setActiveRewards(tab)
        if (tab === "my_rewards") {
            if (active === "coupons") setActive("coupons");
            else setActive("rewards")
        }
        if (tab === "reward_opportunities") setActive("reward_opportunities")
    }

    const handleRewardTab = () => {
        setActive("rewards")
    }
    const handleCouponTab = () => {
        setActive("coupons")
    }

    return <div className={`wll-rewards-container wll-relative wll-flex wll-flex-col  w-full h-[63vh] `}>
        {/*header:*/}
        <PageHeader
            page_name={"rewards"}
            title={launcherState.is_member ? member.points.redeem.title : guest.points.redeem.title}
            handleBackIcon={() => (active === "preview") ? setActive("rewards") : activePage.set("home")}
        />
        {launcherState.is_member && active !== "preview" && launcherState.is_reward_opportunities_show &&
            <div className={`wll-reward-opportunities-my-rewards-tab-container wll-flex w-full h-11  items-center   `}
                 style={{
                     borderBottom: `1px solid rgba(218, 218, 231, 1)`
                 }}
            >
                <RedeemTabContainer click={() => handleActiveRewards("reward_opportunities")}
                                    name={launcherState.labels.reward_opportunity_text}
                                    active={activeRewards === "reward_opportunities"}
                                    tab_name={"reward_opportunities"}
                />
                <RedeemTabContainer click={() => handleActiveRewards("my_rewards")}
                                    name={launcherState.labels.my_rewards_text}
                                    active={["rewards", "coupons"].includes(active)}
                                    tab_name={"my_rewards"}
                />
            </div>}
        {(launcherState.is_member && active !== "preview" && activeRewards === "my_rewards") &&
            <div className={`wll-rewards-coupons-container wll-flex w-full h-11  items-center   `}
                 style={{
                     borderBottom: `1px solid rgba(218, 218, 231, 1)`
                 }}
            >
                <RedeemTabContainer
                    tab_name={"rewards"}
                    click={handleRewardTab} name={launcherState.labels.reward_text}
                    active={["rewards", "preview"].includes(active)}/>

                <RedeemTabContainer
                    tab_name={"coupons"}
                    click={handleCouponTab} name={launcherState.labels.coupon_text}
                    active={active === "coupons"}/>
            </div>}
        {getActiveRedeemRewards(active)}
        <PopupFooter design={design} active={active}/>
    </div>
};

export default RedeemRewards;