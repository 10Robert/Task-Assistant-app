import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, Edit, Trash2, Plus, Check, X, Calendar, Grid, ChevronRight, ChevronDown, List, Filter } from 'lucide-react';

export default function TaskApp() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Desenvolver protótipo",
      priority: "Alta",
      description: "Criar o protótipo inicial do aplicativo para apresentação aos stakeholders",
      status: "Em andamento",
      dueDate: "2025-05-10",
      dueTime: "14:30",
      history: [
        { date: "2025-04-15", status: "Pendente", notes: "Tarefa criada" },
        { date: "2025-04-18", status: "Em andamento", notes: "Iniciado desenvolvimento" }
      ]
    },
    {
      id: 2,
      name: "Reunião com cliente",
      priority: "Alta",
      description: "Discutir os requisitos do novo módulo e alinhar expectativas",
      status: "Pendente",
      dueDate: "2025-04-28",
      dueTime: "10:00",
      history: [
        { date: "2025-04-20", status: "Pendente", notes: "Agendamento da reunião" }
      ]
    },
    {
      id: 3,
      name: "Corrigir bugs",
      priority: "Média",
      description: "Resolver os problemas reportados no módulo de autenticação",
      status: "Concluída",
      dueDate: "2025-04-20",
      dueTime: "18:00",
      history: [
        { date: "2025-04-10", status: "Pendente", notes: "Bugs reportados" },
        { date: "2025-04-12", status: "Em andamento", notes: "Início da correção" },
        { date: "2025-04-20", status: "Concluída", notes: "Todos os bugs corrigidos" }
      ]
    },
    {
      id: 4,
      name: "Documentar API",
      priority: "Baixa",
      description: "Criar documentação completa para a API do sistema",
      status: "Pausada",
      dueDate: "2025-05-15",
      dueTime: "16:45",
      history: [
        { date: "2025-04-05", status: "Pendente", notes: "Tarefa adicionada" },
        { date: "2025-04-08", status: "Em andamento", notes: "Início da documentação" },
        { date: "2025-04-15", status: "Pausada", notes: "Pausada para priorizar outras tarefas" }
      ]
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTask, setEditedTask] = useState({
    name: "",
    description: "",
    priority: "",
    dueDate: "",
    dueTime: ""
  });
  const [draggedTask, setDraggedTask] = useState(null);
  const [activeView, setActiveView] = useState('tasks'); // 'tasks' ou 'calendar'
  const [calendarView, setCalendarView] = useState('week'); // 'day', 'week', 'month', 'year'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState("");
  const [statusFilters, setStatusFilters] = useState({
    "Em andamento": true,
    "Pendente": true,
    "Pausada": true,
    "Concluída": true
  });

  // Funções para navegação no calendário
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

  // Filtrar tarefas com base nos filtros selecionados
  const filteredTasks = tasks.filter(task => {
    // Filtro por status
    if (!statusFilters[task.status]) {
      return false;
    }
    
    // Filtro por data (se especificado)
    if (filterDate && task.dueDate !== filterDate) {
      return false;
    }
    
    return true;
  });

  // Separar tarefas filtradas por status
  const tasksInProgress = filteredTasks.filter(task => task.status === "Em andamento");
  const tasksPaused = filteredTasks.filter(task => task.status === "Pausada");
  const tasksCompleted = filteredTasks.filter(task => task.status === "Concluída");
  const tasksPending = filteredTasks.filter(task => task.status === "Pendente");

  // Agrupar as tarefas por área
  const activeArea = [...tasksInProgress, ...tasksPending];
  const pausedArea = [...tasksPaused, ...tasksCompleted];

  // Funções para calendário
  function getWeekDates(baseDate = currentDate) {
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

  function getMonthDates(baseDate = currentDate) {
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

  function getYearMonths(baseDate = currentDate) {
    const months = [];
    const year = baseDate.getFullYear();
    
    for (let month = 0; month < 12; month++) {
      months.push(new Date(year, month, 1));
    }
    
    return months;
  }

  // Função para obter as tarefas de um dia específico
  const getTasksForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };

  // Função para formatar datas em diferentes formatos
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatFullDate = (date) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('pt-BR', options);
  };

  const formatMonthYear = (date) => {
    const options = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  };

  const formatMonth = (date) => {
    const options = { month: 'short' };
    return date.toLocaleDateString('pt-BR', options);
  };

  // Verifica se a data é hoje
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Função para obter o ícone de acordo com o status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Concluída":
        return <CheckCircle2 className="text-green-500" />;
      case "Em andamento":
        return <Clock className="text-blue-500" />;
      case "Pendente":
        return <AlertCircle className="text-yellow-500" />;
      case "Pausada":
        return <AlertCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  // Função para obter a cor de acordo com a prioridade
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Média":
        return "bg-yellow-100 text-yellow-800";
      case "Baixa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Funções para lidar com os eventos de botões
  const handleEdit = (id) => {
    const task = tasks.find(t => t.id === id);
    setSelectedTask(task);
    setEditedTask({
      name: task.name,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || "",
      dueTime: task.dueTime || ""
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
    const today = new Date().toISOString().split('T')[0];
    const newTask = {
      id: newId,
      name: "Nova tarefa",
      priority: "Média",
      description: "Descrição da tarefa",
      status: "Pendente",
      dueDate: "",
      dueTime: "",
      history: [
        { date: today, status: "Pendente", notes: "Tarefa criada" }
      ]
    };
    
    setSelectedTask(newTask);
    setEditedTask({
      name: newTask.name,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime
    });
    setShowModal(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setEditedTask({
      name: task.name,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || "",
      dueTime: task.dueTime || ""
    });
    setShowModal(true);
  };

  const handleToggleTaskStatus = (id) => {
    const task = tasks.find(t => t.id === id);
    let newStatus;
    
    if (task.status === "Em andamento" || task.status === "Pendente") {
      newStatus = "Pausada";
    } else if (task.status === "Pausada") {
      newStatus = "Em andamento";
    } else if (task.status === "Concluída") {
      newStatus = "Em andamento";
    }

    const today = new Date().toISOString().split('T')[0];
    const historyEntry = { 
      date: today, 
      status: newStatus, 
      notes: `Status alterado para ${newStatus}` 
    };
    
    const updatedTasks = tasks.map(t => 
      t.id === id ? {
        ...t, 
        status: newStatus,
        history: [...t.history, historyEntry]
      } : t
    );
    setTasks(updatedTasks);
  };

  const handleCompleteTask = (id) => {
    // Atualiza o status da tarefa para "Concluída"
    const today = new Date().toISOString().split('T')[0];
    const historyEntry = { 
      date: today, 
      status: "Concluída", 
      notes: "Tarefa concluída" 
    };
    
    const updatedTasks = tasks.map(task => 
      task.id === id ? {
        ...task, 
        status: "Concluída",
        history: [...task.history, historyEntry]
      } : task
    );
    setTasks(updatedTasks);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    if (selectedTask) {
      const today = new Date().toISOString().split('T')[0];
      
      if (tasks.some(t => t.id === selectedTask.id)) {
        // Update existing task
        const existingTask = tasks.find(t => t.id === selectedTask.id);
        const statusChanged = existingTask.status !== selectedTask.status;
        
        let updatedHistory = [...existingTask.history];
        if (statusChanged) {
          updatedHistory.push({
            date: today,
            status: selectedTask.status,
            notes: `Status alterado para ${selectedTask.status}`
          });
        }
        
        const updatedTasks = tasks.map(t => 
          t.id === selectedTask.id 
            ? {
                ...t, 
                name: editedTask.name, 
                description: editedTask.description, 
                priority: editedTask.priority, 
                dueDate: editedTask.dueDate,
                dueTime: editedTask.dueTime,
                status: selectedTask.status,
                history: updatedHistory
              } 
            : t
        );
        setTasks(updatedTasks);
      } else {
        // Add new task
        const newTask = {
          ...selectedTask,
          ...editedTask,
          history: [{
            date: today,
            status: selectedTask.status,
            notes: "Tarefa criada"
          }]
        };
        setTasks([...tasks, newTask]);
      }
    }
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name]: value
    });
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilters({
      ...statusFilters,
      [status]: !statusFilters[status]
    });
  };

  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };

  const clearDateFilter = () => {
    setFilterDate("");
  };

  // Funções para drag and drop
  const handleDragStart = (e, task) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedTask(task);
  };

  const handleDragOver = (e, targetArea) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetArea) => {
    e.preventDefault();
    
    if (draggedTask) {
      let newStatus;
      
      if (targetArea === "active") {
        newStatus = "Em andamento";
      } else if (targetArea === "paused") {
        newStatus = "Pausada";
      }
      
      const today = new Date().toISOString().split('T')[0];
      const historyEntry = { 
        date: today, 
        status: newStatus, 
        notes: `Status alterado para ${newStatus} por arrasto` 
      };
      
      const updatedTasks = tasks.map(task => 
        task.id === draggedTask.id ? {
          ...task, 
          status: newStatus,
          history: [...task.history, historyEntry]
        } : task
      );
      
      setTasks(updatedTasks);
      setDraggedTask(null);
    }
  };

  // Renderiza uma tarefa
  const renderTask = (task) => (
    <div 
      key={task.id} 
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 cursor-grab min-w-64 flex-shrink-0 max-w-xs mr-4 mb-4 hover:shadow-lg transition-shadow ${
        task.status === "Concluída" ? "border-green-500 bg-green-50" : 
        task.status === "Pausada" ? "border-red-500" :
        task.status === "Em andamento" ? "border-blue-500" :
        "border-yellow-500"
      }`}
      onClick={() => handleTaskClick(task)}
      draggable={true}
      onDragStart={(e) => handleDragStart(e, task)}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-semibold ${task.status === "Concluída" ? "line-through text-gray-500" : ""}`}>
          {task.name}
        </h2>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <div className="flex items-center">
          {getStatusIcon(task.status)}
          <span className="ml-1 text-sm text-gray-600">{task.status}</span>
        </div>
      </div>
      
      <p className={`text-gray-600 mb-2 text-sm ${task.status === "Concluída" ? "line-through text-gray-500" : ""}`}>
        {task.description.length > 100 ? task.description.substring(0, 97) + '...' : task.description}
      </p>
      
      {task.dueDate && (
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar size={14} className="mr-1" />
          <span>
            {formatDate(task.dueDate)}
            {task.dueTime && ` às ${task.dueTime}`}
          </span>
        </div>
      )}
      
      <div className="flex justify-end gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
        {task.status !== "Concluída" && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleCompleteTask(task.id);
            }} 
            className="flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 rounded text-green-600 text-xs"
          >
            <Check size={14} />
            Concluir
          </button>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(task.id);
          }} 
          className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-xs"
        >
          <Edit size={14} />
          Editar
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(task.id);
          }} 
          className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600 text-xs"
        >
          <Trash2 size={14} />
          Excluir
        </button>
      </div>
    </div>
  );

  // Renderizar uma versão compacta da tarefa para o calendário
  const renderCalendarTask = (task) => (
    <div 
      key={task.id}
      className={`p-2 mb-2 rounded-md shadow-sm border-l-2 ${
        task.status === "Concluída" ? "border-green-500 bg-green-50" : 
        task.status === "Pausada" ? "border-red-500 bg-red-50" :
        task.status === "Em andamento" ? "border-blue-500 bg-blue-50" :
        "border-yellow-500 bg-yellow-50"
      }`}
      onClick={() => handleTaskClick(task)}
    >
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${task.status === "Concluída" ? "line-through text-gray-500" : ""}`}>
          {task.name}
        </p>
        <span className="text-xs text-gray-600">{task.dueTime || ""}</span>
      </div>
      <div className="flex items-center mt-1 justify-between">
        <span className={`text-xs ${getPriorityColor(task.priority)} px-1 py-0.5 rounded-sm`}>
          {task.priority}
        </span>
        <div className="flex items-center">
          {getStatusIcon(task.status)}
          <span className="ml-1 text-xs text-gray-500">{task.status}</span>
        </div>
      </div>
    </div>
  );

  // Renderizar view de filtros
  const renderFilters = () => (
    <div className="bg-white p-4 mb-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center">
          <Filter size={16} className="mr-2" />
          Filtros
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Filtros de status */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Status:</h4>
          <div className="space-y-1">
            {["Em andamento", "Pendente", "Pausada", "Concluída"].map(status => (
              <label key={status} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusFilters[status]}
                  onChange={() => handleStatusFilterChange(status)}
                  className="rounded text-blue-500 focus:ring-blue-400 mr-2"
                />
                <span className="text-sm">{status}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Filtro por data */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Data de Entrega:</h4>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={filterDate}
              onChange={handleDateFilterChange}
              className="border border-gray-300 rounded p-1 text-sm w-full"
            />
            {filterDate && (
              <button 
                onClick={clearDateFilter}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar view de tarefas
  const renderTasksView = () => (
    <div className="flex-1 overflow-auto p-4 pb-16">
      {renderFilters()}
      
      {/* Área das tarefas em andamento */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-blue-600 flex items-center">
          <Clock size={18} className="mr-2" />
          Tarefas Em Andamento
        </h2>
        <div 
          className="flex overflow-x-auto pb-4 min-h-32 items-start"
          onDragOver={(e) => handleDragOver(e, "active")}
          onDrop={(e) => handleDrop(e, "active")}
        >
          {activeArea.length > 0 ? (
            activeArea.map(renderTask)
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-300 min-w-64 flex-shrink-0 max-w-xs mr-4 flex items-center justify-center h-24 text-gray-400">
              Arraste tarefas para cá
            </div>
          )}
        </div>
      </div>
      
      {/* Área das tarefas pausadas */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-red-600 flex items-center">
          <AlertCircle size={18} className="mr-2" />
          Tarefas Pausadas
        </h2>
        <div 
          className="flex overflow-x-auto pb-4 min-h-32 items-start"
          onDragOver={(e) => handleDragOver(e, "paused")}
          onDrop={(e) => handleDrop(e, "paused")}
        >
          {pausedArea.length > 0 ? (
            pausedArea.map(renderTask)
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-300 min-w-64 flex-shrink-0 max-w-xs mr-4 flex items-center justify-center h-24 text-gray-400">
              Arraste tarefas para cá
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Renderização de diferentes visualizações de calendário
  const renderDayView = () => {
    const tasksForDay = getTasksForDate(currentDate);
    
    return (
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          {formatFullDate(currentDate)}
        </h2>
        
        <div className="min-h-64">
          {tasksForDay.length > 0 ? (
            <div className="space-y-2">
              {tasksForDay.map(renderCalendarTask)}
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-gray-400">
              Sem tarefas para este dia
            </div>
          )}
          
          <button
            onClick={() => {
              const newTask = {
                id: Math.max(...tasks.map(t => t.id), 0) + 1,
                name: "Nova tarefa",
                priority: "Média",
                description: "Descrição da tarefa",
                status: "Pendente",
                dueDate: currentDate.toISOString().split('T')[0],
                dueTime: ""
              };
              
              setSelectedTask(newTask);
              setEditedTask({
                name: newTask.name,
                description: newTask.description,
                priority: newTask.priority,
                dueDate: newTask.dueDate,
                dueTime: newTask.dueTime
              });
              setShowModal(true);
            }}
            className="mt-4 w-full py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200"
          >
            + Adicionar Tarefa
          </button>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates();
    
    return (
      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date, index) => (
          <div key={index} className={`border rounded-lg ${isToday(date) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className={`p-2 text-center border-b ${isToday(date) ? 'bg-blue-100 text-blue-800' : 'bg-gray-50'}`}>
              <p className="font-semibold">{formatFullDate(date)}</p>
            </div>
            <div className="p-2 min-h-64 max-h-96 overflow-y-auto">
              {getTasksForDate(date).length > 0 ? (
                getTasksForDate(date).map(renderCalendarTask)
              ) : (
                <div className="flex items-center justify-center h-16 text-gray-400 text-sm">
                  Sem tarefas
                </div>
              )}
              <button
                onClick={() => {
                  const newTask = {
                    id: Math.max(...tasks.map(t => t.id), 0) + 1,
                    name: "Nova tarefa",
                    priority: "Média",
                    description: "Descrição da tarefa",
                    status: "Pendente",
                    dueDate: date.toISOString().split('T')[0],
                    dueTime: "",
                    history: [
                      { date: new Date().toISOString().split('T')[0], status: "Pendente", notes: "Tarefa criada" }
                    ]
                  };
                  
                  setSelectedTask(newTask);
                  setEditedTask({
                    name: newTask.name,
                    description: newTask.description,
                    priority: newTask.priority,
                    dueDate: newTask.dueDate,
                    dueTime: newTask.dueTime
                  });
                  setShowModal(true);
                }}
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

  const renderMonthView = () => {
    const monthDates = getMonthDates();
    
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
                  {tasksForDay.length > 0 ? (
                    tasksForDay.map(task => (
                      <div 
                        key={task.id}
                        className={`text-xs p-1 mb-1 truncate rounded-sm ${
                          task.status === "Concluída" ? "bg-green-100 text-green-800" : 
                          task.status === "Pausada" ? "bg-red-100 text-red-800" :
                          task.status === "Em andamento" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task);
                        }}
                      >
                        {task.name}
                      </div>
                    ))
                  ) : null}
                  
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

  const renderYearView = () => {
    const months = getYearMonths();
    
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
                    Concluídas: {tasksInMonth.filter(t => t.status === "Concluída").length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizar view de calendário
  const renderCalendarView = () => (
    <div className="flex-1 overflow-auto p-4">
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
      
      <div className="bg-white rounded-lg p-4 shadow-md">
        {calendarView === 'day' && renderDayView()}
        {calendarView === 'week' && renderWeekView()}
        {calendarView === 'month' && renderMonthView()}
        {calendarView === 'year' && renderYearView()}
      </div>
    </div>
  );

  // Renderizar timeline de status
  const renderStatusTimeline = (history) => (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <h3 className="text-sm font-medium mb-2 text-gray-700">Histórico de Status:</h3>
      <div className="space-y-3">
        {history.map((entry, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 h-4 w-4 mt-1 relative">
              <div className={`h-4 w-4 rounded-full ${
                entry.status === "Concluída" ? "bg-green-500" : 
                entry.status === "Pausada" ? "bg-red-500" :
                entry.status === "Em andamento" ? "bg-blue-500" :
                "bg-yellow-500"
              }`}></div>
              {index < history.length - 1 && (
                <div className="absolute top-4 left-1/2 w-px h-6 -ml-px bg-gray-300"></div>
              )}
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-700">
                  {formatDate(entry.date)}
                </span>
                <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${
                  entry.status === "Concluída" ? "bg-green-100 text-green-800" : 
                  entry.status === "Pausada" ? "bg-red-100 text-red-800" :
                  entry.status === "Em andamento" ? "bg-blue-100 text-blue-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {entry.status}
                </span>
              </div>
              {entry.notes && (
                <p className="text-xs text-gray-600 mt-0.5">
                  {entry.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar / Menu Lateral */}
      <div className="w-16 bg-blue-600 h-full flex flex-col items-center py-6">
        <button 
          onClick={handleAddTask}
          className="bg-white text-blue-600 p-2 rounded-full shadow-lg flex items-center justify-center mb-6"
        >
          <Plus size={20} />
        </button>
        
        <div className="flex flex-col items-center space-y-6">
          <button 
            onClick={() => setActiveView('tasks')}
            className={`text-white p-2 rounded-lg ${activeView === 'tasks' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
            title="Tarefas"
          >
            <List size={20} />
          </button>
          <button 
            onClick={() => setActiveView('calendar')}
            className={`text-white p-2 rounded-lg ${activeView === 'calendar' ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
            title="Agenda"
          >
            <Calendar size={20} />
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-xl font-bold">
            {activeView === 'tasks' ? 'Minhas Tarefas' : 'Agenda'}
          </h1>
        </header>
        
        {/* Conteúdo dinâmico baseado na visualização ativa */}
        {activeView === 'tasks' ? renderTasksView() : renderCalendarView()}
      </div>

      {/* Modal para edição de tarefas */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {tasks.some(t => t.id === selectedTask?.id) ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h2>
              <button 
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Tarefa
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedTask.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={editedTask.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <select
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={selectedTask?.status || "Pendente"}
                  onChange={(e) => setSelectedTask({...selectedTask, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Em andamento">Em andamento</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Pausada">Pausada</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Entrega
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={editedTask.dueDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    name="dueTime"
                    value={editedTask.dueTime || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Timeline de status */}
              {selectedTask && selectedTask.history && selectedTask.history.length > 0 && (
                renderStatusTimeline(selectedTask.history)
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleModalSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}