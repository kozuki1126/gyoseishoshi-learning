import userRepository from '@/server/repositories/userRepository';
import progressRepository from '@/server/repositories/progressRepository';

class UserManager {
  async findByEmail(email) {
    return userRepository.findByEmail(email);
  }

  async findById(id) {
    return userRepository.findById(id);
  }

  async create(userData) {
    return userRepository.create(userData);
  }

  async authenticate(email, password) {
    const user = await userRepository.authenticate(email, password);
    if (!user) {
      return null;
    }

    await userRepository.recordLogin(user.id);
    return userRepository.findById(user.id);
  }

  async update(id, updates) {
    return userRepository.update(id, updates);
  }

  async getProgress(userId) {
    return progressRepository.getByUser(userId);
  }

  async updateProgress(userId, unitId, progressData) {
    const unitProgress = await progressRepository.upsertUnitProgress(userId, unitId, progressData);
    return {
      ...(await this.getProgress(userId)),
      [unitId]: unitProgress,
    };
  }

  async getOverallProgress(userId) {
    return progressRepository.getSummary(userId).overall;
  }

  async upgradeToPremium(userId, expiresAt) {
    return userRepository.updateMembership(userId, 'premium_monthly', expiresAt);
  }

  async checkPremiumStatus(userId) {
    return userRepository.checkPremiumStatus(userId);
  }

  async listUsers() {
    return userRepository.listUsers();
  }
}

const userManager = new UserManager();

export default userManager;
