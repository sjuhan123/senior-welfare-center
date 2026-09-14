import { getMembership } from '../models/membership.model.js';

const requireWelfareRole = allowedRoles => async (req, res, next) => {
  const { welfareId } = req.params;
  const membership = await getMembership(req.user.id, welfareId);

  if (!membership || membership.status !== 'approved' || !allowedRoles.includes(membership.role)) {
    return res.status(403).json({ statusCode: 403, message: '권한이 없습니다' });
  }

  next();
};

export { requireWelfareRole };
