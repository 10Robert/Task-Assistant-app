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
    priorityFilters,
    sortOption,
    sortDirection,
    filteredTasks,
    handleStatusFilterChange,
    handlePriorityFilterChange,
    handleDateFilterChange,
    handleSortChange,
    toggleSortDirection,
    clearDateFilter,
    resetFilters
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
        priorityFilters={priorityFilters}
        filterDate={filterDate}
        sortOption={sortOption}
        sortDirection={sortDirection}
        handleStatusFilterChange={handleStatusFilterChange}
        handlePriorityFilterChange={handlePriorityFilterChange}
        handleSortChange={handleSortChange}
        toggleSortDirection={toggleSortDirection}
        handleDateFilterChange={handleDateFilterChange}
        clearDateFilter={clearDateFilter}
        resetFilters={resetFilters}
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