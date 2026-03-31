import contentRepository from '@/server/repositories/contentRepository';
import { getSubjectById } from '@/features/content/lib/subjects';
import { getTokenFromRequest, verifyToken } from '@/features/auth/server/auth';
import { canAccessUnit } from '@/shared/lib/entitlements';

function getOptionalUser(req) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

function isAdminPreviewRequest(req) {
  return req.query.adminPreview === '1' && req.headers['x-admin-preview'] === '1';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { id } = req.query;
    const includeDraft = req.query.includeDraft === 'true';
    const unit = contentRepository.getUnit(id, { includeDraft });

    if (!unit) {
      return res.status(404).json({
        success: false,
        error: '単元が見つかりません',
      });
    }

    const user = getOptionalUser(req);
    const bypassPremiumForAdminPreview = isAdminPreviewRequest(req);

    if (!bypassPremiumForAdminPreview && !canAccessUnit(user, unit)) {
      return res.status(403).json({
        success: false,
        error: 'プレミアム会員限定の単元です',
        unit: {
          id: unit.id,
          title: unit.title,
          subjectId: unit.subjectId,
          accessLevel: unit.accessLevel,
        },
      });
    }

    const subject = getSubjectById(unit.subjectId);
    const { icon, ...subjectWithoutIcon } = subject || {};

    return res.status(200).json({
      success: true,
      unit: {
        ...unit,
        subject: subject
          ? {
              ...subjectWithoutIcon,
              iconName: icon?.displayName || icon?.name || null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Get unit error:', error);
    return res.status(500).json({
      success: false,
      error: '単元の取得に失敗しました',
    });
  }
}
