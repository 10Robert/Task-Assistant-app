// src/context/TaskContext.jsx - VERSÃO COM HISTÓRICO CORRIGIDO

import React, { createContext, useState, useContext, useEffect } from 'react';
import { TASK_STATUS } from '../constants/taskStatuses';
import { taskAPI, convertAPITasksToFrontend, convertAPITaskToFrontend } from '../services/api';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

// FUNÇÃO CORRIGIDA PARA LIDAR COM RESPOSTA DA API
const convertAPIResponseToFrontend = (apiResponse) => {
  if (!apiResponse) {
    return null;
  }

  // Se a API retornar um array, pegar o primeiro item
  if (Array.isArray(apiResponse)) {
    if (apiResponse.length === 0) {
      return null;
    }
    return convertSingleTask(apiResponse[0]);
  }
  
  // Se for um objeto único, converter diretamente
  if (typeof apiResponse === 'object') {
    return convertSingleTask(apiResponse);
  }

  return null;
};

const convertSingleTask = (apiTask) => {
  if (!apiTask || typeof apiTask !== 'object') {
    return null;
  }

  return {
    id: apiTask.id,
    name: apiTask.name || 'Tarefa sem nome',
    description: apiTask.description || "",
    priority: apiTask.priority || "Média",
    status: apiTask.status || "Pendente", 
    dueDate: apiTask.due_date || null,
    dueTime: apiTask.due_time || null,
    history: apiTask.history || [],
    createdAt: apiTask.created_at,
    updatedAt: apiTask.updated_at,
  };
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiTasks = await taskAPI.getTasks();
      const frontendTasks = convertAPITasksToFrontend(apiTasks);
      setTasks(frontendTasks);
    } catch (err) {
      setError('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  // FUNÇÃO PARA RECARREGAR UMA TAREFA ESPECÍFICA COM HISTÓRICO ATUALIZADO
  const reloadTask = async (taskId) => {
    try {
      console.log('🔄 Recarregando tarefa:', taskId);
      const apiTask = await taskAPI.getTask(taskId);
      const frontendTask = convertAPIResponseToFrontend(apiTask);
      
      if (frontendTask) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? frontendTask : task
        ));
        
        // Atualizar selectedTask se for a mesma
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(frontendTask);
        }
        
        console.log('✅ Tarefa recarregada com histórico:', frontendTask);
        return frontendTask;
      }
    } catch (err) {
      console.error('❌ Erro ao recarregar tarefa:', err);
    }
  };

  const createTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const apiTask = await taskAPI.createTask(taskData);
      const frontendTask = convertAPIResponseToFrontend(apiTask);
      if (frontendTask) {
        setTasks(prev => [...prev, frontendTask]);
      }
      return frontendTask;
    } catch (err) {
      setError('Erro ao criar tarefa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentTask = tasks.find(t => t.id === id);
      if (!currentTask) {
        throw new Error('Tarefa não encontrada');
      }

      const completeTaskData = {
        name: updates.name !== undefined ? updates.name : currentTask.name,
        description: updates.description !== undefined ? updates.description : currentTask.description,
        priority: updates.priority !== undefined ? updates.priority : currentTask.priority,
        status: updates.status !== undefined ? updates.status : currentTask.status,
        dueDate: updates.dueDate !== undefined ? updates.dueDate : currentTask.dueDate,
        dueTime: updates.dueTime !== undefined ? updates.dueTime : currentTask.dueTime
      };
      
      const apiTask = await taskAPI.updateTask(id, completeTaskData);
      const frontendTask = convertAPIResponseToFrontend(apiTask);
      
      if (frontendTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? frontendTask : task
        ));
        
        if (selectedTask && selectedTask.id === id) {
          setSelectedTask(frontendTask);
        }
        
        // CORREÇÃO: Recarregar tarefa para obter histórico atualizado
        setTimeout(() => reloadTask(id), 500);
      }
      
      return frontendTask;
    } catch (err) {
      setError('Erro ao atualizar tarefa');
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
      
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(null);
      }
    } catch (err) {
      setError('Erro ao deletar tarefa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeTaskStatus = async (id, newStatus, note = null) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Alterando status:', { id, newStatus, note });
      
      const apiResponse = await taskAPI.updateTaskStatus(id, newStatus, note);
      console.log('🔄 Resposta da API:', apiResponse);
      
      const frontendTask = convertAPIResponseToFrontend(apiResponse);
      
      if (frontendTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? frontendTask : task
        ));
        
        if (selectedTask && selectedTask.id === id) {
          setSelectedTask(frontendTask);
        }
        
        // CORREÇÃO: Recarregar tarefa após 500ms para garantir que o histórico foi salvo
        setTimeout(() => reloadTask(id), 500);
      }
      
      return frontendTask;
    } catch (err) {
      setError('Erro ao alterar status da tarefa');
      throw err;
    } finally {
      setLoading(false);
      setDraggedTask(null);
    }
  };

  const getTasksForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };

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
    await changeTaskStatus(taskId, TASK_STATUS.COMPLETED, 'Tarefa marcada como concluída');
  };

  const value = {
    tasks,
    selectedTask,
    setSelectedTask,
    showModal,
    setShowModal,
    draggedTask,
    setDraggedTask,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    loadTasks,
    reloadTask, // Expor função para recarregar tarefa
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