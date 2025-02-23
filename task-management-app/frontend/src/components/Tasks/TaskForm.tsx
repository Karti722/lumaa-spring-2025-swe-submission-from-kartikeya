import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createTask, updateTask } from '../../services/taskService';

interface TaskFormProps {
  existingTask?: {
    id: number;
    title: string;
    description?: string;
    isComplete: boolean;
  };
  onTaskUpdated?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ existingTask, onTaskUpdated }) => {
  const [title, setTitle] = useState(existingTask ? existingTask.title : '');
  const [description, setDescription] = useState(existingTask ? existingTask.description : '');
  const [isComplete, setIsComplete] = useState(existingTask ? existingTask.isComplete : false);
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingTask) {
      await updateTask(existingTask.id, { title, description, isComplete });
    } else {
      await createTask({ title, description, isComplete });
    }
    if (onTaskUpdated) {
      onTaskUpdated();
    }
    history.push('/tasks');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isComplete}
            onChange={(e) => setIsComplete(e.target.checked)}
          />
          Completed
        </label>
      </div>
      <button type="submit">{existingTask ? 'Update Task' : 'Create Task'}</button>
    </form>
  );
};

export default TaskForm;