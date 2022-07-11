import { useState, useEffect, useRef } from 'react'

import Task from './components/Task'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import taskService from './services/tasks'
import loginService from './services/login'
import Toggleable from './components/Toggleable'
import './index.css'
import TaskForm from './components/TaskForm'


const App = () => {

  /*
  ---------------------------- useState vars */

  const [tasks, setTasks] = useState([]) // all tasks (IST EIN ARRAY!!!)
  const [showAllTasks, setShowAllTasks] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) // user object (if logged in)


  /*
  ---------------------------- useEffect */

  // Load all tasks from server
  useEffect(() => {
    taskService
      .getAll()
      .then(initialTasks => {
        setTasks(initialTasks)
      })
  }, [])

  // Load user from localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      taskService.setToken(user.token)
    }
  }, [])


  /*
  ---------------------------- Methods */

  // Login handler
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

  // Logout handler
  const handleLogout = () => {
    try {
      window.localStorage.removeItem('loggedUser')
      setUser(null)
      taskService.setToken(null)
    } catch (exception) {
      setErrorMessage('Logout failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


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

  const addTask = (newTaskObject) => {
    // Vor dem Hinzufuegen des neuen Tasks, das Form schließen
    taskFormRef.current.toggleVisibility()

    taskService
      .create(newTaskObject)
      .then(returnedTask => {
        setTasks(tasks.concat(returnedTask))
      })
  }

  // Show all tasks
  const tasksToShow = showAllTasks ? tasks : tasks.filter(task => task.completed)

  // Ref for task form
  const taskFormRef = useRef()


  /*
  ---------------------------- Render */
  return (
    <div>
      <h1>Tasks</h1>
      <Notification message={errorMessage} />

      {user === null ?
        <Toggleable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Toggleable>
        :
        <div>
          <p id='logged-text'>{user.name} is logged in!</p>
          <Toggleable buttonLabel='new task' ref={taskFormRef}>
            <TaskForm createTask={addTask} />
          </Toggleable>
          <button onClick={handleLogout}>Logout</button>
        </div>
      }

      <div>
        <button onClick={() => setShowAllTasks(!showAllTasks)}>
          show {showAllTasks ? 'done' : 'all tasks'}
        </button>
      </div>
      <ul>
        {tasksToShow.map(task =>
          <Task key={task.id} task={task} toggleTaskCompleted={() => toggleTaskCompletedFor(task.id)} />)}
      </ul>
    </div >
  )
}

export default App



