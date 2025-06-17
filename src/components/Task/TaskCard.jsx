import React from 'react';
import { Check, Edit, Trash2, Calendar, RotateCcw } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { getPriorityColor, getTaskStatusColor } from '../../utils/formatUtils';
import { handleDragStart } from '../../utils/dragDropUtils';
import StatusIcon from '../UI/StatusIcon';
import { useTaskContext } from '../../context/TaskContext';
import { TASK_STATUS } from '../../constants/taskStatuses';

const TaskCard = ({ task, onEdit, onDelete, onComplete, onClick }) => {
  const { setDraggedTask, changeTaskStatus } = useTaskContext();

  // Verificar se a tarefa tem todos os dados necessários
  if (!task || !task.id) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 min-w-64 flex-shrink-0 max-w-xs mr-4 mb-4">
        <p className="text-red-600 text-sm">Erro: Dados da tarefa incompletos</p>
      </div>
    );
  }

  const handleReactivate = async (e) => {
    e.stopPropagation();
    try {
      await changeTaskStatus(task.id, TASK_STATUS.PENDING, 'Tarefa reativada');
    } catch (error) {
      alert('Erro ao reativar tarefa: ' + error.message);
    }
  };

  return (
    <div 
      key={task.id} 
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 cursor-grab min-w-64 flex-shrink-0 max-w-xs mr-4 mb-4 hover:shadow-lg transition-shadow ${getTaskStatusColor(task.status)} ${
        task.status === TASK_STATUS.COMPLETED ? 'opacity-75' : ''
      }`}
      onClick={() => onClick(task)}
      draggable={true}
      onDragStart={(e) => handleDragStart(e, task, setDraggedTask)}
    >
      {/* Header com nome da tarefa */}
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-semibold ${task.status === TASK_STATUS.COMPLETED ? "line-through text-gray-500" : ""}`}>
          {task.name || 'Sem título'}
        </h2>
      </div>
      
      {/* Prioridade e Status */}
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority || 'Média')}`}>
          {task.priority || 'Média'}
        </span>
        <div className="flex items-center">
          <StatusIcon status={task.status} />
          <span className="ml-1 text-sm text-gray-600">{task.status || 'Pendente'}</span>
        </div>
      </div>
      
      {/* Descrição - só mostrar se existir */}
      {task.description && task.description.trim() && (
        <p className={`text-gray-600 mb-2 text-sm ${task.status === TASK_STATUS.COMPLETED ? "line-through text-gray-500" : ""}`}>
          {task.description.length > 100 ? 
            task.description.substring(0, 97) + '...' : 
            task.description
          }
        </p>
      )}
      
      {/* Data de entrega */}
      {task.dueDate && (
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar size={14} className="mr-1" />
          <span>
            {formatDate(task.dueDate)}
            {task.dueTime && ` às ${task.dueTime}`}
          </span>
        </div>
      )}
      
      {/* Botões de ação */}
      <div className="flex justify-end gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
        {task.status === TASK_STATUS.COMPLETED ? (
          // Botões para tarefas concluídas
          <>
            <button 
              onClick={handleReactivate}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded text-blue-600 text-xs"
              title="Reativar tarefa"
            >
              <RotateCcw size={14} />
              Reativar
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task.id);
              }} 
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-xs"
              title="Editar tarefa"
            >
              <Edit size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }} 
              className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600 text-xs"
              title="Excluir tarefa"
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          // Botões para tarefas não concluídas
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onComplete(task.id);
              }} 
              className="flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 rounded text-green-600 text-xs"
              title="Marcar como concluída"
            >
              <Check size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task.id);
              }} 
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-xs"
              title="Editar tarefa"
            >
              <Edit size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }} 
              className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600 text-xs"
              title="Excluir tarefa"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;