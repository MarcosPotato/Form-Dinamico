import React, { useCallback } from 'react'
import { useRef } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import { getInputField } from './components/InputsFields'

import { fields } from './formFields'

import { Container, FormCard } from './style'
import { Grid } from '@mui/material'
import { getValidationsForm } from './getYupValidations'
import getValidationErros from './getValidationErros'

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
                    <Grid container spacing={2}>
                        { fields.map(field => {
                            const Field = getInputField(field.type)
                            return (
                                <Grid item xs={ field.mobile_grid_size } md={ field.desk_grid_size }>
                                    <Field { ...field } type={ field.contentType || "text" } fullWidth />
                                </Grid>
                            )
                        })}
                    </Grid>
                    <button style={{ marginTop: "50px" }} type="submit">Click me</button>
                </Form>
            </FormCard>
        </Container>
    )
}

export default App