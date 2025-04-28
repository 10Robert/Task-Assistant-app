import React from 'react';
import { Filter } from 'lucide-react';
import { ALL_STATUSES } from '../../constants/taskStatuses';

const TaskFilterPanel = ({ 
  statusFilters, 
  filterDate, 
  handleStatusFilterChange, 
  handleDateFilterChange,
  clearDateFilter 
}) => {
  return (
    <div className="bg-white p-4 mb-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center">
          <Filter size={16} className="mr-2" />
          Filtros
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Filtros de status */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Status:</h4>
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
        
        {/* Filtro por data */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Data de Entrega:</h4>
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
      </div>
    </div>
  );
};

export default TaskFilterPanel;