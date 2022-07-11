import { useState } from 'react'

const TaskForm = ({ createTask }) => {
  const [newTask, setNewTask] = useState('')

  const handleInputChange = ({ target }) => {
    setNewTask(target.value)
  }

  const addTask = (event) => {
    event.preventDefault()

    createTask({
      title: newTask,
      completed: false,
    })

    setNewTask('')
  }


  return (
    <div>
      <h2>Create a new task</h2>

      <form onSubmit={addTask}>
        <input type="text" onChange={handleInputChange} value={newTask} />
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default TaskForm