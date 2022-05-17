import { FieldsType } from "../../@types/dynamicFormFields"

export const fields: FieldsType[] = [
    {
        name: "field1",
        label: "Field 1",
        desk_grid_size: 6,
        mobile_grid_size: 12,
        type: "text",
        size: "small",
        contentType: "text",
        isRequired: true,
        validationMessage: "Field 1 is required",
        validationType: "text",
        inputChildren: ["field3", "select", "autocomplete"]
    },
    {
        name: "field3",
        label: "Field 3",
        desk_grid_size: 6,
        mobile_grid_size: 12,
        type: "select",
        size: "small",
        contentType: "text",
        isRequired: true,
        inputDependence: "field1",
        validationMessage: "E-mail Inválido",
        validationType: "text",
        inputChildren: ["select", "autocomplete"],
        options: [
            { label: "Alagoas", value: "AC"},
            { label: "Alagoas", value: "AL"},
            { label: "Amapá", value: "AP"},
            { label: "Amazonas", value: "AM"},
            { label: "Bahia", value: "BA"},
            { label: "Ceará", value: "CE"},
            { label: "Distrito Federal", value: "DF"},
            { label: "Espírito Santo", value: "ES"},
            { label: "Goiás", value: "GO"},
            { label: "Maranhão", value: "MA"},
            { label: "Mato Grosso", value: "MT"},
            { label: "Mato Grosso do Sul", value: "MS"},
            { label: "Minas Gerais", value: "MG"},
            { label: "Pará", value: "PA"},
            { label: "Paraíba", value: "PB"},
            { label: "Paraná", value: "PR"},
            { label: "Pernambuco", value: "PE"},
            { label: "Piauí", value: "PI"},
            { label: "Rio de Janeiro", value: "RJ"},
            { label: "Rio Grande do Norte", value: "RN"},
            { label: "Rio Grande do Sul", value: "RS"},
            { label: "Rondônia", value: "RO"},
            { label: "Roraima", value: "RR"},
            { label: "Santa Catarina", value: "SC"},
            { label: "São Paulo", value: "SP"},
            { label: "Sergipe", value: "SE"},
            { label: "Tocantins", value: "TO"}
        ]
    },
    {
        name: "select",
        label: "Select",
        desk_grid_size: 6,
        mobile_grid_size: 12,
        type: "select",
        size: "small",
        isRequired: true,
        isAsyncOptionsData: true,
        inputDependence: "field3",
        validationType: "text",
        asyncResquest: {
            endpoint: "/consultapadrao",
            params: {
                tabela: "CC2",
                campos: "CC2_EST,CC2_CODMUN,CC2_MUN",
                ordem: "CC2_MUN",
                procura: "CC2_EST"
            }
        }
    },
    {
        name: "autocomplete",
        label: "Autocomplete",
        desk_grid_size: 6,
        mobile_grid_size: 12,
        type: "autocomplete",
        size: "small",
        isRequired: true,
        isAsyncOptionsData: true,
        inputDependence: "field3",
        validationType: "text",
        options: ["teste"],
        asyncResquest: {
            endpoint: "/consultapadrao",
            params: {
                tabela: "CC2",
                campos: "CC2_EST,CC2_CODMUN,CC2_MUN",
                ordem: "CC2_MUN",
                procura: "CC2_EST"
            }
        }
    }
]