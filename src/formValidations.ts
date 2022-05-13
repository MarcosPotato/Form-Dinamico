import * as Yup from 'yup'
import { AnyObject } from 'yup/lib/types'
import { validadeCNPJ, validadeCPF } from './validateDocuments'

type YupIntance = Yup.StringSchema<string | undefined, AnyObject, string | undefined>

interface ValidationsProps{
    type: string
    validationMessage: string
    yupInstance: YupIntance
}

export const formValidations = ({ type, validationMessage, yupInstance }: ValidationsProps): YupIntance => {

    if(!yupInstance){
        throw new Error("Yup Instance must be passed")
    }

    switch(type){
        case "text":
            return yupInstance
        case "email":
            return yupInstance.email(validationMessage)
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