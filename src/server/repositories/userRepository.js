import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword } from '@/features/auth/server/auth';
import { MEMBERSHIP_TIERS } from '@/shared/lib/entitlements';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
}

function readUsers() {
  ensureStorage();
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeUsers(users) {
  ensureStorage();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

class UserRepository {
  findByEmail(email) {
    const users = readUsers();
    return users.find((user) => user.email === email) || null;
  }

  findById(id) {
    const users = readUsers();
    return users.find((user) => user.id === id) || null;
  }

  async create(userData) {
    const users = readUsers();
    const existing = users.find((user) => user.email === userData.email);
    if (existing) {
      throw new Error('このメールアドレスは既に登録されています');
    }

    const now = new Date().toISOString();
    const newUser = {
      id: String(Date.now()),
      email: userData.email,
      name: userData.name,
      password: await hashPassword(userData.password),
      role: userData.role || 'user',
      status: 'active',
      membership: MEMBERSHIP_TIERS.FREE,
      isPremium: false,
      premiumExpiresAt: null,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
      progress: {},
      settings: {
        emailNotifications: true,
        darkMode: false,
      },
    };

    users.push(newUser);
    writeUsers(users);
    return sanitizeUser(newUser);
  }

  async authenticate(email, password) {
    const user = this.findByEmail(email);
    if (!user) {
      return null;
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return null;
    }

    return sanitizeUser(user);
  }

  async update(id, updates) {
    const users = readUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error('ユーザーが見つかりません');
    }

    const next = { ...updates };
    if (next.password) {
      next.password = await hashPassword(next.password);
    }

    users[index] = {
      ...users[index],
      ...next,
      updatedAt: new Date().toISOString(),
    };

    writeUsers(users);
    return sanitizeUser(users[index]);
  }

  async recordLogin(id) {
    return this.update(id, { lastLoginAt: new Date().toISOString() });
  }

  listUsers() {
    return readUsers().map((user) => sanitizeUser(user));
  }

  async updateMembership(id, membership, premiumExpiresAt = null) {
    return this.update(id, {
      membership,
      isPremium: membership !== MEMBERSHIP_TIERS.FREE,
      premiumExpiresAt,
    });
  }

  async checkPremiumStatus(id) {
    const user = this.findById(id);
    if (!user) {
      return false;
    }

    if (!user.isPremium || !user.premiumExpiresAt) {
      return Boolean(user.isPremium);
    }

    const expired = new Date(user.premiumExpiresAt) < new Date();
    if (!expired) {
      return true;
    }

    await this.updateMembership(id, MEMBERSHIP_TIERS.FREE, null);
    return false;
  }
}

const userRepository = new UserRepository();

export default userRepository;
