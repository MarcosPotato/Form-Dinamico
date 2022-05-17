import React from 'react'
import { useRef, useEffect, useCallback } from 'react'

import { inputMasks } from '../../utils/masks/inputMasks'
import { getInputField, InputFieldsRef } from '../../components/InputsFields'

import { Grid } from '@mui/material'
import { FieldsType } from '../../@types/dynamicFormFields'

interface DynamicFormProps {
    fields: FieldsType[]
}

interface OnSettingValueProps{
    fieldName: string

}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields }) => {

    const fieldsReferences = useRef<Array<InputFieldsRef | null>>([])

    const onSettingValue = useCallback((fieldName: string) => {
        const selectedField = fields.find(field => field.name === fieldName)
        
        if(!selectedField){
            throw new Error ("Invalid fieldNames, this value not exist")
        }

        if(!!selectedField.inputChildren && selectedField.inputChildren.length > 0){
            selectedField.inputChildren.forEach(child => {
                const reference = fieldsReferences.current.find(reference => reference?.fieldName === child)
                const selectedChild = fields.find(field => field.name === child)

                reference?.changeValue("")

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
                            observerValue={ (!!field.inputChildren || !!field.inputDependence) ? onSettingValue : undefined }
                        />
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default DynamicForm