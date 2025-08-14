import { prisma } from '@/lib/prisma';
import { Prisma, Subject, Unit, Content, UserProgress } from '@prisma/client';

// Types for extended data structures
type UnitWithContent = Unit & {
  content?: Content | null;
  subject?: Subject;
};

type UnitWithRelated = UnitWithContent & {
  relatedUnits?: Array<Pick<Unit, 'id' | 'title' | 'type' | 'difficulty' | 'estimatedTime'>>;
};

interface UnitFilters {
  subjectId?: string;
  type?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

interface SearchParams {
  query: string;
  type?: string;
  subjectId?: string;
  limit?: number;
}

interface ProgressUpdate {
  completed?: boolean;
  score?: number;
  timeSpent?: number;
  notes?: string;
}

interface UserProgressSummary {
  overall: {
    totalUnits: number;
    completedUnits: number;
    averageScore: number;
    totalStudyTime: number;
  };
  bySubject: Record<string, {
    completed: number;
    total: number;
    averageScore: number;
  }>;
  recent: Array<{
    unitId: string;
    unitTitle: string;
    subjectName: string;
    completedAt: Date;
    score: number | null;
    timeSpent: number;
  }>;
}

/**
 * Database Content Service - Prisma-based content management
 * Replaces the in-memory ContentManager with database operations
 */
class DatabaseContentService {

  // Subject operations
  async getSubjects() {
    try {
      const subjects = await prisma.subject.findMany({
        where: { isActive: true },
        include: {
          units: {
            where: { isActive: true },
            select: { id: true }
          }
        },
        orderBy: { order: 'asc' }
      });

      return subjects.map(subject => ({
        id: subject.id,
        name: subject.name,
        description: subject.description || '',
        order: subject.order,
        unitCount: subject.units.length,
        isActive: subject.isActive
      }));
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw new Error('科目の取得中にエラーが発生しました');
    }
  }

  async getSubject(id: string) {
    try {
      return await prisma.subject.findUnique({
        where: { id, isActive: true },
        include: {
          units: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              type: true,
              difficulty: true,
              estimatedMinutes: true,
              hasAudio: true,
              audioUrl: true,
              pdfUrl: true,
              order: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching subject:', error);
      throw new Error('科目の詳細取得中にエラーが発生しました');
    }
  }

  // Unit operations
  async getUnits(filters: UnitFilters = {}) {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const skip = (page - 1) * limit;

      const where: Prisma.UnitWhereInput = {
        isActive: filters.isActive ?? true,
        ...(filters.subjectId && { subjectId: filters.subjectId }),
        ...(filters.type && { type: filters.type }),
        ...(filters.difficulty && { difficulty: filters.difficulty })
      };

      const [units, total] = await Promise.all([
        prisma.unit.findMany({
          where,
          include: {
            subject: {
              select: { name: true, id: true }
            },
            content: {
              select: { introduction: true, keyPoints: true }
            }
          },
          orderBy: [
            { subjectId: 'asc' },
            { order: 'asc' }
          ],
          skip,
          take: limit
        }),
        prisma.unit.count({ where })
      ]);

      return {
        units: units.map(unit => ({
          id: unit.id,
          title: unit.title,
          subjectId: unit.subjectId,
          subjectName: unit.subject?.name || '',
          type: unit.type,
          difficulty: unit.difficulty,
          estimatedTime: unit.estimatedMinutes || 30,
          hasAudio: unit.hasAudio || false,
          order: unit.order,
          introduction: unit.content?.introduction || '',
          keyPoints: unit.content?.keyPoints || [],
          createdAt: unit.createdAt,
          updatedAt: unit.updatedAt
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching units:', error);
      throw new Error('学習単元の取得中にエラーが発生しました');
    }
  }

  async getUnit(id: string): Promise<UnitWithRelated | null> {
    try {
      const unit = await prisma.unit.findUnique({
        where: { id, isActive: true },
        include: {
          subject: true,
          content: true
        }
      });

      if (!unit) {
        return null;
      }

      // Get related units from the same subject
      const relatedUnits = await prisma.unit.findMany({
        where: {
          subjectId: unit.subjectId,
          isActive: true,
          id: { not: id }
        },
        select: {
          id: true,
          title: true,
          type: true,
          difficulty: true,
          estimatedMinutes: true
        },
        orderBy: { order: 'asc' },
        take: 5
      });

      return {
        ...unit,
        estimatedTime: unit.estimatedMinutes || 30,
        relatedUnits: relatedUnits.map(u => ({
          ...u,
          estimatedTime: u.estimatedMinutes || 30
        }))
      };
    } catch (error) {
      console.error('Error fetching unit:', error);
      throw new Error('学習単元の詳細取得中にエラーが発生しました');
    }
  }

  async createUnit(unitData: Prisma.UnitCreateInput) {
    try {
      return await prisma.unit.create({
        data: unitData,
        include: {
          subject: true,
          content: true
        }
      });
    } catch (error) {
      console.error('Error creating unit:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('この学習単元IDは既に存在します');
        }
        if (error.code === 'P2003') {
          throw new Error('指定された科目が存在しません');
        }
      }
      throw new Error('学習単元の作成中にエラーが発生しました');
    }
  }

  async updateUnit(id: string, updates: Prisma.UnitUpdateInput) {
    try {
      return await prisma.unit.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date()
        },
        include: {
          subject: true,
          content: true
        }
      });
    } catch (error) {
      console.error('Error updating unit:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('指定された学習単元が見つかりません');
        }
      }
      throw new Error('学習単元の更新中にエラーが発生しました');
    }
  }

  async deleteUnit(id: string) {
    try {
      // Soft delete - set isActive to false
      await prisma.unit.update({
        where: { id },
        data: { isActive: false }
      });
      return true;
    } catch (error) {
      console.error('Error deleting unit:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('指定された学習単元が見つかりません');
        }
      }
      throw new Error('学習単元の削除中にエラーが発生しました');
    }
  }

