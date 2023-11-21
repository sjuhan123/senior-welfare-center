import District from "./districts.mongo.js";

async function saveDistrict(districtName) {
  try {
    const districtInstance = new District({
      name: districtName,
    });

    const filter = { name: districtInstance.name };
    const update = {
      $set: {
        name: districtInstance.name,
      },
    };

    await District.updateOne(filter, update, { upsert: true });
    return districtInstance._id;
  } catch (error) {
    console.error("Could not save district", error);
    throw error;
  }
}

async function getAllDistricts() {
  return await District.find({}, { _id: 0, __v: 0 });
}

export { getAllDistricts, saveDistrict };
