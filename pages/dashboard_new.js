import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isProtected, setIsProtected] = useState(false);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');

  // Check token and load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    // Load saved user info from storage
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

  // Fetch all tasks for current user
  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      const taskData = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      setTasks(taskData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tasks';
      console.error('Fetch error:', errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  };

  // Load tasks when dashboard is protected
  useEffect(() => {
    if (isProtected) {
      fetchTasks();
    }
  }, [isProtected]);

  // Add new task and refresh list
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }
    try {
      await API.post('/tasks', { title, description });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error adding task';
      alert(errorMessage);
      console.error('Add error:', err);
    }
  };

  // Delete task after confirmation
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

  // Prepare task for editing
  const handleEditStart = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status || 'pending');
  };

  // Save updated task to database
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

      setEditingId(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error updating task';
      alert(errorMessage);
      console.error('Update error:', err);
    }
  };

  // Cancel task editing
  const handleEditCancel = () => {
    setEditingId(null);
  };

  // Clear storage and redirect to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, marginBottom: '8px' }}>Dashboard</h1>
            {user && <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Welcome, <strong>{user.name}</strong></p>}
          </div>
          <button 
            onClick={handleLogout} 
            style={{ background: '#FE6337', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.3s ease' }}
            onMouseOver={(e) => e.target.style.background = '#E54D23'}
            onMouseOut={(e) => e.target.style.background = '#FE6337'}
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          
          {/* Add Task Form */}
          <form onSubmit={handleAddTask} style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Task Title</label>
            <input
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.3s ease' }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />

            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Description (Optional)</label>
            <textarea
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', minHeight: '100px', boxSizing: 'border-box', transition: 'border-color 0.3s ease', resize: 'vertical' }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />

            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', background: '#FE6337', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Add Task
            </button>
          </form>

          {/* Tasks Section */}
          <div style={{ marginTop: '30px', borderTop: '2px solid #f0f0f0', paddingTop: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Your Tasks</h2>
            
            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                <p style={{ fontSize: '16px' }}>No tasks yet. Create one to get started!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task._id} 
                  style={{ border: '2px solid #e0e0e0', borderRadius: '8px', padding: '18px', marginBottom: '15px', background: '#fafafa', transition: 'all 0.3s ease' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  
                  {editingId === task._id ? (
                    // Edit Mode
                    <div>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '2px solid #667eea', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', minHeight: '80px', boxSizing: 'border-box' }}
                      />
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleUpdateTask(task._id)}
                          style={{ flex: 1, padding: '10px', background: '#FE6337', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                          onMouseOver={(e) => e.target.style.background = '#E54D23'}
                          onMouseOut={(e) => e.target.style.background = '#FE6337'}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          style={{ flex: 1, padding: '10px', background: '#999', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                          onMouseOver={(e) => e.target.style.background = '#777'}
                          onMouseOut={(e) => e.target.style.background = '#999'}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', margin: '0 0 10px 0' }}>{task.title}</h3>
                      <p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0' }}>{task.description || 'No description'}</p>
                      
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginBottom: '12px',
                          background: task.status === 'completed' ? '#d4edda' : task.status === 'in-progress' ? '#cce5ff' : '#fff3cd',
                          color: task.status === 'completed' ? '#155724' : task.status === 'in-progress' ? '#004085' : '#856404'
                        }}
                      >
                        {task.status === 'completed' ? 'Completed' : task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </span>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <button
                          onClick={() => handleEditStart(task)}
                          style={{ flex: 1, padding: '8px', background: '#FE6337', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                          onMouseOver={(e) => e.target.style.background = '#E54D23'}
                          onMouseOut={(e) => e.target.style.background = '#FE6337'}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          style={{ flex: 1, padding: '8px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                          onMouseOver={(e) => e.target.style.background = '#da190b'}
                          onMouseOut={(e) => e.target.style.background = '#f44336'}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
