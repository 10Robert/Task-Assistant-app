import React, { useState } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import Layout from './components/Layout/Layout';
import TaskViewWithFilters from './components/Task/TaskViewWithFilters';
import CalendarContainer from './components/Calendar/CalendarContainer';
import TaskModal from './components/Task/TaskModal';
import CompletedTasksView from './components/Task/CompletedTasksView';
import Dashboard from './components/dashboard/Dashboard';

const TaskApp = () => {
  const [activeView, setActiveView] = useState('tasks');
  const { setSelectedTask, setShowModal } = useTaskContext();

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

  // Renderizar a visualização ativa
  const renderActiveView = () => {
    switch (activeView) {
      case 'tasks':
        return <TaskViewWithFilters />;
      case 'completed-tasks':
        return <CompletedTasksView />;
      case 'calendar':
        return <CalendarContainer />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <TaskViewWithFilters />;
    }
  };

  return (
    <Layout
      activeView={activeView}
      setActiveView={setActiveView}
      handleAddTask={handleAddTask}
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