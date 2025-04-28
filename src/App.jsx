import React, { useState } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import Layout from './components/Layout/Layout';
import TaskContainer from './components/Task/TaskContainer';
import CalendarContainer from './components/Calendar/CalendarContainer';
import TaskModal from './components/Task/TaskModal';

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
      dueTime: ""
    };
    
    setSelectedTask(newTask);
    setShowModal(true);
  };

  return (
    <Layout
      activeView={activeView}
      setActiveView={setActiveView}
      handleAddTask={handleAddTask}
    >
      {activeView === 'tasks' ? <TaskContainer /> : <CalendarContainer />}
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