export interface FieldsType{
    name: string
    label: string
    defaultValue?: string
    defaultChecked?: boolean
    defaultOpen?: any
    desk_grid_size: number
    mobile_grid_size: number
    size?: "small" | "medium"
    type: "text" | "select" | "autocomplete" | "date"
    contentType: "email" | "number" | "password" | "text"
    isRequired: boolean
    validationMessage?: string
    validationType: string
}

export const fields: FieldsType[] = [
    {
        name: "field1",
        label: "Field 1",
        defaultValue: "value",
        desk_grid_size: 4,
        mobile_grid_size: 12,
        type: "text",
        size: "small",
        contentType: "text",
        isRequired: true,
        validationMessage: "Field 1 is required",
        validationType: "text"
    },
    {
        name: "field2",
        label: "Field 2",
        defaultValue: "value",
        desk_grid_size: 4,
        mobile_grid_size: 12,
        type: "text",
        size: "small",
        contentType: "text",
        isRequired: false,
        validationType: "text"
    },
    {
        name: "field3",
        label: "Field 3",
        defaultValue: "value",
        desk_grid_size: 4,
        mobile_grid_size: 12,
        type: "text",
        size: "small",
        contentType: "email",
        isRequired: true,
        validationMessage: "E-mail Inválido",
        validationType: "email"
    },
]