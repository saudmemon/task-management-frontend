import { useEffect, useState, useMemo } from 'react';
import API from '../utils/api';
import { useRouter } from 'next/router';
import useSWR from 'swr';
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
  FiX,
  FiSearch,
  FiFilter,
  FiUser
} from 'react-icons/fi';

// SWR Fetcher using our API instance
const fetcher = (url) => API.get(url).then((res) => res.data);

/**
 * Premium Dashboard Component
 * Features: SWR caching, Optimistic UI, Glassmorphism design
 */
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isProtected, setIsProtected] = useState(false);

  // Task state management via SWR
  const { data: taskData, error, mutate } = useSWR(isProtected ? '/tasks' : null, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 5000
  });

  const tasks = useMemo(() => {
    if (!taskData) return [];
    return Array.isArray(taskData) ? taskData : taskData.tasks || [];
  }, [taskData]);

  // UI State
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  // Edit mode state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Failed to parse user data', err);
      }
    }

    setIsProtected(true);
  }, [router]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const newTask = { title: taskTitle, description: taskDescription, status: 'pending' };
      // Optimistic Update
      mutate([...tasks, { ...newTask, _id: 'temp-' + Date.now() }], false);
      
      await API.post('/tasks', newTask);
      setTaskTitle('');
      setTaskDescription('');
      setIsAddingTask(false);
      mutate(); // Trigger revalidation
    } catch (err) {
      alert('Failed to add task');
      mutate();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      mutate(tasks.filter(t => t._id !== taskId), false);
      await API.delete(`/tasks/${taskId}`);
      mutate();
    } catch (err) {
      alert('Failed to delete task');
      mutate();
    }
  };

  const handleUpdateTask = async (taskId) => {
    try {
      const updatedData = { title: editTitle, description: editDescription, status: editStatus };
      mutate(tasks.map(t => t._id === taskId ? { ...t, ...updatedData } : t), false);
      await API.put(`/tasks/${taskId}`, updatedData);
      setEditingTaskId(null);
      mutate();
    } catch (err) {
      alert('Failed to update task');
      mutate();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesFilter = filter === 'all' || task.status === filter;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, searchQuery]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length
  }), [tasks]);

  if (!isProtected) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', paddingBottom: '80px' }}>
      {/* Header / Navbar */}
      <nav style={{ 
        background: 'white', 
        padding: '16px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'var(--primary)', 
            padding: '10px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
          }}>
            <FiList style={{ fontSize: '20px', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>TaskMaster</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{user.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Workspace Admin</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiUser style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{ 
              background: '#fee2e2', 
              color: '#ef4444', 
              padding: '10px 16px', 
              borderRadius: '10px', 
              fontSize: '13px', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '40px', animation: 'fadeIn 0.5s ease-out' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Workspace Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Track your progress and manage your daily objectives.</p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '24px', 
          marginBottom: '48px' 
        }}>
          {[
            { label: 'Total Tasks', value: stats.total, color: 'var(--primary)', icon: <FiList /> },
            { label: 'In Progress', value: stats.inProgress, color: '#f59e0b', icon: <FiActivity /> },
            { label: 'Completed', value: stats.completed, color: '#10b981', icon: <FiCheckCircle /> },
            { label: 'Pending', value: stats.pending, color: '#ef4444', icon: <FiClock /> }
          ].map((s, i) => (
            <div key={i} style={{ 
              background: 'white', 
              padding: '24px', 
              borderRadius: '20px', 
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)',
              animation: `fadeIn 0.5s ease-out ${i * 0.1}s both`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{s.label}</p>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{s.value}</p>
                </div>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: `${s.color}15`, 
                  color: s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions & Filters */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', gap: '12px', background: 'white', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            {['all', 'pending', 'in-progress', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  fontWeight: '700',
                  background: filter === f ? 'var(--primary)' : 'transparent',
                  color: filter === f ? 'white' : 'var(--text-muted)',
                  textTransform: 'capitalize'
                }}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', flex: 1, justifyContent: 'flex-end' }}>
            <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
              <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px 12px 40px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-light)',
                  background: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <button
              onClick={() => setIsAddingTask(true)}
              style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontSize: '14px', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              <FiPlus /> New Task
            </button>
          </div>
        </div>

        {/* Add Task Modal-like Form */}
        {isAddingTask && (
          <div style={{ 
            background: 'white', 
            padding: '32px', 
            borderRadius: '24px', 
            marginBottom: '40px', 
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-light)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Create New Task</h3>
              <button onClick={() => setIsAddingTask(false)} style={{ color: 'var(--text-muted)', background: 'none' }}><FiX size={24} /></button>
            </div>
            <form onSubmit={handleAddTask}>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Task Title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '16px', fontWeight: '600' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <textarea
                  placeholder="Description (Optional)"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '15px', minHeight: '100px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsAddingTask(false)} style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--bg-app)', color: 'var(--text-main)', fontWeight: '700' }}>Cancel</button>
                <button type="submit" style={{ padding: '12px 32px', borderRadius: '10px', background: 'var(--primary)', color: 'white', fontWeight: '700' }}>Create Task</button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '24px', border: '1px dashed var(--border-light)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>No tasks found in this view.</p>
            </div>
          ) : (
            filteredTasks.map((task, idx) => (
              <div key={task._id} style={{ 
                background: 'white', 
                borderRadius: '20px', 
                padding: '24px', 
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                animation: `slideInRight 0.4s ease-out ${idx * 0.05}s both`
              }} className="task-card">
                {editingTaskId === task._id ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--primary)' }} />
                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={{ padding: '8px', borderRadius: '8px' }}>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button onClick={() => handleUpdateTask(task._id)} style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', borderRadius: '8px' }}>Save</button>
                      <button onClick={() => setEditingTaskId(null)} style={{ padding: '8px 16px', background: 'var(--bg-app)', borderRadius: '8px' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{task.title}</h4>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '11px', 
                          fontWeight: '800', 
                          textTransform: 'uppercase',
                          background: task.status === 'completed' ? '#d1fae5' : task.status === 'in-progress' ? '#fef3c7' : '#fee2e2',
                          color: task.status === 'completed' ? '#059669' : task.status === 'in-progress' ? '#d97706' : '#dc2626'
                        }}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>
                      {task.description && <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>{task.description}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => {
                          setEditingTaskId(task._id);
                          setEditTitle(task.title);
                          setEditDescription(task.description);
                          setEditStatus(task.status);
                        }} 
                        style={{ padding: '10px', borderRadius: '10px', background: 'var(--bg-app)', color: 'var(--text-muted)' }}
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task._id)} 
                        style={{ padding: '10px', borderRadius: '10px', background: '#fee2e2', color: '#ef4444' }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <style jsx>{`
        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}
  );
}
