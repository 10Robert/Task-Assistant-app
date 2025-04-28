import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, Tag, AlignLeft, CheckSquare } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import StatusTimeline from './StatusTimeline';
import { ALL_PRIORITIES } from '../../constants/taskPriorities';
import { ALL_STATUSES } from '../../constants/taskStatuses';
import { getPriorityColor } from '../../utils/formatUtils';
import EditableStatusTimeline from './StatusTimeline'

const TaskModal = () => {
  const { 
    selectedTask, 
    setSelectedTask, 
    showModal, 
    setShowModal, 
    tasks, 
    updateTask, 
    createTask,
    updateTaskHistory 
  } = useTaskContext();

  const [editedTask, setEditedTask] = useState({
    name: "",
    description: "",
    priority: "",
    dueDate: "",
    dueTime: "",
    notes: ""
  });

  useEffect(() => {
    if (selectedTask) {
      setEditedTask({
        name: selectedTask.name,
        description: selectedTask.description,
        priority: selectedTask.priority,
        dueDate: selectedTask.dueDate || "",
        dueTime: selectedTask.dueTime || "",
        notes: selectedTask.notes || ""
      });
    }
  }, [selectedTask]);

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleModalSave = () => {
    if (selectedTask) {
      // Adicionar notas ao histórico se houver
      const updates = {
        ...editedTask,
        status: selectedTask.status
      };
      
      if (tasks.some(t => t.id === selectedTask.id)) {
        // Update existing task
        updateTask(selectedTask.id, updates);
      } else {
        // Add new task
        createTask(updates);
      }
    }
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name]: value
    });
  };

  if (!showModal || !selectedTask) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {tasks.some(t => t.id === selectedTask?.id) ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button 
            onClick={handleModalClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Conteúdo */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Coluna esquerda */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <CheckSquare size={16} className="mr-2" />
                  Nome da Tarefa
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedTask.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Título da tarefa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <AlignLeft size={16} className="mr-2" />
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={editedTask.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva detalhes da tarefa"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Tag size={16} className="mr-2" />
                    Prioridade
                  </label>
                  <select
                    name="priority"
                    value={editedTask.priority}
                    onChange={handleInputChange}
                    className={`w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 ${getPriorityColor(editedTask.priority)}`}
                  >
                    {ALL_PRIORITIES.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <CheckSquare size={16} className="mr-2" />
                    Status
                  </label>
                  <select
                    name="status"
                    value={selectedTask?.status}
                    onChange={(e) => setSelectedTask({...selectedTask, status: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    {ALL_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Coluna direita */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar size={16} className="mr-2" />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Clock size={16} className="mr-2" />
                    Horário
                  </label>
                  <input
                    type="time"
                    name="dueTime"
                    value={editedTask.dueTime || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <AlignLeft size={16} className="mr-2" />
                  Anotações
                </label>
                <textarea
                  name="notes"
                  value={editedTask.notes || ""}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Adicione notas ou observações"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Timeline de status editável */}
          {selectedTask && selectedTask.history && selectedTask.history.length > 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <EditableStatusTimeline 
                history={selectedTask.history} 
                taskId={selectedTask.id}
                onUpdateHistory={updateTaskHistory}
              />
            </div>
          )}
        </div>
        
        {/* Rodapé */}
        <div className="border-t p-4 flex justify-end space-x-3 sticky bottom-0 bg-white">
          <button
            onClick={handleModalClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <X size={16} className="mr-2" />
            Cancelar
          </button>
          <button
            onClick={handleModalSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Save size={16} className="mr-2" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;