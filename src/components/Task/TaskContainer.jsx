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
    handleStatusFilterChange,
    handleDateFilterChange,
    clearDateFilter
  } = useTaskFilters(tasks);

  // Separar tarefas filtradas por status
  const tasksInProgress = filteredTasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS);
  const tasksPaused = filteredTasks.filter(task => task.status === TASK_STATUS.PAUSED);
  const tasksCompleted = filteredTasks.filter(task => task.status === TASK_STATUS.COMPLETED);
  const tasksPending = filteredTasks.filter(task => task.status === TASK_STATUS.PENDING);

  // Agrupar as tarefas por área
  const activeArea = [...tasksInProgress, ...tasksPending];
  const pausedArea = [...tasksPaused, ...tasksCompleted];

  return (
    <div className="flex-1 overflow-auto p-4 pb-16">
      <TaskFilterPanel
        statusFilters={statusFilters}
        filterDate={filterDate}
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