import api from './api';

export const researchService = {
  // Projects & Sessions
  async getProjects() {
    const response = await api.get('/research');
    return response.data.projects;
  },

  async getProjectById(id) {
    const response = await api.get(`/research/${id}`);
    return response.data.project;
  },

  async createProject(data) {
    const response = await api.post('/research', data);
    return response.data;
  },

  async executePipeline(id) {
    const response = await api.post(`/research/${id}/execute`);
    return response.data;
  },

  async deleteProject(id) {
    const response = await api.delete(`/research/${id}`);
    return response.data;
  },

  // Granular Stage Execution (Section 28)
  async triggerSearch(id) {
    const response = await api.post(`/research/${id}/search`);
    return response.data;
  },

  async triggerAnalysis(id) {
    const response = await api.post(`/research/${id}/analyze`);
    return response.data;
  },

  async triggerComparison(id) {
    const response = await api.post(`/research/${id}/compare`);
    return response.data;
  },

  async triggerGaps(id) {
    const response = await api.post(`/research/${id}/gaps`);
    return response.data;
  },

  async triggerFuture(id) {
    const response = await api.post(`/research/${id}/future`);
    return response.data;
  },

  async triggerReport(id) {
    const response = await api.post(`/research/${id}/report`);
    return response.data;
  },

  // Papers
  async getPapers(projectId) {
    const response = await api.get(`/papers?projectId=${projectId}`);
    return response.data.papers;
  },

  async getPaperById(paperId) {
    const response = await api.get(`/papers/${paperId}`);
    return response.data.paper;
  },

  async addPaper(paperData) {
    const response = await api.post('/papers', paperData);
    return response.data.paper;
  },

  // Analysis & Synthesis Data
  async getAnalysis(paperId) {
    const response = await api.get(`/analysis/paper/${paperId}`);
    return response.data.analysis;
  },

  async getComparison(projectId) {
    const response = await api.get(`/analysis/comparison/${projectId}`);
    return response.data.comparison;
  },

  async getGaps(projectId) {
    const response = await api.get(`/analysis/gaps/${projectId}`);
    return response.data.gaps;
  },

  async getFutureDirections(projectId) {
    const response = await api.get(`/analysis/future/${projectId}`);
    return response.data.directions;
  },

  async getReport(projectId) {
    const response = await api.get(`/analysis/report/${projectId}`);
    return response.data.report;
  },

  // Document Upload (PDF)
  async uploadDocument(formData) {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
