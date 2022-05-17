import React from "react"
import { 
    useEffect, 
    useRef, 
    useState, 
    forwardRef, 
    useImperativeHandle,
    useCallback
} from "react"
import { useField } from "@unform/core"

import api from "../../../services/api"

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
    asyncResquest?: {
        endpoint: string,
        params?: {
            [key: string]: string
        }
    }

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
    asyncResquest,
    isAsyncOptionsData,
    observerValue
}, ref) => {

    const inputRef = useRef<TextFieldProps>(null)
    const { fieldName, registerField, error } = useField(name)

    const [hasAnError, setHasAnError] = useState(false)
    const [value, setValue] = useState(initialValue || "")

    const [optionsList, setOptionsList] = useState<string[]>(options || [])

    const [inputIdleTimeoutID, setInputIdleTimeoutID] = useState<NodeJS.Timeout>()

    const getOptions = useCallback(async(value: string) => {
        console.log("teste autocomplete")
        try{
            const response = await api.get(asyncResquest?.endpoint as string, {
                params: {
                    ...asyncResquest?.params,
                    pesquisa: value,
                    company: "01",
                    brach: "01"
                },
                headers: {
                    authorization: "3c478422074463b32b3b276d8087cc8ac659f597dc3cab0300ed0b30d8eeb0c07d31c937498270a388dd29f10e6e3683278ebd8ae9661de65711161e6b387c34"
                }
            })

            if(!!response.data.data){
                setOptionsList(response.data.data.consultapadrao.map(item => `${item.CC2_CODMUN} - ${item.CC2_MUN}`))
            }

            console.log(response)
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

    useImperativeHandle(ref, () => ({
        fieldName: fieldName,
        getValue: () => ( inputRef.current?.value || "" ),
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