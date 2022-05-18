import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormDataPicker from './FormDataPicker'
import FormAutoComplete from './FormAutoComplete'
import FormInputWithSearch from './FormInputWithSearch'

export type InputsType = "text" | "select" | "autocomplete" | "date" | "searchText"

export interface InputFieldsRef{
    fieldName: string
    changeValue(value: string): void
    getValue(): string | unknown
    refreshData?: (requiredValue: string) => void
}

export const getInputField = (type: InputsType) => {
    switch(type){
        case "text":
            return FormInput
        case "select":
            return FormSelect
        case "date":
            return FormDataPicker
        case "autocomplete":
            return FormAutoComplete
        case "searchText":
            return FormInputWithSearch
        default:
            return FormInput
    }
}