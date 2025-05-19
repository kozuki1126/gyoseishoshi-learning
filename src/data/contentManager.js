// Content Manager for in-memory content storage and management
// Used by API routes to manage content data

import { subjects } from './subjects';

class ContentManager {
  constructor() {
    this.units = this.initializeUnits();
    this.userProgress = new Map();
    this.searchIndex = this.buildSearchIndex();
  }

  // Initialize mock units data
  initializeUnits() {
    const units = new Map();
    
    // Sample units for each subject
    const sampleUnits = [
      // Constitutional Law units
      {
        id: '101',
        title: '憲法の基本原理',
        subjectId: 'constitutional-law',
        difficulty: 'beginner',
        estimatedTime: 30,
        type: 'lecture',
        content: {
          introduction: '本章では、日本国憲法の基本原理について学習します。',
          sections: [
            {
              title: '国民主権',
              content: '国民主権とは、国家の主権が国民に存することを意味します。',
              subsections: [
                {
                  title: '直接民主制と間接民主制',
                  content: '民主政治の形態には直接民主制と間接民主制があります。'
                }
              ]
            },
            {
              title: '基本的人権の尊重',
              content: '基本的人権の尊重は、個人の尊厳を基礎とします。'
            },
            {
              title: '平和主義',
              content: '日本国憲法は平和主義を基本原理の一つとしています。'
            }
          ],
          keyPoints: [
            '国民主権は憲法の基本原理の一つ',
            '基本的人権は個人の尊厳に基づく',
            '平和主義は戦争放棄を含む'
          ],
          conclusion: '三つの基本原理は相互に関連し合っています。'
        },
        audioUrl: '/audio/units/101.mp3',
        hasAudio: true,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        id: '102',
        title: '基本的人権の体系',
        subjectId: 'constitutional-law',
        difficulty: 'intermediate',
        estimatedTime: 45,
        type: 'lecture',
        content: {
          introduction: '基本的人権の体系と各権利について学習します。',
          sections: [
            {
              title: '自由権',
              content: '自由権は、国家からの自由を保障する権利です。',
              subsections: [
                {
                  title: '精神的自由',
                  content: '思想・良心の自由、表現の自由などが含まれます。'
                },
                {
                  title: '身体的自由',
                  content: '身体の自由、住居の不可侵などが含まれます。'
                }
              ]
            },
            {
              title: '社会権',
              content: '社会権は、国家による積極的な保障を求める権利です。'
            }
          ],
          keyPoints: [
            '自由権は消極的権利',
            '社会権は積極的権利',
            '両者は対立するものではない'
          ]
        },
        hasAudio: false,
        createdAt: '2024-01-16T00:00:00Z',
        updatedAt: '2024-01-16T00:00:00Z'
      },

      // Administrative Law units
      {
        id: '201',
        title: '行政法の基本原理',
        subjectId: 'administrative-law',
        difficulty: 'intermediate',
        estimatedTime: 40,
        type: 'lecture',
        content: {
          introduction: '行政法の基本原理について学習します。',
          sections: [
            {
              title: '行政法とは',
              content: '行政法は、行政機関の活動について定めた法律です。'
            },
            {
              title: '行政法の体系',
              content: '行政組織法と行政作用法に大別されます。'
            }
          ],
          keyPoints: [
            '行政法は公法の一分野',
            '権力関係を規律する',
            '行政の適法性を確保する'
          ]
        },
        hasAudio: true,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      },

      // Civil Law units
      {
        id: '301',
        title: '民法の基本原理',
        subjectId: 'civil-law',
        difficulty: 'beginner',
        estimatedTime: 35,
        type: 'lecture',
        content: {
          introduction: '民法の基本原理について学習します。',
          sections: [
            {
              title: '私的自治の原則',
              content: '個人が自らの意思で法律関係を決定できる原則です。'
            },
            {
              title: '所有権絶対の原則',
              content: '所有権は完全かつ排他的な権利とする原則です。'
            }
          ],
          keyPoints: [
            '私的自治は契約自由の基礎',
            '所有権は物権の基本',
            '過失責任主義が原則'
          ]
        },
        hasAudio: false,
        createdAt: '2024-01-25T00:00:00Z',
        updatedAt: '2024-01-25T00:00:00Z'
      },

      // Practice units
      {
        id: '401',
        title: '憲法基礎問題演習',
        subjectId: 'constitutional-law',
        difficulty: 'beginner',
        estimatedTime: 60,
        type: 'practice',
        content: {
          introduction: '憲法の基礎的な問題を通じて理解を深めます。',
          sections: [
            {
              title: '選択式問題',
              content: '基本的な知識を確認する選択式問題です。'
            },
            {
              title: '記述式問題',
              content: '理解度を深める記述式問題です。'
            }
          ],
          keyPoints: [
            '基本概念の理解が重要',
            '条文の暗記だけでは不十分',
            '具体的事例で考える'
          ]
        },
        hasAudio: false,
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z'
      }
    ];

    // Add units to map
    sampleUnits.forEach(unit => {
      units.set(unit.id, unit);
    });

    return units;
  }

