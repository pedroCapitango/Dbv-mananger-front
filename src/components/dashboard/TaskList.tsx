import React, { useState } from 'react';
import type { Task } from '../../types';
import { Card } from '../ui/Card';
import { PRIORITY_COLORS } from '../../utils/constants';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa',
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tarefas Pendentes</h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={() => toggleTask(task.id)}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-label={`Marcar "${task.task}" como concluída`}
            />
            <div className="flex-1">
              <p className={`text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.task}
              </p>
              <span
                className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}
              >
                {getPriorityLabel(task.priority)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
