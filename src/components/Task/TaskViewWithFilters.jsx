import React, { useState } from 'react';
import { Clock, AlertTriangle, Play, CheckCircle, Filter } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { TASK_STATUS } from '../../constants/taskStatuses';
import TaskCard from './TaskCard';

const TaskViewWithFilters = () => {
  const { 
    tasks, 
    setSelectedTask, 
    setShowModal,
    handleEdit,
    handleDelete,
    handleCompleteTask 
  } = useTaskContext();
  
  // Estado para controlar o filtro ativo
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Pegar a data atual
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filtrar tarefas com base no filtro ativo
  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'pending':
        return tasks.filter(task => {
          if (task.status !== TASK_STATUS.PENDING) return false;
          if (!task.dueDate) return true;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate >= today;
        });
        
      case 'overdue':
        return tasks.filter(task => {
          if (!task.dueDate) return false;
          if (task.status === TASK_STATUS.COMPLETED) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today;
        });
        
      case 'in-progress':
        return tasks.filter(task => 
          task.status === TASK_STATUS.IN_PROGRESS
        );
        
      case 'paused':
        return tasks.filter(task => 
          task.status === TASK_STATUS.PAUSED
        );
        
      case 'all':
      default:
        return tasks;
    }
  };
  
  const filteredTasks = getFilteredTasks();
  
  // Obter o título apropriado com base no filtro ativo
  const getFilterTitle = () => {
    switch (activeFilter) {
      case 'pending': return 'Tarefas Pendentes';
      case 'overdue': return 'Tarefas Atrasadas';
      case 'in-progress': return 'Tarefas em Andamento';
      case 'completed': return 'Tarefas Concluídas';
      case 'all': default: return 'Todas as Tarefas';
    }
  };
  
  // Obter a cor apropriada com base no filtro ativo
  const getFilterColor = () => {
    switch (activeFilter) {
      case 'pending': return 'text-yellow-600';
      case 'overdue': return 'text-red-600';
      case 'in-progress': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'all': default: return 'text-gray-800';
    }
  };
  
  // Obter o ícone apropriado com base no filtro ativo
  const getFilterIcon = () => {
    switch (activeFilter) {
      case 'pending': return <Clock size={22} className="mr-2" />;
      case 'overdue': return <AlertTriangle size={22} className="mr-2" />;
      case 'in-progress': return <Play size={22} className="mr-2" />;
      case 'completed': return <CheckCircle size={22} className="mr-2" />;
      case 'all': default: return <Filter size={22} className="mr-2" />;
    }
  };
  
  // Obter a mensagem apropriada quando não há tarefas
  const getEmptyMessage = () => {
    switch (activeFilter) {
      case 'pending': 
        return {
          title: 'Sem tarefas pendentes',
          message: 'Você não possui tarefas pendentes no momento.'
        };
      case 'overdue': 
        return {
          title: 'Sem tarefas atrasadas',
          message: 'Você está em dia com todas as suas tarefas!'
        };
      case 'in-progress': 
        return {
          title: 'Sem tarefas em andamento',
          message: 'Você não está trabalhando em nenhuma tarefa no momento.'
        };
      case 'completed': 
        return {
          title: 'Sem tarefas concluídas',
          message: 'Você ainda não concluiu nenhuma tarefa.'
        };
      case 'all': 
      default: 
        return {
          title: 'Sem tarefas',
          message: 'Comece adicionando uma nova tarefa!'
        };
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4 pb-16">
      {/* Botões de filtro */}
      <div className="bg-white rounded-lg p-4 shadow-md mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeFilter === 'all' 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter size={16} className="mr-2" />
            Todas
          </button>
          
          <button
            onClick={() => setActiveFilter('pending')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeFilter === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
            }`}
          >
            <Clock size={16} className="mr-2" />
            Pendentes
          </button>
          
          <button
            onClick={() => setActiveFilter('overdue')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeFilter === 'overdue' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-red-50'
            }`}
          >
            <AlertTriangle size={16} className="mr-2" />
            Atrasadas
          </button>
          
          <button
            onClick={() => setActiveFilter('in-progress')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeFilter === 'in-progress' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
            }`}
          >
            <Play size={16} className="mr-2" />
            Em Andamento
          </button>
          
          <button
            onClick={() => setActiveFilter('paused')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeFilter === 'paused' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-green-50'
            }`}
          >
            <CheckCircle size={16} className="mr-2" />
            Pausadas
          </button>
        </div>
      </div>
      
      {/* Lista de tarefas filtradas */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className={`text-xl font-semibold ${getFilterColor()} flex items-center mb-4`}>
          {getFilterIcon()}
          {getFilterTitle()} ({filteredTasks.length})
        </h2>
        
        <div className="flex flex-wrap gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                <TaskCard 
                  task={activeFilter === 'overdue' ? {...task, isOverdue: true} : task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onComplete={handleCompleteTask}
                  onClick={(task) => {
                    setSelectedTask(task);
                    setShowModal(true);
                  }}
                />
              </div>
            ))
          ) : (
            <div className="w-full bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              {getFilterIcon()}
              <h3 className="text-lg font-medium mb-2">{getEmptyMessage().title}</h3>
              <p>{getEmptyMessage().message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskViewWithFilters;