// src/components/Task/StatusTimeline.jsx - VERSÃO COM DEBUG DETALHADO

import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/dateUtils';
import { getTaskBadgeColor } from '../../utils/formatUtils';
import { Plus, Save, X, RefreshCw } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

const StatusTimeline = ({ history, taskId }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { changeTaskStatus, selectedTask, reloadTask } = useTaskContext();

  // Debug: Log do histórico recebido
  useEffect(() => {
    console.log('📊 ===== STATUS TIMELINE DEBUG =====');
    console.log('📊 TaskId recebido:', taskId);
    console.log('📊 História recebida (props):', history);
    console.log('📊 Tipo da história:', typeof history);
    console.log('📊 É array:', Array.isArray(history));
    console.log('📊 Quantidade de itens:', history?.length || 0);
    console.log('📊 SelectedTask:', selectedTask);
    console.log('📊 SelectedTask.history:', selectedTask?.history);
    
    if (history && history.length > 0) {
      history.forEach((item, index) => {
        console.log(`📊 Item ${index}:`, {
          id: item.id,
          status: item.status,
          notes: item.notes,
          created_at: item.created_at,
          date: item.date
        });
      });
    }
    console.log('📊 ===== FIM DEBUG =====');
  }, [history, taskId, selectedTask]);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      alert('Digite uma anotação antes de salvar');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const currentStatus = selectedTask?.status || 'Pendente';
      console.log('📝 Adicionando nota:', { taskId, currentStatus, note: newNote.trim() });
      
      await changeTaskStatus(taskId, currentStatus, newNote.trim());
      
      // Aguardar e recarregar
      setTimeout(async () => {
        console.log('🔄 Recarregando tarefa após adicionar nota...');
        await reloadTask(taskId);
      }, 1000);
      
      setNewNote('');
      setShowAddForm(false);
      
    } catch (error) {
      console.error('❌ Erro ao adicionar nota:', error);
      alert('Erro ao adicionar anotação: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefreshHistory = async () => {
    console.log('🔄 Atualizando histórico manualmente...');
    try {
      await reloadTask(taskId);
    } catch (error) {
      console.error('❌ Erro ao atualizar histórico:', error);
    }
  };

  const handleCancel = () => {
    setNewNote('');
    setShowAddForm(false);
  };

  // Usar histórico do selectedTask se disponível, senão usar props
  const currentHistory = selectedTask?.history || history || [];
  
  // Debug do histórico atual
  console.log('📊 Histórico atual sendo usado:', currentHistory);
  
  // Ordenar histórico por data (mais recente primeiro)
  const sortedHistory = currentHistory ? [...currentHistory].sort((a, b) => {
    const dateA = new Date(a.created_at || a.date);
    const dateB = new Date(b.created_at || b.date);
    return dateB - dateA;
  }) : [];

  console.log('📊 Histórico ordenado:', sortedHistory);

  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      {/* Debug Info - Remover em produção */}
      <div className="mb-2 p-2 bg-yellow-50 rounded text-xs">
        <strong>Debug:</strong>
        <div>TaskId: {taskId}</div>
        <div>Props History: {history?.length || 0} itens</div>
        <div>SelectedTask History: {selectedTask?.history?.length || 0} itens</div>
        <div>Current History: {currentHistory?.length || 0} itens</div>
        <div>Sorted History: {sortedHistory?.length || 0} itens</div>
      </div>

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

      {/* Lista do histórico com debug detalhado */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {sortedHistory.length > 0 ? (
          sortedHistory.map((entry, index) => {
            console.log(`📊 Renderizando item ${index}:`, entry);
            
            return (
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
                  {/* Debug de cada item */}
                  <div className="mb-1 p-1 bg-gray-100 rounded text-xs">
                    <div>ID: {entry.id}</div>
                    <div>Status: {entry.status}</div>
                    <div>Data: {entry.created_at || entry.date}</div>
                    <div>Notas: {entry.notes || 'sem notas'}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs text-gray-500">
                      {formatDate(entry.created_at || entry.date)}
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
            );
          })
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