import React, { useEffect, useState } from 'react';
import { Task } from '../../types';
import { getTasks, deleteTask } from '../../services/taskService';
import TaskItem from './TaskItem';

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const fetchedTasks = await getTasks();
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    if (loading) {
        return <div>Loading tasks...</div>;
    }

    return (
        <div>
            <h2>Task List</h2>
            <ul>
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} onDelete={handleDelete} />
                ))}
            </ul>
        </div>
    );
};

export default TaskList;