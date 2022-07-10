import { useState, useEffect } from 'react'

import Task from './components/Task'
import Notification from './components/Notification'
import taskService from './services/tasks'
import loginService from './services/login'

import './index.css'


const App = () => {

  /*
  ---------------------------- useState vars */

  const [tasks, setTasks] = useState([]) // all tasks (IST EIN ARRAY!!!)
  const [newTask, setNewTask] = useState('') // new task (input)
  const [showAllTasks, setShowAllTasks] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) // user object (if logged in)

  /*
  ---------------------------- useEffect */

  useEffect(() => {
    taskService
      .getAll()
      .then(initialTasks => {
        setTasks(initialTasks)
      })
  }, [])

  /*
  ---------------------------- Methods */

  const toggleTaskCompletedFor = (id) => {
    const task = tasks.find(task => task.id === id)
    const changedTask = { ...task, completed: !task.completed }

    taskService
      .update(id, changedTask)
      .then(returnedTask => {
        setTasks(tasks.map(task => task.id !== id ? task : returnedTask)) // Gibt veraendertes Task zurueck
      })
      .catch(error => {
        setErrorMessage(`Task '${task.title}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setTasks(tasks.filter(n => n.id !== id))
      })
  }

  const addTask = (event) => {
    event.preventDefault()

    const newTaskObject = {
      title: newTask,
      date: new Date().toISOString(),
      completed: false,
      id: tasks.count + 1,
    }

    taskService
      .create(newTaskObject)
      .then(returnedTask => {
        setTasks(tasks.concat(returnedTask))
        setNewTask('')
      })
  }

  // Input change
  const handleInputChange = (event) => {
    setNewTask(event.target.value)
  }

  // Show all tasks
  const tasksToShow = showAllTasks ? tasks : tasks.filter(task => task.completed)

  // Login
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({ username, password })

      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))

      taskService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username:
          <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password:
          <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    )
  }

  const taskForm = () => {
    return (
      <form onSubmit={addTask}>
        <input
          value={newTask}
          onChange={handleInputChange}
        />
        <button type="submit">Add</button>
      </form>
    )
  }

  /*
  ---------------------------- Render */
  return (
    <div>
      <h1>Tasks</h1>
      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          {taskForm()}
        </div>}
      <div>
        <button onClick={() => setShowAllTasks(!showAllTasks)}>{showAllTasks ? 'show done' : 'show all tasks'}</button>
      </div>
      <ul>
        {tasksToShow.map(task => <Task key={task.id} task={task} toggleTaskCompleted={() => toggleTaskCompletedFor(task.id)} />)}
      </ul>
    </div>
  )
}

export default App



