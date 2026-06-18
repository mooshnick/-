import { useEffect, useState } from 'react'

const savedTasks = JSON.parse(localStorage.getItem('tasksList')) || []

function App() {
  const [tasks, setTasks] = useState(savedTasks)
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    localStorage.setItem('tasksList', JSON.stringify(tasks))
  }, [tasks])

  function addTask(event) {
    event.preventDefault()

    if (newTask.trim() === '') {
      return
    }

    const task = {
      id: Date.now(),
      text: newTask.trim(),
      isCompleted: false
    }

    setTasks([...tasks, task])
    setNewTask('')
  }

  function deleteTask(id) {
    const afterDelete = tasks.filter((task) => task.id !== id)
    setTasks(afterDelete)
  }

  function changeCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, isCompleted: !task.isCompleted }
      }
      return task
    })

    setTasks(updatedTasks)
  }

  function startEdit(task) {
    setEditingId(task.id)
    setEditText(task.text)
  }

  function saveEdit(id) {
    if (editText.trim() === '') {
      return
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, text: editText.trim() }
      }
      return task
    })

    setTasks(updatedTasks)
    setEditingId(null)
    setEditText('')
  }

  let tasksToShow = tasks

  if (filter === 'active') {
    tasksToShow = tasks.filter((task) => !task.isCompleted)
  }

  if (filter === 'completed') {
    tasksToShow = tasks.filter((task) => task.isCompleted)
  }

  const completedCount = tasks.filter((task) => task.isCompleted).length

  return (
    <main className="page">
      <section className="box">
        <h1>רשימת משימות</h1>
        <p className="small-title">משימת React - Todo List</p>

        <form onSubmit={addTask} className="add-form">
          <input
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="כתוב משימה חדשה..."
          />
          <button>הוסף</button>
        </form>

        <div className="filters">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'selected' : ''}>
            הכל
          </button>
          <button onClick={() => setFilter('active')} className={filter === 'active' ? 'selected' : ''}>
            פעילות
          </button>
          <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'selected' : ''}>
            בוצעו
          </button>
        </div>

        <div className="counter">
          סה״כ: {tasks.length} | בוצעו: {completedCount}
        </div>

        <ul className="tasks-list">
          {tasksToShow.length === 0 && <li className="empty">אין משימות להצגה</li>}

          {tasksToShow.map((task) => (
            <li key={task.id} className="task-row">
              {editingId === task.id ? (
                <>
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={(event) => setEditText(event.target.value)}
                  />
                  <button onClick={() => saveEdit(task.id)}>שמור</button>
                  <button onClick={() => setEditingId(null)}>ביטול</button>
                </>
              ) : (
                <>
                  <label className="task-text">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => changeCompleted(task.id)}
                    />
                    <span className={task.isCompleted ? 'done' : ''}>{task.text}</span>
                  </label>
                  <div className="task-buttons">
                    <button onClick={() => startEdit(task)}>ערוך</button>
                    <button onClick={() => deleteTask(task.id)}>מחק</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
