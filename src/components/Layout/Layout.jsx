import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ 
  children, 
  activeView, 
  setActiveView, 
  handleAddTask,
  isMobile,
  isMenuOpen,
  toggleMenu
}) => {
  // Obter o título da página com base na visualização ativa
  const getPageTitle = () => {
    switch (activeView) {
      case 'tasks':
        return 'Minhas Tarefas';
      case 'calendar':
        return 'Agenda';
      case 'completed':
        return 'Tarefas Concluídas';
      case 'dashboard':
        return 'Dashboard';
      case 'settings':
        return 'Configurações';
      case 'help':
        return 'Ajuda';
      default:
        return 'Meu App de Tarefas';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        handleAddTask={handleAddTask}
        isMobile={isMobile}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />
      
      <div className={`flex-1 overflow-hidden flex flex-col ${isMobile ? 'pl-0' : ''}`}>
        <Header 
          title={getPageTitle()}
          isMobile={isMobile}
          toggleMenu={toggleMenu}
        />
        {children}
      </div>
    </div>
  );
};

export default Layout;