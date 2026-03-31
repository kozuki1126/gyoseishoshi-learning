import contentRepository from '@/server/repositories/contentRepository';

class ContentManager {
  async getUnits(filters = {}) {
    return contentRepository.listUnits(filters, {
      page: filters.page,
      limit: filters.limit,
      includeDraft: filters.includeDraft,
    });
  }

  async getUnit(id, options = {}) {
    return contentRepository.getUnit(id, options);
  }

  async createUnit(unitData) {
    return contentRepository.saveUnit(unitData);
  }

  async updateUnit(id, updates) {
    return contentRepository.saveUnit({ ...updates, id });
  }

  async deleteUnit(id) {
    return contentRepository.deleteUnit(id);
  }

  async searchContent(params, options = {}) {
    return contentRepository.searchUnits(params, options);
  }
}

const contentManager = new ContentManager();

export default contentManager;
export { ContentManager };
