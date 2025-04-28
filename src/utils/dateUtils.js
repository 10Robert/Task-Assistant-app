export function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }
  
  export function formatFullDate(date) {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('pt-BR', options);
  }
  
  export function formatMonthYear(date) {
    const options = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  }
  
  export function formatMonth(date) {
    const options = { month: 'short' };
    return date.toLocaleDateString('pt-BR', options);
  }
  
  export function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
  
  export function getWeekDates(baseDate) {
    const weekDates = [];
    const date = new Date(baseDate);
    const day = date.getDay(); // 0 = Domingo, 1 = Segunda, ...
    
    // Calcular o domingo da semana atual
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - day);
    
    // Gerar array com os 7 dias da semana
    for (let i = 0; i < 7; i++) {
      const day = new Date(sunday);
      day.setDate(sunday.getDate() + i);
      weekDates.push(day);
    }
    
    return weekDates;
  }
  
  export function getMonthDates(baseDate) {
    const monthDates = [];
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    
    // Adicionar dias anteriores ao primeiro dia para completar a semana
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      monthDates.push({ date, isCurrentMonth: false });
    }
    
    // Adicionar todos os dias do mês
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      monthDates.push({ date, isCurrentMonth: true });
    }
    
    // Adicionar dias após o último dia para completar a semana
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(year, month + 1, i);
      monthDates.push({ date, isCurrentMonth: false });
    }
    
    return monthDates;
  }
  
  export function getYearMonths(baseDate) {
    const months = [];
    const year = baseDate.getFullYear();
    
    for (let month = 0; month < 12; month++) {
      months.push(new Date(year, month, 1));
    }
    
    return months;
  }
  
  export function getTodayString() {
    return new Date().toISOString().split('T')[0];
  }
  