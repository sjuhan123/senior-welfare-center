import mongoose from 'mongoose';
import Membership from './membership.mongo.js';

const ROLE_MATCH_BY_FILTER = {
  staff: { role: { $in: ['admin', 'super'] } },
  teacher: { role: 'teacher' },
  member: { role: 'member' },
  off: { active: false },
};

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

async function getWelfareMembershipsPage(welfareId, { filter, search, sort, page, limit }) {
  const pipeline = [
    { $match: { welfare: new mongoose.Types.ObjectId(welfareId), ...(ROLE_MATCH_BY_FILTER[filter] || {}) } },
    { $lookup: { from: 'users', localField: 'userId', foreignField: 'id', as: 'user' } },
    { $unwind: '$user' },
    ...(search ? [{ $match: { 'user.userName': { $regex: search, $options: 'i' } } }] : []),
    { $sort: { createdAt: sort === 'asc' ? 1 : -1 } },
    {
      $facet: {
        members: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              userId: 1,
              userName: '$user.userName',
              role: 1,
              status: 1,
              active: { $ifNull: ['$active', true] },
              joinedVia: 1,
              createdAt: 1,
            },
          },
        ],
        totalCount: [{ $count: 'count' }],
      },
    },
  ];

  const [result] = await Membership.aggregate(pipeline);

  return {
    members: result?.members || [],
    total: result?.totalCount[0]?.count || 0,
  };
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
  getWelfareMembershipsPage,
  approveMembership,
  getMembership,
  hasApprovedRole,
  setMembershipActive,
  deactivateMembership,
  deleteMembershipsByUserId,
};
