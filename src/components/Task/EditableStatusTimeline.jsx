import React, { useState } from 'react';
import { formatDate } from '../../utils/dateUtils';
import { getTaskBadgeColor } from '../../utils/formatUtils';
import { Clock, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { ALL_STATUSES } from '../../constants/taskStatuses';

const EditableStatusTimeline = ({ history, taskId, onUpdateHistory }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [editedEntry, setEditedEntry] = useState({
    date: '',
    status: '',
    notes: ''
  });

  // Inicia a edição de uma entrada existente
  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditedEntry({
      date: history[index].date,
      status: history[index].status,
      notes: history[index].notes || ''
    });
    setAddingNew(false);
  };

  // Inicia a adição de uma nova entrada
  const handleStartAdd = () => {
    setAddingNew(true);
    setEditingIndex(null);
    setEditedEntry({
      date: new Date().toISOString().split('T')[0],
      status: history[history.length - 1]?.status || 'Pendente',
      notes: ''
    });
  };

  // Cancela a edição ou adição
  const handleCancel = () => {
    setEditingIndex(null);
    setAddingNew(false);
  };

  // Salva as alterações em uma entrada existente
  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedHistory = [...history];
      updatedHistory[editingIndex] = { ...editedEntry };
      onUpdateHistory(taskId, updatedHistory);
    }
    setEditingIndex(null);
  };

  // Salva uma nova entrada
  const handleSaveNew = () => {
    if (addingNew) {
      const updatedHistory = [...history, { ...editedEntry }];
      onUpdateHistory(taskId, updatedHistory);
    }
    setAddingNew(false);
  };

  // Remove uma entrada do histórico
  const handleRemove = (index) => {
    if (window.confirm('Tem certeza que deseja remover este registro do histórico?')) {
      const updatedHistory = [...history];
      updatedHistory.splice(index, 1);
      onUpdateHistory(taskId, updatedHistory);
    }
  };

  // Manipula mudanças nos campos de edição
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEntry({
      ...editedEntry,
      [name]: value
    });
  };

  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Clock size={16} className="mr-2" />
          Histórico de Status:
        </h3>
        <button
          onClick={handleStartAdd}
          className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
          disabled={addingNew || editingIndex !== null}
        >
          <Plus size={14} className="mr-1" />
          Adicionar
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Formulário para adicionar nova entrada */}
        {addingNew && (
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-2">
            <h4 className="text-sm font-medium mb-2 text-blue-700">Nova Entrada</h4>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Data:</label>
                <input
                  type="date"
                  name="date"
                  value={editedEntry.date}
                  onChange={handleInputChange}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Status:</label>
                <select
                  name="status"
                  value={editedEntry.status}
                  onChange={handleInputChange}
                  className="w-full p-1 text-sm border border-gray-300 rounded"
                >
                  {ALL_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-600 mb-1">Anotações:</label>
              <textarea
                name="notes"
                value={editedEntry.notes}
                onChange={handleInputChange}
                className="w-full p-1 text-sm border border-gray-300 rounded"
                rows="2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center"
              >
                <X size={12} className="mr-1" />
                Cancelar
              </button>
              <button
                onClick={handleSaveNew}
                className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white flex items-center"
              >
                <Save size={12} className="mr-1" />
                Salvar
              </button>
            </div>
          </div>
        )}
        
        {/* Lista de entradas do histórico */}
        {history.map((entry, index) => (
          <div key={index} className="flex items-start group">
            <div className="flex-shrink-0 h-5 w-5 mt-1 relative">
              <div className={`h-5 w-5 rounded-full ${
                entry.status === "Concluída" ? "bg-green-500" : 
                entry.status === "Pausada" ? "bg-red-500" :
                entry.status === "Em andamento" ? "bg-blue-500" :
                "bg-yellow-500"
              } flex items-center justify-center`}>
                {entry.status === "Concluída" && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {index < history.length - 1 && (
                <div className="absolute top-5 left-1/2 w-0.5 h-8 -ml-px bg-gray-300"></div>
              )}
            </div>
            
            {editingIndex === index ? (
              // Modo de edição
              <div className="ml-4 min-w-0 flex-1 bg-blue-50 p-2 rounded-md border border-blue-200">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Data:</label>
                    <input
                      type="date"
                      name="date"
                      value={editedEntry.date}
                      onChange={handleInputChange}
                      className="w-full p-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Status:</label>
                    <select
                      name="status"
                      value={editedEntry.status}
                      onChange={handleInputChange}
                      className="w-full p-1 text-sm border border-gray-300 rounded"
                    >
                      {ALL_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-xs text-gray-600 mb-1">Anotações:</label>
                  <textarea
                    name="notes"
                    value={editedEntry.notes}
                    onChange={handleInputChange}
                    className="w-full p-1 text-sm border border-gray-300 rounded"
                    rows="2"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center"
                  >
                    <X size={12} className="mr-1" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white flex items-center"
                  >
                    <Save size={12} className="mr-1" />
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              // Modo de visualização
              <div className="ml-4 min-w-0 flex-1 relative">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {formatDate(entry.date)}
                  </span>
                  <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${getTaskBadgeColor(entry.status)}`}>
                    {entry.status}
                  </span>
                  
                  {/* Botões de ação visíveis apenas no hover */}
                  <div className="absolute right-0 top-0 hidden group-hover:flex items-center space-x-1">
                    <button
                      onClick={() => handleStartEdit(index)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      disabled={editingIndex !== null || addingNew}
                      title="Editar"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleRemove(index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                      disabled={editingIndex !== null || addingNew || history.length <= 1}
                      title="Remover"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                {entry.notes && (
                  <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded-md border-l-2 border-gray-300">
                    {entry.notes}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditableStatusTimeline;