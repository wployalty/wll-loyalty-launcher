import React from 'react';
import SidebarTabContainer from "../../Common/SidebarTabContainer";

const GuestMember = ({setActiveSidebar, choosedTypeUser}) => {
    const getActivatedSideBar = () => {
        switch (choosedTypeUser) {
            case "guest":
                return <div>
                    <SidebarTabContainer label="Welcome" tabIcon={"arrow_right"}
                                         click={() => setActiveSidebar("welcome")}/>
                    <SidebarTabContainer label="Points" tabIcon={"arrow_right"}
                                         click={() => setActiveSidebar("points")}/>
                    <SidebarTabContainer label="referrals" tabIcon={"arrow_right"}
                                         click={() => setActiveSidebar("referrals")}/>
                </div>;
            case "member":
                return <div>
                    <SidebarTabContainer label="Banner" tabIcon={"arrow_right"}
                                         click={() => setActiveSidebar("banner")}/>
                    <SidebarTabContainer label="Referrals" tabIcon={"arrow_right"}
                                         click={() => setActiveSidebar("member_referrals")}/>
                </div>
        }
    }

    return <div>
        {getActivatedSideBar()}
    </div>
};

export default GuestMember;