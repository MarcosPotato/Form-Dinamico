import Axios from 'axios'

const api = Axios.create({
    baseURL: "http://naos.logithink.it:10571/rest"
})

export default api