import React from "react"
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { useField } from "@unform/core"

import { CheckIcon, CloseIcon, Container, ErrorMessage, Input } from "./style"

import { Autocomplete, TextFieldProps } from '@mui/material'

interface FormAutoCompleteProps {
    name: string
    label: string
    loading?: boolean
    options?: Array<string>
    defaultValue?: string
    disabled?: boolean
    cleanRules?: () => void
    onPasteRule?: (event: any, input: TextFieldProps | null) => void
    onChangeRule?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, input: TextFieldProps | null, value?: any) => void
}

export interface FormAutoCompleteRef{
    changeValue(value: string): void
    getValue(): string | unknown
}

const FormAutoComplete: React.ForwardRefRenderFunction<FormAutoCompleteRef,FormAutoCompleteProps> = ({ 
    name, 
    label,
    loading,
    options,
    defaultValue,
    disabled
}, ref) => {

    const inputRef = useRef<TextFieldProps>(null)
    const { fieldName, registerField, error } = useField(name)

    const [hasAnError, setHasAnError] = useState(false)
    const [value, setValue] = useState(defaultValue || "")

    const [optionsList, setOptionsList] = useState<string[]>(options || [])

    useImperativeHandle(ref, () => ({
        changeValue: (value) => {
            if(inputRef.current?.value){
                inputRef.current.value = value || ""
                setValue(value || "")
                if(inputRef.current.value === ""){
                    setHasAnError(false)
                }
            }
        },
        getValue: () => ( inputRef.current?.value || "" )
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

    useEffect(() => { setValue(defaultValue || "") }, [defaultValue])

    useEffect(() => {
        if(value === ""){
            setHasAnError(false)
        }
    }, [value])

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