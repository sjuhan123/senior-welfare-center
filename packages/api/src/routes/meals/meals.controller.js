import { getMealsByMonth, upsertMeal, deleteMeal } from '../../models/meal.model.js';

async function httpGetMeals(req, res) {
  try {
    const { welfareId } = req.params;
    const { month } = req.query;

    const meals = await getMealsByMonth(welfareId, month);

    return res.status(200).json({
      statusCode: 200,
      message: '식단 목록 조회 성공',
      data: meals,
    });
  } catch (error) {
    console.error('Error retrieving meals:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPutMeal(req, res) {
  try {
    const { welfareId, date } = req.params;
    const { items, updatedAt } = req.body;

    const { result, doc } = await upsertMeal(welfareId, date, items, updatedAt);

    if (result === 'conflict') {
      return res.status(409).json({ statusCode: 409, message: '다른 관리자가 이미 변경했습니다' });
    }

    return res.status(200).json({
      statusCode: 200,
      message: '식단 저장 성공',
      data: doc,
    });
  } catch (error) {
    console.error('Error saving meal:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpDeleteMeal(req, res) {
  try {
    const { mealId } = req.params;
    const { updatedAt } = req.body;

    const { result } = await deleteMeal(mealId, updatedAt);

    if (result === 'not_found') {
      return res.status(404).json({ statusCode: 404, message: '해당 식단을 찾을 수 없습니다' });
    }

    if (result === 'conflict') {
      return res.status(409).json({ statusCode: 409, message: '다른 관리자가 이미 변경했습니다' });
    }

    return res.status(200).json({
      statusCode: 200,
      message: '식단 삭제 성공',
    });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

export { httpGetMeals, httpPutMeal, httpDeleteMeal };