  // Content operations
  async updateUnitContent(unitId: string, contentData: Prisma.ContentUpdateInput) {
    try {
      // Check if content already exists
      const existingContent = await prisma.content.findUnique({
        where: { unitId }
      });

      if (existingContent) {
        return await prisma.content.update({
          where: { unitId },
          data: {
            ...contentData,
            updatedAt: new Date()
          }
        });
      } else {
        return await prisma.content.create({
          data: {
            unitId,
            ...contentData
          }
        });
      }
    } catch (error) {
      console.error('Error updating unit content:', error);
      throw new Error('学習コンテンツの更新中にエラーが発生しました');
    }
  }

  // Search operations
  async searchContent(params: SearchParams) {
    try {
      const { query, type, subjectId, limit = 10 } = params;
      
      const where: Prisma.UnitWhereInput = {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { introduction: { contains: query, mode: 'insensitive' } } },
          { content: { body: { contains: query, mode: 'insensitive' } } },
          { content: { conclusion: { contains: query, mode: 'insensitive' } } }
        ],
        ...(type && { type }),
        ...(subjectId && { subjectId })
      };

      const results = await prisma.unit.findMany({
        where,
        include: {
          subject: { select: { name: true } },
          content: { 
            select: { 
              introduction: true, 
              body: true,
              keyPoints: true 
            } 
          }
        },
        take: limit,
        orderBy: [
          { updatedAt: 'desc' },
          { order: 'asc' }
        ]
      });

