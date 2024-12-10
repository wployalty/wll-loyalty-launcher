import React from 'react';
import PageHeader from "../Common/PageHeader";
import {CommonContext, UiLabelContext} from "../../Context";
import RewardsList from "../redeem_rewards/RewardsList";
import CouponsList from "../redeem_rewards/CouponsList";
import RedeemTabContainer from "../redeem_rewards/RedeemTabContainer";
import PopupFooter from "../Common/PopupFooter";
import RewardOpportunityList from "../redeem_rewards/RewardOpportunityList";

const RedeemPageLauncher = ({activePage, activeSidebar}) => {
    let labels = React.useContext(UiLabelContext);
    const {commonState,} = React.useContext(CommonContext);
    const [activeRewards, setActiveRewards] = React.useState("reward_opportunities");
    const [active, setActive] = React.useState("reward_opportunities");

    const {design,} = commonState;

    const getActiveRedeemRewards = (active) => {
        switch (active) {
            case `rewards`:
                return <RewardsList is_member={activeSidebar === "member"}/>;
            case `coupons`:
                return <CouponsList/>;
            case `reward_opportunities`:
                return <RewardOpportunityList/>;
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

    return <div className={`h-full flex flex-col relative  w-full `}>
        {/*header:*/}
        <PageHeader title={labels.common.redeem}
                    handleBackIcon={() => activePage.set("home")}
        />
        {activeSidebar === "member" && <div className={`flex w-full h-12 items-center   `}
                                            style={{
                                                borderBottom: `1px solid rgba(218, 218, 231, 1)`
                                            }}
        >


            <RedeemTabContainer click={() => handleActiveRewards("reward_opportunities")}
                                name={labels.common.rewards_tab.reward_opportunity}
                                active={activeRewards === "reward_opportunities"}/>
            <RedeemTabContainer click={() => handleActiveRewards("my_rewards")}
                                name={labels.common.rewards_tab.my_rewards}
                                active={["rewards", "coupons"].includes(active)}/>
        </div>}
        {(activeSidebar === "member" && activeRewards === "my_rewards") &&
            <div className={`flex w-full h-12 items-center border-b border-card_border `}>
                <RedeemTabContainer click={handleRewardTab} name={labels.common.rewards_title}
                                    active={active === "rewards"}/>
                <RedeemTabContainer click={handleCouponTab} name={labels.common.coupons_title}
                                    active={active === "coupons"}/>
            </div>}
        {getActiveRedeemRewards(active)}
        <PopupFooter show={design.branding.is_show}/>
    </div>
};

export default RedeemPageLauncher;