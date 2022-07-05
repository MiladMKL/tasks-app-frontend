import { useState, useEffect } from 'react'
import Task from './components/Task'
import axios from 'axios'


const App = (props) => {

  /*
  ---------------------------- useState vars */
  const [tasks, setTasks] = useState([]) // all tasks (IST EIN ARRAY!!!)
  const [newTask, setNewTask] = useState('') // new task (input)
  const [showAllTasks, setShowAllTasks] = useState(true)


  /*
  ---------------------------- useEffect */
  useEffect(() => {
    axios
      .get('http://localhost:3001/tasks')
      .then(response => {
        setTasks(response.data)
      })
  }, [])


  /*
  ---------------------------- Methods */
  const addTask = (event) => {
    event.preventDefault()
    console.log('clicked!', event.target);

    const newTaskObject = {
      id: tasks.count + 1,
      name: newTask,
      date: new Date(),
      done: false
    }

    axios.post('http://localhost:3001/tasks', newTaskObject)
      .then(response => {
        setTasks(tasks.concat(response.data))
        setNewTask('')
      })
  }

  const handleInputChange = (event) => {
    setNewTask(event.target.value)
  }

  const tasksToShow = showAllTasks ? tasks : tasks.filter(task => task.done)

  /*
  ---------------------------- Render */
  return (
    <div>
      <h1>Tasks</h1>
      <button onClick={() => setShowAllTasks(!showAllTasks)}>{showAllTasks ? 'show done' : 'show all tasks'}</button>
      <ul>
        {tasksToShow.map(task => <Task key={task.id} task={task} />)}
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



