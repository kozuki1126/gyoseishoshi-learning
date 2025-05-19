// Content Service for handling learning content operations
// Provides API interface for content management

class ContentService {
  constructor() {
    this.baseUrl = '/api/content';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Utility method for making HTTP requests
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: `HTTP ${response.status} - ${response.statusText}`
        }));
        throw new Error(error.error || error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error(`ContentService request failed:`, error);
      throw error;
    }
  }

  // Cache management
  getCacheKey(key) {
    return `content_${key}`;
  }

  setCache(key, data) {
    this.cache.set(this.getCacheKey(key), {
      data,
      timestamp: Date.now()
    });
  }

  getCache(key) {
    const cacheKey = this.getCacheKey(key);
    const cached = this.cache.get(cacheKey);
    
    if (!cached) return null;
    
    const isExpired = (Date.now() - cached.timestamp) > this.cacheTimeout;
    if (isExpired) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    return cached.data;
  }

  clearCache() {
    this.cache.clear();
  }

  // Unit operations
  async getUnits(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const cacheKey = `units_${queryString}`;
    
    // Check cache first
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const data = await this.request(`/units?${queryString}`);
    this.setCache(cacheKey, data);
    return data;
  }

  async getUnit(id) {
    if (!id) throw new Error('Unit ID is required');
    
    const cacheKey = `unit_${id}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const data = await this.request(`/unit?id=${id}`);
    this.setCache(cacheKey, data);
    return data;
  }

  async createUnit(unitData) {
    if (!unitData.title || !unitData.subjectId || !unitData.content) {
      throw new Error('Missing required fields: title, subjectId, content');
    }

    const data = await this.request('/units', {
      method: 'POST',
      body: unitData
    });

    // Invalidate related cache
    this.clearCache();
    return data;
  }

  async updateUnit(id, updates) {
    if (!id) throw new Error('Unit ID is required');

    const data = await this.request(`/unit?id=${id}`, {
      method: 'PUT',
      body: updates
    });

    // Invalidate cache for this unit
    this.cache.delete(this.getCacheKey(`unit_${id}`));
    return data;
  }

  async deleteUnit(id) {
    if (!id) throw new Error('Unit ID is required');

    const data = await this.request(`/unit?id=${id}`, {
      method: 'DELETE'
    });

    // Invalidate cache
    this.clearCache();
    return data;
  }

  // Progress operations
  async getProgress(userId, filters = {}) {
    const queryString = new URLSearchParams({ userId, ...filters }).toString();
    const cacheKey = `progress_${queryString}`;
    
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const data = await this.request(`/progress?${queryString}`);
    this.setCache(cacheKey, data);
    return data;
  }

  async updateProgress(progressData) {
    if (!progressData.userId || !progressData.unitId) {
      throw new Error('Missing required fields: userId, unitId');
    }

    const data = await this.request('/progress', {
      method: 'POST',
      body: progressData
    });

    // Invalidate progress cache
    for (const [key] of this.cache.entries()) {
      if (key.startsWith('content_progress_')) {
        this.cache.delete(key);
      }
    }

    return data;
  }

  // Subject operations
  async getSubjects() {
    const cacheKey = 'subjects';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const data = await this.request('/subjects');
    this.setCache(cacheKey, data);
    return data;
  }

  // Search operations
  async searchContent(query, filters = {}) {
    if (!query) throw new Error('Search query is required');

    const queryString = new URLSearchParams({ 
      q: query, 
      ...filters 
    }).toString();

    const data = await this.request(`/search?${queryString}`);
    return data; // Don't cache search results
  }

  // Content loading helpers
  async loadUnitContent(id) {
    try {
      const response = await this.getUnit(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to load unit');
      }
      return response.data;
    } catch (error) {
      console.error('Error loading unit content:', error);
      throw error;
    }
  }

  async loadMarkdownContent(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load markdown: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading markdown content:', error);
      throw error;
    }
  }

  // Batch operations
  async batchGetUnits(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Unit IDs array is required');
    }

    const promises = ids.map(id => this.getUnit(id));
    
    try {
      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        id: ids[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (error) {
      console.error('Batch get units failed:', error);
      throw error;
    }
  }

  async batchUpdateProgress(progressUpdates) {
    if (!Array.isArray(progressUpdates) || progressUpdates.length === 0) {
      throw new Error('Progress updates array is required');
    }

    const promises = progressUpdates.map(update => this.updateProgress(update));
    
    try {
      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        update: progressUpdates[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (error) {
      console.error('Batch update progress failed:', error);
      throw error;
    }
  }

  // Analytics and reporting
  async getStudyAnalytics(userId, timeRange = '30d') {
    const cacheKey = `analytics_${userId}_${timeRange}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const progress = await this.getProgress(userId);
      if (!progress.success) {
        throw new Error('Failed to load progress data');
      }

      // Process analytics from progress data
      const analytics = this.processStudyAnalytics(progress.data, timeRange);
      this.setCache(cacheKey, analytics);
      return analytics;
    } catch (error) {
      console.error('Error loading study analytics:', error);
      throw error;
    }
  }

  processStudyAnalytics(progressData, timeRange) {
    // Simple analytics processing
    const overall = progressData.overall || {};
    const bySubject = progressData.bySubject || {};
    const recent = progressData.recent || [];

    return {
      summary: {
        totalUnits: overall.totalUnits || 0,
        completedUnits: overall.completedUnits || 0,
        averageScore: overall.averageScore || 0,
        totalStudyTime: overall.totalStudyTime || 0
      },
      subjectsProgress: Object.entries(bySubject).map(([id, data]) => ({
        subjectId: id,
        completed: data.completed || 0,
        total: data.total || 0,
        score: data.score || 0,
        progressPercentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
      })),
      recentActivity: recent.slice(0, 10),
      timeRange,
      generatedAt: new Date().toISOString()
    };
  }

  // Error handling utilities
  isNetworkError(error) {
    return error.name === 'TypeError' && error.message.includes('fetch');
  }

  isAuthError(error) {
    return error.message.includes('401') || error.message.includes('Unauthorized');
  }

  isNotFoundError(error) {
    return error.message.includes('404') || error.message.includes('not found');
  }

  // Cleanup
  destroy() {
    this.clearCache();
  }
}

// Create singleton instance
const contentService = new ContentService();

export default contentService;
export { ContentService };
