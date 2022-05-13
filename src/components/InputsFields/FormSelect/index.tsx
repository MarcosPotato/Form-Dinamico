import React from "react"
import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react"
import { useField } from "@unform/core"

import {
    Select,
    SelectProps,
    SelectChangeEvent,
    InputLabel,
    MenuItem
} from "@mui/material"

import { CheckIcon, CloseIcon, Container, FormField, ErrorMessage } from "./style"

interface Option{
    value: string | number | readonly string[] | undefined
    label: string
}

interface FormSelectProps extends SelectProps{
    name: string
    initialValue?: string
    onChangeRule?: (event: SelectChangeEvent<string>, input: HTMLInputElement | null, value?: any) => void
    cleanRules?: () => void
    options?: Array<Option>
}

export interface FormSelectRef {
    changeValue(value: string): void
    getValue(): string | unknown
}

const FormSelect: React.ForwardRefRenderFunction<FormSelectRef, FormSelectProps> = ({ 
    name, 
    label, 
    initialValue, 
    options, 
    onChangeRule, 
    cleanRules, 
    ...rest 
}, ref) => {

    const inputRef = useRef<HTMLInputElement>(null)
    const { fieldName, error, registerField } = useField(name)
    const [hasAnError, setHasAnError] = useState<boolean>(false)
    const [value, setValue] = useState<string>(initialValue || "")

    const [optionsList, setOptionsList] = useState<Option[]>(options || [])

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
        getValue: () => inputRef.current?.value as string
    }))

    useEffect(() =>{
        registerField({
            name: fieldName,
            ref: inputRef.current,
            getValue(refInput){
                return refInput.value
            } 
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldName, registerField, inputRef.current])

    useEffect(() => {
        if(!!error){ setHasAnError(true) }
    }, [error, initialValue])

    useEffect(() => {
        setValue(initialValue || "")
    }, [initialValue])

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
            <FormField 
                fullWidth
                isError={ !!error }
                hasAnError={ hasAnError }
            >
                <InputLabel id="form-select-label">{ label }</InputLabel>
                <Select
                    { ...rest }
                    label={label}
                    labelId="form-select-label"
                    id="form-select-label"
                    fullWidth
                    value={ value }
                    inputRef={ inputRef }
                    defaultValue={"São Paulo"}
                    onChange={ event => {
                        if(onChangeRule){ onChangeRule(event, inputRef.current) }
                        if(cleanRules){ cleanRules() }
                        if(inputRef.current?.value ){
                            inputRef.current.value = event.target.value
                        }
                        setValue(event.target.value)
                    }}
                >
                    { optionsList.map((option, index) => (
                        <MenuItem key={ index } value={ option.value }>
                            { option.label }
                        </MenuItem>
                    ))}
                </Select>
            </FormField>
            { !!error ?
                <>
                <CloseIcon />
                <ErrorMessage>{ error }</ErrorMessage>
                </>
            : (!error && hasAnError) &&
                <CheckIcon />
            }
        </Container>
    )
}

export default forwardRef(FormSelect)