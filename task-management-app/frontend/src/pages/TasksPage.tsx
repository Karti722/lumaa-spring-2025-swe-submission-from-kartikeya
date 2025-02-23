import React, { useEffect, useState } from 'react';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';
import { getTasks } from '../services/taskService';

const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const fetchedTasks = await getTasks();
            setTasks(fetchedTasks);
        };

        fetchTasks();
    }, []);

    return (
        <div>
            <h1>Task Management</h1>
            <TaskForm setTasks={setTasks} />
            <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
    );
};

export default TasksPage;