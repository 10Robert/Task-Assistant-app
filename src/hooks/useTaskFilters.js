import { useState } from 'react';
import { ALL_STATUSES } from '../constants/taskStatuses';
import { ALL_PRIORITIES } from '../constants/taskPriorities';
import { TASK_PRIORITY } from '../constants/taskPriorities';

export function useTaskFilters(tasks) {
  const [filterDate, setFilterDate] = useState("");
  const [statusFilters, setStatusFilters] = useState(
    ALL_STATUSES.reduce((acc, status) => ({ ...acc, [status]: true }), {})
  );
  const [priorityFilters, setPriorityFilters] = useState(
    ALL_PRIORITIES.reduce((acc, priority) => ({ ...acc, [priority]: true }), {})
  );
  const [sortOption, setSortOption] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");
  
  const handleStatusFilterChange = (status) => {
    setStatusFilters({
      ...statusFilters,
      [status]: !statusFilters[status]
    });
  };
  
  const handlePriorityFilterChange = (priority) => {
    setPriorityFilters({
      ...priorityFilters,
      [priority]: !priorityFilters[priority]
    });
  };
  
  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const clearDateFilter = () => {
    setFilterDate("");
  };
  
  const resetFilters = () => {
    setStatusFilters(
      ALL_STATUSES.reduce((acc, status) => ({ ...acc, [status]: true }), {})
    );
    setPriorityFilters(
      ALL_PRIORITIES.reduce((acc, priority) => ({ ...acc, [priority]: true }), {})
    );
    setFilterDate("");
    setSortOption("dueDate");
    setSortDirection("asc");
  };
  
  // Filtrar e ordenar tarefas
  const filteredAndSortedTasks = () => {
    // Aplicar filtros
    let filtered = tasks.filter(task => {
      // Filtro por status
      if (!statusFilters[task.status]) {
        return false;
      }
      
      // Filtro por prioridade
      if (!priorityFilters[task.priority]) {
        return false;
      }
      
      // Filtro por data (se especificado)
      if (filterDate && task.dueDate !== filterDate) {
        return false;
      }
      
      return true;
    });
    
    // Ordenar tarefas
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      // Determinar valores para comparação com base na opção de ordenação
      switch (sortOption) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'priority':
          // Ordem de prioridade: Alta > Média > Baixa
          const priorityValues = {
            [TASK_PRIORITY.HIGH]: 3,
            [TASK_PRIORITY.MEDIUM]: 2,
            [TASK_PRIORITY.LOW]: 1
          };
          aValue = priorityValues[a.priority] || 0;
          bValue = priorityValues[b.priority] || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'dueDate':
          // Para datas, valores vazios vão para o final
          aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
          bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      // Direção da ordenação
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      // Comparação
      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });
    
    return filtered;
  };
  
  return {
    filterDate,
    statusFilters,
    priorityFilters,
    sortOption,
    sortDirection,
    filteredTasks: filteredAndSortedTasks(),
    handleStatusFilterChange,
    handlePriorityFilterChange,
    handleDateFilterChange,
    handleSortChange,
    toggleSortDirection,
    clearDateFilter,
    resetFilters
  };
}