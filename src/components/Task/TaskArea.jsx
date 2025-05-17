import React from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
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
    setDraggedTask
  } = useTaskContext();

  // Determinar o status e o ícone com base no tipo de área
  let statusForDrop;
  let areaIcon;
  let textColor;
  
  switch (areaType) {
    case "active":
      statusForDrop = TASK_STATUS.IN_PROGRESS;
      areaIcon = <Clock size={18} className="mr-2" />;
      textColor = "text-blue-600";
      break;
    case "paused":
      statusForDrop = TASK_STATUS.PAUSED;
      areaIcon = <AlertCircle size={18} className="mr-2" />;
      textColor = "text-red-600";
      break;
    case "completed":
      statusForDrop = TASK_STATUS.COMPLETED;
      areaIcon = <CheckCircle size={18} className="mr-2" />;
      textColor = "text-green-600";
      break;
    default:
      statusForDrop = TASK_STATUS.PENDING;
      areaIcon = <Clock size={18} className="mr-2" />;
      textColor = "text-blue-600";
  }

  const handleDrop = (e) => {
    e.preventDefault();
    
    if (draggedTask) {
      changeTaskStatus(
        draggedTask.id, 
        statusForDrop, 
        `Status alterado para ${statusForDrop} por arrasto`
      );
      
      setDraggedTask(null);
    }
  };

  // Se não houver tarefas e for a área de concluídas, não exibir nada
  if (tasks.length === 0 && areaType === "completed") {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className={`text-lg font-semibold mb-4 ${textColor} flex items-center`}>
        {areaIcon}
        {title}
        <span className="ml-2 text-sm text-gray-500 font-normal">({tasks.length})</span>
      </h2>
      <div 
        className="flex overflow-x-auto pb-4 min-h-32 items-start"
        onDragOver={(e) => handleDragOver(e)}
        onDrop={handleDrop}
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
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-300 min-w-64 flex-shrink-0 max-w-xs mr-4 flex items-center justify-center h-24 text-gray-400">
            {areaType === "active" ? "Arraste tarefas para iniciar" : 
             areaType === "paused" ? "Arraste tarefas para pausar" :
             "Sem tarefas nesta seção"}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskArea;