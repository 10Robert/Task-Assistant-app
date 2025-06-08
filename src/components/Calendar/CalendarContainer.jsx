import React from 'react';
import { useCalendar } from '../../hooks/useCalendar';
import CalendarNavigation from './CalendarNavigation';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';

const CalendarContainer = () => {
  const {
    calendarView,
    setCalendarView,
    currentDate,
    setCurrentDate,
    goToToday,
    goToPrevious,
    goToNext
  } = useCalendar();

  return (
    <div className="flex-1 overflow-auto p-6">
      <CalendarNavigation
        calendarView={calendarView}
        setCalendarView={setCalendarView}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
        goToToday={goToToday}
      />
      
      <div className="bg-white rounded-lg p-4 shadow-md">
        {calendarView === 'day' && <DayView currentDate={currentDate} />}
        
        {calendarView === 'week' && <WeekView currentDate={currentDate} />}
        
        {calendarView === 'month' && (
          <MonthView 
            currentDate={currentDate} 
            setCurrentDate={setCurrentDate}
            setCalendarView={setCalendarView}
          />
        )}
        
        {calendarView === 'year' && (
          <YearView 
            currentDate={currentDate} 
            setCurrentDate={setCurrentDate}
            setCalendarView={setCalendarView}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarContainer;