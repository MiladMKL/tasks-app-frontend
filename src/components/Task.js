const Task = ({ task, toggleTaskDone }) => {
  const label = task.done ? '✓' : '✗'

  return (
    <li>
      {task.name}
      <span> </span>
      <button onClick={toggleTaskDone}>{label}</button>
    </li>
  )
}

export default Task