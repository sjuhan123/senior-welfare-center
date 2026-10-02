import { getLostItems, createLostItem, updateLostItem, deleteLostItem } from '../../models/lostItem/lostItem.model.js';

async function httpGetLostItems(req, res) {
  try {
    const { welfareId } = req.params;

    const lostItems = await getLostItems(welfareId);

    return res.status(200).json({
      statusCode: 200,
      message: '분실물 목록 조회 성공',
      data: lostItems,
    });
  } catch (error) {
    console.error('Error retrieving lost items:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPostLostItem(req, res) {
  try {
    const { welfareId } = req.params;
    const { item, where, when, keep, notifyNotice } = req.body;

    const lostItem = await createLostItem(welfareId, { item, where, when, keep, notifyNotice });

    return res.status(201).json({
      statusCode: 201,
      message: '분실물 등록 성공',
      data: lostItem,
    });
  } catch (error) {
    console.error('Error creating lost item:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPatchLostItem(req, res) {
  try {
    const { lostItemId } = req.params;
    const { item, where, when, keep, notifyNotice, claimed, updatedAt } = req.body;

    const fields = {};
    if (item !== undefined) fields.item = item;
    if (where !== undefined) fields.where = where;
    if (when !== undefined) fields.when = when;
    if (keep !== undefined) fields.keep = keep;
    if (notifyNotice !== undefined) fields.notifyNotice = notifyNotice;
    if (claimed !== undefined) fields.claimed = claimed;

    const { result, doc } = await updateLostItem(lostItemId, updatedAt, fields);

    if (result === 'not_found') {
      return res.status(404).json({ statusCode: 404, message: '해당 분실물을 찾을 수 없습니다' });
    }

    if (result === 'conflict') {
      return res.status(409).json({ statusCode: 409, message: '다른 관리자가 이미 변경했습니다' });
    }

    return res.status(200).json({
      statusCode: 200,
      message: '분실물 수정 성공',
      data: doc,
    });
  } catch (error) {
    console.error('Error updating lost item:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpDeleteLostItem(req, res) {
  try {
    const { lostItemId } = req.params;
    const { updatedAt } = req.body;

    const { result } = await deleteLostItem(lostItemId, updatedAt);

    if (result === 'not_found') {
      return res.status(404).json({ statusCode: 404, message: '해당 분실물을 찾을 수 없습니다' });
    }

    if (result === 'conflict') {
      return res.status(409).json({ statusCode: 409, message: '다른 관리자가 이미 변경했습니다' });
    }

    return res.status(200).json({
      statusCode: 200,
      message: '분실물 삭제 성공',
    });
  } catch (error) {
    console.error('Error deleting lost item:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

export { httpGetLostItems, httpPostLostItem, httpPatchLostItem, httpDeleteLostItem };
