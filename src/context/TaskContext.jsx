import React, { createContext, useState, useContext, useEffect } from 'react';
import { TASK_STATUS } from '../constants/taskStatuses';
import { TASK_PRIORITY } from '../constants/taskPriorities';
import { taskAPI, convertAPITasksToFrontend, convertAPITaskToFrontend } from '../services/api';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Testar conexão e carregar tarefas ao inicializar
  useEffect(() => {
    testConnectionAndLoadTasks();
  }, []);

  const testConnectionAndLoadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      
      // Carregar tarefas
      const apiTasks = await taskAPI.getTasks();
    
      
      const frontendTasks = convertAPITasksToFrontend(apiTasks);
      setTasks(frontendTasks);
      
    } catch (err) {
      setError(`Erro de conexão: ${err.message}`);

    } finally {
      setLoading(false);
    }
  };


  const createTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiTask = await taskAPI.createTask(taskData);
    
      
      const frontendTask = convertAPITaskToFrontend(apiTask);
      setTasks(prev => [...prev, frontendTask]);
      return frontendTask;
      
    } catch (err) {

      setError(`Erro ao criar: ${err.message}`);
      
      // Fallback local
      const localTask = {
        id: Date.now(),
        ...taskData,
        history: []
      };
      setTasks(prev => [...prev, localTask]);
      return localTask;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiTask = await taskAPI.updateTask(id, updates);
      const frontendTask = convertAPITaskToFrontend(apiTask);
      
      setTasks(prev => prev.map(task => 
        task.id === id ? frontendTask : task
      ));
      
      return frontendTask;
    } catch (err) {

      setError(`Erro ao atualizar: ${err.message}`);
      
      // Fallback local
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await taskAPI.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      
    } catch (err) {
      setError(`Erro ao deletar: ${err.message}`);
      
      // Fallback local
      setTasks(prev => prev.filter(task => task.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const getTasksForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };

  // Funções auxiliares para compatibilidade
  const handleEdit = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowModal(true);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
      await deleteTask(taskId);
    }
  };

  const handleCompleteTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { ...task, status: TASK_STATUS.COMPLETED });
    }
  };

  const changeTaskStatus = async (id, newStatus, note = null) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { ...task, status: newStatus });
    }
  };

  const value = {
    // Estado
    tasks,
    selectedTask,
    setSelectedTask,
    showModal,
    setShowModal,
    draggedTask,
    setDraggedTask,
    loading,
    error,
    
    // Funções da API
    createTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    testConnectionAndLoadTasks,
    
    // Funções utilitárias
    getTasksForDate,
    handleEdit,
    handleDelete,
    handleCompleteTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};