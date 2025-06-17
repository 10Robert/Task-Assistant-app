// src/services/api.js - VERSÃO FINAL LIMPA

const API_BASE_URL = 'http://localhost:8000/api/v1';

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
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.status === 204 ? null : await response.json();
  } catch (error) {
    throw error;
  }
};

export const taskAPI = {
  testConnection: async () => {
    const response = await fetch('http://localhost:8000/health');
    return await response.json();
  },

  getTasks: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.skip) searchParams.append('skip', params.skip);
    if (params.limit) searchParams.append('limit', params.limit);
    
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/tasks/${queryString ? `?${queryString}` : ''}`;
    
    return makeRequest(url);
  },

  getTask: (id) => makeRequest(`${API_BASE_URL}/tasks/${id}`),

  createTask: (task) => {
    const apiTask = {
      name: task.name || "Nova tarefa",
      description: task.description || "",
      priority: task.priority || "Média",
      status: task.status || "Pendente",
      due_date: task.dueDate || null,
      due_time: task.dueTime || null,
    };

    return makeRequest(`${API_BASE_URL}/tasks/`, {
      method: 'POST',
      body: JSON.stringify(apiTask),
    });
  },

  updateTask: (id, task) => {
    const apiTask = {
      name: task.name || "Tarefa sem nome",
      description: task.description || "",
      priority: task.priority || "Média", 
      status: task.status || "Pendente",
      due_date: task.dueDate || null,
      due_time: task.dueTime || null,
    };

    return makeRequest(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apiTask),
    });
  },

  updateTaskStatus: (id, status, notes = null) => {
    const payload = { 
      status: status,
      notes: notes 
    };
    
    return makeRequest(`${API_BASE_URL}/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteTask: (id) => makeRequest(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  }),

  getTasksByDate: (date) => {
    const dateString = date instanceof Date 
      ? date.toISOString().split('T')[0] 
      : date;
    
    return makeRequest(`${API_BASE_URL}/tasks/date/${dateString}`);
  },

  getTaskHistory: (id) => makeRequest(`${API_BASE_URL}/tasks/${id}/history`),
};

// Função para converter dados da API para o formato do frontend
export const convertAPITaskToFrontend = (apiTask) => {
  if (!apiTask || typeof apiTask !== 'object') {
    return null;
  }

  return {
    id: apiTask.id,
    name: apiTask.name || 'Tarefa sem nome',
    description: apiTask.description || "",
    priority: apiTask.priority || "Média",
    status: apiTask.status || "Pendente", 
    dueDate: apiTask.due_date || null,
    dueTime: apiTask.due_time || null,
    history: apiTask.history || [],
    createdAt: apiTask.created_at,
    updatedAt: apiTask.updated_at,
  };
};

export const convertAPITasksToFrontend = (apiTasks) => {
  if (!Array.isArray(apiTasks)) {
    return [];
  }
  
  return apiTasks
    .map(convertAPITaskToFrontend)
    .filter(task => task !== null);
};

export default taskAPI;