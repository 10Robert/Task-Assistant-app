import React, { useState, useEffect } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import Layout from './components/Layout/Layout';
import TaskContainer from './components/Task/TaskContainer';
import CalendarContainer from './components/Calendar/CalendarContainer';
import TaskModal from './components/Task/TaskModal';
import PendingAndOverdueTasks from './components/Task/PendingAndOverdueTasks';
import CompletedTasksScreen from './components/Task/CompletedTasksScreen';
import Dashboard from './components/Dashboard/Dashboard';
import { useMediaQuery } from './hooks/useMediaQuery';

const TaskApp = () => {
  const [activeView, setActiveView] = useState('tasks');
  const { setSelectedTask, setShowModal } = useTaskContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Fechar o menu quando uma visualização é selecionada no mobile
  useEffect(() => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [activeView, isMobile]);

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      name: "Nova tarefa",
      priority: "Média",
      description: "Descrição da tarefa",
      status: "Pendente",
      dueDate: "",
      dueTime: "",
      notes: ""
    };
    
    setSelectedTask(newTask);
    setShowModal(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Renderizar a visualização ativa
  const renderActiveView = () => {
    switch (activeView) {
      case 'tasks':
        return (
          <>
            <PendingAndOverdueTasks />
            <TaskContainer />
          </>
        );
      case 'calendar':
        return <CalendarContainer />;
      case 'completed':
        return <CompletedTasksScreen />;
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Configurações</h1>
            <p className="text-gray-600">Esta funcionalidade estará disponível em breve.</p>
          </div>
        );
      case 'help':
        return (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Ajuda</h1>
            <p className="text-gray-600">Esta funcionalidade estará disponível em breve.</p>
          </div>
        );
      default:
        return <TaskContainer />;
    }
  };

  return (
    <Layout
      activeView={activeView}
      setActiveView={setActiveView}
      handleAddTask={handleAddTask}
      isMobile={isMobile}
      isMenuOpen={isMenuOpen}
      toggleMenu={toggleMenu}
    >
      {renderActiveView()}
      <TaskModal />
    </Layout>
  );
};

// Componente principal envolto pelo Provider
const App = () => {
  return (
    <TaskProvider>
      <TaskApp />
    </TaskProvider>
  );
};

export default App;