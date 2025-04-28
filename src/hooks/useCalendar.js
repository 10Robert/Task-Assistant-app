import { useState } from 'react';

export function useCalendar() {
  const [calendarView, setCalendarView] = useState('week'); // 'day', 'week', 'month', 'year'
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const goToToday = () => setCurrentDate(new Date());
  
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    } else if (calendarView === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (calendarView === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (calendarView === 'year') {
      newDate.setFullYear(currentDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'day') {
      newDate.setDate(currentDate.getDate() + 1);
    } else if (calendarView === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (calendarView === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (calendarView === 'year') {
      newDate.setFullYear(currentDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };
  
  return {
    calendarView,
    setCalendarView,
    currentDate,
    setCurrentDate,
    goToToday,
    goToPrevious,
    goToNext
  };
}
