import Membership from './membership.mongo.js';

async function createMembership(userId, welfareId, joinedVia) {
  const existing = await Membership.findOne({ userId, welfare: welfareId });

  if (existing) {
    return existing;
  }

  return await Membership.create({ userId, welfare: welfareId, joinedVia });
}

async function getMembershipsByUserId(userId) {
  return await Membership.find({ userId }).populate('welfare');
}

async function getMembershipsByWelfareId(welfareId, status) {
  const filter = { welfare: welfareId };

  if (status) {
    filter.status = status;
  }

  return await Membership.find(filter);
}

async function approveMembership(membershipId, role) {
  return await Membership.findByIdAndUpdate(membershipId, { status: 'approved', role }, { new: true });
}

async function getMembership(userId, welfareId) {
  return await Membership.findOne({ userId, welfare: welfareId });
}

async function hasApprovedRole(userId, roles) {
  const membership = await Membership.findOne({
    userId,
    status: 'approved',
    role: { $in: roles },
  });

  return Boolean(membership);
}

export { createMembership, getMembershipsByUserId, getMembershipsByWelfareId, approveMembership, getMembership, hasApprovedRole };
