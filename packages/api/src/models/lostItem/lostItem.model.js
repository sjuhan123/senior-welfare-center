import LostItem from './lostItem.mongo.js';
import { updateWithVersionCheck, deleteWithVersionCheck } from '../../utils/versionedUpdate.js';

async function getLostItems(welfareId) {
  return await LostItem.find({ welfare: welfareId }).sort({ createdAt: -1 });
}

async function createLostItem(welfareId, { item, where, when, keep, notifyNotice }) {
  return await LostItem.create({ welfare: welfareId, item, where, when, keep, notifyNotice });
}

async function updateLostItem(lostItemId, expectedUpdatedAt, fields) {
  return await updateWithVersionCheck(LostItem, lostItemId, expectedUpdatedAt, fields);
}

async function deleteLostItem(lostItemId, expectedUpdatedAt) {
  return await deleteWithVersionCheck(LostItem, lostItemId, expectedUpdatedAt);
}

export { getLostItems, createLostItem, updateLostItem, deleteLostItem };
