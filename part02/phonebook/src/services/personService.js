import axios from "axios";

const baseUrl = "/api/persons"

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = (person) => {
    return axios.post(baseUrl, person).then(response => response.data)
}

const deleteOne = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

const updateOne = (id, newPerson) => {
    return axios.put(`${baseUrl}/${id}`, newPerson).then(response => response.data)
}

export default {
    getAll,
    create,
    deleteOne,
    updateOne
}