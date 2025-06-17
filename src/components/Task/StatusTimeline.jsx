import React, { useState } from 'react';
import { formatDateTime } from '../../utils/dateUtils';
import { getTaskBadgeColor } from '../../utils/formatUtils';
import { Plus, Save, X, RefreshCw } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

const StatusTimeline = ({ history, taskId }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { changeTaskStatus, selectedTask, reloadTask } = useTaskContext();

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      alert('Digite uma anotação antes de salvar');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const currentStatus = selectedTask?.status || 'Pendente';
      await changeTaskStatus(taskId, currentStatus, newNote.trim());
      
      // Aguardar e recarregar
      setTimeout(async () => {
        await reloadTask(taskId);
      }, 1000);
      
      setNewNote('');
      setShowAddForm(false);
      
    } catch (error) {
      alert('Erro ao adicionar anotação: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefreshHistory = async () => {
    try {
      await reloadTask(taskId);
    } catch (error) {
      console.error('Erro ao atualizar histórico:', error);
    }
  };

  const handleCancel = () => {
    setNewNote('');
    setShowAddForm(false);
  };

  // Usar histórico do selectedTask se disponível, senão usar props
  const currentHistory = selectedTask?.history || history || [];
  
  // Ordenar histórico por data (mais recente primeiro)
  const sortedHistory = currentHistory ? [...currentHistory].sort((a, b) => {
    const dateA = new Date(a.created_at || a.date);
    const dateB = new Date(b.created_at || b.date);
    return dateB - dateA;
  }) : [];

  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">
          Histórico de Status ({sortedHistory.length})
        </h3>
        <div className="flex gap-1">
          <button
            onClick={handleRefreshHistory}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded transition-colors"
            title="Atualizar histórico"
          >
            <RefreshCw size={12} />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors"
            disabled={showAddForm}
          >
            <Plus size={12} />
            Adicionar Nota
          </button>
        </div>
      </div>

      {/* Formulário para adicionar nova nota */}
      {showAddForm && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <label className="block text-xs font-medium text-blue-700 mb-1">
            Nova anotação:
          </label>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Descreva o que aconteceu com esta tarefa..."
            className="w-full p-2 text-sm border border-blue-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            disabled={isSubmitting}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors"
              disabled={isSubmitting}
            >
              <X size={12} />
              Cancelar
            </button>
            <button
              onClick={handleAddNote}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50"
              disabled={isSubmitting || !newNote.trim()}
            >
              <Save size={12} />
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {/* Lista do histórico */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {sortedHistory.length > 0 ? (
          sortedHistory.map((entry, index) => (
            <div key={entry.id || `entry-${index}`} className="flex items-start">
              <div className="flex-shrink-0 h-3 w-3 mt-1.5 relative">
                <div className={`h-3 w-3 rounded-full ${
                  entry.status === "Concluída" ? "bg-green-500" : 
                  entry.status === "Pausada" ? "bg-red-500" :
                  entry.status === "Em andamento" ? "bg-blue-500" :
                  "bg-yellow-500"
                }`}></div>
                {index < sortedHistory.length - 1 && (
                  <div className="absolute top-3 left-1/2 w-px h-8 -ml-px bg-gray-300"></div>
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs text-gray-500">
                    {formatDateTime(entry.created_at || entry.date)}
                  </span>
                  <span className={`text-xs py-0.5 px-2 rounded-full ${getTaskBadgeColor(entry.status)}`}>
                    {entry.status}
                  </span>
                </div>
                
                {entry.notes && (
                  <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 border-l-2 border-gray-300">
                    {entry.notes}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded">
            <div className="mb-1">📝</div>
            Nenhum histórico disponível
            <div className="text-xs mt-1">Adicione a primeira anotação!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusTimeline;