import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import './Dashboard.css';

interface Task {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await getTasks(token);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        navigate('/login');
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateTask = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await createTask(token, { title: newTaskTitle, description: newTaskDescription });
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (id: number, isComplete: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const updatedTask = { isComplete };
      await updateTask(token, id, updatedTask);
      setTasks(tasks.map(task => (task.id === id ? { ...task, isComplete } : task)));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
  };

  const handleSaveTask = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (editTaskId === null) return;

    try {
      const updatedTask = { title: editTaskTitle, description: editTaskDescription };
      await updateTask(token, editTaskId, updatedTask);
      setTasks(tasks.map(task => (task.id === editTaskId ? { ...task, ...updatedTask } : task)));
      setEditTaskId(null);
      setEditTaskTitle('');
      setEditTaskDescription('');
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await deleteTask(token, id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Task Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">⏻</span>
          Logout
        </button>
      </div>
      
      <div className="create-task-section">
        <h3 className="section-title">Create New Task</h3>
        <div className="task-form">
          <input
            type="text"
            className="task-input"
            placeholder="Enter task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <input
            type="text"
            className="task-input task-description"
            placeholder="Enter task description..."
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <button className="create-btn" onClick={handleCreateTask}>
            <span className="btn-icon">+</span>
            Create Task
          </button>
        </div>
      </div>

      <div className="tasks-section">
        <h3 className="section-title">Your Tasks</h3>
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.isComplete ? 'completed' : ''}`}>
              <div className="task-header">
                <h4 className="task-title">{task.title}</h4>
                <div className={`status-badge ${task.isComplete ? 'complete' : 'incomplete'}`}>
                  {task.isComplete ? '✓ Complete' : '○ Incomplete'}
                </div>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-actions">
                <button className="edit-btn" onClick={() => handleEditTask(task)}>
                  <span className="btn-icon">✎</span>
                  Edit
                </button>
                <button 
                  className="toggle-btn"
                  onClick={() => handleUpdateTask(task.id, !task.isComplete)}
                >
                  <span className="btn-icon">{task.isComplete ? '↺' : '✓'}</span>
                  {task.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={!task.isComplete}
                >
                  <span className="btn-icon">🗑</span>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editTaskId !== null && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3 className="modal-title">Edit Task</h3>
            <div className="modal-form">
              <input
                type="text"
                className="task-input"
                placeholder="Task title..."
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
              />
              <input
                type="text"
                className="task-input task-description"
                placeholder="Task description..."
                value={editTaskDescription}
                onChange={(e) => setEditTaskDescription(e.target.value)}
              />
              <div className="modal-actions">
                <button className="save-btn" onClick={handleSaveTask}>
                  <span className="btn-icon">💾</span>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={() => setEditTaskId(null)}>
                  <span className="btn-icon">✕</span>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;