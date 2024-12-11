import React from 'react';
import Icon from "../Common/Icon";
import Button from "../Common/Button";
import {LaunchercontentContext} from "../../Context";
import {postRequest} from "../Common/postRequest";
import {
    CopyTOClipBoard,
    getDateValue,
    getMonthValue,
    getFullYearValue, getDatePadStart, validateNumber, getHtmlDecodeString, getReadableDateFormat, getJSONData
} from "../../helpers/utilities";
import Image from "../Common/Image";
import BirthdayInputWrapper from "../Common/BirthdayInputWrapper";
import LoadingIcon from "../Common/LoadingIcon";
import dateFormat from "dateformat";

const PreviewEarnPoint = ({previewData}) => {
    const {launcherState} = React.useContext(LaunchercontentContext);
    const {design, content} = launcherState;
    const [loadingButton, setLoadingButton] = React.useState(false);
    let [copy, setCopy] = React.useState(false);
    const [birthdayLoading, setBirthdayLoading] = React.useState(false);
    const {action_type} = previewData.value
    const {colors} = design;
    const [editDate, setEditDate] = React.useState(false);
    const [isBirthdateAdded, setIsBirthdateAdded] = React.useState(false);
    const [birthdate, setBirthdate] = React.useState({
        date: getDateValue(previewData.value.birth_date),
        month: getMonthValue(previewData.value.birth_date),
        year: getFullYearValue(previewData.value.birth_date)
    })

    const handleBirthdayDate = async (value) => {
        let params = {
            campaign_id: value.id,
            wlr_nonce: launcherState.nonces.wlr_reward_nonce,
            birth_date: `${birthdate.year}-${getDatePadStart(birthdate.month)}-${getDatePadStart(birthdate.date)}`,
            action: "wlr_update_birthday"
        };
        setBirthdayLoading(true);
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success === true && resJSON.data != null && resJSON.data !== {}) {
            if (launcherState.is_edit_after_birth_day_date === "yes") {
                setIsBirthdateAdded(false)
            } else setIsBirthdateAdded(true)
            let data = {...previewData.value};
            data.birth_date = params.birth_date;
            previewData.set({
                ...data,
                birth_date: params.birth_date,
                display_birth_date: resJSON.data.display_format_date
            });
            setBirthdayLoading(false)
            setEditDate(false);
        } else if (resJSON.success === false && resJSON.data !== null) {
            setBirthdayLoading(false)
            setEditDate(false);
        }
    }
    const handleEditBirthday = () => {
        if (previewData.value.birth_date === "") setBirthdate({...birthdate, date: "", month: "", year: ""})
        setEditDate(true)
    }

    const handleCopyReferralCode = (url) => {

        const event = new CustomEvent('wlr_copy_link_custom_url', {
            detail: {
                referralUrl: url,
            }
        });

        document.dispatchEvent(event)
        if(window.wlr_updated_referral_code){
            CopyTOClipBoard(window.wlr_updated_referral_code);
        }else{
            CopyTOClipBoard(url);
        }
        setCopy(true);
    }

    const handleFollowShare = async (value) => {
        let click_social_status = [];
        let params = {
            action: `wlr_follow_${value.action_type}`,
            wlr_nonce: launcherState.nonces.apply_share_nonce,
            id: value.id,
        };
        setLoadingButton(true);
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success) {
            launcherState.is_followup_redirect ? window.open(value.share_url, value.action_type, "width=626, height=436 ") : window.open(value.share_url, '_blank');
            if (!click_social_status.includes(value.action_type)) {
                click_social_status.push(value.action_type);
            }
            setLoadingButton(false);
        } else if (resJSON.success === false) {
            setLoadingButton(false);
        }
    }

    const handleSocialShare = async (url, action, nonce) => {
        let click_social_status = [];
        let params = {
            action: `wlr_social_${action}`,
            wlr_nonce: nonce,
        };
        setLoadingButton(true);
        let json = await postRequest(params);
        let resJSON = getJSONData(json.data);
        if (resJSON.success) {
            window.open(url, action, 'width=626,height=436');
            if (!click_social_status.includes(action)) {
                click_social_status.push(action);
            }
            setLoadingButton(false);
        } else if (resJSON.success === false) {
            setLoadingButton(false);
        }
    }

    const getBirthdateInputLabel = (date_order_field) => {
        switch (date_order_field) {
            case `d`:
                return {
                    placeholder: "dd",
                    label: launcherState.labels.birth_date_label.day,
                    field: "date",
                };
            case `m`:
                return {
                    placeholder: "mm",
                    label: launcherState.labels.birth_date_label.month,
                    field: "month",
                };
            case `Y`:
                return {
                    placeholder: "yyyy",
                    label: launcherState.labels.birth_date_label.year,
                    field: "year",
                };
        }
    }

    const getFieldCharLength = (field) => {
        return ["date", "month"].includes(field) ? 2 : 4;
    };

    const handleBirthdayFieldChange = (e, field) => {
        let data = {...birthdate};
        data[field] = validateNumber(e.target.value, getFieldCharLength(field));
        setBirthdate(data);
    }

    const getBirthdayFieldValue = (date_order_field) => {
        switch (date_order_field) {
            case `d`:
                return birthdate.date;
            case `m`:
                return birthdate.month;
            case `Y`:
                return birthdate.year;
        }
    }

    //case 1: month: 2 char, date: 2 char, year 4
    //case 2: min-month: 1 char, date: 1 char, Year: 4
    // case 3: 0-9 only allowed
    // case 4: month: 12 max, day: 31 days, year: current year
    // case 5: year start from 1823

    const birthdateFieldValidation = (field) => {
        if (field === "date") {
            return !/^(0?[1-9]|[1-2][0-9]|3[0-1])$/.test(birthdate.date);
        } else if (field === "month") {
            return !/^(0?[1-9]|1[0-2])$/.test(birthdate.month);
        } else if (field === "year") {
            return (!/^[1-9][0-9]{3}$/.test(birthdate.year) || !(birthdate.year > 1823) || !(birthdate.year <= new Date().getFullYear()));
        }
    }

    return <div
        className={`wll-preview-${action_type}-container  wll-flex w-full h-full wll-flex-col gap-y-4 px-5  lg:gap-y-5 overflow-y-auto wll-relative`}
        style={{
            padding: "24px",
            paddingBottom: "50px",
        }}
    >
        <div
            className={`wll-preview-${action_type}-details-container wll-flex items-center justify-start w-full lg:gap-x-3 gap-x-2`}>

            <div className={`wll-preview-${action_type}-icon-container w-8 h-8 wll-flex items-center justify-center  `}>
                {previewData.value.icon == "" ? <Icon icon={`${previewData.value.action_type}`}
                                                      fontSize={`text-3xl lg:text-4xl`}/> :
                    <Image height={"h-8"} width={"w-8"}
                           image={previewData.value.icon}
                    />
                }
            </div>
            <div className={`wll-preview-${action_type}-name wll-flex wll-flex-col gap-y-1.5 w-full `}>
                <div className={`wll-flex w-full gap-x-1.5 items-center `}>
                    <p
                        dangerouslySetInnerHTML={{__html: previewData.value.name}}
                        className={'text-sm lg:text-md font-bold text-dark'} style={{
                        width: "90%"
                    }}/>
                    {(previewData.value.is_achieved && ["whatsapp_share", "email_share", "twitter_share", "facebook_share", "birthday", "signup", "followup_share"].includes(previewData.value.action_type)) &&
                        <div style={{
                            borderColor: design.colors.theme.primary,
                        }}
                             className={`wll-preview-${action_type}-achieved-container border border-solid rounded-md  h-8 w-max wll-flex items-center gap-x-2 px-2.5 py-2 `}>
                            <Icon icon={"tick_circle"}/>
                            <p className={`wll-preview-${action_type}-achieved-text text-dark text-xs font-medium  `}>
                                {previewData.value.achieved_text}
                            </p>
                        </div>}
                </div>
                <div className={`wll-flex items-center justify-start w-full gap-x-2`}>
                    <p className={`wll-preview-${action_type}-discount-desc text-xs lg:text-sm font-normal text-light`}
                       dangerouslySetInnerHTML={{__html: previewData.value.campaign_title_discount}}
                    />
                </div>

            </div>
        </div>

        {/*------------------birth day-=-------------------*/}
        {(previewData.value.action_type === "birthday" && launcherState.is_member === true) &&
            <div
                className={`wll-preview-${action_type}-container wll-flex  ${editDate ? "items-end" : "items-center"} gap-x-1.5  w-full `}>
                {
                    editDate ?
                        <div
                            className={`wll-birthday-campaign-date-input-container wll-flex gap-x-1.5 lg:gap-x-2 items-center `}>
                            {
                                previewData.value.birthday_date_format.format.map((field_order, i) => {
                                    return <BirthdayInputWrapper
                                        key={i}
                                        type={"text"}
                                        id={`wll-birthday-campaign-${getBirthdateInputLabel(field_order).field}`}
                                        height={"h-10"}
                                        label={getBirthdateInputLabel(field_order).label}
                                        placeHolder={getBirthdateInputLabel(field_order).placeholder}
                                        value={getBirthdayFieldValue(field_order)}
                                        onChange={(e) => handleBirthdayFieldChange(e, getBirthdateInputLabel(field_order).field)}
                                        field={getBirthdateInputLabel(field_order).field}
                                        error={birthdateFieldValidation(getBirthdateInputLabel(field_order).field)}
                                    />
                                })
                            }
                        </div>
                        :
                        <p className={`wll-preview-${action_type}-campaign-date-text wll-flex items-center justify-center w-1/2 text-light text-sm 2xl:text-md`}>{previewData.value.display_birth_date === "" ? "-" : previewData.value.display_birth_date}</p>
                }
                {previewData.value.show_edit_birthday && !isBirthdateAdded && previewData.value.is_allow_edit &&
                    <div
                        className={`wll-preview-${action_type}-button-container wll-flex items-center justify-center w-1/2`}>
                        {
                            birthdayLoading ? <LoadingIcon/> :
                                <Button
                                    width={'w-full'}
                                    height={"h-10"}
                                    textColor={`${colors.buttons.text}`}
                                    id={`wll-preview-${action_type}-update-button`}
                                    bgColor={`${colors.buttons.background}`}
                                    disabled={editDate && (birthdateFieldValidation("date") || birthdateFieldValidation("month") || birthdateFieldValidation("year"))}
                                    click={() => editDate ? handleBirthdayDate(previewData.value) : handleEditBirthday()}
                                >{editDate ? previewData.value.update_text : previewData.value.edit_text}
                                </Button>
                        }
                    </div>}
            </div>
        }
        <p className={`wll-preview-${action_type}-description text-sm lg:text-md font-normal text-light  `}
           style={{
               textIndent: "32px"
           }}
           dangerouslySetInnerHTML={{__html: previewData.value.description}}
        />

        {/*------------- referral  ---------------------------*/}
        {(["referral"].includes(previewData.value.action_type) && launcherState.is_member === true && content.member.referrals.is_referral_action_available) &&
            <div
                className={`wll-preview-${action_type}-referral-container border border-card_border border-solid wll-flex h-8 items-center rounded-md w-full`}>
                <p className={`wll-preview-${action_type}-referral-url p-2  whitespace-nowrap w-[90%] overflow-hidden overflow-ellipsis text-light 2xl:text-sm text-xs font-medium `}
                   style={{
                       direction: "ltr"
                   }}
                >
                    {launcherState.content.member.referrals.referral_url}</p>
                <span
                    className={`wll-preview-${action_type}-referral-copy-icon-container wll-flex h-8 items-center justify-center px-3 right-0 rounded-md w-8`}
                    style={{background: `${design.colors.theme.primary}`}}
                >
                                <Icon click={() => handleCopyReferralCode(previewData.value.referral_url)}
                                      fontSize={"text-md"}
                                      icon={`${copy ? "tick" : "copy"}`} color={"#ffffff"}/>
                             </span>
            </div>
        }
        {/*----------------------social share------------------------------*/}
        {


            (["whatsapp_share", "email_share", "twitter_share", "facebook_share"].includes(previewData.value.action_type) && launcherState.is_member === true && content.member.referrals.is_referral_action_available) &&
            <div
                className={`wll-preview-${action_type}-social-share-button wll-flex w-full items-center justify-center`}>
                {loadingButton ? <LoadingIcon/> : <Button
                    width={'w-max'}
                    disabled={loadingButton}
                    textColor={`${colors.buttons.text}`}
                    bgColor={`${colors.buttons.background}`}
                    click={() => handleSocialShare(getHtmlDecodeString(previewData.value.action_url), previewData.value.action_type, launcherState.nonces.apply_share_nonce)}
                >{previewData.value.button_text}
                </Button>}
            </div>
        }
        {/*-------------------follow share-------------*/}
        {(["followup_share"].includes(previewData.value.action_type) && launcherState.is_member === true) &&
            <div
                className={`wll-preview-${action_type}-follow-share-button wll-flex w-full items-center justify-center`}>
                {loadingButton ? <LoadingIcon/> : <Button
                    width={'w-max'}
                    disabled={loadingButton}
                    textColor={`${colors.buttons.text}`}
                    bgColor={`${colors.buttons.background}`}
                    click={() => handleFollowShare(previewData.value)}
                >{previewData.value.button_text}
                </Button>}
            </div>}
        {/*-----------------sign up action for guest------------------------*/}
        {/*{(["signup"].includes(previewData.value.action_type) && launcherState.is_member === false) &&*/}
        {/*    <div className={`wll-flex w-full items-center justify-center`}>*/}
        {/*        <Button*/}
        {/*            width={'w-max'}*/}
        {/*            textColor={`${colors.buttons.text}`}*/}
        {/*            bgColor={`${colors.buttons.background}`}*/}
        {/*            click={() => window.open(previewData.value.action_url)}*/}
        {/*        >{previewData.value.button_text}*/}
        {/*        </Button>*/}
        {/*    </div>}*/}


    </div>
};

export default PreviewEarnPoint;