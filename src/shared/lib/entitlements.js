export const MEMBERSHIP_TIERS = {
  FREE: 'free',
  PREMIUM_MONTHLY: 'premium_monthly',
  PREMIUM_ANNUAL: 'premium_annual',
};

export function getMembershipTier(user) {
  if (!user) {
    return MEMBERSHIP_TIERS.FREE;
  }

  if (user.membership) {
    return user.membership;
  }

  return user.isPremium ? MEMBERSHIP_TIERS.PREMIUM_MONTHLY : MEMBERSHIP_TIERS.FREE;
}

export function hasPremiumAccess(user) {
  const tier = getMembershipTier(user);
  return tier === MEMBERSHIP_TIERS.PREMIUM_MONTHLY || tier === MEMBERSHIP_TIERS.PREMIUM_ANNUAL;
}

export function canAccessUnit(user, unit) {
  if (!unit || unit.accessLevel !== 'premium') {
    return true;
  }

  return hasPremiumAccess(user);
}

export function getEntitlementLabel(accessLevel) {
  return accessLevel === 'premium' ? 'プレミアム' : '無料';
}
