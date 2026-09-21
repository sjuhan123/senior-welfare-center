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

export { updateWithVersionCheck };
