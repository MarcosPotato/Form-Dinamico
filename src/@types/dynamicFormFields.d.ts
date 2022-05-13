import { CalendarPickerView } from "@mui/lab"

export interface FieldsType{
    name: string
    label: string
    initialValue?: any
    desk_grid_size: number
    mobile_grid_size: number
    size?: "small" | "medium"
    type: "text" | "select" | "autocomplete" | "date"
    contentType?: "email" | "number" | "password" | "text"
    isRequired: boolean
    validationMessage?: string
    mask?: string
    validationType: string

    options?: Array<any> //Only for autocomplete (string array) e select (SelectOptions arrya) fields 

    inputFormat?: string //Only for date fields

    views?: CalendarPickerView[] //Only for date fields
    minDate?: Date //Only for date fields
    maxDate?: Date //Only for date fields
}