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
    active: { $ne: false },
    role: { $in: roles },
  });

  return Boolean(membership);
}

async function setMembershipActive(membershipId, active) {
  return await Membership.findByIdAndUpdate(membershipId, { active }, { new: true });
}

async function deactivateMembership(userId, membershipId) {
  return await Membership.findOneAndUpdate({ _id: membershipId, userId }, { active: false }, { new: true });
}

async function deleteMembershipsByUserId(userId) {
  await Membership.deleteMany({ userId });
}

export {
  createMembership,
  getMembershipsByUserId,
  getMembershipsByWelfareId,
  approveMembership,
  getMembership,
  hasApprovedRole,
  setMembershipActive,
  deactivateMembership,
  deleteMembershipsByUserId,
};
