import { ValidationError } from 'yup'

export interface ErrorForm{
    [key: string]: string
}

export default function getValidationErros(err: ValidationError){

    const validationErrors: ErrorForm = {}

    err.inner.forEach(error => {
        if(error.path) { validationErrors[error.path] = error.message }
    })

    return validationErrors
}