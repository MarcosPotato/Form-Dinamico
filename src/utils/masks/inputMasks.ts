export const cnpjMask = (value: string): string => (
    value.replace(/\D+/g, '')
         .replace(/(\d{2})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d)/, '$1/$2')
         .replace(/(\d{4})(\d)/, '$1-$2')
         .replace(/(-\d{2})\d+?$/, '$1')
)

export const cpfMask = (value: string): string => (
    value.replace(/\D+/g, '')
         .replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d)/, '$1-$2')
         .replace(/(-\d{2})\d+?$/, '$1')
)

export const cepMask = (value: string): string => (
    value.replace(/\D+/g, '').replace(/(\d{5})(\d)/, '$1-$2')
)

export const inputMasks = {
    document: (event, input) => {
        if(event.target.value.replace(/\D+/g, '').length <= 11){
            input.value = cpfMask(event.target.value)
        } else{
            input.value = cnpjMask(event.target.value)
        }
    },
    cep: (event, input) => {
        input.value = cepMask(event.target.value.replace(/\D+/g, ''))
    },
    number: (event, input) => {
        input.value = event.target.value.replace(/\D+/g, '')
    }
}