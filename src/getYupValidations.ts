import * as Yup from "yup"

interface GetValidationsParams{
    validationType: string
    isRequired: boolean
    label: string
    validationMessage?: string
}

Yup.addMethod(Yup.string, "getYupValidation", function(type: string, validationMessage: string){
    if(type === "text"){
        return this
    }

    if(type === "email"){
        return this.email(validationMessage)
    }

    return this
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
    console.log({ validationType, isRequired })

    if(isRequired){
        return Yup.string().getYupValidation(validationType, validationMessage as string).required(`${label} é obrigatóri${getPrefix(label)}`)
    } else{
        return Yup.string().getYupValidation(validationType, validationMessage as string).notRequired()
    }
}