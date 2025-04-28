import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { BarChart, LineChart, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PieChart as PieChartIcon, BarChart as BarChartIcon, TrendingUp, Calendar } from 'lucide-react';
import { formatMonth } from '../../utils/dateUtils';
import { TASK_STATUS } from '../../constants/taskStatuses';
import { TASK_PRIORITY } from '../../constants/taskPriorities';

const Dashboard = () => {
  const { tasks } = useTaskContext();
  const [timeframe, setTimeframe] = useState('month'); // 'week', 'month', 'year'
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    statusDistribution: [],
    priorityDistribution: [],
    completionTrend: [],
    dailyTasksCount: []
  });
  
  // Cores para os gráficos
  const COLORS = {
    status: {
      [TASK_STATUS.COMPLETED]: '#10B981',
      [TASK_STATUS.IN_PROGRESS]: '#3B82F6',
      [TASK_STATUS.PENDING]: '#F59E0B',
      [TASK_STATUS.PAUSED]: '#EF4444'
    },
    priority: {
      [TASK_PRIORITY.HIGH]: '#EF4444',
      [TASK_PRIORITY.MEDIUM]: '#F59E0B',
      [TASK_PRIORITY.LOW]: '#10B981'
    }
  };
  
  // Atualizar dados do dashboard baseado nas tarefas e timeframe
  useEffect(() => {
    const prepareData = () => {
      // Determinar período a ser analisado
      let startDate, endDate;
      
      if (timeframe === 'week') {
        // Calcular início e fim da semana
        const start = new Date(selectedWeek);
        const day = start.getDay();
        start.setDate(start.getDate() - day); // Domingo
        startDate = new Date(start);
        
        const end = new Date(start);
        end.setDate(end.getDate() + 6); // Sábado
        endDate = end;
      } else if (timeframe === 'month') {
        // Calcular início e fim do mês
        startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      } else if (timeframe === 'year') {
        // Calcular início e fim do ano
        startDate = new Date(selectedMonth.getFullYear(), 0, 1);
        endDate = new Date(selectedMonth.getFullYear(), 11, 31);
      }
      
      // Filtrar tarefas no período (baseado em dueDate)
      const tasksInPeriod = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate >= startDate && taskDate <= endDate;
      });
      
      // Distribuição por status
      const statusCounts = {};
      ALL_STATUSES.forEach(status => {
        statusCounts[status] = 0;
      });
      
      tasksInPeriod.forEach(task => {
        statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
      });
      
      const statusDistribution = Object.keys(statusCounts).map(status => ({
        name: status,
        value: statusCounts[status],
        color: COLORS.status[status]
      }));
      
      // Distribuição por prioridade
      const priorityCounts = {};
      ALL_PRIORITIES.forEach(priority => {
        priorityCounts[priority] = 0;
      });
      
      tasksInPeriod.forEach(task => {
        priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
      });
      
      const priorityDistribution = Object.keys(priorityCounts).map(priority => ({
        name: priority,
        value: priorityCounts[priority],
        color: COLORS.priority[priority]
      }));
      
      // Tendência de conclusão (por dia ou semana, dependendo do timeframe)
      let completionTrend = [];
      
      if (timeframe === 'week' || timeframe === 'month') {
        // Criar um objeto para cada dia no período
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          
          // Contar tarefas concluídas neste dia
          const tasksCompletedOnDate = tasks.filter(task => {
            if (!task.history) return false;
            
            // Encontrar a entrada mais recente de "Concluída" para esta tarefa
            const completionEntry = task.history
              .filter(entry => entry.status === TASK_STATUS.COMPLETED)
              .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            
            if (!completionEntry) return false;
            
            return completionEntry.date === dateStr;
          });
          
          completionTrend.push({
            date: new Date(currentDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
            concluídas: tasksCompletedOnDate.length
          });
          
          // Incrementar para o próximo dia
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else if (timeframe === 'year') {
        // Agrupar por mês para o ano
        for (let month = 0; month < 12; month++) {
          const firstDay = new Date(selectedMonth.getFullYear(), month, 1);
          const lastDay = new Date(selectedMonth.getFullYear(), month + 1, 0);
          
          // Contar tarefas concluídas neste mês
          const tasksCompletedInMonth = tasks.filter(task => {
            if (!task.history) return false;
            
            // Verificar se há alguma entrada de conclusão neste mês
            return task.history.some(entry => {
              if (entry.status !== TASK_STATUS.COMPLETED) return false;
              
              const entryDate = new Date(entry.date);
              return entryDate >= firstDay && entryDate <= lastDay;
            });
          });
          
          completionTrend.push({
            date: formatMonth(new Date(selectedMonth.getFullYear(), month, 1)),
            concluídas: tasksCompletedInMonth.length
          });
        }
      }
      
      // Distribuição diária de tarefas (para gráfico de densidade)
      const dailyTasksCount = [];
      
      if (timeframe === 'week' || timeframe === 'month') {
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          
          // Contar todas as tarefas para este dia
          const tasksForDate = tasksInPeriod.filter(task => task.dueDate === dateStr);
          
          dailyTasksCount.push({
            date: new Date(currentDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
            total: tasksForDate.length,
            concluídas: tasksForDate.filter(t => t.status === TASK_STATUS.COMPLETED).length,
            pendentes: tasksForDate.filter(t => t.status === TASK_STATUS.PENDING).length,
            andamento: tasksForDate.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length,
            pausadas: tasksForDate.filter(t => t.status === TASK_STATUS.PAUSED).length
          });
          
          // Incrementar para o próximo dia
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      
      setDashboardData({
        statusDistribution,
        priorityDistribution,
        completionTrend,
        dailyTasksCount
      });
    };
    
    prepareData();
  }, [tasks, timeframe, selectedMonth, selectedWeek]);
  
  // Navegar pelo tempo
  const goToNextPeriod = () => {
    if (timeframe === 'week') {
      const nextWeek = new Date(selectedWeek);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setSelectedWeek(nextWeek);
    } else if (timeframe === 'month') {
      const nextMonth = new Date(selectedMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setSelectedMonth(nextMonth);
    } else if (timeframe === 'year') {
      const nextYear = new Date(selectedMonth);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setSelectedMonth(nextYear);
    }
  };
  
  const goToPreviousPeriod = () => {
    if (timeframe === 'week') {
      const prevWeek = new Date(selectedWeek);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setSelectedWeek(prevWeek);
    } else if (timeframe === 'month') {
      const prevMonth = new Date(selectedMonth);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setSelectedMonth(prevMonth);
    } else if (timeframe === 'year') {
      const prevYear = new Date(selectedMonth);
      prevYear.setFullYear(prevYear.getFullYear() - 1);
      setSelectedMonth(prevYear);
    }
  };
  
  const goToToday = () => {
    const today = new Date();
    setSelectedWeek(today);
    setSelectedMonth(today);
  };
  
  // Exibir título do período
  const getPeriodTitle = () => {
    if (timeframe === 'week') {
      const start = new Date(selectedWeek);
      const day = start.getDay();
      start.setDate(start.getDate() - day); // Domingo
      
      const end = new Date(start);
      end.setDate(end.getDate() + 6); // Sábado
      
      return `${start.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})} - ${end.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}`;
    } else if (timeframe === 'month') {
      return selectedMonth.toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'});
    } else if (timeframe === 'year') {
      return selectedMonth.getFullYear().toString();
    }
  };
  
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-white rounded-lg p-4 shadow-md mb-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={goToPreviousPeriod}
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
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border border-gray-300 rounded-md p-1 text-sm"
            >
              <option value="week">Semanal</option>
              <option value="month">Mensal</option>
              <option value="year">Anual</option>
            </select>
            
            <h2 className="text-lg font-semibold">{getPeriodTitle()}</h2>
          </div>
          
          <button 
            onClick={goToNextPeriod}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
          >
            Próximo &gt;
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Cartões resumo */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon size={18} className="mr-2 text-blue-600" />
            Distribuição por Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}`}
                >
                  {dashboardData.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon size={18} className="mr-2 text-blue-600" />
            Distribuição por Prioridade
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.priorityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}`}
                >
                  {dashboardData.priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp size={18} className="mr-2 text-blue-600" />
            Tendência de Conclusão
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboardData.completionTrend}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="concluídas" stroke="#10B981" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChartIcon size={18} className="mr-2 text-blue-600" />
            Quantidade Diária de Tarefas
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData.dailyTasksCount}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Total" fill="#64748b" />
                <Bar dataKey="concluídas" name="Concluídas" fill="#10B981" />
                <Bar dataKey="andamento" name="Em Andamento" fill="#3B82F6" />
                <Bar dataKey="pendentes" name="Pendentes" fill="#F59E0B" />
                <Bar dataKey="pausadas" name="Pausadas" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Resumo de produtividade */}
      <div className="bg-white rounded-lg p-4 shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar size={18} className="mr-2 text-blue-600" />
          Resumo de Produtividade
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="text-sm font-medium text-green-800 mb-1">Tarefas Concluídas</h4>
            <p className="text-2xl font-bold text-green-700">
              {dashboardData.statusDistribution.find(item => item.name === TASK_STATUS.COMPLETED)?.value || 0}
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Em Andamento</h4>
            <p className="text-2xl font-bold text-blue-700">
              {dashboardData.statusDistribution.find(item => item.name === TASK_STATUS.IN_PROGRESS)?.value || 0}
            </p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="text-sm font-medium text-yellow-800 mb-1">Pendentes</h4>
            <p className="text-2xl font-bold text-yellow-700">
              {dashboardData.statusDistribution.find(item => item.name === TASK_STATUS.PENDING)?.value || 0}
            </p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="text-sm font-medium text-red-800 mb-1">Pausadas</h4>
            <p className="text-2xl font-bold text-red-700">
              {dashboardData.statusDistribution.find(item => item.name === TASK_STATUS.PAUSED)?.value || 0}
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Taxa de Conclusão</h4>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-600 h-4 rounded-full" 
              style={{ 
                width: `${
                  (dashboardData.statusDistribution.find(item => item.name === TASK_STATUS.COMPLETED)?.value || 0) / 
                  (dashboardData.statusDistribution.reduce((sum, item) => sum + item.value, 0) || 1) * 100
                }%` 
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {Math.round(
              (dashboardData.statusDistribution.find(item => item.name === TASK_STATUS.COMPLETED)?.value || 0) / 
              (dashboardData.statusDistribution.reduce((sum, item) => sum + item.value, 0) || 1) * 100
            )}% das tarefas concluídas neste período
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;