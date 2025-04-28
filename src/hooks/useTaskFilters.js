import { useState } from 'react';
import { ALL_STATUSES } from '../constants/taskStatuses';

export function useTaskFilters(tasks) {
  const [filterDate, setFilterDate] = useState("");
  const [statusFilters, setStatusFilters] = useState(
    ALL_STATUSES.reduce((acc, status) => ({ ...acc, [status]: true }), {})
  );
  
  const handleStatusFilterChange = (status) => {
    setStatusFilters({
      ...statusFilters,
      [status]: !statusFilters[status]
    });
  };
  
  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };
  
  const clearDateFilter = () => {
    setFilterDate("");
  };
  
  const filteredTasks = tasks.filter(task => {
    // Filtro por status
    if (!statusFilters[task.status]) {
      return false;
    }
    
    // Filtro por data (se especificado)
    if (filterDate && task.dueDate !== filterDate) {
      return false;
    }
    
    return true;
  });
  
  return {
    filterDate,
    statusFilters,
    filteredTasks,
    handleStatusFilterChange,
    handleDateFilterChange,
    clearDateFilter
  };
}