import { useState, useEffect } from 'react'
import Task from './components/Task'
import Notification from './components/Notification'
import taskService from './services/tasks'
import './index.css'


const App = (props) => {

  /*
  ---------------------------- useState vars */

  const [tasks, setTasks] = useState([]) // all tasks (IST EIN ARRAY!!!)
  const [newTask, setNewTask] = useState('') // new task (input)
  const [showAllTasks, setShowAllTasks] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')


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

  const toggleTaskDoneFor = (id) => {
    const task = tasks.find(task => task.id === id)
    const changedTask = { ...task, done: !task.done }

    taskService
      .update(id, changedTask)
      .then(returnedTask => {
        setTasks(tasks.map(task => task.id !== id ? task : returnedTask)) // Gibt veraendertes Task zurueck
      })
      .catch(error => {
        setErrorMessage(`Task '${task.name}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setTasks(tasks.filter(n => n.id !== id))
      })
  }

  const addTask = (event) => {
    event.preventDefault()

    const newTaskObject = {
      id: tasks.count + 1,
      name: newTask,
      date: new Date(),
      done: false
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
  const tasksToShow = showAllTasks ? tasks : tasks.filter(task => task.done)

  /*
  ---------------------------- Render */
  return (
    <div>
      <h1>Tasks</h1>
      <Notification message={errorMessage} />
      <button onClick={() => setShowAllTasks(!showAllTasks)}>{showAllTasks ? 'show done' : 'show all tasks'}</button>
      <ul>
        {tasksToShow.map(task => <Task key={task.id} task={task} toggleTaskDone={() => toggleTaskDoneFor(task.id)} />)}
      </ul>

      <form onSubmit={addTask}>
        <input
          value={newTask}
          onChange={handleInputChange}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}

export default App



