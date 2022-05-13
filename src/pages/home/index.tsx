import React, { useCallback } from 'react'
import { useRef } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import { fields } from '../../utils/validations/formFields'
import { getValidationsForm } from '../../utils/validations/dynamicForm/getYupValidations'
import getValidationErros from '../../utils/validations/getValidationErros'

import { Container, FormCard } from './style'
import DynamicForm from '../../components/DynamicForm'

interface FormData {
    [key: string]: string | Date
}

const App: React.FC = () => {
    const formRef = useRef<FormHandles>(null)

    const handleSubmit = useCallback(async(data: FormData) => {
        console.log(data)

        let validationObject = {}

        fields.forEach(field => {
            validationObject[field.name] = getValidationsForm({
                validationType: field.validationType, 
                isRequired: field.isRequired, 
                label: field.label,
                validationMessage: field.validationMessage
            })
        })
        
        try{
            const schema = Yup.object().shape(validationObject)

            await schema.validate(data, {
                abortEarly: false
            })

            console.log("validado")
            console.log(data)
        } catch(error: any){
            if(error instanceof Yup.ValidationError){
                const errors = getValidationErros(error)

                formRef.current?.setErrors(errors)
            }
        }
    }, [formRef])

    return(
        <Container>
            <FormCard>
                <Form ref={ formRef } onSubmit={ handleSubmit }>
                    <DynamicForm fields={ fields } />
                    <button type="submit">Click me</button>
                </Form>
            </FormCard>
        </Container>
    )
}

export default App