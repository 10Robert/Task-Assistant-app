import React from 'react';
import { getMonthDates, formatMonthYear, isToday } from '../../utils/dateUtils';
import { getTaskBadgeColor } from '../../utils/formatUtils';
import { useTaskContext } from '../../context/TaskContext';

const MonthView = ({ currentDate, setCurrentDate, setCalendarView }) => {
  const { getTasksForDate, setSelectedTask, setShowModal } = useTaskContext();
  const monthDates = getMonthDates(currentDate);
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">
        {formatMonthYear(currentDate)}
      </h2>
      
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-sm font-medium py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {monthDates.map((item, index) => {
          const tasksForDay = getTasksForDate(item.date);
          return (
            <div 
              key={index} 
              className={`border p-1 min-h-24 ${
                isToday(item.date) ? 'bg-blue-50 border-blue-500' : 
                item.isCurrentMonth ? 'bg-white border-gray-200' : 
                'bg-gray-50 border-gray-200 text-gray-400'
              }`}
              onClick={() => {
                setCurrentDate(new Date(item.date));
                setCalendarView('day');
              }}
            >
              <div className="text-right text-xs mb-1">
                {item.date.getDate()}
              </div>
              
              <div className="overflow-y-auto max-h-20">
                {tasksForDay.slice(0, 3).map(task => (
                  <div 
                    key={task.id}
                    className={`text-xs p-1 mb-1 truncate rounded-sm ${getTaskBadgeColor(task.status)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTask(task);
                      setShowModal(true);
                    }}
                  >
                    {task.name}
                  </div>
                ))}
                
                {tasksForDay.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{tasksForDay.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;