// src/components/Task/TaskArea.jsx - LÓGICA DE DROP CORRIGIDA

import React from 'react';
import { Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import TaskCard from './TaskCard';
import { handleDragOver, handleDragStart } from '../../utils/dragDropUtils';
import { TASK_STATUS } from '../../constants/taskStatuses';
import { useTaskContext } from '../../context/TaskContext';

const TaskArea = ({ title, areaType, tasks }) => {
  const { 
    changeTaskStatus, 
    handleEdit, 
    handleDelete, 
    handleCompleteTask, 
    setSelectedTask, 
    setShowModal,
    draggedTask,
    setDraggedTask,
    loading
  } = useTaskContext();

  const handleDrop = async (e) => {
    e.preventDefault();
    
    if (draggedTask) {
      let newStatus;
      let statusMessage;
      
      // Determinar novo status baseado na área de destino
      switch (areaType) {
        case "pending":
          newStatus = TASK_STATUS.PENDING;
          statusMessage = "Pendente";
          break;
        case "active":
          newStatus = TASK_STATUS.IN_PROGRESS;
          statusMessage = "Em andamento";
          break;
        case "paused":
          newStatus = TASK_STATUS.PAUSED;
          statusMessage = "Pausada";
          break;
        case "finished":
          // Para área finalizada, determinar se pausar ou concluir
          // Se vier de uma área ativa, pausar. Se já estiver pausada, manter.
          if (draggedTask.status === TASK_STATUS.IN_PROGRESS || draggedTask.status === TASK_STATUS.PENDING) {
            newStatus = TASK_STATUS.PAUSED;
            statusMessage = "Pausada";
          } else {
            // Se já estiver pausada ou concluída, não mudar
            newStatus = draggedTask.status;
            statusMessage = draggedTask.status;
          }
          break;
        default:
          newStatus = TASK_STATUS.PENDING;
          statusMessage = "Pendente";
      }
      
      // Só alterar se o status for diferente
      if (newStatus && draggedTask.status !== newStatus) {
        try {
          await changeTaskStatus(
            draggedTask.id, 
            newStatus, 
            `Status alterado para ${statusMessage} por arrasto`
          );
        } catch (error) {
          alert('Erro ao alterar status da tarefa');
        }
      }
      
      setDraggedTask(null);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
  };

  // Ícone e cor baseado no tipo de área
  const getAreaIcon = () => {
    switch (areaType) {
      case "pending":
        return <FileText size={18} className="mr-2" />;
      case "active":
        return <Clock size={18} className="mr-2" />;
      case "paused":
        return <AlertCircle size={18} className="mr-2" />;
      case "finished":
        return <CheckCircle size={18} className="mr-2" />;
      default:
        return <FileText size={18} className="mr-2" />;
    }
  };

  const getAreaColor = () => {
    switch (areaType) {
      case "pending":
        return "text-yellow-600";
      case "active":
        return "text-blue-600";
      case "paused":
        return "text-red-600";
      case "finished":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getDropMessage = () => {
    switch (areaType) {
      case "pending":
        return "Solte aqui para marcar como Pendente";
      case "active":
        return "Solte aqui para marcar como Em Andamento";
      case "paused":
        return "Solte aqui para Pausar";
      case "finished":
        return "Solte aqui para Finalizar";
      default:
        return "Arraste tarefas para cá";
    }
  };

  return (
    <div className="mb-8">
      <h2 className={`text-lg font-semibold mb-4 ${getAreaColor()} flex items-center`}>
        {getAreaIcon()}
        {title}
        {loading && <span className="ml-2 text-sm text-gray-500">(Atualizando...)</span>}
      </h2>
      
      <div 
        className={`flex overflow-x-auto pb-4 min-h-32 items-start border-2 border-dashed rounded-lg p-2 transition-all ${
          draggedTask ? 'border-blue-400 bg-blue-25' : 'border-gray-300'
        }`}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onComplete={handleCompleteTask}
              onClick={(task) => {
                setSelectedTask(task);
                setShowModal(true);
              }}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-300 min-w-64 flex-shrink-0 max-w-xs mr-4 flex items-center justify-center h-24 text-gray-400 text-center">
            {draggedTask ? getDropMessage() : 'Nenhuma tarefa nesta categoria'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskArea;