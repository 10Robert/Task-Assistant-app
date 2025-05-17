import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { CheckCircle, Search, Filter, Archive, MoreHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { TASK_STATUS } from '../../constants/taskStatuses';
import { ALL_PRIORITIES } from '../../constants/taskPriorities';
import { getPriorityColor } from '../../utils/formatUtils';

const CompletedTasksScreen = () => {
  const { tasks, setSelectedTask, setShowModal, updateTask } = useTaskContext();
  
  // Estados para filtragem e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState([...ALL_PRIORITIES]);
  const [sortOption, setSortOption] = useState('completedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  
  // Carregar tarefas concluídas
  useEffect(() => {
    // Filtrar as tarefas concluídas
    const completed = tasks.filter(task => 
      task.status === TASK_STATUS.COMPLETED
    );
    
    // Aplicar filtragem
    let filtered = completed;
    
    // Filtragem por prioridade
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(task => 
        selectedPriorities.includes(task.priority)
      );
    }
    
    // Filtragem por texto
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
      );
    }
    
    // Filtragem por data
    if (dateRange.start) {
      filtered = filtered.filter(task => {
        // Encontrar a entrada de conclusão
        const completionEntry = task.history
          .filter(entry => entry.status === TASK_STATUS.COMPLETED)
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          
        if (!completionEntry) return false;
        
        return completionEntry.date >= dateRange.start;
      });
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(task => {
        // Encontrar a entrada de conclusão
        const completionEntry = task.history
          .filter(entry => entry.status === TASK_STATUS.COMPLETED)
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          
        if (!completionEntry) return false;
        
        return completionEntry.date <= dateRange.end;
      });
    }
    
    // Aplicar ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortOption === 'completedDate') {
        // Encontrar a data de conclusão mais recente para cada tarefa
        const aCompletionEntry = a.history
          .filter(entry => entry.status === TASK_STATUS.COMPLETED)
          .sort((x, y) => new Date(y.date) - new Date(x.date))[0];
          
        const bCompletionEntry = b.history
          .filter(entry => entry.status === TASK_STATUS.COMPLETED)
          .sort((x, y) => new Date(y.date) - new Date(x.date))[0];
          
        aValue = aCompletionEntry ? new Date(aCompletionEntry.date) : new Date(0);
        bValue = bCompletionEntry ? new Date(bCompletionEntry.date) : new Date(0);
      } else if (sortOption === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortOption === 'priority') {
        const priorityOrder = {
          'Alta': 3,
          'Média': 2,
          'Baixa': 1
        };
        
        aValue = priorityOrder[a.priority] || 0;
        bValue = priorityOrder[b.priority] || 0;
      } else if (sortOption === 'dueDate') {
        aValue = a.dueDate ? new Date(a.dueDate) : new Date(0);
        bValue = b.dueDate ? new Date(b.dueDate) : new Date(0);
      }
      
      // Determinar a direção da ordenação
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      // Comparar valores
      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });
    
    setCompletedTasks(filtered);
  }, [tasks, searchQuery, selectedPriorities, sortOption, sortDirection, dateRange]);
  
  // Manipular seleção de tarefas
  const toggleTaskSelection = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };
  
  // Selecionar/desselecionar todas as tarefas
  const toggleSelectAll = () => {
    if (selectedTasks.length === completedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(completedTasks.map(task => task.id));
    }
  };
  
  // Arquivar tarefas selecionadas
  const archiveSelectedTasks = () => {
    if (selectedTasks.length === 0) return;
    
    if (window.confirm(`Arquivar ${selectedTasks.length} tarefa(s) selecionada(s)?`)) {
      selectedTasks.forEach(taskId => {
        updateTask(taskId, { archived: true });
      });
      
      setSelectedTasks([]);
    }
  };
  
  // Reabrir tarefa (mudar status para pendente)
  const reopenTask = (taskId) => {
    if (window.confirm('Reabrir esta tarefa como pendente?')) {
      updateTask(taskId, { 
        status: TASK_STATUS.PENDING,
        history: [
          ...tasks.find(t => t.id === taskId).history,
          { 
            date: new Date().toISOString().split('T')[0],
            status: TASK_STATUS.PENDING,
            notes: 'Tarefa reaberta'
          }
        ]
      });
    }
  };
  
  // Alternar a direção da ordenação
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-white rounded-lg p-4 shadow-md mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <CheckCircle size={20} className="mr-2 text-green-600" />
            Tarefas Concluídas
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              title="Mostrar filtros"
            >
              <Filter size={18} />
            </button>
            
            <button
              onClick={archiveSelectedTasks}
              disabled={selectedTasks.length === 0}
              className={`p-2 rounded-md ${selectedTasks.length > 0 ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              title="Arquivar selecionadas"
            >
              <Archive size={18} />
            </button>
          </div>
        </div>
        
        {/* Barra de busca */}
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
        
        {/* Painel de filtros e ordenação */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
            <h3 className="text-sm font-medium mb-3 text-gray-700">Filtros e Ordenação</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por prioridade */}
              <div>
                <h4 className="text-xs font-medium mb-2 text-gray-600">Prioridade:</h4>
                <div className="space-y-1">
                  {ALL_PRIORITIES.map(priority => (
                    <label key={priority} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPriorities.includes(priority)}
                        onChange={() => {
                          if (selectedPriorities.includes(priority)) {
                            setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
                          } else {
                            setSelectedPriorities([...selectedPriorities, priority]);
                          }
                        }}
                        className="rounded text-blue-500 focus:ring-blue-400 mr-2"
                      />
                      <span className="text-sm">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Filtro por data de conclusão */}
              <div>
                <h4 className="text-xs font-medium mb-2 text-gray-600">Período de Conclusão:</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">De:</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="w-full p-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Até:</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="w-full p-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
              
              {/* Opções de ordenação */}
              <div>
                <h4 className="text-xs font-medium mb-2 text-gray-600">Ordenar por:</h4>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="p-1 text-sm border border-gray-300 rounded flex-grow"
                  >
                    <option value="completedDate">Data de conclusão</option>
                    <option value="name">Nome</option>
                    <option value="priority">Prioridade</option>
                    <option value="dueDate">Data de entrega</option>
                  </select>
                  
                  <button
                    onClick={toggleSortDirection}
                    className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                    title={sortDirection === 'asc' ? 'Crescente' : 'Decrescente'}
                  >
                    {sortDirection === 'asc' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedPriorities([...ALL_PRIORITIES]);
                      setDateRange({start: '', end: ''});
                      setSortOption('completedDate');
                      setSortDirection('desc');
                    }}
                    className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Lista de tarefas concluídas */}
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTasks.length === completedTasks.length && completedTasks.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded text-blue-500 focus:ring-blue-400 mr-2"
                    />
                    Tarefa
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Conclusão
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Entrega
                </th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedTasks.length > 0 ? (
                completedTasks.map(task => {
                  // Encontrar a data de conclusão mais recente
                  const completionEntry = task.history
                    .filter(entry => entry.status === TASK_STATUS.COMPLETED)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                  
                  const completionDate = completionEntry ? completionEntry.date : '-';
                  
                  return (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(task.id)}
                            onChange={() => toggleTaskSelection(task.id)}
                            className="rounded text-blue-500 focus:ring-blue-400 mr-3"
                          />
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">{task.name}</div>
                            <div className="text-xs text-gray-500 max-w-xs truncate">{task.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(completionDate)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {task.dueDate ? formatDate(task.dueDate) : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Ver detalhes
                          </button>
                          
                          <div className="relative group">
                            <button className="text-gray-500 hover:text-gray-700">
                              <MoreHorizontal size={16} />
                            </button>
                            
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                              <div className="py-1">
                                <button
                                  onClick={() => reopenTask(task.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Reabrir como pendente
                                </button>
                                <button
                                  onClick={() => {
                                    updateTask(task.id, { archived: true });
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Arquivar tarefa
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Nenhuma tarefa concluída encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação ou rodapé */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {completedTasks.length} tarefas encontradas
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedTasksScreen;