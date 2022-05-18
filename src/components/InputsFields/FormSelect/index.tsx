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

import api from "../../../services/api"

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
    value: string | number 
    label: string
}

interface FormSelectProps extends SelectProps{
    name: string
    options?: Array<Option>
    initialValue?: string
    isAsyncOptionsData?: boolean
    asyncResquest?: {
        endpoint: string,
        params?: {
            [key: string]: string
        }
    }

    cleanRules?: () => void
    observerValue?: (fieldName: string) => void
    onChangeRule?: (event: SelectChangeEvent<string>, input: HTMLInputElement | null, value?: any) => void
}

const FormSelect: React.ForwardRefRenderFunction<InputFieldsRef, FormSelectProps> = ({ 
    name, 
    label, 
    options, 
    initialValue,
    asyncResquest,
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

    const getOptions = useCallback(async(value: string) => {
        try{
            const response = await api.get(asyncResquest?.endpoint as string, {
                params: {
                    ...asyncResquest?.params,
                    pesquisa: value,
                    company: "01",
                    brach: "0101"
                },
                headers: {
                    authorization: "8c7cea11d0692ae1d3477d5cfb0d9781128af36d38b30f6c38bf987e1126ea8996ac56baa5bac59426a5e53b8eb3eeaa6a6417f77e6c6d10a25101960f8aece7"
                }
            })

            if(!!response.data.data){
                setOptionsList(response.data.data.consultapadrao.map(item => ({
                    label: item.CC2_MUN,
                    value: item.CC2_CODMUN
                })))
            }
        }catch(error: any){
            console.log(error)
        }
    },[asyncResquest])

    const updateOptionsList = useCallback((value: string) => {
        setOptionsList(options || [])
        if(inputIdleTimeoutID !== undefined){
            clearInterval(inputIdleTimeoutID)
        }
        const timeoutId = setTimeout(() => {
            console.log("atualizando")
            getOptions(value)
        }, 1000)

        setInputIdleTimeoutID(timeoutId)
    },[inputIdleTimeoutID, getOptions, options])

    const getSelectValue = useCallback(() => {
        return inputRef.current?.value || value
    },[inputRef, value])

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
            getValue: () => getSelectValue()
        })
    }, [fieldName, registerField])

    const teste = () => {
        console.log(inputRef.current?.value)
    }

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
                    { optionsList.map((option) => (
                        <MenuItem key={ option.value } value={ option.value }>
                            { option.label }
                        </MenuItem>
                    ))}
                </Select>
                <button onClick={ teste } type="button">Teste</button>
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