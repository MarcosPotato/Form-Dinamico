import React from "react"
import { 
    useState, 
    useRef, 
    useEffect, 
    useImperativeHandle, 
    forwardRef,
    useCallback
} from "react"
import { useField } from "@unform/core"

import { InputFieldsRef } from "../index"

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
    options?: Array<Option>
    initialValue?: string
    isAsyncOptionsData?: boolean

    cleanRules?: () => void
    observerValue?: (fieldName: string) => void
    onChangeRule?: (event: SelectChangeEvent<string>, input: HTMLInputElement | null, value?: any) => void
}

const FormSelect: React.ForwardRefRenderFunction<InputFieldsRef, FormSelectProps> = ({ 
    name, 
    label, 
    options, 
    initialValue,
    isAsyncOptionsData,
    cleanRules,
    onChangeRule, 
    observerValue,
    ...rest 
}, ref) => {

    const inputRef = useRef<HTMLInputElement>(null)

    const { fieldName, error, registerField } = useField(name)

    const [hasAnError, setHasAnError] = useState<boolean>(false)
    const [value, setValue] = useState<string>(initialValue || "")

    const [inputIdleTimeoutID, setInputIdleTimeoutID] = useState<NodeJS.Timeout>()

    const [optionsList, setOptionsList] = useState<Option[]>(options || [])

    const updateOptionsList = useCallback((value: string) => {
        if(inputIdleTimeoutID !== undefined){
            clearInterval(inputIdleTimeoutID)
        }
        const timeoutId = setTimeout(() => {
            console.log("atualizando")

            // colocar request
            setOptionsList(prev => [
                ...prev,
                { value: value, label: `${prev.length + 1}` }
            ])
        }, 1000)

        setInputIdleTimeoutID(timeoutId)
    },[inputIdleTimeoutID])

    useImperativeHandle(ref, () => ({
        fieldName: fieldName,
        getValue: () => inputRef.current?.value as string,
        refreshData: isAsyncOptionsData ? updateOptionsList : undefined,
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

        if(observerValue){
            observerValue(fieldName)
        }
    }, [value, fieldName, observerValue ])

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
                    { optionsList.length <= 0 &&
                        <MenuItem value="" disabled>
                            Nenhum resultado
                        </MenuItem>
                    }
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