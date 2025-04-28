import React from 'react';

const CalendarNavigation = ({ 
  calendarView, 
  setCalendarView, 
  goToPrevious, 
  goToNext, 
  goToToday 
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPrevious}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
        >
          &lt; Anterior
        </button>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={goToToday}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-md text-blue-700 text-sm"
          >
            Hoje
          </button>
          
          <select 
            value={calendarView}
            onChange={(e) => setCalendarView(e.target.value)}
            className="border border-gray-300 rounded-md p-1 text-sm"
          >
            <option value="day">Diário</option>
            <option value="week">Semanal</option>
            <option value="month">Mensal</option>
            <option value="year">Anual</option>
          </select>
        </div>
        
        <button 
          onClick={goToNext}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
        >
          Próximo &gt;
        </button>
      </div>
    </div>
  );
};

export default CalendarNavigation;
