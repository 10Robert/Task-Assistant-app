// src/components/Task/TaskContainer.jsx - VERSÃO FINAL

import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useTaskFilters } from '../../hooks/useTaskFilters';
import TaskFilterPanel from './TaskFilterPanel';
import TaskArea from './TaskArea';
import { TASK_STATUS } from '../../constants/taskStatuses';

const TaskContainer = () => {
  const { tasks, loading, error } = useTaskContext();
  
  const {
    filterDate,
    statusFilters,
    filteredTasks,
    handleStatusFilterChange,
    handleDateFilterChange,
    clearDateFilter
  } = useTaskFilters(tasks);

  // Separar tarefas por status
  const pendingTasks = filteredTasks.filter(task => task.status === TASK_STATUS.PENDING);
  const inProgressTasks = filteredTasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS);
  const pausedTasks = filteredTasks.filter(task => task.status === TASK_STATUS.PAUSED);
  const completedTasks = filteredTasks.filter(task => task.status === TASK_STATUS.COMPLETED);

  // Agrupar para as áreas
  const activeTasks = [...pendingTasks, ...inProgressTasks];
  const finishedTasks = [...pausedTasks, ...completedTasks];

  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-4 pb-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Carregando tarefas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto p-4 pb-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h3 className="font-medium">Erro ao carregar tarefas</h3>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
          >
            Recarregar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 pb-16">
      {/* Painel de Filtros */}
      <TaskFilterPanel
        statusFilters={statusFilters}
        filterDate={filterDate}
        handleStatusFilterChange={handleStatusFilterChange}
        handleDateFilterChange={handleDateFilterChange}
        clearDateFilter={clearDateFilter}
      />
      
      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <div className="text-yellow-700 text-sm font-medium">Pendentes</div>
          <div className="text-2xl font-bold text-yellow-800">{pendingTasks.length}</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-blue-700 text-sm font-medium">Em Andamento</div>
          <div className="text-2xl font-bold text-blue-800">{inProgressTasks.length}</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="text-red-700 text-sm font-medium">Pausadas</div>
          <div className="text-2xl font-bold text-red-800">{pausedTasks.length}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-green-700 text-sm font-medium">Concluídas</div>
          <div className="text-2xl font-bold text-green-800">{completedTasks.length}</div>
        </div>
      </div>
      
      {/* Áreas de Tarefas */}
      <TaskArea 
        title="Tarefas Ativas"
        areaType="active" 
        tasks={activeTasks}
      />
      
      <TaskArea 
        title="Tarefas Finalizadas"
        areaType="finished" 
        tasks={finishedTasks}
      />

      {/* Mensagem se não houver tarefas */}
      {tasks.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">📝</div>
          <p className="text-gray-500 mb-4">Nenhuma tarefa encontrada</p>
          <button 
            onClick={() => {/* Trigger add task modal */}}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Criar primeira tarefa
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskContainer;