import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import TaskCard from './TaskCard';
import { handleDragOver } from '../../utils/dragDropUtils';
import { TASK_STATUS } from '../../constants/taskStatuses';
import { useTaskContext } from '../../context/TaskContext';

const PendingAndOverdueTasks = () => {
  const { 
    tasks,
    changeTaskStatus, 
    handleEdit, 
    handleDelete, 
    handleCompleteTask, 
    setSelectedTask, 
    setShowModal,
    draggedTask,
    setDraggedTask
  } = useTaskContext();

  // Pegue a data atual
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filtre tarefas pendentes (não concluídas e não atrasadas)
  const pendingTasks = tasks.filter(task => {
    if (task.status === TASK_STATUS.COMPLETED) return false;
    
    if (!task.dueDate) return task.status === TASK_STATUS.PENDING;
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return task.status === TASK_STATUS.PENDING && dueDate >= today;
  });

  // Filtre tarefas atrasadas (não concluídas e com data de entrega passada)
  const overdueTasks = tasks.filter(task => {
    if (task.status === TASK_STATUS.COMPLETED || !task.dueDate) return false;
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  });

  const handleDrop = (e, status) => {
    e.preventDefault();
    
    if (draggedTask) {
      changeTaskStatus(
        draggedTask.id, 
        status, 
        `Status alterado para ${status} por arrasto`
      );
      
      setDraggedTask(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tarefas Pendentes */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-yellow-600 flex items-center">
          <Clock size={18} className="mr-2" />
          Tarefas Pendentes ({pendingTasks.length})
        </h2>
        
        <div 
          className="flex overflow-x-auto pb-4 min-h-32 items-start"
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, TASK_STATUS.PENDING)}
        >
          {pendingTasks.length > 0 ? (
            pendingTasks.map(task => (
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
              Sem tarefas pendentes
            </div>
          )}
        </div>
      </div>
      
      {/* Tarefas Atrasadas */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-red-600 flex items-center">
          <AlertTriangle size={18} className="mr-2" />
          Tarefas Atrasadas ({overdueTasks.length})
        </h2>
        
        <div 
          className="flex overflow-x-auto pb-4 min-h-32 items-start"
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, TASK_STATUS.PENDING)}
        >
          {overdueTasks.length > 0 ? (
            overdueTasks.map(task => (
              <TaskCard 
                key={task.id}
                task={{...task, isOverdue: true}}
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
              Sem tarefas atrasadas
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingAndOverdueTasks;