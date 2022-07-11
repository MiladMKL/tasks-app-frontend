import axios from 'axios'
const baseUrl = '/api/tasks'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

/** Handles axios requests */

const getAll = () => {
  const request = axios.get(baseUrl)

  /*
  const nonExisting = {
    id: 10000,
    title: 'This note is not saved to server',
    date: '2019-05-30T17:30:31.098Z',
    completed: true,
  }
  return request.then(response => response.data.concat(nonExisting))
  */

  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  // const request = axios.post(baseUrl, newObject)
  // return request.then(response => response.data)

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, update, setToken }