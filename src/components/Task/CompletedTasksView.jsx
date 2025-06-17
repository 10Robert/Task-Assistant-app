import React, { useState } from 'react';
import { CheckCircle, Search, Calendar, Filter, ArrowDownAZ, ChevronUp, ChevronDown } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { TASK_STATUS } from '../../constants/taskStatuses';
import { formatDate, formatDateTime } from '../../utils/dateUtils';

const CompletedTasksView = () => {
  const { 
    tasks, 
    setSelectedTask, 
    setShowModal,
    handleEdit,
    handleDelete
  } = useTaskContext();
  
  // Estados para filtragem e ordenação
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('completedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Filtrar tarefas concluídas
  const completedTasks = tasks.filter(task => 
    task.status === TASK_STATUS.COMPLETED
  );
  
  // Aplicar filtros de pesquisa e data
  const filteredTasks = completedTasks.filter(task => {
    // Filtro de texto
    if (searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filtro de data inicial
    if (dateRange.start && task.dueDate && task.dueDate < dateRange.start) {
      return false;
    }
    
    // Filtro de data final
    if (dateRange.end && task.dueDate && task.dueDate > dateRange.end) {
      return false;
    }
    
    return true;
  });
  
  // Ordenar tarefas
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'completedDate':
        // Encontrar data de conclusão na história
        const aCompletionEntry = a.history
          ?.filter(entry => entry.status === TASK_STATUS.COMPLETED)
          .sort((x, y) => new Date(y.created_at || y.date) - new Date(x.created_at || x.date))[0];
        
        const bCompletionEntry = b.history
          ?.filter(entry => entry.status === TASK_STATUS.COMPLETED)
          .sort((x, y) => new Date(y.created_at || y.date) - new Date(x.created_at || x.date))[0];
        
        valueA = aCompletionEntry ? new Date(aCompletionEntry.created_at || aCompletionEntry.date) : new Date(0);
        valueB = bCompletionEntry ? new Date(bCompletionEntry.created_at || bCompletionEntry.date) : new Date(0);
        break;
        
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
        
      case 'priority':
        const priorityValues = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
        valueA = priorityValues[a.priority] || 0;
        valueB = priorityValues[b.priority] || 0;
        break;
        
      case 'dueDate':
        valueA = a.dueDate ? new Date(a.dueDate) : new Date(0);
        valueB = b.dueDate ? new Date(b.dueDate) : new Date(0);
        break;
        
      default:
        return 0;
    }
    
    // Aplicar direção da ordenação
    return sortDirection === 'asc' 
      ? (valueA < valueB ? -1 : valueA > valueB ? 1 : 0)
      : (valueA > valueB ? -1 : valueA < valueB ? 1 : 0);
  });
  
  // Alternar direção de ordenação
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  // Resetar filtros
  const resetFilters = () => {
    setSearchQuery('');
    setSortBy('completedDate');
    setSortDirection('desc');
    setDateRange({ start: '', end: '' });
  };
  
  // Função para encontrar a data de conclusão de uma tarefa
  const getCompletionDate = (task) => {
    if (!task.history) return null;
    
    const completionEntry = task.history
      .filter(entry => entry.status === TASK_STATUS.COMPLETED)
      .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))[0];
    
    return completionEntry ? (completionEntry.created_at || completionEntry.date) : null;
  };

  return (
    <div className="flex-1 overflow-auto p-4 pb-16">
      <div className="bg-white rounded-lg p-4 shadow-md mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-green-600 flex items-center">
            <CheckCircle size={22} className="mr-2" />
            Tarefas Concluídas ({filteredTasks.length})
          </h2>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-md ${showFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            title="Filtros e Ordenação"
          >
            <Filter size={18} />
          </button>
        </div>
        
        {/* Barra de Pesquisa */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar tarefas concluídas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Painel de Filtros (Expansível) */}
        {showFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Filtro por Data */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Período de Conclusão
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">De:</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Até:</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Ordenação */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ArrowDownAZ size={16} className="mr-2" />
                  Ordenação
                </h3>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="completedDate">Data de conclusão</option>
                    <option value="name">Nome</option>
                    <option value="priority">Prioridade</option>
                    <option value="dueDate">Data de entrega</option>
                  </select>
                  <button
                    onClick={toggleSortDirection}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
                    title={sortDirection === 'asc' ? 'Crescente' : 'Decrescente'}
                  >
                    {sortDirection === 'asc' ? 
                      <ChevronUp size={18} /> : 
                      <ChevronDown size={18} />
                    }
                  </button>
                </div>
                <button
                  onClick={resetFilters}
                  className="mt-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Lista de Tarefas Concluídas */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex flex-wrap gap-4">
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <div key={task.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                <div 
                  className="bg-white border-l-4 border-green-500 rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer h-full flex flex-col"
                  onClick={() => {
                    setSelectedTask(task);
                    setShowModal(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold line-through text-gray-500">{task.name}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {task.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1 line-through line-clamp-2">
                    {task.description}
                  </p>
                  
                  <div className="mt-auto pt-2">
                    {task.dueDate && (
                      <div className="flex items-center text-sm text-gray-400 mb-1">
                        <Calendar size={14} className="mr-1" />
                        Prazo: {formatDate(task.dueDate)}
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle size={14} className="mr-1" />
                      Concluída: {formatDateTime(getCompletionDate(task) || '')}
                    </div>
                  </div>

                  <div className="flex justify-end mt-2 gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(task.id);
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id);
                      }}
                      className="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Sem tarefas concluídas</h3>
              <p>Você ainda não concluiu nenhuma tarefa ou nenhuma corresponde aos filtros.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedTasksView;