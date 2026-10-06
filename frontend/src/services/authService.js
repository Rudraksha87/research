import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('researchlens_token', response.data.token);
      localStorage.setItem('researchlens_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('researchlens_token', response.data.token);
      localStorage.setItem('researchlens_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('researchlens_token');
    localStorage.removeItem('researchlens_user');
  },

  getStoredUser() {
    try {
      const user = localStorage.getItem('researchlens_user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  getStoredToken() {
    return localStorage.getItem('researchlens_token');
  }
};
