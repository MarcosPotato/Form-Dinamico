
export const validadeCNPJ = (cnpj: string): boolean => {
    let auxToValidate = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let auxCalToValidade: Array<number> = []

    if(cnpj === undefined || cnpj === null){
        return false
    }

    const filteredData = cnpj.replace(/[^a-zA-Z0-9 ]/g, "").split("")

    if(filteredData.length !== 14){
        return false
    }

    const firstDigit = Number(filteredData[12])

    for(let cnpjDigit = 0; cnpjDigit < filteredData.length - 2; cnpjDigit++){
        auxCalToValidade.push(Number(filteredData[cnpjDigit]) * auxToValidate[cnpjDigit])
    }

    let SumProd = auxCalToValidade.reduce((prevValue, currentValue) => prevValue + currentValue)

    if(SumProd%11 < 2){
        if(firstDigit !== 0){
            return false
        }
    }else{
        if(firstDigit !== (11 - (SumProd%11))){
            return false
        }
    }

    auxToValidate.unshift(6)
    auxCalToValidade = []
    SumProd = 0

    const secondDigit = Number(filteredData[13])

    for(let cnpjDigit = 0; cnpjDigit < filteredData.length - 1; cnpjDigit++){
        auxCalToValidade.push(Number(filteredData[cnpjDigit]) * auxToValidate[cnpjDigit])
    }

    SumProd = auxCalToValidade.reduce((prevValue, currentValue) => prevValue + currentValue)

    if(SumProd%11 < 2){
        if(secondDigit !== 0){
            return false
        }
    }else{
        if(secondDigit !== (11 - (SumProd%11))){
            return false
        }
    }

    return true
}

export const validadeCPF = (cpf: string): boolean => {
    if(cpf === "" || cpf === null){
        return false
    }

    const filteredData = cpf.replace(/[^a-zA-Z0-9 ]/g, "")

    if(filteredData.length > 11){
        return false
    }

    let isEqual = true;

    for(let char = 0; char < filteredData.length - 1; char++){
        if(filteredData[char] !== filteredData[char + 1])
            isEqual = false
    }

    if(isEqual){
        return false
    }

    let cpfAmount = 0
    let auxCpfMulti = 10

    for(let char = 0; char < filteredData.length - 2; char++){
        cpfAmount += (Number(filteredData[char]) * auxCpfMulti)
        auxCpfMulti-- 
    }

    let firstDigit = ((cpfAmount*10)%11).toString().split('').pop()

    if(firstDigit !== filteredData[9]){
        return false
    }

    cpfAmount = 0
    auxCpfMulti = 11

    for(let char = 0; char < filteredData.length - 1; char++){
        cpfAmount += (Number(filteredData[char]) * auxCpfMulti)
        auxCpfMulti-- 
    }

    let secondDigit = ((cpfAmount*10)%11).toString().split('').pop()

    if(secondDigit !== filteredData[10]){
        return false
    }

    return true
}