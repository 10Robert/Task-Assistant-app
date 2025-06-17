const API_BASE_URL = 'http://localhost:8000/api/v1';

// Funções de conversão entre API e frontend
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

export const convertAPITasksToFrontend = (apiTasks) => {
  return apiTasks.map(convertAPITaskToFrontend);
};

export const convertFrontendTaskToAPI = (frontendTask) => {
  return {
    name: frontendTask.name,
    description: frontendTask.description || null,
    priority: frontendTask.priority,
    status: frontendTask.status,
    due_date: frontendTask.dueDate || null,
    due_time: frontendTask.dueTime || null,
  };
};

// Funções da API
export const taskAPI = {
  // Buscar todas as tarefas
  getTasks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Erro ao buscar tarefas: ${error.message}`);
    }
  },

  // Buscar uma tarefa específica
  getTask: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Erro ao buscar tarefa: ${error.message}`);
    }
  },

  // Criar nova tarefa
  createTask: async (taskData) => {
    try {
      const apiTaskData = convertFrontendTaskToAPI(taskData);
      
      const response = await fetch(`${API_BASE_URL}/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiTaskData)
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Erro ao criar tarefa: ${error.message}`);
    }
  },

  // Atualizar tarefa
  updateTask: async (id, taskData) => {
    try {
      const apiTaskData = convertFrontendTaskToAPI(taskData);
      
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiTaskData)
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Erro ao atualizar tarefa: ${error.message}`);
    }
  },

  // Atualizar status da tarefa
  updateTaskStatus: async (id, status, notes = null) => {
    try {
      const statusData = {
        status: status,
        notes: notes
      };
      
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData)
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Erro ao atualizar status: ${error.message}`);
    }
  },

  // Deletar tarefa
  deleteTask: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Erro ao deletar tarefa: ${error.message}`);
    }
  },

  // Buscar tarefas por data
  getTasksByDate: async (date) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/date/${date}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Erro ao buscar tarefas por data: ${error.message}`);
    }
  },

  // Buscar histórico de uma tarefa
  getTaskHistory: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/history`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Erro ao buscar histórico: ${error.message}`);
    }
  }
};