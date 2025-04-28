import React from 'react';
import { Filter, ArrowDownAZ, Calendar, Tag } from 'lucide-react';
import { ALL_STATUSES } from '../../constants/taskStatuses';
import { ALL_PRIORITIES } from '../../constants/taskPriorities';

const TaskFilterPanel = ({ 
  statusFilters,
  priorityFilters, 
  filterDate, 
  sortOption,
  handleStatusFilterChange,
  handlePriorityFilterChange,
  handleSortChange,
  handleDateFilterChange,
  clearDateFilter 
}) => {
  return (
    <div className="bg-white p-4 mb-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center">
          <Filter size={16} className="mr-2" />
          Filtros e Ordenação
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtros de status */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Status:
          </h4>
          <div className="space-y-1">
            {ALL_STATUSES.map(status => (
              <label key={status} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusFilters[status]}
                  onChange={() => handleStatusFilterChange(status)}
                  className="rounded text-blue-500 focus:ring-blue-400 mr-2"
                />
                <span className="text-sm">{status}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Filtros de prioridade */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
            <Tag size={16} className="mr-2" />
            Prioridade:
          </h4>
          <div className="space-y-1">
            {ALL_PRIORITIES.map(priority => (
              <label key={priority} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={priorityFilters[priority]}
                  onChange={() => handlePriorityFilterChange(priority)}
                  className="rounded text-blue-500 focus:ring-blue-400 mr-2"
                />
                <span className="text-sm">{priority}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Filtro por data */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
            <Calendar size={16} className="mr-2" />
            Data de Entrega:
          </h4>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={filterDate}
              onChange={handleDateFilterChange}
              className="border border-gray-300 rounded p-1 text-sm w-full"
            />
            {filterDate && (
              <button 
                onClick={clearDateFilter}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
        
        {/* Opções de ordenação */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
            <ArrowDownAZ size={16} className="mr-2" />
            Ordenar por:
          </h4>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Nome</option>
            <option value="priority">Prioridade</option>
            <option value="dueDate">Data de Entrega</option>
            <option value="status">Status</option>
            <option value="createdAt">Data de Criação</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilterPanel;