import * as Yup from "yup"
import { GetValidationsParams } from "../../../@types/dynamicValidations"

import { formValidations } from './formValidations'

Yup.addMethod(Yup.string, "getYupValidation", function(type: string, validationMessage: string){
    const validation = formValidations({
        yupInstance: this,
        type,
        validationMessage
    })

    return validation 
})

const getPrefix = (string: string) => {
    const lastLetter = string.split("")[string.split("").length - 1].toUpperCase()

    if(lastLetter === "A"){
        return "a"
    } else{
        return "o"
    }
}

export const getValidationsForm = ({ validationType, isRequired, label, validationMessage }: GetValidationsParams) => {
    if(isRequired){
        return Yup.string().getYupValidation(validationType, validationMessage as string).required(`${label} é obrigatóri${getPrefix(label)}`)
    } else{
        return Yup.string().getYupValidation(validationType, validationMessage as string).notRequired()
    }
}