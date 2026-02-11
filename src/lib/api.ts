const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !endpoint.includes('/auth/login')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    apiCall<{ token: string; expiresIn: number; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  verify: (token: string) =>
    apiCall<{ valid: boolean; user: any }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiCall<{ categories: any[] }>('/categories'),
};

// Companies API
export const companiesAPI = {
  getAll: (params?: { category?: string; status?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.limit) query.append('limit', params.limit.toString());
    return apiCall<{ companies: any[]; total: number }>(`/companies?${query}`);
  },

  getById: (id: string) => apiCall<any>(`/companies/${id}`),

  getByCategory: (category: string) =>
    apiCall<{ companies: any[] }>(`/companies/category/${category}`),

  search: (q: string, category?: string) => {
    const query = new URLSearchParams({ q });
    if (category) query.append('category', category);
    return apiCall<{ companies: any[] }>(`/companies/search?${query}`);
  },

  create: (data: any) =>
    apiCall<{ message: string; company: any }>('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall<{ message: string }>(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/companies/${id}`, {
      method: 'DELETE',
    }),

  export: (category?: string) => {
    const query = category ? `?category=${category}` : '';
    return fetch(`${API_BASE_URL}/companies/export${query}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }).then((res) => res.blob());
  },
};

// Priorities API
export const prioritiesAPI = {
  getAll: () => apiCall<{ priorities: any[] }>('/priorities'),

  getByCategory: (category: string) =>
    apiCall<{ priorities: any[] }>(`/priorities/category/${category}`),

  create: (data: any) =>
    apiCall<{ message: string; priority: any }>('/priorities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall<{ message: string }>(`/priorities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/priorities/${id}`, {
      method: 'DELETE',
    }),
};

// Books API
export const booksAPI = {
  getAll: () => apiCall<{ books: any[] }>('/books'),

  getById: (id: string) => apiCall<any>(`/books/${id}`),

  create: (data: any) =>
    apiCall<{ message: string; book: any }>('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Orders API
export const ordersAPI = {
  getAll: () => apiCall<{ orders: any[] }>('/orders'),

  create: (data: any) =>
    apiCall<{ message: string; order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Submissions API
export const submissionsAPI = {
  getAll: (params?: { type?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.status) query.append('status', params.status);
    return apiCall<{ submissions: any[] }>(`/submissions?${query}`);
  },

  create: (data: any) =>
    apiCall<{ message: string; submission: any }>('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string, notes?: string) =>
    apiCall<{ message: string }>(`/submissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reviewNotes: notes }),
    }),

  approve: (id: string) =>
    apiCall<{ message: string }>(`/submissions/${id}/approve`, {
      method: 'POST',
    }),
};

// Contact API
export const contactAPI = {
  getAll: () => apiCall<{ contacts: any[] }>('/contacts'),

  submit: (data: any) =>
    apiCall<{ message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiCall<any>('/dashboard/stats'),
};

// Excel Upload API
export const excelAPI = {
  upload: (data: { fileName: string; fileUrl: string; category: string }) =>
    apiCall<{ message: string; uploadId: string }>('/excel/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getHistory: () => apiCall<{ uploads: any[] }>('/excel/history'),
};

// Analytics API
export const analyticsAPI = {
  getTrends: (months: number = 12) =>
    apiCall<any>(`/analytics/trends?months=${months}`),
};

// Settings API
export const settingsAPI = {
  get: (key: string) => apiCall<any>(`/settings/${key}`),
};
