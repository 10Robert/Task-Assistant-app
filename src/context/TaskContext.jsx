import React, { createContext, useState, useContext } from 'react';
import { TASK_STATUS } from '../constants/taskStatuses';
import { TASK_PRIORITY } from '../constants/taskPriorities';
import { getTodayString } from '../utils/dateUtils';

const initialTasks = [
  {
    id: 1,
    name: "Desenvolver protótipo",
    priority: TASK_PRIORITY.HIGH,
    description: "Criar o protótipo inicial do aplicativo para apresentação aos stakeholders",
    status: TASK_STATUS.IN_PROGRESS,
    dueDate: "2025-05-10",
    dueTime: "14:30",
    history: [
      { date: "2025-04-15", status: TASK_STATUS.PENDING, notes: "Tarefa criada" },
      { date: "2025-04-18", status: TASK_STATUS.IN_PROGRESS, notes: "Iniciado desenvolvimento" }
    ]
  },
  {
    id: 2,
    name: "Reunião com cliente",
    priority: TASK_PRIORITY.HIGH,
    description: "Discutir os requisitos do novo módulo e alinhar expectativas",
    status: TASK_STATUS.PENDING,
    dueDate: "2025-04-28",
    dueTime: "10:00",
    history: [
      { date: "2025-04-20", status: TASK_STATUS.PENDING, notes: "Agendamento da reunião" }
    ]
  },
  {
    id: 3,
    name: "Corrigir bugs",
    priority: TASK_PRIORITY.MEDIUM,
    description: "Resolver os problemas reportados no módulo de autenticação",
    status: TASK_STATUS.COMPLETED,
    dueDate: "2025-04-20",
    dueTime: "18:00",
    history: [
      { date: "2025-04-10", status: TASK_STATUS.PENDING, notes: "Bugs reportados" },
      { date: "2025-04-12", status: TASK_STATUS.IN_PROGRESS, notes: "Início da correção" },
      { date: "2025-04-20", status: TASK_STATUS.COMPLETED, notes: "Todos os bugs corrigidos" }
    ]
  },
  {
    id: 4,
    name: "Documentar API",
    priority: TASK_PRIORITY.LOW,
    description: "Criar documentação completa para a API do sistema",
    status: TASK_STATUS.PAUSED,
    dueDate: "2025-05-15",
    dueTime: "16:45",
    history: [
      { date: "2025-04-05", status: TASK_STATUS.PENDING, notes: "Tarefa adicionada" },
      { date: "2025-04-08", status: TASK_STATUS.IN_PROGRESS, notes: "Início da documentação" },
      { date: "2025-04-15", status: TASK_STATUS.PAUSED, notes: "Pausada para priorizar outras tarefas" }
    ]
  }
];

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  
  const createTask = (taskData) => {
    const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
    const today = getTodayString();
    
    const newTask = {
      id: newId,
      ...taskData,
      history: [
        { date: today, status: taskData.status || TASK_STATUS.PENDING, notes: "Tarefa criada" }
      ]
    };
    
    setTasks([...tasks, newTask]);
    return newTask;
  };
  
  const updateTask = (id, updates) => {
    const today = getTodayString();
    const existingTask = tasks.find(t => t.id === id);
    
    if (!existingTask) return null;
    
    let updatedHistory = [...existingTask.history];
    if (updates.status && updates.status !== existingTask.status) {
      updatedHistory.push({
        date: today,
        status: updates.status,
        notes: `Status alterado para ${updates.status}`
      });
    }
    
    const updatedTasks = tasks.map(task => 
      task.id === id 
        ? { ...task, ...updates, history: updatedHistory }
        : task
    );
    
    setTasks(updatedTasks);
    return updatedTasks.find(t => t.id === id);
  };
  
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };
  
  const changeTaskStatus = (id, newStatus, note = null) => {
    const today = getTodayString();
    const historyEntry = { 
      date: today, 
      status: newStatus, 
      notes: note || `Status alterado para ${newStatus}` 
    };
    
    const updatedTasks = tasks.map(task => 
      task.id === id ? {
        ...task, 
        status: newStatus,
        history: [...task.history, historyEntry]
      } : task
    );
    
    setTasks(updatedTasks);
  };
  
  const getTasksForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };
  
  const value = {
    tasks,
    selectedTask,
    setSelectedTask,
    showModal,
    setShowModal,
    draggedTask,
    setDraggedTask,
    createTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    getTasksForDate
  };
  
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
