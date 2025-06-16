import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useTaskFilters } from '../../hooks/useTaskFilters';
import TaskFilterPanel from './TaskFilterPanel';
import TaskArea from './TaskArea';
import { TASK_STATUS } from '../../constants/taskStatuses';

const TaskContainer = () => {
  const { tasks } = useTaskContext();
  
  const {
    filterDate,
    statusFilters,
    filteredTasks,
    availableStatuses,
    handleStatusFilterChange,
    handleDateFilterChange,
    clearDateFilter
  } = useTaskFilters(tasks);

  // As tarefas já estão filtradas no hook, mas aplicamos filtro adicional de segurança
  const visibleTasks = filteredTasks.filter(task => 
    task.status !== TASK_STATUS.COMPLETED && task.status !== "Concluída"
  );

  // Separar tarefas filtradas por status (excluindo concluídas)
  const tasksInProgress = visibleTasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS);
  const tasksPaused = visibleTasks.filter(task => task.status === TASK_STATUS.PAUSED);
  const tasksPending = visibleTasks.filter(task => task.status === TASK_STATUS.PENDING);

  // Agrupar as tarefas por área
  const activeArea = [...tasksInProgress, ...tasksPending];
  const pausedArea = [...tasksPaused];

  return (
    <div className="flex-1 overflow-auto p-4 pb-16">
      <TaskFilterPanel
        statusFilters={statusFilters}
        filterDate={filterDate}
        availableStatuses={availableStatuses}
        handleStatusFilterChange={handleStatusFilterChange}
        handleDateFilterChange={handleDateFilterChange}
        clearDateFilter={clearDateFilter}
      />
      
      <TaskArea 
        title="Tarefas Em Andamento" 
        areaType="active" 
        tasks={activeArea}
      />
      
      <TaskArea 
        title="Tarefas Pausadas" 
        areaType="paused" 
        tasks={pausedArea}
      />
    </div>
  );
};

export default TaskContainer;