import axios from "axios"
const baseURL = "http://localhost:7001/api"


const instance = axios.create({
    baseURL: baseURL
})

export default instance