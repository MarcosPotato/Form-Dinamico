import { FieldsType } from "../../@types/dynamicFormFields"

export const fields: FieldsType[] = [
    {
        name: "field1",
        label: "Field 1",
        desk_grid_size: 4,
        mobile_grid_size: 12,
        type: "text",
        size: "small",
        contentType: "text",
        isRequired: true,
        validationMessage: "Field 1 is required",
        validationType: "text",
        inputChildren: ["field3", "select"]
    },
    {
        name: "field3",
        label: "Field 3",
        desk_grid_size: 4,
        mobile_grid_size: 12,
        type: "text",
        size: "small",
        contentType: "text",
        isRequired: true,
        inputDependence: "field1",
        validationMessage: "E-mail Inválido",
        validationType: "email",
        inputChildren: ["select"]
    },
    {
        name: "select",
        label: "Select",
        desk_grid_size: 4,
        mobile_grid_size: 12,
        type: "select",
        size: "small",
        isRequired: true,
        isAsyncOptionsData: true,
        inputDependence: "field3",
        validationType: "text"
    }
]