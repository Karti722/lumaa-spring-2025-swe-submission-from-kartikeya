import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

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
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <h3>Create New Task</h3>
        <input
          type="text"
          placeholder="Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button onClick={handleCreateTask}>Create Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>{task.isComplete ? 'Complete' : 'Incomplete'}</p>
            <button onClick={() => handleUpdateTask(task.id, !task.isComplete)}>
              {task.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => handleEditTask(task)}>Edit</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {editTaskId !== null && (
        <div>
          <h3>Edit Task</h3>
          <input
            type="text"
            placeholder="Title"
            value={editTaskTitle}
            onChange={(e) => setEditTaskTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={editTaskDescription}
            onChange={(e) => setEditTaskDescription(e.target.value)}
          />
          <button onClick={handleSaveTask}>Save Task</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;