import React from 'react'
import { useRef, useEffect, useCallback } from 'react'

import { inputMasks } from '../../utils/masks/inputMasks'
import { getInputField, InputFieldsRef } from '../../components/InputsFields'

import { Grid } from '@mui/material'
import { FieldsType } from '../../@types/dynamicFormFields'

interface DynamicFormProps {
    fields: FieldsType[]
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields }) => {

    const fieldsReferences = useRef<Array<InputFieldsRef | null>>([])

    const onSettingValue = useCallback((fieldName: string, value?: string[]) => {
        const selectedField = fields.find(field => field.name === fieldName)
        const selectedReference = fieldsReferences.current.find(reference => reference?.fieldName === fieldName)
        
        if(!selectedField){
            throw new Error ("Invalid fieldNames, this value not exist")
        }

        if(!!selectedReference && !!value){
            if(selectedReference.type === "searchText"){
                selectedReference.changeValue(value[0])
            }
        }

        if(!!selectedField.inputChildren && selectedField.inputChildren.length > 0){
            selectedField.inputChildren.forEach((child, index) => {
                const reference = fieldsReferences.current.find(reference => reference?.fieldName === child)
                const selectedChild = fields.find(field => field.name === child)

                if(!!value){
                    reference?.changeValue(value[index + 1])
                } else{
                    reference?.changeValue("")
                }

                if(!!selectedChild && selectedChild.inputDependence){        
                    const dependenceRef = fieldsReferences.current.find(reference => reference?.fieldName === selectedChild.inputDependence)

                    if(!!reference?.refreshData && !!dependenceRef){
                        if(selectedField.name === selectedChild.inputDependence){
                            reference.refreshData(dependenceRef.getValue() as string)
                        }
                    }
                }
            })
        }

    }, [fields, fieldsReferences])
    
    return (
        <Grid container spacing={2}>
            { fields.map((field, index) => {
                const InputField = getInputField(field.type)
                return (
                    <Grid 
                        key={ field.name } 
                        item xs={ field.mobile_grid_size } 
                        md={ field.desk_grid_size }
                    >
                        <InputField 
                            { ...field }
                            fullWidth 
                            type={ field.contentType || "text" } 
                            inputProps={ field.inputProps || undefined }
                            ref={ ref => fieldsReferences.current[index] = ref }
                            onChangeRule={ field.mask ? inputMasks[field.mask] : undefined }
                            onPasteRule={ field.mask ? inputMasks[field.mask] : undefined }  
                            observerValue={ (!!field.inputChildren || !!field.inputDependence || field.type === "searchText") ? onSettingValue : undefined }
                        />
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default DynamicForm