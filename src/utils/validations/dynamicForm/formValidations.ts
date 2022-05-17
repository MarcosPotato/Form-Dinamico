import { ValidationsProps, YupIntance } from '../../../@types/dynamicValidations'
import { validadeCNPJ, validadeCPF } from '../validateDocuments'

export const formValidations = ({ type, validationMessage, yupInstance }: ValidationsProps): YupIntance => {

    if(!yupInstance){
        throw new Error("Yup Instance must be passed")
    }

    switch(type){
        case "text":
            return yupInstance
        case "email":
            return yupInstance.email(validationMessage)
        case "verify_length":
            return yupInstance.max(8, validationMessage)
        case "document":
            return yupInstance.test("test-document-type", validationMessage, function(value){
                const { path, createError } = this

                const document = value || ""
                const filteredValue = document.replace(/\D/g, "")

                if(filteredValue.length === 14){
                    return ( validadeCNPJ(filteredValue) || createError({ path, message: "CNPJ inválido" }) )
                }

                if(filteredValue.length === 11){
                    return ( validadeCPF(filteredValue) || createError({ path, message: "CPF inválido" }) )
                }

                return createError({ path, message: validationMessage })
            })
        default:
            return yupInstance
    }
}