import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { TASK_STATUS } from '../../constants/taskStatuses';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const TaskContainer = () => {
  const { tasks, setSelectedTask, setShowModal } = useTaskContext();
  
  // Pegar a data atual
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filtragem das tarefas
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    if (task.status === TASK_STATUS.COMPLETED) return false;
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  });

  const pendingTasks = tasks.filter(task => {
    if (task.status !== TASK_STATUS.PENDING) return false;
    
    // Se não tem data ou a data é hoje ou futura
    if (!task.dueDate) return true;
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate >= today;
  });

  const pausedTaks = tasks.filter(task => {
    if (task.status !== TASK_STATUS.PAUSED) return false;

    if (!task.dueDate) return true;

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate >= today;
  });
  
  // Filtragem básica por status
  const tasksInProgress = tasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS);
  const tasksCompleted = tasks.filter(task => task.status === TASK_STATUS.COMPLETED);
  const taksPaused = tasks.filter(task => task.status == TASK_STATUS.PAUSED);

  // Renderizar seções de tarefas
  const renderTaskList = (tasksList, bgColor, borderColor, isOverdue = false) => {
    return tasksList.map(task => (
      <div 
        key={task.id}
        className={`${bgColor} border-l-4 ${borderColor} rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer w-full max-w-sm`}
        onClick={() => {
          setSelectedTask(task);
          setShowModal(true);
        }}
      >
        <div className="flex justify-between items-start">
          <h3 className={`font-semibold ${isOverdue ? "text-red-800" : ""} ${task.status === TASK_STATUS.COMPLETED ? "line-through text-gray-500" : ""}`}>
            {task.name}
          </h3>
          <span className={`${
            task.status === TASK_STATUS.PENDING 
              ? "bg-yellow-100 text-yellow-800" 
              : task.status === TASK_STATUS.IN_PROGRESS 
                ? "bg-blue-100 text-blue-800" 
                : "bg-green-100 text-green-800"
          } text-xs px-2 py-1 rounded-full`}>
            {task.status}
          </span>
        </div>
        <p className={`text-sm text-gray-600 mt-1 line-clamp-2 ${task.status === TASK_STATUS.COMPLETED ? "line-through" : ""}`}>
          {task.description}
        </p>
        {task.dueDate && (
          <div className={`flex items-center mt-2 ${isOverdue ? "text-red-700" : "text-gray-500"} text-sm`}>
            {isOverdue ? <AlertTriangle size={14} className="mr-1" /> : <Clock size={14} className="mr-1" />}
            {task.dueDate} {task.dueTime && `às ${task.dueTime}`}
            {isOverdue && " - ATRASADA"}
          </div>
        )}
      </div>
    ));
  };

  const renderTaskSection = (title, taskList, icon, titleColor, bgColor, borderColor, isOverdue = false) => {
    if (taskList.length === 0 && title === "Tarefas Concluídas") {
      return null; // Não mostrar seção de concluídas se estiver vazia
    }
    
    return (
      <div className="mb-6">
        <h2 className={`text-lg font-semibold mb-4 ${titleColor} flex items-center`}>
          {icon}
          {title} ({taskList.length})
        </h2>
        
        <div className="flex flex-wrap gap-4">
          {taskList.length > 0 ? (
            renderTaskList(taskList, bgColor, borderColor, isOverdue)
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 w-full text-center text-gray-400">
              Sem tarefas {title.toLowerCase().replace("tarefas ", "")}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto p-4 pb-16">
      {/* Tarefas Atrasadas */}
      {renderTaskSection(
        "Tarefas Atrasadas", 
        overdueTasks, 
        <AlertTriangle size={18} className="mr-2" />,
        "text-red-600",
        "bg-red-50",
        "border-red-500",
        true
      )}
      
      {/* Tarefas Pendentes */}
      {renderTaskSection(
        "Tarefas Pendentes", 
        pendingTasks, 
        <Clock size={18} className="mr-2" />,
        "text-yellow-600",
        "bg-white",
        "border-yellow-500"
      )}
      
      {/* Tarefas em andamento */}
      {renderTaskSection(
        "Tarefas Em Andamento", 
        tasksInProgress, 
        <Clock size={18} className="mr-2" />,
        "text-blue-600",
        "bg-white",
        "border-blue-500"
      )}
      
      {/* Tarefas concluídas */}
      {renderTaskSection(
        "Tarefas Concluídas", 
        tasksCompleted, 
        <CheckCircle size={18} className="mr-2" />,
        "text-green-600",
        "bg-white",
        "border-green-500"
      )}

      {renderTaskSection(
        "Tarefas Pausadas",
        taksPaused,
        <Clock size={18}className="mr-2"/>,
        "text-purple-600",
        "bg-white",
        "border-purple-500"
      )}
    </div>
  );
};

export default TaskContainer;