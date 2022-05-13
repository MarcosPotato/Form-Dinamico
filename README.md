# Formulário Dinâmico

Este é um repositório para testar o formulário dinamico, onde os campos são carregados através de um JSON e suas validação são realizadas automaticamente de acordo com os campos.

# Como utilizar

Para utilizar o formulário dinâmico você de importa-lo de "src/components/DynamicForm" e utiliza-lo dentro de uma tag Form do @unform/web. <br/>
Ele deve ser utilizado dentro dessa tag para que os campos sejam registrados no unform permitindo a fácil implementação, manipulação e validação do campo a ser carregado
Após isso deve-se passar como propriedades um array de <i>FieldsType</i> composto pela seguinte estrutura: <br />

<pre>
<code>
    {
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

        options?: Array<any> //Somente para os campos do tipo autocomplete (string array) e select (SelectOptions arrya)

        inputFormat?: string //Somente para campos de data

        views?: CalendarPickerView[] //Somente para campos de data
        minDate?: Date //Somente para campos de data
        maxDate?: Date //Somente para campos de data
    }
    </code>
</pre>

<br />

| Campos              | Descrição                                                                     | Obrigatório                                  | Tipo                                       |
| ------------------- | ----------------------------------------------------------------------------- | :------------------------------------------: | :----------------------------------------: |
|  name               |  Nome do input. Este valor deve ser único, servindo como um ID para o unform  | Sim                                          | string                                     |
|  label              |  Nome a ser mostrado do Input                                                 | Sim                                          | string                                     |
|  initialValue       |  Valor inicial a ser carregado no input | Obrigatório                         | Não                                          | string, number ou undefined                |
|  desk_grid_size     |  Tamanho do grid a ser ocupado utilizando no computador                       | Sim                                          | number                                     |
|  mobile_grid_size   |  Tamanho do grid a ser ocupado utilizando em dispositivos móveis              | Sim                                          | number                                     |
|  size               |  Tamanho do da altura do input                                                | Não (padrão large)                           | "small" ou "medium"                        |
|  type               |  Tipo do Input                                                                | Sim                                          | "text", "select", "autocomplete" ou "date" |
|  contentType        |  Tipo do conteúdo do input                                                    | Não (padrão text)                            | "email", "number", "password" ou "text"    |
|  isRequired         |  Indica se é um campo obrigatório do formulário                               | Sim                                          | boolean                                    |
|  validationMessage  |  Messagem de erro para a validação                                            | Sim                                          | string                                     |
|  mask               |  Nome da máscara a ser aplicada no input                                      | Não                                          | string                                     |
|  validationType     |  Tipo de validação a ser realizada                                            | Sim                                          | string                                     |
|  options            |  Listagem de opções a serem carregadas no select ou autocomplete              | Somente se o tipo for select ou autocomplete | any[]*                                     |
|  inputFormat        |  Formato da data do input                                                     | Somente se o tipo for date                   | string                                     |
|  views              |  Tipo de visualização da data                                                 | Somente se o tipo for date                   | CalendarPickerView[]**                     |
|  minDate            |  Data mínima a ser selecionada no input                                       | Não (válido apenas para o tipo date)         | Date                                       |
|  maxDate            |  Data máxima a ser selecionada no input                                       | Não (válido apenas para o tipo date)         | Date                                       |

<br />

* Para inputs de autocomplete deve ser um array de string e para o input select deve ser um array utilizando o seguinte objeto:<br />
<pre>
    <code>
    {
        value: number | string,
        label: string
    }
    </code>
</pre>
<br />
** Este é um tipo do <a href="https://mui.com/pt/x/api/date-pickers/date-picker/">DatePicker</a> do @mui/lab

<br /><br />

Após isso os campos serão renderizados. A captura dos dados é recebida no evento submit da tag Form do @unform/web e para realizar a validação dinâmica utilize o seguinte trecho de código: <br />

<pre>
<code>
const handleSubmit = async(data: FormData) => {

    ...

    let validationObject = {}

    fields.forEach(field => {
        validationObject[field.name] = getValidationsForm({
            validationType: field.validationType, 
            isRequired: field.isRequired, 
            label: field.label,
            validationMessage: field.validationMessage
        })
    })
    
    try{
        const schema = Yup.object().shape(validationObject)

        await schema.validate(data, {
            abortEarly: false
        })

        // coloque aqui a continuação da função caso todos os campos estajam validados
    } catch(error: any){
        if(error instanceof Yup.ValidationError){
            const errors = getValidationErros(error)

            formRef.current?.setErrors(errors)
        }

        ...
        // coloque aqui a tratativa de erros que não sejam validações de campos usando o Yup
    }
}
</code>
</pre>

<br />

| Campos            | Descrição                                                           |
| ----------------- | ------------------------------------------------------------------- |
|  fields           |  variavel que armazena o array dos campos                           |
|  validationObject |  estrutura para o shape do yup que é gerada de acordo com os campos |

<br />

# Personalização 

Caso seja necessário podemos personalizar as validações que são realizadas nos campo de formulário.<br />
Para fazer isso navegue até src/utils/validations/dynamicForm/formValidations.ts. Crie um novo case no switch com o nome da validação que deseja criar: <br />

<pre>
<code>
export const formValidations = ({ type, validationMessage, yupInstance }: ValidationsProps): YupIntance => {

    ...

    switch(type){
        ...
        case "validacao_personalizada":
            return // seu código aqui
        default:
            return yupInstance
    }
}
</code>
</pre>

<br />

Nesse retorno podemos realizar de 2 formar, voltando a validação do próprio Yup: <br />
<pre>
<code>
...
    switch(type){
        ...
        case "validacao_personalizada":
            return yupInstance."metodo_do_yup"
        ...
    }
...
</code>
</pre>

<br />

Caso queira criar o medos personalizado deva utilizar a seguinte forma: <br />
<pre>
<code>
...
    switch(type){
        ...
        case "validacao_personalizada":
            return yupInstance.test("test-document-type", validationMessage, function(value){
                const { path, createError } = this

                // seu código validação
                // o retorno deve ser uma instancia de erro usando o createError ou um valor true para
                // o caso de passar na validação

                return createError({ path, message: validationMessage })
            })
        ...
    }
...
</code>
</pre>