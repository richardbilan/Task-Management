import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState({ show: false, editing: null, form: { title: '', description: '' } })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    setLoading(true)
    const res = await fetch(API_URL)
    setTasks(await res.json())
    setLoading(false)
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && task.completed) || 
      (filter === 'incomplete' && !task.completed)
    return matchesSearch && matchesFilter
  })

  const apiCall = async (url, options = {}) => {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
    return res.status === 204 ? null : res.json()
  }

  const saveTask = async () => {
    if (!modal.form.title.trim()) return

    const data = modal.editing
      ? await apiCall(`${API_URL}/${modal.editing.id}`, { method: 'PUT', body: JSON.stringify(modal.form) })
      : await apiCall(API_URL, { method: 'POST', body: JSON.stringify({ ...modal.form, completed: false }) })
    
    setTasks(modal.editing 
      ? tasks.map(t => t.id === modal.editing.id ? data : t)
      : [...tasks, data])
    closeModal()
  }

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const updated = await apiCall(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify({ ...task, completed: !task.completed }) })
    setTasks(tasks.map(t => t.id === id ? updated : t))
  }

  const deleteTask = async (id) => {
    await apiCall(`${API_URL}/${id}`, { method: 'DELETE' })
    setTasks(tasks.filter(t => t.id !== id))
  }

  const editTask = (task) => setModal({ show: true, editing: task, form: { title: task.title, description: task.description } })
  const closeModal = () => setModal({ show: false, editing: null, form: { title: '', description: '' } })
  const updateForm = (field, value) => setModal({ ...modal, form: { ...modal.form, [field]: value } })

  return (
    <div className="app">
      <header className="header">
        <h1>My Tasks</h1>
        <input type="text" placeholder="Search Task" value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
      </header>

      {loading && <p>Loading...</p>}

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
