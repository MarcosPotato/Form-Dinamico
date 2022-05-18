import Axios from 'axios'

const api = Axios.create({
    baseURL: "http://ultrafinetechnologies105388.protheus.cloudtotvs.com.br:8400/rest"
})

export default api