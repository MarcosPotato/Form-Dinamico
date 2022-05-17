import React from "react"
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { useField } from "@unform/core"

import { InputFieldsRef } from '../index'

import { Autocomplete, TextFieldProps } from '@mui/material'

import { 
    CheckIcon, 
    CloseIcon, 
    Container, 
    ErrorMessage, 
    Input 
} from "./style"

interface FormAutoCompleteProps {
    name: string
    label: string
    loading?: boolean
    options?: Array<string>
    initialValue?: string
    disabled?: boolean
    isAsyncOptionsData?: boolean
    
    cleanRules?: () => void
    observerValue?: (fieldName: string) => void
    onPasteRule?: (event: any, input: TextFieldProps | null) => void
    onChangeRule?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, input: TextFieldProps | null, value?: any) => void
}

const FormAutoComplete: React.ForwardRefRenderFunction<InputFieldsRef,FormAutoCompleteProps> = ({ 
    name, 
    label,
    loading,
    options,
    disabled,
    initialValue,
    observerValue
}, ref) => {

    const inputRef = useRef<TextFieldProps>(null)
    const { fieldName, registerField, error } = useField(name)

    const [hasAnError, setHasAnError] = useState(false)
    const [value, setValue] = useState(initialValue || "")

    const [optionsList, setOptionsList] = useState<string[]>(options || [])

    useImperativeHandle(ref, () => ({
        fieldName: fieldName,
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
    }, [fieldName, registerField])

    useEffect(() => {
        if(!!error){ setHasAnError(true) }
    }, [error])

    useEffect(() => { setValue(initialValue || "") }, [initialValue])

    useEffect(() => {
        if(value === ""){
            setHasAnError(false)
        }

        if(observerValue){
            observerValue(fieldName)
        }
    }, [value, fieldName, observerValue ])

    useEffect(() => {
        setOptionsList(options || [])
    },[options])

    return(
        <Container>
            <Autocomplete
                value={ value }
                options={ optionsList }
                loadingText="Carregando..."
                noOptionsText="Sem resultados"
                fullWidth
                disabled={ disabled }
                loading={ loading }
                onChange={(_, option) => setValue(option || "")}
                renderInput={props => 
                    <Input
                        {...props} 
                        hiddenLabel
                        name={ name } 
                        label={label}
                        isError={ !!error }
                        hasAnError={ hasAnError }
                        size="small"
                        fullWidth
                        inputRef={inputRef}
                    />
                }
            />
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

export default forwardRef(FormAutoComplete)