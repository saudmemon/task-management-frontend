import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useRouter } from 'next/router';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLogOut,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiList,
  FiSave,
  FiX
} from 'react-icons/fi';

/**
 * Dashboard Page Component
 * Main application interface for task management
 * Features: Create, Read, Update, Delete tasks with filtering
 */
export default function Dashboard() {
  const router = useRouter();

  // Task state management
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  // Form state for new tasks
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  // Edit mode state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');

  // Auth state
  const [user, setUser] = useState(null);
  const [isProtected, setIsProtected] = useState(false);

  /**
   * Check authentication token and load user data on component mount
   * Redirects to login if no token is found
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    // Parse and load saved user information
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse user data', err);
      }
    }

    setIsProtected(true);
  }, [router]);

  /**
   * Fetch all tasks from the server
   * Handles authentication errors by redirecting to login
   */
  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      const taskData = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      setTasks(taskData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tasks';
      console.error('Fetch error:', errorMessage);
      // Redirect to login if token is invalid
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  };

  /**
   * Load tasks when dashboard is authenticated
   */
  useEffect(() => {
    if (isProtected) {
      fetchTasks();
    }
  }, [isProtected]);

  /**
   * Create a new task
   * Validates title before submission
   */
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }
    try {
      await API.post('/tasks', { title: taskTitle, description: taskDescription });
      setTaskTitle('');
      setTaskDescription('');
      fetchTasks();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error adding task';
      alert(errorMessage);
      console.error('Add error:', err);
    }
  };

  /**
   * Delete a task after user confirmation
   */
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error deleting task';
      alert(errorMessage);
      console.error('Delete error:', err);
    }
  };

  /**
   * Prepare task for editing by loading its data into edit state
   */
  const handleEditStart = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status || 'pending');
  };

  /**
   * Update task with new values
   * Validates title before submission
   */
  const handleUpdateTask = async (taskId) => {
    if (!editTitle.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    try {
      await API.put(`/tasks/${taskId}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus
      });

      setTasks(tasks.map(task =>
        task._id === taskId
          ? { ...task, title: editTitle, description: editDescription, status: editStatus }
          : task
      ));

      setEditingTaskId(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error updating task';
      alert(errorMessage);
      console.error('Update error:', err);
    }
  };

  /**
   * Cancel editing and reset edit state
   */
  const handleEditCancel = () => {
    setEditingTaskId(null);
  };

  /**
   * Clear user session and redirect to login
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  /**
   * Filter tasks based on selected filter
   */
  useEffect(() => {
    const filtered = tasks.filter(task => {
      if (filter === 'completed') return task.status === 'completed';
      if (filter === 'pending') return task.status === 'pending';
      if (filter === 'in-progress') return task.status === 'in-progress';
      return true;
    });
    setFilteredTasks(filtered);
  }, [tasks, filter]);

  /**
   * Calculate task statistics for dashboard cards
   */
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'white', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiList style={{ fontSize: '24px', color: '#667eea' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'white', margin: 0 }}>Task Dashboard</h1>
            {user && <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', margin: '6px 0 0 0' }}>Welcome back, <strong>{user.name}</strong>!</p>}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: '#FE6337', color: 'white', padding: '10px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(254, 99, 55, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#E54D23'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(254, 99, 55, 0.4)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = '#FE6337'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(254, 99, 55, 0.3)'; }}
        >
          <FiLogOut /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {[
            { label: 'Total Tasks', value: stats.total, bgColor: '#667eea', icon: <FiList /> },
            { label: 'Completed', value: stats.completed, bgColor: '#27ae60', icon: <FiCheckCircle /> },
            { label: 'In Progress', value: stats.inProgress, bgColor: '#f39c12', icon: <FiActivity /> },
            { label: 'Pending', value: stats.pending, bgColor: '#e74c3c', icon: <FiClock /> }
          ].map((stat, idx) => (
            <div key={idx} style={{ background: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', borderTop: `4px solid ${stat.bgColor}`, transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <p style={{ color: '#999', fontSize: '12px', fontWeight: '600', margin: 0, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{stat.label}</p>
                  <p style={{ color: stat.bgColor, fontSize: '36px', fontWeight: '700', margin: '12px 0 0 0' }}>{stat.value}</p>
                </div>
                <div style={{ fontSize: '32px', opacity: 0.3 }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Section */}
        <div style={{ background: 'white', padding: '32px', borderRadius: '12px', marginBottom: '32px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 24px 0' }}>Create New Task</h2>
          <form onSubmit={handleAddTask}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Task Title *</label>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.3s ease', fontFamily: 'inherit' }}
                onFocus={(e) => { e.target.style.borderColor = '#667eea'; e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Description</label>
              <textarea
                placeholder="Add details about your task..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', minHeight: '100px', boxSizing: 'border-box', transition: 'all 0.3s ease', resize: 'vertical', fontFamily: 'inherit' }}
                onFocus={(e) => { e.target.style.borderColor = '#667eea'; e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button
              type="submit"
              style={{ background: '#FE6337', color: 'white', padding: '12px 32px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(254, 99, 55, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#E54D23'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(254, 99, 55, 0.4)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#FE6337'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(254, 99, 55, 0.3)'; }}
            >
              <FiPlus /> Add Task
            </button>
          </form>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {[
            { value: 'all', label: 'All Tasks', color: '#667eea' },
            { value: 'pending', label: 'Pending', color: '#e74c3c' },
            { value: 'in-progress', label: 'In Progress', color: '#f39c12' },
            { value: 'completed', label: 'Completed', color: '#27ae60' }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '10px 20px',
                border: filter === f.value ? 'none' : `2px solid ${f.color}`,
                background: filter === f.value ? f.color : 'white',
                color: filter === f.value ? 'white' : f.color,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: filter === f.value ? `0 4px 12px ${f.color}33` : 'none'
              }}
              onMouseOver={(e) => { if (filter !== f.value) { e.target.style.background = f.color + '10'; } }}
              onMouseOut={(e) => { if (filter !== f.value) { e.target.style.background = 'white'; } }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div style={{ background: 'white', padding: '80px 20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📋</div>
            <p style={{ fontSize: '18px', color: '#999', margin: 0, fontWeight: '500' }}>
              {filter === 'all' ? 'No tasks yet. Create one to get started!' : `No ${filter} tasks`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', transition: 'all 0.3s ease', borderLeft: `5px solid ${task.status === 'completed' ? '#27ae60' : task.status === 'in-progress' ? '#f39c12' : '#e74c3c'}` }}
                onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {editingTaskId === task._id ? (
                  // Edit Mode
                  <div style={{ padding: '24px', background: '#f9f9f9' }}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', border: '2px solid #667eea', borderRadius: '8px', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', fontFamily: 'inherit', fontWeight: '600' }}
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', minHeight: '80px', marginBottom: '12px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleUpdateTask(task._id)}
                        style={{ flex: 1, padding: '10px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        onMouseOver={(e) => e.target.style.background = '#229954'}
                        onMouseOut={(e) => e.target.style.background = '#27ae60'}
                      >
                        <FiSave /> Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        style={{ flex: 1, padding: '10px', background: '#bdc3c7', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        onMouseOver={(e) => e.target.style.background = '#95a5a6'}
                        onMouseOut={(e) => e.target.style.background = '#bdc3c7'}
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>{task.title}</h3>
                        <span
                          style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            background: task.status === 'completed' ? '#d4edda' : task.status === 'in-progress' ? '#cce5ff' : '#fff3cd',
                            color: task.status === 'completed' ? '#155724' : task.status === 'in-progress' ? '#004085' : '#856404'
                          }}
                        >
                          {task.status === 'completed' ? 'Done' : task.status === 'in-progress' ? 'In Progress' : 'Todo'}
                        </span>
                      </div>
                      {task.description && <p style={{ fontSize: '13px', color: '#666', margin: '8px 0 0 0', lineHeight: '1.5' }}>{task.description}</p>}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                      <button
                        onClick={() => handleEditStart(task)}
                        style={{ padding: '8px 12px', background: '#FE6337', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#E54D23'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#FE6337'}
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        style={{ padding: '8px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#c0392b'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#e74c3c'}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
