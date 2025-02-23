import React from 'react';

interface TaskItemProps {
    id: number;
    title: string;
    description?: string;
    isComplete: boolean;
    onUpdate: (id: number, updatedTask: Partial<Omit<TaskItemProps, 'id'>>) => void;
    onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ id, title, description, isComplete, onUpdate, onDelete }) => {
    const handleToggleComplete = () => {
        onUpdate(id, { isComplete: !isComplete });
    };

    const handleDelete = () => {
        onDelete(id);
    };

    return (
        <div className="task-item">
            <h3>{title}</h3>
            {description && <p>{description}</p>}
            <div>
                <button onClick={handleToggleComplete}>
                    {isComplete ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

export default TaskItem;