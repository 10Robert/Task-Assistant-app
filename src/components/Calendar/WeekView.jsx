import React from 'react';
import { getWeekDates, formatFullDate, isToday } from '../../utils/dateUtils';
import CalendarTask from './CalendarTask';
import { useTaskContext } from '../../context/TaskContext';

const WeekView = ({ currentDate }) => {
  const { getTasksForDate, setSelectedTask, setShowModal } = useTaskContext();
  const weekDates = getWeekDates(currentDate);
  
  const handleAddTask = (date) => {
    const newTask = {
      id: Date.now(),
      name: "Nova tarefa",
      priority: "Média",
      description: "Descrição da tarefa",
      status: "Pendente",
      dueDate: date.toISOString().split('T')[0],
      dueTime: ""
    };
    
    setSelectedTask(newTask);
    setShowModal(true);
  };
  
  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDates.map((date, index) => (
        <div key={index} className={`border rounded-lg ${isToday(date) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <div className={`p-2 text-center border-b ${isToday(date) ? 'bg-blue-100 text-blue-800' : 'bg-gray-50'}`}>
            <p className="font-semibold">{formatFullDate(date)}</p>
          </div>
          <div className="p-2 min-h-64 max-h-96 overflow-y-auto">
            {getTasksForDate(date).length > 0 ? (
              getTasksForDate(date).map(task => (
                <CalendarTask 
                  key={task.id} 
                  task={task} 
                  onClick={() => {
                    setSelectedTask(task);
                    setShowModal(true);
                  }} 
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-16 text-gray-400 text-sm">
                Sem tarefas
              </div>
            )}
            <button
              onClick={() => handleAddTask(date)}
              className="mt-2 w-full py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200"
            >
              + Adicionar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeekView;
