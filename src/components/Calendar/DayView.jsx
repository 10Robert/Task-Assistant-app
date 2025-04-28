import React from 'react';
import { formatFullDate } from '../../utils/dateUtils';
import CalendarTask from './CalendarTask';
import { useTaskContext } from '../../context/TaskContext';

const DayView = ({ currentDate }) => {
  const { getTasksForDate, setSelectedTask, setShowModal } = useTaskContext();
  const tasksForDay = getTasksForDate(currentDate);
  
  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      name: "Nova tarefa",
      priority: "Média",
      description: "Descrição da tarefa",
      status: "Pendente",
      dueDate: currentDate.toISOString().split('T')[0],
      dueTime: ""
    };
    
    setSelectedTask(newTask);
    setShowModal(true);
  };
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        {formatFullDate(currentDate)}
      </h2>
      
      <div className="min-h-64">
        {tasksForDay.length > 0 ? (
          <div className="space-y-2">
            {tasksForDay.map(task => (
              <CalendarTask 
                key={task.id} 
                task={task} 
                onClick={() => {
                  setSelectedTask(task);
                  setShowModal(true);
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-24 text-gray-400">
            Sem tarefas para este dia
          </div>
        )}
        
        <button
          onClick={handleAddTask}
          className="mt-4 w-full py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200"
        >
          + Adicionar Tarefa
        </button>
      </div>
    </div>
  );
};

export default DayView;