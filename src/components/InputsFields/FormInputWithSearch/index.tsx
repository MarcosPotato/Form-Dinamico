import React from "react"
import { 
    useEffect, 
    useRef, 
    useState,
    forwardRef, 
    useImperativeHandle 
} from "react"
import { useField } from "@unform/core"
import { InputFieldsRef, InputsType } from "../index"

import { DialogTypes, getDialog, DialogRef } from "../../Modal"

import { TextFieldProps, BaseTextFieldProps, CircularProgress } from "@mui/material"

import { CheckIcon, CloseIcon, Container, ErrorMessage, Input, SearchButton } from "./style"
import { Search } from "@mui/icons-material"

interface FormInputWithSearchProps extends BaseTextFieldProps{
    name: string
    initialValue?: string,
    loading?: boolean
    dialogType?: DialogTypes,
    observerValue?: (fieldName: string, value?: string[]) => void
    onChangeRule?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, input: TextFieldProps | null, value?: any) => void
    onPasteRule?: (event: any, input: TextFieldProps | null) => void
    cleanRules?: () => void
}

const FormInputWithSearch: React.ForwardRefRenderFunction<InputFieldsRef, FormInputWithSearchProps> = ({ 
    name, 
    type,
    label,
    loading, 
    children,
    dialogType,
    initialValue,
    onBlur: blurFunction,
    onFocus: focusFunction,
    cleanRules,
    onPasteRule, 
    onChangeRule, 
    observerValue,
    ...rest 
}, ref) => {

    const inputRef = useRef<TextFieldProps>(null)
    const dialogRef = useRef<DialogRef>(null)

    const { fieldName, registerField, defaultValue, error } = useField(name)

    const [hasAnError, setHasAnError] = useState(false)
    const [shrinkLabel, setShrinkLabel] = useState(false)

    const [isFocus, setIsFocus] = useState<boolean>(false)

    const [value, setValue] = useState<string>(initialValue || "")

    const Dialog = getDialog(dialogType as string)

    useImperativeHandle(ref, () => ({
        fieldName: fieldName,
        type: "searchText" as InputsType,
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
        <>
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
                    onPaste={ onPasteRule ? (event) => {
                        onPasteRule(event, inputRef.current)
                    } : () => {}}
                    onFocus={ event => {
                        setIsFocus(true)
                        if(!!focusFunction) {
                            focusFunction(event)
                        }
                    }}
                    onBlur={ event => {
                        setIsFocus(false)
                        if(!!blurFunction) {
                            blurFunction(event)
                        }
                    }}
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
                />
                { !!error ?
                    <>
                    <CloseIcon style={{ marginRight: type === "date" ? "-8px" : "0px"}} />
                    <ErrorMessage> { error } </ErrorMessage>
                    </>
                : (!error && hasAnError) &&
                    <CheckIcon style={{ marginRight: type === "date" ? "-7px" : "0px"}}  />
                }
                <SearchButton
                    variant="contained"
                    color="primary"
                    isFocusedInput={ isFocus }
                    onClick={() => dialogRef.current?.openDialog() }
                >
                    <Search/>
                </SearchButton>
            </Container>
            <Dialog 
                ref={ dialogRef }
                disableMultiSelection
                onSelect={ (values: string[]) => {
                    console.log(values)
                    if(!!observerValue){
                        observerValue(fieldName, values)
                    }
                }}
            />
        </>
    )
}

export default forwardRef(FormInputWithSearch)