import React from "react"
import { 
    useEffect, 
    useRef, 
    useState,
    forwardRef, 
    useImperativeHandle 
} from "react"
import { useField } from "@unform/core"
import { InputFieldsRef } from "../index"

import { TextFieldProps, BaseTextFieldProps } from "@mui/material"

import { CheckIcon, CloseIcon, Container, ErrorMessage, Input } from "./style"

interface FormInputProps extends BaseTextFieldProps{
    name: string
    initialValue?: string,
    loading?: boolean
    observerValue?: (fieldName: string) => void
    onChangeRule?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, input: TextFieldProps | null, value?: any) => void
    onPasteRule?: (event: any, input: TextFieldProps | null) => void
    cleanRules?: () => void
}

const FormInput: React.ForwardRefRenderFunction<InputFieldsRef, FormInputProps> = ({ 
    name, 
    type,
    label,
    loading, 
    children,
    initialValue,
    cleanRules,
    onPasteRule, 
    onChangeRule, 
    observerValue,
    ...rest 
}, ref) => {

    const inputRef = useRef<TextFieldProps>(null)
    const {fieldName, registerField, defaultValue, error} = useField(name)

    const [hasAnError, setHasAnError] = useState(false)
    const [shrinkLabel, setShrinkLabel] = useState(false)
    const [value, setValue] = useState<string>(initialValue || "")

    useImperativeHandle(ref, () => ({
        fieldName: fieldName,
        getValue: () => ( inputRef.current?.value as string),
        changeValue: (value) => {
            setValue(value)
            if(inputRef.current?.value){
                inputRef.current.value = value || ""
            }
            if(value === ""){
                setShrinkLabel(false)
                setHasAnError(false)
            } else{
                setShrinkLabel(true)
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

    useEffect(() => {
        if(!!value && type !== "date"){ setShrinkLabel(true) }
    }, [value, type])

    useEffect(() => {
        if(type === "date"){ setShrinkLabel(true) }
    }, [type])

    useEffect(() => { setValue(initialValue || "") },[initialValue])

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
            <Input 
                {...rest}
                label={label}
                isError={ !!error }
                hasAnError={ hasAnError }
                inputRef={ inputRef }
                type={ type || "text"}
                name={ name }
                value={ value }
                defaultValue={ defaultValue }
                InputLabelProps={{ shrink: shrinkLabel }}
                onChange={ (event) => {
                    if(onChangeRule){ onChangeRule(event, inputRef.current) }
                    setValue(inputRef.current?.value as string)
                    if(cleanRules){ cleanRules() }
                    if(inputRef.current?.value === ""){
                        if(type !== "date"){
                            setShrinkLabel(false)
                        }
                        setHasAnError(false)
                    } else{
                        setShrinkLabel(true)
                    }
                }}
                onPaste={ onPasteRule ? (event) => {
                    onPasteRule(event, inputRef.current)
                } : () => {}}
            />
            { !!error ?
                <>
                <CloseIcon style={{ marginRight: type === "date" ? "-8px" : "0px"}} />
                <ErrorMessage> { error } </ErrorMessage>
                </>
            : (!error && hasAnError) &&
                <CheckIcon style={{ marginRight: type === "date" ? "-7px" : "0px"}}  />
            }
        </Container>
    )
}

export default forwardRef(FormInput)