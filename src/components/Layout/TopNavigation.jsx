import React from 'react';
import { Plus, List, Calendar } from 'lucide-react';

const TopNavigation = ({ activeView, setActiveView, handleAddTask }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              {activeView === 'tasks' ? 'Minhas Tarefas' : 'Agenda'}
            </h1>
          </div>
          
          {/* Navegação Central */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setActiveView('tasks')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeView === 'tasks' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <List size={18} />
              <span>Tarefas</span>
            </button>
            
            <button 
              onClick={() => setActiveView('calendar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeView === 'calendar' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Calendar size={18} />
              <span>Agenda</span>
            </button>
          </div>
          
          {/* Botão Adicionar */}
          <button 
            onClick={handleAddTask}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
          >
            <Plus size={18} />
            <span className="font-medium">Nova Tarefa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;