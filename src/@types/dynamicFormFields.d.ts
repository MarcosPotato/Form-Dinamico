import { CalendarPickerView } from "@mui/lab"
import { InputsType } from "../components/InputsFields"

export interface FieldsType{
    name: string
    label: string
    initialValue?: any
    desk_grid_size: number
    mobile_grid_size: number
    type: InputsType
    isRequired: boolean
    validationMessage?: string
    validationType: string
    contentType?: "email" | "number" | "password" | "text"
    size?: "small" | "medium"
    mask?: string
    inputDependence?: string
    inputChildren?: string[]
    inputProps?: {
        [key: string]: number | string | boolean
    }

    options?: Array<any> //Only for autocomplete and select fields 
    isAsyncOptionsData?: boolean //Only for autocomplete and select fields
    asyncResquest?: {
        endpoint: string,
        params?: {
            [key: string]: string
        }
    }

    inputFormat?: string //Only for date fields
    views?: CalendarPickerView[] //Only for date fields
    minDate?: Date //Only for date fields
    maxDate?: Date //Only for date fields

    dialogType?: "product" | "supplier" //Only for type searchText
}