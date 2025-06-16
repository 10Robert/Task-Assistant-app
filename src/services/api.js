// src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Função auxiliar para fazer requisições
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const taskAPI = {
  // Listar todas as tarefas
  getTasks: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.skip) searchParams.append('skip', params.skip);
    if (params.limit) searchParams.append('limit', params.limit);
    
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/tasks/${queryString ? `?${queryString}` : ''}`;
    
    return makeRequest(url);
  },

  // Obter tarefa por ID
  getTask: (id) => makeRequest(`${API_BASE_URL}/tasks/${id}`),

  // Criar nova tarefa
  createTask: (task) => {
    // Converter dados do frontend para o formato da API
    const apiTask = {
      name: task.name,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      due_date: task.dueDate || null,
      due_time: task.dueTime || null,
    };

    return makeRequest(`${API_BASE_URL}/tasks/`, {
      method: 'POST',
      body: JSON.stringify(apiTask),
    });
  },

  // Atualizar tarefa
  updateTask: (id, task) => {
    const apiTask = {
      name: task.name,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      due_date: task.dueDate || null,
      due_time: task.dueTime || null,
    };

    return makeRequest(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apiTask),
    });
  },

  // Atualizar apenas o status da tarefa
  updateTaskStatus: (id, status, notes = null) => {
    return makeRequest(`${API_BASE_URL}/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Deletar tarefa
  deleteTask: (id) => makeRequest(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  }),

  // Obter tarefas por data específica
  getTasksByDate: (date) => {
    // Converter Date object para string no formato YYYY-MM-DD
    const dateString = date instanceof Date 
      ? date.toISOString().split('T')[0] 
      : date;
    
    return makeRequest(`${API_BASE_URL}/tasks/date/${dateString}`);
  },

  // Obter histórico de uma tarefa
  getTaskHistory: (id) => makeRequest(`${API_BASE_URL}/tasks/${id}/history`),
};

// Função para converter dados da API para o formato do frontend
export const convertAPITaskToFrontend = (apiTask) => {
  return {
    id: apiTask.id,
    name: apiTask.name,
    description: apiTask.description || "",
    priority: apiTask.priority,
    status: apiTask.status,
    dueDate: apiTask.due_date,
    dueTime: apiTask.due_time,
    history: apiTask.history || [],
    createdAt: apiTask.created_at,
    updatedAt: apiTask.updated_at,
  };
};

// Função para converter múltiplas tarefas
export const convertAPITasksToFrontend = (apiTasks) => {
  return apiTasks.map(convertAPITaskToFrontend);
};

export default taskAPI;