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

  // Pegar a data atual (início do dia)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filtre tarefas atrasadas (tarefas não concluídas com data de entrega passada)
  const overdueTasks = tasks.filter(task => {
    // Verificar se a tarefa tem data de entrega
    if (!task.dueDate) return false;
    
    // Verificar se a tarefa não está concluída
    if (task.status === TASK_STATUS.COMPLETED) return false;
    
    // Verificar se a data de entrega já passou
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  });

  // Filtre tarefas pendentes (status "Pendente" e não atrasadas)
  const pendingTasks = tasks.filter(task => {
    // Primeiro, verificar se o status é "Pendente"
    if (task.status !== TASK_STATUS.PENDING) return false;
    
    // Se não tem data, é considerada pendente
    if (!task.dueDate) return true;
    
    // Verificar se a data de entrega ainda não passou (não está atrasada)
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate >= today;
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

  
};

export default PendingAndOverdueTasks;