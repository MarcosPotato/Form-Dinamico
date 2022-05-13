import * as Yup from 'yup'
import { AnyObject } from 'yup/lib/types'

export type YupIntance = Yup.StringSchema<string | undefined, AnyObject, string | undefined>

export interface ValidationsProps{
    type: string
    validationMessage: string
    yupInstance: YupIntance
}

export interface GetValidationsParams{
    validationType: string
    isRequired: boolean
    label: string
    validationMessage?: string
}