async function updateWithVersionCheck(Model, id, expectedUpdatedAt, fields) {
  const updated = await Model.findOneAndUpdate({ _id: id, updatedAt: expectedUpdatedAt }, fields, { new: true });

  if (updated) {
    return { result: 'ok', doc: updated };
  }

  const current = await Model.findById(id);

  if (!current) {
    return { result: 'not_found' };
  }

  return { result: 'conflict' };
}

async function upsertWithVersionCheck(Model, filter, expectedUpdatedAt, fields) {
  const existing = await Model.findOne(filter);

  if (!existing) {
    if (expectedUpdatedAt) {
      return { result: 'conflict' };
    }

    try {
      const doc = await Model.create({ ...filter, ...fields });
      return { result: 'ok', doc };
    } catch (error) {
      if (error.code === 11000) {
        return { result: 'conflict' };
      }
      throw error;
    }
  }

  if (!expectedUpdatedAt) {
    return { result: 'conflict' };
  }

  return updateWithVersionCheck(Model, existing._id, expectedUpdatedAt, fields);
}

async function deleteWithVersionCheck(Model, id, expectedUpdatedAt) {
  const deleted = await Model.findOneAndDelete({ _id: id, updatedAt: expectedUpdatedAt });

  if (deleted) {
    return { result: 'ok' };
  }

  const current = await Model.findById(id);

  if (!current) {
    return { result: 'not_found' };
  }

  return { result: 'conflict' };
}

export { updateWithVersionCheck, upsertWithVersionCheck, deleteWithVersionCheck };
