import Meal from './meal.mongo.js';
import { upsertWithVersionCheck, deleteWithVersionCheck } from '../../utils/versionedUpdate.js';

async function getMealsByMonth(welfareId, month) {
  return await Meal.find({ welfare: welfareId, date: { $regex: `^${month}` } }).sort({ date: 1 });
}

async function upsertMeal(welfareId, date, items, expectedUpdatedAt) {
  return await upsertWithVersionCheck(Meal, { welfare: welfareId, date }, expectedUpdatedAt, { items });
}

async function deleteMeal(mealId, expectedUpdatedAt) {
  return await deleteWithVersionCheck(Meal, mealId, expectedUpdatedAt);
}

export { getMealsByMonth, upsertMeal, deleteMeal };