  // Build search index for content
  buildSearchIndex() {
    const index = new Map();
    
    for (const [id, unit] of this.units) {
      const searchableText = [
        unit.title,
        unit.content?.introduction || '',
        unit.content?.conclusion || '',
        ...(unit.content?.sections?.map(s => s.title + ' ' + s.content) || []),
        ...(unit.content?.keyPoints || [])
      ].join(' ').toLowerCase();

      // Simple keyword extraction
      const keywords = searchableText
        .split(/\s+/)
        .filter(word => word.length > 2)
        .filter(word => !/^(の|は|を|が|に|で|と|から|まで|について|における)$/.test(word));

      keywords.forEach(keyword => {
        if (!index.has(keyword)) {
          index.set(keyword, new Set());
        }
        index.get(keyword).add(id);
      });
    }

    return index;
  }

  // Unit CRUD operations
  async getUnits(filters = {}) {
    let units = Array.from(this.units.values());

    // Apply filters
    if (filters.subjectId) {
      units = units.filter(unit => unit.subjectId === filters.subjectId);
    }

    if (filters.type) {
      units = units.filter(unit => unit.type === filters.type);
    }

    if (filters.difficulty) {
      units = units.filter(unit => unit.difficulty === filters.difficulty);
    }

    // Apply pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      units: units.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: units.length,
        totalPages: Math.ceil(units.length / limit)
      }
    };
  }

  async getUnit(id) {
    const unit = this.units.get(id);
    if (!unit) {
      return null;
    }

    // Add related units
    const relatedUnits = Array.from(this.units.values())
      .filter(u => u.id !== id && u.subjectId === unit.subjectId)
      .slice(0, 5)
      .map(u => ({
        id: u.id,
        title: u.title,
        type: u.type,
        difficulty: u.difficulty,
        estimatedTime: u.estimatedTime
      }));

    return {
      ...unit,
      relatedUnits
    };
  }

  async createUnit(unitData) {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const unit = {
      id,
      ...unitData,
      createdAt: now,
      updatedAt: now
    };

    this.units.set(id, unit);
    this.rebuildSearchIndex();
    
    return unit;
  }

  async updateUnit(id, updates) {
    const unit = this.units.get(id);
    if (!unit) {
      return null;
    }

    const updatedUnit = {
      ...unit,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    this.units.set(id, updatedUnit);
    this.rebuildSearchIndex();
    
    return updatedUnit;
  }

  async deleteUnit(id) {
    const deleted = this.units.delete(id);
    if (deleted) {
      this.rebuildSearchIndex();
    }
    return deleted;
  }

  // Subject operations
  async getSubjects() {
    // Return subjects with unit counts
    const subjectsWithCounts = subjects.map(subject => {
      const unitCount = Array.from(this.units.values())
        .filter(unit => unit.subjectId === subject.id).length;
      
      return {
        ...subject,
        unitCount
      };
    });

    return subjectsWithCounts;
  }

  // Search operations
  async searchContent(params) {
    const { query, type, subjectId, limit = 10 } = params;
    const searchTerms = query.toLowerCase().split(/\s+/);
    const results = new Map();

    // Search in index
    searchTerms.forEach(term => {
      for (const [keyword, unitIds] of this.searchIndex) {
        if (keyword.includes(term) || term.includes(keyword)) {
          unitIds.forEach(unitId => {
            const score = results.get(unitId) || 0;
            results.set(unitId, score + 1);
          });
        }
      }
    });

    // Get units and sort by relevance
    let searchResults = Array.from(results.entries())
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([unitId]) => this.units.get(unitId))
      .filter(unit => unit) // Remove any null units
      .slice(0, limit);

    // Apply filters
    if (type) {
      searchResults = searchResults.filter(unit => unit.type === type);
    }

    if (subjectId) {
      searchResults = searchResults.filter(unit => unit.subjectId === subjectId);
    }

    return searchResults.map(unit => ({
      id: unit.id,
      title: unit.title,
      subjectId: unit.subjectId,
      type: unit.type,
      difficulty: unit.difficulty,
      estimatedTime: unit.estimatedTime,
      snippet: this.generateSnippet(unit, query)
    }));
  }

  // User progress operations
  getUserProgress(userId) {
    return this.userProgress.get(userId) || {
      overall: {
        totalUnits: 0,
        completedUnits: 0,
        averageScore: 0,
        totalStudyTime: 0
      },
      bySubject: {},
      recent: []
    };
  }

  updateUserProgress(userId, unitId, progressData) {
    const userProgress = this.getUserProgress(userId);
    
    // Update recent activity
    const recentEntry = {
      unitId,
      completedAt: new Date().toISOString(),
      score: progressData.score || 0,
      timeSpent: progressData.timeSpent || 0
    };

    userProgress.recent.unshift(recentEntry);
    userProgress.recent = userProgress.recent.slice(0, 20); // Keep last 20

    // Update overall stats
    if (progressData.completed) {
      userProgress.overall.completedUnits += 1;
    }
    
    userProgress.overall.totalStudyTime += progressData.timeSpent || 0;

    // Recalculate average score
    const scores = userProgress.recent.map(r => r.score).filter(s => s > 0);
    if (scores.length > 0) {
      userProgress.overall.averageScore = Math.round(
        scores.reduce((sum, score) => sum + score, 0) / scores.length
      );
    }

    // Update by subject
    const unit = this.units.get(unitId);
    if (unit) {
      const subjectProgress = userProgress.bySubject[unit.subjectId] || {
        completed: 0,
        total: 0,
        score: 0
      };

      if (progressData.completed) {
        subjectProgress.completed += 1;
      }

      // Update subject score
      const subjectScores = userProgress.recent
        .filter(r => {
          const u = this.units.get(r.unitId);
          return u && u.subjectId === unit.subjectId && r.score > 0;
        })
        .map(r => r.score);

      if (subjectScores.length > 0) {
        subjectProgress.score = Math.round(
          subjectScores.reduce((sum, score) => sum + score, 0) / subjectScores.length
        );
      }

      userProgress.bySubject[unit.subjectId] = subjectProgress;
    }

    this.userProgress.set(userId, userProgress);
    return userProgress;
  }

  // Utility methods
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  generateSnippet(unit, query) {
    const searchableText = [
      unit.content?.introduction || '',
      ...(unit.content?.sections?.map(s => s.content) || [])
    ].join(' ');

    const words = searchableText.split(/\s+/);
    const queryWords = query.toLowerCase().split(/\s+/);
    
    // Find first occurrence of query terms
    let startIndex = 0;
    for (let i = 0; i < words.length; i++) {
      if (queryWords.some(qw => words[i].toLowerCase().includes(qw))) {
        startIndex = Math.max(0, i - 10);
        break;
      }
    }

    const snippet = words.slice(startIndex, startIndex + 30).join(' ');
    return snippet.length > 100 ? snippet.substr(0, 100) + '...' : snippet;
  }

  rebuildSearchIndex() {
    this.searchIndex = this.buildSearchIndex();
  }

  // Analytics
  getAnalytics() {
    const totalUnits = this.units.size;
    const subjectCounts = {};
    const typeCounts = {};
    const difficultyCounts = {};

    for (const unit of this.units.values()) {
      subjectCounts[unit.subjectId] = (subjectCounts[unit.subjectId] || 0) + 1;
      typeCounts[unit.type] = (typeCounts[unit.type] || 0) + 1;
      difficultyCounts[unit.difficulty] = (difficultyCounts[unit.difficulty] || 0) + 1;
    }

    return {
      totalUnits,
      subjectCounts,
      typeCounts,
      difficultyCounts,
      lastUpdated: new Date().toISOString()
    };
  }

  // Cleanup
  clear() {
    this.units.clear();
    this.userProgress.clear();
    this.searchIndex.clear();
  }
}

// Create singleton instance
const contentManager = new ContentManager();

export default contentManager;
export { ContentManager };
