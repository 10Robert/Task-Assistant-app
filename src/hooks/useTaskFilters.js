import { useState } from 'react';
import { ALL_STATUSES, TASK_STATUS } from '../constants/taskStatuses';

export function useTaskFilters(tasks) {
  const [filterDate, setFilterDate] = useState("");
  
  // Filtrar apenas status que não sejam "Concluída" - todas as variações possíveis
  const availableStatuses = ALL_STATUSES.filter(status => 
    status !== TASK_STATUS.COMPLETED && 
    status !== "Concluída" && 
    status !== "concluída" &&
    status !== "CONCLUÍDA"
  );
  
  const [statusFilters, setStatusFilters] = useState(
    availableStatuses.reduce((acc, status) => ({ ...acc, [status]: true }), {})
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
  
  // Função para verificar se uma tarefa está concluída (todas as variações)
  const isTaskCompleted = (task) => {
    const completedStatuses = [
      TASK_STATUS.COMPLETED,
      "Concluída",
      "concluída", 
      "CONCLUÍDA",
      "Concluida",
      "concluida"
    ];
    return completedStatuses.includes(task.status);
  };
  
  const filteredTasks = tasks.filter(task => {
    // PRIMEIRO E MAIS IMPORTANTE: Excluir TODAS as tarefas concluídas
    if (isTaskCompleted(task)) {
      return false;
    }
    
    // SEGUNDO: Verificar se o status está nos filtros ativos
    if (statusFilters[task.status] === false) {
      return false;
    }
    
    // TERCEIRO: Filtro por data (se especificado)
    if (filterDate && task.dueDate !== filterDate) {
      return false;
    }
    
    return true;
  });
  
  return {
    filterDate,
    statusFilters,
    filteredTasks,
    availableStatuses,
    handleStatusFilterChange,
    handleDateFilterChange,
    clearDateFilter
  };
}