      return results.map(unit => ({
        id: unit.id,
        title: unit.title,
        subjectId: unit.subjectId,
        subjectName: unit.subject?.name || '',
        type: unit.type,
        difficulty: unit.difficulty,
        estimatedTime: unit.estimatedMinutes || 30,
        snippet: this.generateSnippet(unit.content?.introduction || unit.content?.body || '', query)
      }));
    } catch (error) {
      console.error('Error searching content:', error);
      throw new Error('コンテンツの検索中にエラーが発生しました');
    }
  }

  // User progress operations
  async getUserProgress(userId: string): Promise<UserProgressSummary> {
    try {
      const [progressRecords, subjects] = await Promise.all([
        prisma.userProgress.findMany({
          where: { userId },
          include: {
            unit: {
              include: { subject: true }
            }
          },
          orderBy: { lastAccessed: 'desc' }
        }),
        prisma.subject.findMany({
          where: { isActive: true },
          include: {
            units: {
              where: { isActive: true },
              select: { id: true }
            }
          }
        })
      ]);

      // Calculate overall stats
      const completedUnits = progressRecords.filter(p => p.completed).length;
      const totalStudyTime = progressRecords.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
      const scoresWithValues = progressRecords
        .map(p => p.score)
        .filter((score): score is number => score !== null);
      const averageScore = scoresWithValues.length > 0 
        ? Math.round(scoresWithValues.reduce((sum, score) => sum + score, 0) / scoresWithValues.length)
        : 0;

      // Calculate by-subject stats
      const bySubject: Record<string, { completed: number; total: number; averageScore: number }> = {};
      
      subjects.forEach(subject => {
        const subjectProgress = progressRecords.filter(p => p.unit.subjectId === subject.id);
        const subjectScores = subjectProgress
          .map(p => p.score)
          .filter((score): score is number => score !== null);
        
        bySubject[subject.id] = {
          completed: subjectProgress.filter(p => p.completed).length,
          total: subject.units.length,
          averageScore: subjectScores.length > 0 
            ? Math.round(subjectScores.reduce((sum, score) => sum + score, 0) / subjectScores.length)
            : 0
        };
      });

      // Recent activity (last 20)
      const recent = progressRecords.slice(0, 20).map(p => ({
        unitId: p.unitId,
        unitTitle: p.unit.title,
        subjectName: p.unit.subject?.name || '',
        completedAt: p.lastAccessed || p.createdAt,
        score: p.score,
        timeSpent: p.timeSpent || 0
      }));

      return {
        overall: {
          totalUnits: progressRecords.length,
          completedUnits,
          averageScore,
          totalStudyTime
        },
        bySubject,
        recent
      };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw new Error('学習進捗の取得中にエラーが発生しました');
    }
  }

  async updateUserProgress(userId: string, unitId: string, progressData: ProgressUpdate) {
    try {
      // Upsert user progress
      const progress = await prisma.userProgress.upsert({
        where: {
          userId_unitId: { userId, unitId }
        },
        update: {
          completed: progressData.completed ?? undefined,
          score: progressData.score ?? undefined,
          timeSpent: progressData.timeSpent ? { increment: progressData.timeSpent } : undefined,
          notes: progressData.notes ?? undefined,
          lastAccessed: new Date(),
          ...(progressData.completed && { completedAt: new Date() })
        },
        create: {
          userId,
          unitId,
          completed: progressData.completed || false,
          score: progressData.score || null,
          timeSpent: progressData.timeSpent || 0,
          notes: progressData.notes || null,
          lastAccessed: new Date(),
          ...(progressData.completed && { completedAt: new Date() })
        }
      });

      return progress;
    } catch (error) {
      console.error('Error updating user progress:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new Error('指定されたユーザーまたは学習単元が存在しません');
        }
      }
      throw new Error('学習進捗の更新中にエラーが発生しました');
    }
  }

  // Analytics
  async getAnalytics() {
    try {
      const [unitCount, progressCount, subjects] = await Promise.all([
        prisma.unit.count({ where: { isActive: true } }),
        prisma.userProgress.count(),
        prisma.subject.findMany({
          where: { isActive: true },
          include: {
            units: {
              where: { isActive: true },
              select: { type: true, difficulty: true }
            }
          }
        })
      ]);

      const subjectCounts: Record<string, number> = {};
      const typeCounts: Record<string, number> = {};
      const difficultyCounts: Record<string, number> = {};

      subjects.forEach(subject => {
        subjectCounts[subject.id] = subject.units.length;
        
        subject.units.forEach(unit => {
          typeCounts[unit.type] = (typeCounts[unit.type] || 0) + 1;
          difficultyCounts[unit.difficulty] = (difficultyCounts[unit.difficulty] || 0) + 1;
        });
      });

      return {
        totalUnits: unitCount,
        totalProgress: progressCount,
        subjectCounts,
        typeCounts,
        difficultyCounts,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('分析データの取得中にエラーが発生しました');
    }
  }

  // Utility methods
  private generateSnippet(text: string, query: string): string {
    if (!text) return '';
    
    const words = text.split(/\s+/);
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
}

// Create singleton instance
const databaseContentService = new DatabaseContentService();

export default databaseContentService;
export { DatabaseContentService, type UnitFilters, type SearchParams, type ProgressUpdate, type UserProgressSummary };
