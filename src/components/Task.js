const Task = ({ task, toggleTaskCompleted }) => {
  const label = task.completed ? '✓' : '✗'

  return (
    <li>
      {task.title}
      <span> </span>
      <button onClick={toggleTaskCompleted}>{label}</button>
    </li>
  )
}

export default Task