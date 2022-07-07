import axios from 'axios'
// const baseUrl = 'http://localhost:3001/tasks'
// const baseUrl = 'http://localhost:3001/api/tasks'
const baseUrl = '/api/tasks'

/** Handles axios requests */

const getAll = () => {
  const request = axios.get(baseUrl)

  const nonExisting = {
    id: 10000,
    title: 'This note is not saved to server',
    date: '2019-05-30T17:30:31.098Z',
    completed: true,
  }
  return request.then(response => response.data.concat(nonExisting))

  // return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update }