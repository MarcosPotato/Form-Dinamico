import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormDataPicker from './FormDataPicker'
import FormAutoComplete from './FormAutoComplete'

type InputsType = "text" | "select" | "autocomplete" | "date"

export const getInputField = (type: InputsType) => {
    switch(type){
        case "text":
            return FormInput
        case "select":
            return FormSelect
        case "autocomplete":
            return FormDataPicker
        case "date":
            return FormAutoComplete
        default:
            return FormInput
    }
}