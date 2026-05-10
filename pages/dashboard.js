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
  FiSearch,
  FiUser,
  FiGrid,
  FiSettings,
  FiPieChart,
  FiMenu,
  FiX
} from 'react-icons/fi';

const fetcher = (url) => API.get(url).then((res) => res.data);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isProtected, setIsProtected] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data: taskData, mutate } = useSWR(isProtected ? '/tasks' : null, fetcher, {
    revalidateOnFocus: true,
  });

  const tasks = useMemo(() => {
    if (!taskData) return [];
    return Array.isArray(taskData) ? taskData : taskData.tasks || [];
  }, [taskData]);

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    if (userData) { try { setUser(JSON.parse(userData)); } catch (err) {} }
    setIsProtected(true);
  }, [router]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }
    try {
      const newTask = { title: taskTitle, description: taskDescription, status: 'pending' };
      mutate([...tasks, { ...newTask, _id: 'temp-' + Date.now() }], false);
      await API.post('/tasks', newTask);
      setTaskTitle(''); setTaskDescription(''); setIsAddingTask(false);
      mutate();
    } catch (err) { alert('Failed to add task'); mutate(); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      mutate(tasks.filter(t => t._id !== taskId), false);
      await API.delete(`/tasks/${taskId}`);
      mutate();
    } catch (err) { alert('Failed to delete task'); mutate(); }
  };

  const handleUpdateTask = async (taskId) => {
    try {
      const updatedData = { title: editTitle, description: editDescription, status: editStatus };
      mutate(tasks.map(t => t._id === taskId ? { ...t, ...updatedData } : t), false);
      await API.put(`/tasks/${taskId}`, updatedData);
      setEditingTaskId(null);
      mutate();
    } catch (err) { alert('Failed to update task'); mutate(); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesFilter = filter === 'all' || task.status === filter;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: isSidebarOpen ? '280px' : '0px', 
        background: '#0f172a', 
        color: 'white', 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 100
      }} className="sidebar">
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
            <FiCheckCircle size={24} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>TaskMaster</span>
        </div>

        <nav style={{ flex: 1, padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'all', icon: <FiGrid />, label: 'Overview' },
            { id: 'pending', icon: <FiClock />, label: 'Upcoming' },
            { id: 'in-progress', icon: <FiActivity />, label: 'In Progress' },
            { id: 'completed', icon: <FiCheckCircle />, label: 'Completed' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                width: '100%',
                background: filter === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: filter === item.id ? 'white' : '#94a3b8',
                fontSize: '15px',
                fontWeight: '600'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
          
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#ef4444', width: '100%', background: 'transparent', fontWeight: '600' }}>
              <FiLogOut /> Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        {/* Top Navbar */}
        <header style={{ 
          padding: '20px 40px', 
          background: 'rgba(248, 250, 252, 0.8)', 
          backdropFilter: 'blur(10px)',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'white', padding: '10px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
              <FiMenu size={20} color="var(--text-main)" />
            </button>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search your tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '320px', padding: '12px 16px 12px 44px', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none', background: 'white', fontSize: '14px' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right', display: 'none' }} className="user-info">
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div style={{ padding: '40px' }}>
          {/* Dashboard Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', color: '#0f172a', marginBottom: '8px' }}>
                Hello, {user?.name?.split(' ')[0]} 👋
              </h2>
              <p style={{ fontSize: '16px', color: '#64748b' }}>You have {stats.pending} pending tasks for today.</p>
            </div>
            <button 
              onClick={() => setIsAddingTask(true)}
              style={{ 
                background: '#6366f1', 
                color: 'white', 
                padding: '14px 28px', 
                borderRadius: '14px', 
                fontWeight: '700', 
                fontSize: '15px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' 
              }}
            >
              <FiPlus size={20} /> New Task
            </button>
          </div>

          {/* Stats Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            {[
              { label: 'Total Tasks', value: stats.total, color: '#6366f1', icon: <FiList /> },
              { label: 'In Progress', value: stats.inProgress, color: '#f59e0b', icon: <FiActivity /> },
              { label: 'Completed', value: stats.completed, color: '#10b981', icon: <FiCheckCircle /> },
              { label: 'Pending', value: stats.pending, color: '#ef4444', icon: <FiClock /> },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>{stat.label}</p>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{stat.value}</p>
                </div>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${stat.color}10`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Task Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {isAddingTask && (
              <div className="glass" style={{ padding: '24px', borderRadius: '24px', border: '2px dashed #6366f1', animation: 'fadeIn 0.4s', background: 'white' }}>
                <input 
                  placeholder="Task Title (Required)" 
                  value={taskTitle} 
                  onChange={(e) => setTaskTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '16px', fontWeight: '700', outline: 'none', marginBottom: '12px' }}
                />
                <textarea 
                  placeholder="Description..." 
                  value={taskDescription} 
                  onChange={(e) => setTaskDescription(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', outline: 'none', minHeight: '80px', resize: 'none' }}
                />
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button onClick={handleAddTask} style={{ flex: 1, background: '#6366f1', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: '700' }}>Create</button>
                  <button onClick={() => setIsAddingTask(false)} style={{ flex: 1, background: '#e2e8f0', padding: '12px', borderRadius: '10px', fontWeight: '700' }}>Cancel</button>
                </div>
              </div>
            )}

            {filteredTasks.map((task) => (
              <div key={task._id} style={{ 
                background: 'white', 
                borderRadius: '24px', 
                padding: '24px', 
                boxShadow: 'var(--shadow-sm)', 
                border: '1px solid var(--border-light)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }} className="task-card">
                {editingTaskId === task._id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--primary)' }} />
                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={{ padding: '8px', borderRadius: '8px' }}>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleUpdateTask(task._id)} style={{ flex: 1, background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '8px' }}>Save</button>
                      <button onClick={() => setEditingTaskId(null)} style={{ flex: 1, background: 'var(--border-light)', padding: '8px', borderRadius: '8px' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '11px', 
                        fontWeight: '800', 
                        textTransform: 'uppercase',
                        background: task.status === 'completed' ? '#d1fae5' : task.status === 'in-progress' ? '#fef3c7' : '#fee2e2',
                        color: task.status === 'completed' ? '#059669' : task.status === 'in-progress' ? '#d97706' : '#dc2626'
                      }}>
                        {task.status.replace('-', ' ')}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => { setEditingTaskId(task._id); setEditTitle(task.title); setEditDescription(task.description); setEditStatus(task.status); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><FiEdit2 size={16} /></button>
                        <button onClick={() => handleDeleteTask(task._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 size={16} /></button>
                      </div>
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>{task.title}</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>{task.description}</p>
                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      <FiClock /> Created {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && !isAddingTask && (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <img src="https://illustrations.popsy.co/amber/no-messages-found.svg" alt="Empty" style={{ width: '200px', marginBottom: '24px', opacity: 0.5 }} />
              <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-muted)' }}>No tasks found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .task-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }
        @media (max-width: 768px) {
          .sidebar { width: 0 !important; }
          .user-info { display: none !important; }
        }
      `}</style>
    </div>
  );
}
