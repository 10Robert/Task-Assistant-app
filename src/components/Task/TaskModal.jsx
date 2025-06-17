// src/components/Task/TaskModal.jsx - VERSÃO COM DEBUG

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import StatusTimeline from './StatusTimeline';
import { ALL_PRIORITIES } from '../../constants/taskPriorities';
import { ALL_STATUSES } from '../../constants/taskStatuses';

const TaskModal = () => {
  const { 
    selectedTask, 
    setSelectedTask, 
    showModal, 
    setShowModal, 
    tasks, 
    updateTask, 
    createTask 
  } = useTaskContext();

  const [editedTask, setEditedTask] = useState({
    name: "",
    description: "",
    priority: "Média",
    status: "Pendente",
    dueDate: "",
    dueTime: ""
  });

  // Debug do selectedTask
  useEffect(() => {
    console.log('🎯 ===== TASK MODAL DEBUG =====');
    console.log('🎯 ShowModal:', showModal);
    console.log('🎯 SelectedTask:', selectedTask);
    console.log('🎯 SelectedTask ID:', selectedTask?.id);
    console.log('🎯 SelectedTask History:', selectedTask?.history);
    if (selectedTask?.history) {
      console.log('🎯 Histórico detalhado:');
      selectedTask.history.forEach((item, index) => {
        console.log(`  ${index}:`, {
          id: item.id,
          status: item.status,
          notes: item.notes,
          created_at: item.created_at
        });
      });
    }
    console.log('🎯 ===== FIM DEBUG =====');
  }, [selectedTask, showModal]);

  // Atualizar estado quando selectedTask mudar
  useEffect(() => {
    if (selectedTask) {
      setEditedTask({
        name: selectedTask.name || "",
        description: selectedTask.description || "",
        priority: selectedTask.priority || "Média",
        status: selectedTask.status || "Pendente",
        dueDate: selectedTask.dueDate || "",
        dueTime: selectedTask.dueTime || ""
      });
    } else {
      setEditedTask({
        name: "",
        description: "",
        priority: "Média",
        status: "Pendente",
        dueDate: "",
        dueTime: ""
      });
    }
  }, [selectedTask]);

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTask(null);
    setEditedTask({
      name: "",
      description: "",
      priority: "Média",
      status: "Pendente",
      dueDate: "",
      dueTime: ""
    });
  };

  const handleModalSave = async () => {
    if (!editedTask.name.trim()) {
      alert('Nome da tarefa é obrigatório');
      return;
    }

    try {
      if (selectedTask && tasks.some(t => t.id === selectedTask.id)) {
        // Atualizar tarefa existente
        await updateTask(selectedTask.id, {
          name: editedTask.name.trim(),
          description: editedTask.description.trim(),
          priority: editedTask.priority,
          status: editedTask.status,
          dueDate: editedTask.dueDate || null,
          dueTime: editedTask.dueTime || null
        });
      } else {
        // Criar nova tarefa
        await createTask({
          name: editedTask.name.trim(),
          description: editedTask.description.trim(),
          priority: editedTask.priority,
          status: editedTask.status,
          dueDate: editedTask.dueDate || null,
          dueTime: editedTask.dueTime || null
        });
      }
      
      handleModalClose();
    } catch (error) {
      alert('Erro ao salvar tarefa: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!showModal) return null;

  const isEditing = selectedTask && tasks.some(t => t.id === selectedTask.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? `Editar Tarefa (ID: ${selectedTask?.id})` : 'Nova Tarefa'}
          </h2>
          <button 
            onClick={handleModalClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Debug info */}
        {isEditing && (
          <div className="mb-4 p-2 bg-yellow-50 rounded text-xs">
            <strong>Debug Modal:</strong>
            <div>Task ID: {selectedTask?.id}</div>
            <div>Task Name: {selectedTask?.name}</div>
            <div>History Items: {selectedTask?.history?.length || 0}</div>
            <div>Is Editing: {isEditing ? 'Sim' : 'Não'}</div>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Tarefa *
            </label>
            <input
              type="text"
              name="name"
              value={editedTask.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o nome da tarefa"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descreva a tarefa (opcional)"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridade
            </label>
            <select
              name="priority"
              value={editedTask.priority}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              {ALL_PRIORITIES.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={editedTask.status}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              {ALL_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Entrega
              </label>
              <input
                type="date"
                name="dueDate"
                value={editedTask.dueDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário
              </label>
              <input
                type="time"
                name="dueTime"
                value={editedTask.dueTime}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Mostrar StatusTimeline apenas se for edição */}
          {isEditing && selectedTask && (
            <div>
              <div className="mb-2 p-2 bg-blue-50 rounded text-xs">
                <strong>Passando para StatusTimeline:</strong>
                <div>TaskId: {selectedTask.id}</div>
                <div>History: {selectedTask.history?.length || 0} itens</div>
              </div>
              
              <StatusTimeline 
                history={selectedTask.history} 
                taskId={selectedTask.id}
              />
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleModalClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleModalSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!editedTask.name.trim()}
          >
            {isEditing ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;