import React from 'react';
import { Plus, List, Calendar, CheckCircle, BarChart2 } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, handleAddTask }) => {
  return (
    <div className="w-16 bg-purple-600 h-full flex flex-col items-center py-6">
      <button 
        onClick={handleAddTask}
        className="bg-white text-blue-600 p-2 rounded-full shadow-lg flex items-center justify-center mb-6"
      >
        <Plus size={20} />
      </button>
      
      <div className="flex flex-col items-center space-y-6">
        <button 
          onClick={() => setActiveView('tasks')}
          className={`text-white p-2 rounded-lg ${activeView === 'tasks' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
          title="Tarefas"
        >
          <List size={20} />
        </button>
        <button 
          onClick={() => setActiveView('completed-tasks')}
          className={`text-white p-2 rounded-lg ${activeView === 'completed-tasks' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
          title="Tarefas Concluídas"
        >
          <CheckCircle size={20} />
        </button>
        <button 
          onClick={() => setActiveView('calendar')}
          className={`text-white p-2 rounded-lg ${activeView === 'calendar' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
          title="Agenda"
        >
          <Calendar size={20} />
        </button>
        <button 
          onClick={() => setActiveView('dashboard')}
          className={`text-white p-2 rounded-lg ${activeView === 'dashboard' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
          title="Dashboard"
        >
          <BarChart2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;