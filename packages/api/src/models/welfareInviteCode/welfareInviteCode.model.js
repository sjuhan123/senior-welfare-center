import crypto from 'crypto';

import WelfareInviteCode from './welfareInviteCode.mongo.js';

function generateCode() {
  return crypto.randomBytes(6).toString('hex');
}

async function issueInviteCode(welfareId) {
  await WelfareInviteCode.updateMany({ welfare: welfareId, active: true }, { active: false });

  return await WelfareInviteCode.create({
    welfare: welfareId,
    code: generateCode(),
  });
}

async function getActiveInviteCode(welfareId) {
  return await WelfareInviteCode.findOne({ welfare: welfareId, active: true });
}

async function getInviteCodeHistory(welfareId) {
  return await WelfareInviteCode.find({ welfare: welfareId }).sort({
    issuedAt: -1,
  });
}

async function findActiveInviteCodeByCode(code) {
  return await WelfareInviteCode.findOne({ code, active: true }).populate('welfare');
}

async function incrementScanCount(inviteCodeId) {
  await WelfareInviteCode.updateOne({ _id: inviteCodeId }, { $inc: { scanCount: 1 } });
}

export { issueInviteCode, getActiveInviteCode, getInviteCodeHistory, findActiveInviteCodeByCode, incrementScanCount };
