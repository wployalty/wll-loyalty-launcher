import React from 'react';
import InputWrapper from "../Common/InputWrapper";
import DropdownWrapper from "../Common/DropdownWrapper";
import {getChosenLabel, getErrorMessage} from "../../helpers/utilities";
import Input from "../Common/Input";
import LabelInputContainer from "../Common/LabelInputContainer";
import {CommonContext, UiLabelContext} from "../../Context";
import DeleteIconContainer from "../Common/DeleteIconContainer";

const PageCondition = ({updateConditionFields, key_value, item, deleteCondition, errorList, errors}) => {
    const labels = React.useContext(UiLabelContext)
    const [conditionState, setConditionState] = React.useState({
        operator: {value: "home_page", label: labels.common.home_text},
        url_path: "",
    });
    const operator_list = [
        {value: "home_page", label: labels.common.home_text},
        {value: "contains", label: labels.common.contains_text},
        {value: "do_not_contains", label: labels.common.do_not_contains_text},
    ];
    const handlePathField = (e) => {
        let data = {...conditionState};
        data.url_path = e.target.value;
        setConditionState(data);
        updateConditionFields(key_value, data)
    };

    const handleOperator = (item) => {
        let data = {...conditionState};
        data.operator = item;
        setConditionState(data);
        updateConditionFields(key_value, data)
    }

    React.useEffect(() => {
        if (item !== undefined) {
            setConditionState(item)
            updateConditionFields(key_value, item);
        } else {
            updateConditionFields(key_value, conditionState);
        }
    }, []);

    return <div className={`flex flex-col justify-center gap-x-2 w-full`}>
        <p>{labels.common.url_text}</p>

        <div className={`flex items-start w-full gap-x-2 relative`}>
            <DropdownWrapper
                width={`${conditionState.operator.value === "home_page" ? "w-[85%]" : "w-1/2"}`}
                options={operator_list}
                label={conditionState.operator.label}
                value={conditionState.operator.value}
                handleDropDownClick={handleOperator}
            />
            {["contains", "do_not_contains"].includes(conditionState.operator.value) &&
                <LabelInputContainer
                    onChange={handlePathField}
                    value={conditionState.url_path}
                    width={"w-1/3"}
                    gap={false}
                    error={errorList.includes(`launcher.show_conditions.${key_value}.url_path`)}
                    error_message={errorList.includes(`launcher.show_conditions.${key_value}.url_path`) && getErrorMessage(errors, `launcher.show_conditions.${key_value}.url_path`)}
                />}
            <DeleteIconContainer title={labels.common.delete_text} extraCss={"absolute right-0 bottom-0"}
                                 click={() => deleteCondition(key_value)}/>
        </div>
    </div>
};

export default PageCondition;