import React from 'react'

import { inputMasks } from '../../utils/masks/inputMasks'
import { getInputField } from '../../components/InputsFields'

import { Grid } from '@mui/material'
import { FieldsType } from '../../@types/dynamicFormFields'

interface DynamicFormProps {
    fields: FieldsType[]
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields }) => (
    <Grid container spacing={2}>
        { fields.map(field => {
            const InputField = getInputField(field.type)
            return (
                <Grid 
                    key={ field.name } 
                    item xs={ field.mobile_grid_size } 
                    md={ field.desk_grid_size }
                >
                    <InputField 
                        { ...field }
                        type={ field.contentType || "text" } 
                        fullWidth 
                        onChangeRule={ field.mask ? inputMasks[field.mask] : undefined }
                        onPasteRule={ field.mask ? inputMasks[field.mask] : undefined }  
                    />
                </Grid>
            )
        })}
    </Grid>
)

export default DynamicForm