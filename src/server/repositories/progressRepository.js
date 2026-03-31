import userRepository from '@/server/repositories/userRepository';
import contentRepository from '@/server/repositories/contentRepository';

class ProgressRepository {
  getByUser(userId) {
    const user = userRepository.findById(userId);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    return user.progress || {};
  }

  getUnitProgress(userId, unitId) {
    const progress = this.getByUser(userId);
    return progress[unitId] || null;
  }

  async upsertUnitProgress(userId, unitId, progressData) {
    const user = userRepository.findById(userId);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    const current = user.progress?.[unitId] || {};
    const next = {
      ...current,
      ...progressData,
      timeSpent: Number(progressData.timeSpent ?? current.timeSpent ?? 0),
      lastAccessed: new Date().toISOString(),
    };

    await userRepository.update(userId, {
      progress: {
        ...(user.progress || {}),
        [unitId]: next,
      },
    });

    return next;
  }

  getSummary(userId) {
    const byUnit = this.getByUser(userId);
    const publishedUnits = contentRepository.listUnits({}, { includeDraft: false }).units;
    const publishedById = Object.fromEntries(publishedUnits.map((unit) => [unit.id, unit]));

    const recent = Object.entries(byUnit)
      .map(([unitId, progress]) => ({
        unitId,
        ...progress,
        unit: publishedById[unitId] || null,
      }))
      .sort((left, right) => new Date(right.lastAccessed || 0) - new Date(left.lastAccessed || 0))
      .slice(0, 5);

    const completedUnits = Object.values(byUnit).filter((progress) => progress.completed).length;
    const scores = Object.values(byUnit)
      .map((progress) => progress.score)
      .filter((score) => score !== undefined);
    const totalTimeSpent = Object.values(byUnit).reduce((sum, progress) => sum + Number(progress.timeSpent || 0), 0);

    const bySubject = publishedUnits.reduce((accumulator, unit) => {
      if (!accumulator[unit.subjectId]) {
        accumulator[unit.subjectId] = {
          totalUnits: 0,
          completedUnits: 0,
          completionRate: 0,
        };
      }

      accumulator[unit.subjectId].totalUnits += 1;
      if (byUnit[unit.id]?.completed) {
        accumulator[unit.subjectId].completedUnits += 1;
      }

      accumulator[unit.subjectId].completionRate = Math.round(
        (accumulator[unit.subjectId].completedUnits / accumulator[unit.subjectId].totalUnits) * 100
      );

      return accumulator;
    }, {});

    return {
      overall: {
        totalUnits: Object.keys(byUnit).length,
        completedUnits,
        averageScore: scores.length
          ? Math.round(scores.reduce((sum, score) => sum + Number(score), 0) / scores.length)
          : 0,
        totalTimeSpent,
        completionRate: publishedUnits.length
          ? Math.round((completedUnits / publishedUnits.length) * 100)
          : 0,
      },
      recent,
      bySubject,
      byUnit,
    };
  }
}

const progressRepository = new ProgressRepository();

export default progressRepository;
