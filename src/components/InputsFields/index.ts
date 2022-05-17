import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormDataPicker from './FormDataPicker'
import FormAutoComplete from './FormAutoComplete'

type InputsType = "text" | "select" | "autocomplete" | "date"

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
        default:
            return FormInput
    }
}