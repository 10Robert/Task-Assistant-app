import React from 'react';
import { getYearMonths, formatMonth } from '../../utils/dateUtils';
import { useTaskContext } from '../../context/TaskContext';

const YearView = ({ currentDate, setCurrentDate, setCalendarView }) => {
  const { tasks } = useTaskContext();
  const months = getYearMonths(currentDate);
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">
        {currentDate.getFullYear()}
      </h2>
      
      <div className="grid grid-cols-4 gap-4">
        {months.map((month, index) => {
          // Contar tarefas no mês
          const monthStart = new Date(month);
          const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
          
          const tasksInMonth = tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate >= monthStart && taskDate <= monthEnd;
          });
          
          const completedTasks = tasksInMonth.filter(t => t.status === "Concluída");
          
          return (
            <div 
              key={index}
              className={`border rounded-lg p-3 cursor-pointer hover:bg-gray-50 ${
                month.getMonth() === currentDate.getMonth() && 
                month.getFullYear() === currentDate.getFullYear() ? 
                'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => {
                setCurrentDate(new Date(month));
                setCalendarView('month');
              }}
            >
              <h3 className="font-medium text-center mb-2">
                {formatMonth(month)}
              </h3>
              
              <div className="flex justify-between text-sm">
                <span>Total: {tasksInMonth.length}</span>
                <span className="text-green-600">
                  Concluídas: {completedTasks.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearView;