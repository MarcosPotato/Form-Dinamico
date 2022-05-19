import React from 'react'
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useField } from '@unform/core'

import { InputFieldsRef, InputsType } from '../index'

import ptBrLocale from 'date-fns/locale/pt-BR'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { CalendarPickerView, DatePicker } from '@mui/lab'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

import { 
    Container, 
    Input, 
    ErrorMessage, 
    CheckIcon, 
    CloseIcon 
} from './style'

interface FormDatePickerProps{
    name: string,
    label: string,
    inputFormat?: string
    initialValue?: string,
    fullWidth?: boolean
    size?: "small" | "medium" | undefined
    views?: readonly CalendarPickerView[] | undefined
    disabled?: boolean
    minDate?: Date
    observerValue?: (fieldName: string) => void
}

const FormDatePicker: React.ForwardRefRenderFunction<InputFieldsRef, FormDatePickerProps> = ({
    name, 
    size, 
    label, 
    fullWidth,
    initialValue, 
    observerValue,
    ...rest
}, ref) => {

    const inputRef = useRef<HTMLInputElement>(null)
    const {fieldName, error, registerField} = useField(name)

    const [hasAnError, setHasAnError] = useState<boolean>(false)
    const [value, setValue] = useState<string | unknown>(initialValue || "")

    useImperativeHandle(ref, () => ({
        fieldName: fieldName,
        type: "date" as InputsType,
        getValue: () => ( inputRef.current?.value || "" ),
        changeValue: (value) => {
            if(inputRef.current?.value){
                inputRef.current.value = value || ""
                setValue(value || "")
                if(inputRef.current.value === ""){
                    setHasAnError(false)
                }
            }
        }
    }))

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: "value"
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[registerField, fieldName, inputRef.current])

    useEffect(() => {
        if(!!error){ setHasAnError(true) }
    }, [error])

    useEffect(() => {
        setValue(initialValue || "") 
    },[initialValue])

    useEffect(() => {
        if(value === ""){
            setHasAnError(false)
        }

        if(observerValue){
            observerValue(fieldName)
        }
    }, [value, fieldName, observerValue ])

    return(
        <Container>
            <LocalizationProvider dateAdapter={ AdapterDateFns } locale={ ptBrLocale }>
                <DatePicker
                    { ...rest }
                    value={ value }
                    label={ label }
                    inputRef={ inputRef }
                    
                    onChange={value => {
                        setValue(value)
                        if(inputRef.current?.value) 
                            inputRef.current.value = (value as string)
                    }}
                    renderInput={(params) => (
                        <Input
                            {...params}
                            error={ false }
                            isError={!!error}
                            hasAnError={ hasAnError }
                            name={ name }
                            size={size}
                            fullWidth={fullWidth}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                />
            </LocalizationProvider>
            { !!error ?
                <>
                <CloseIcon />
                <ErrorMessage> { error } </ErrorMessage>
                </>
            : (!error && hasAnError) &&
                <CheckIcon />
            }
        </Container>
    )
}

export default forwardRef(FormDatePicker)