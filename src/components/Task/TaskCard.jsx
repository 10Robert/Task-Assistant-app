import React from 'react';
import { Check, Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { getPriorityColor, getTaskStatusColor } from '../../utils/formatUtils';
import { handleDragStart } from '../../utils/dragDropUtils';
import StatusIcon from '../UI/StatusIcon';
import { useTaskContext } from '../../context/TaskContext';
import { TASK_STATUS } from '../../constants/taskStatuses';

const TaskCard = ({ task, onEdit, onDelete, onComplete, onClick }) => {
  const { setDraggedTask } = useTaskContext();
  const isOverdue = task.isOverdue;

  return (
    <div 
      key={task.id} 
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 cursor-grab min-w-64 flex-shrink-0 max-w-xs mr-4 mb-4 hover:shadow-lg transition-shadow ${
        isOverdue ? "border-red-500 bg-red-50" : getTaskStatusColor(task.status)
      }`}
      onClick={() => onClick(task)}
      draggable={true}
      onDragStart={(e) => handleDragStart(e, task, setDraggedTask)}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-semibold ${task.status === TASK_STATUS.COMPLETED ? "line-through text-gray-500" : ""} ${isOverdue ? "text-red-700" : ""}`}>
          {task.name}
        </h2>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <div className="flex items-center">
          <StatusIcon status={task.status} />
          <span className="ml-1 text-sm text-gray-600">{task.status}</span>
        </div>
      </div>
      
      <p className={`text-gray-600 mb-2 text-sm ${task.status === TASK_STATUS.COMPLETED ? "line-through text-gray-500" : ""}`}>
        {task.description.length > 100 ? task.description.substring(0, 97) + '...' : task.description}
      </p>
      
      {task.dueDate && (
        <div className={`flex items-center text-sm mb-3 ${isOverdue ? "text-red-600 font-medium" : "text-gray-500"}`}>
          {isOverdue ? (
            <AlertTriangle size={14} className="mr-1" />
          ) : (
            <Calendar size={14} className="mr-1" />
          )}
          <span>
            {formatDate(task.dueDate)}
            {task.dueTime && ` às ${task.dueTime}`}
            {isOverdue && " - ATRASADA"}
          </span>
        </div>
      )}
      
      <div className="flex justify-end gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
        {task.status !== TASK_STATUS.COMPLETED && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task.id);
            }} 
            className="flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 rounded text-green-600 text-xs"
          >
            <Check size={14} />
            Concluir
          </button>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task.id);
          }} 
          className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-xs"
        >
          <Edit size={14} />
          Editar
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }} 
          className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600 text-xs"
        >
          <Trash2 size={14} />
          Excluir
        </button>
      </div>
    </div>
  );
};

export default TaskCard;