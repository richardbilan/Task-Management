import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState({ show: false, editing: null, form: { title: '', description: '' } })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()
      setTasks(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title ? task.title.toLowerCase().includes(search.toLowerCase()) : false
    const matchFilter = filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'incomplete' && !task.completed)
    return matchSearch && matchFilter
  })

  const saveTask = async () => {
    if (!modal.form.title.trim()) return

    try {
      if (modal.editing) {
        console.log('Sending update:', modal.form)
        const response = await fetch(`${API_URL}/${modal.editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modal.form)
        })
        if (!response.ok) throw new Error('Failed to update task')
        const updatedTask = await response.json()
        console.log('Received update:', updatedTask)
        setTasks(tasks.map(t => t.id === modal.editing.id ? updatedTask : t))
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...modal.form, completed: false })
        })
        if (!response.ok) throw new Error('Failed to create task')
        const newTask = await response.json()
        setTasks([...tasks, newTask])
      }
      setModal({ show: false, editing: null, form: { title: '', description: '' } })
    } catch (err) {
      console.error('Error saving task:', err)
      alert('Error saving task: ' + err.message)
    }
  }

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: !task.completed })
      })
      if (!response.ok) throw new Error('Failed to toggle task')
      const updatedTask = await response.json()
      setTasks(tasks.map(t => t.id === id ? updatedTask : t))
    } catch (err) {
      console.error('Error toggling task:', err)
      alert('Error toggling task: ' + err.message)
    }
  }

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  const editTask = (task) => {
    setModal({
      show: true,
      editing: task,
      form: {
        title: task.title,
        description: task.description
      }
    })
  }

  const closeModal = () => {
    setModal({
      show: false,
      editing: null,
      form: { title: '', description: '' }
    })
  }

  const updateForm = (field, value) => {
    setModal({
      ...modal,
      form: { ...modal.form, [field]: value }
    })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>My Tasks</h1>
        <input type="text" placeholder="Search Task" value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
      </header>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div className="filters">
        {['all', 'incomplete', 'completed'].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)} Tasks
          </button>
        ))}
        <button onClick={() => setModal({ ...modal, show: true })} className="add-task-btn">+ Add Task</button>
      </div>

      {modal.show && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal.editing ? 'Edit Task' : 'Add New Task'}</h2>
            <input type="text" placeholder="Title *" value={modal.form.title} onChange={e => updateForm('title', e.target.value)} className="modal-input" />
            <textarea placeholder="Description" value={modal.form.description} onChange={e => updateForm('description', e.target.value)} className="modal-textarea" />
            <div className="modal-actions">
              <button onClick={closeModal} className="cancel-btn">Cancel</button>
              <button onClick={saveTask} className="confirm-btn">{modal.editing ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
            <div className="task-content">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            <div className="task-actions">
              <button onClick={() => editTask(task)} className="action-btn edit-btn">Edit</button>
              <button onClick={() => deleteTask(task.id)} className="action-btn delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
