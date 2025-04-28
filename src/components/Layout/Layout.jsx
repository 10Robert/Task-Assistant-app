import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ 
  children, 
  activeView, 
  setActiveView, 
  handleAddTask 
}) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        handleAddTask={handleAddTask} 
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <Header title={activeView === 'tasks' ? 'Minhas Tarefas' : 'Agenda'} />
        {children}
      </div>
    </div>
  );
};

export default Layout;