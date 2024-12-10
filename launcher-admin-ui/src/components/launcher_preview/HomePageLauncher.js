import Icon from "../Common/Icon";
import {CommonContext} from "../../Context";
import {getHexColor, getReplacedString} from "../../helpers/utilities";
import PopupFooter from "../Common/PopupFooter";
import React from "react";

const HomePageLauncher = ({activePage}) => {
    const {commonState, appState} = React.useContext(CommonContext);
    const {design, content} = commonState;
    let {guest} = content;
    let {welcome, points, referrals} = guest;

    const Image = ({
                       image,
                       height = "h-6",
                       width = "w-6",
                       objectFit = "object-contain"
                   }) => {
        return <img alt={"image"} className={`${height}  ${width} ${objectFit} rounded-md`}
                    src={image}
        />
    }

    return <div className={`flex flex-col shadow-launcher relative  w-full h-full `}>

        {/*header*/}
        <div className={`flex  items-center justify-between w-full py-2 px-3`}>

            {design.logo.image == "" ? <Icon fontSize={"2xl:text-xl text-md"} icon={"wployalty_logo"}
                                             opactity={`${design.logo.is_show === "none" && "opacity-0"}`}/>
                :
                <img loading={"lazy"}
                     className={`${design.logo.is_show === "none" && "opacity-0"} object-contain rounded-md h-8 w-12`}
                     src={design.logo.image}
                     alt={"logo_image"}
                />}

            <div className={`flex items-center justify-center h-8 w-8 rounded-md `}
                 style={{background: `${design.colors.theme.primary}`}}
            >
                <Icon icon={"close"}
                      fontSize={"2xl:text-2xl text-xl"}
                      color={`${getHexColor(design.colors.theme.text)}`}
                />

            </div>
        </div>

        <div className={`flex flex-col overflow-y-auto h-max max-h-[360px] w-full px-3 py-2  gap-y-2 lg:gap-y-3`}>

            {/*    join card*/}
            <div
                className={` rounded-xl  flex flex-col items-center justify-start px-3 xl:py-3 py-2 w-full gap-y-1.5 shadow-card_1`}
                style={{backgroundColor: `${design.colors.theme.primary}`}}
            >
                <div className={`flex flex-col items-center justify-start gap-y-1 text-center`}>
                    <p className={`font-extrabold text-sm  ${design.colors.theme.text === "white" ? "text-white" : "text-black"}`}
                       dangerouslySetInnerHTML={{__html: getReplacedString(welcome.texts.title)}}/>
                    <p className={` ${design.colors.theme.text === "white" ? "text-white" : "text-black"}  text-xs font-normal `}
                       dangerouslySetInnerHTML={{__html: getReplacedString(welcome.texts.description)}}/>
                </div>
                <button
                    className={`antialiased font-medium  
                flex items-center justify-center space-x-2 
                outline-none tracking-normal whitespace-nowrap 
                wp-loyalty-button text-primary px-6 py-2
                  cursor-pointer min-w-max rounded-md
                   cursor-pointer`}
                    style={{backgroundColor: `${design.colors.buttons.background} `}}
                >
                <span
                    className={`${design.colors.buttons.text === "white" ? "text-white" : "text-black"} 2xl:text-sm text-xs font-semibold `}
                    dangerouslySetInnerHTML={{__html: getReplacedString(welcome.button.text)}}/>
                </button>
                <div className={`flex items-center gap-x-1.5 text-ultra_light text-sm font-medium`}>
                    <p className={`${design.colors.theme.text === "white" ? "text-white" : "text-black"}  text-xs `}
                       dangerouslySetInnerHTML={{__html: getReplacedString(welcome.texts.have_account)}}/>
                    <span
                        className={`font-semibold 2xl:text-sm text-xs ${design.colors.theme.text === "white" ? "text-white" : "text-black"} cursor-pointer`}
                        dangerouslySetInnerHTML={{__html: getReplacedString(welcome.texts.sign_in)}}
                    />
                </div>
            </div>
            {/*    points and redeem*/}
            <div className={`flex w-full gap-x-3 `}>

                {/* ************************ earn points ********************************** */}
                <div
                    onClick={() => activePage.set("earn_points")}
                    className={`flex flex-col  shadow-launcher cursor-pointer shadow-card_1 px-3 py-2 w-1/2 gap-y-4 rounded-xl shadow-card_1`}>
                    <div className={`w-8 h-8 flex items-center justify-center`}>
                        {["", undefined].includes(guest.points.earn.icon.image) ?
                            <Icon icon={"fixed-discount"} fontSize={"2xl:text-3xl text-2xl"}/>
                            :
                            <Image
                                width={'w-full'} height={`h-full`}
                                image={guest.points.earn.icon.image}
                            />
                        }
                    </div>
                    <div className={`flex items-center w-full justify-between `}>
                        <p className={`text-xs lg:text-sm text-dark  font-semibold`}
                           dangerouslySetInnerHTML={{__html: getReplacedString(guest.points.earn.title)}}
                        />
                        <Icon icon={"arrow_right"}/>
                    </div>
                </div>
                {/*    redeem page*/}
                <div
                    onClick={() => activePage.set("redeem")}
                    className={`flex flex-col  shadow-launcher cursor-pointer  shadow-card_1 px-3 py-2 w-1/2 gap-y-4 rounded-xl shadow-card_1`}>
                    <div className={`w-8 h-8 flex items-center justify-center `}>
                        {[""].includes(points.redeem.icon.image) ?
                            <Icon icon={"redeem"} fontSize={"2xl:text-3xl text-2xl"}/>
                            :
                            <Image width={'w-full'} height={`h-full`} image={guest.points.redeem.icon.image}/>
                        }
                    </div>
                    <div className={`flex items-center w-full justify-between `}>
                        <p className={`text-xs lg:text-sm text-dark  font-semibold `}
                           dangerouslySetInnerHTML={{__html: getReplacedString(guest.points.redeem.title)}}
                        />
                        <Icon icon={"arrow_right"}/>
                    </div>
                </div>
            </div>

            {/*  REferral*/}
            {(content.guest.referrals.is_referral_action_available && appState.is_pro) && <div
                className={`flex flex-col shadow-launcher gap-y-1 2xl:gap-y-2 px-3 py-2.5 xl:py-3 rounded-xl shadow-card_1 `}>
                <p className={`2xl:text-sm text-xs text-dark  font-semibold `}
                   dangerouslySetInnerHTML={{__html: getReplacedString(referrals.title)}}/>
                <p className={`text-10px leading-4 text-light font-medium `}
                   dangerouslySetInnerHTML={{__html: getReplacedString(referrals.description)}}/>
            </div>}
        </div>
        <PopupFooter show={design.branding.is_show}/>
    </div>
}

export default HomePageLauncher;