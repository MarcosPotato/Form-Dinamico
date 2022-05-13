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
    contentType?: "email" | "number" | "password" | "text"
    isRequired: boolean
    validationMessage?: string
    validationType: string
    options?: Array<any>
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
    {
        name: "document",
        label: "CPF/CNPJ",
        defaultValue: "value",
        desk_grid_size: 4,
        mobile_grid_size: 12,
        type: "text",
        contentType: "text",
        size: "small",
        isRequired: false,
        validationType: "document",
        validationMessage: "Doumento inválido",
        options: [
            { label: "teste1", value: 1 },
            { label: "teste2", value: 2 },
            { label: "teste3", value: 3 },
        ]
    },
    {
        name: "select",
        label: "Combo",
        defaultValue: "1",
        desk_grid_size: 4,
        mobile_grid_size: 12,
        type: "select",
        size: "small",
        isRequired: false,
        validationType: "text",
        options: [
            { label: "teste1", value: 1 },
            { label: "teste2", value: 2 },
            { label: "teste3", value: 3 },
        ]
    },
    {
        name: "autocomplete",
        label: "Autocomplete",
        desk_grid_size: 4,
        mobile_grid_size: 12,
        type: "autocomplete",
        size: "small",
        isRequired: false,
        validationType: "text",
        options: [
            "teste1",
            "teste2",
            "teste3",
        ]
    },
]