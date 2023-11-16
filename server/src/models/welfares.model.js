import welfaresInfo from "../../data/welfares.data.js";
import Welfare from "./welfares.mongo.js";

async function loadWelfareData() {
  try {
    for (const welfare of welfaresInfo) {
      await savePlanet(welfare);
    }
  } catch (error) {
    console.error("Error loading welfare data", error);
    reject(error);
  } finally {
    const welfaresFound = (await getAllWelfares()).length;
    console.info(`${welfaresFound} welfares found`);
  }
}

async function getAllWelfares(req, res) {
  return await Welfare.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function savePlanet(welfare) {
  try {
    const welfareInstance = new Welfare({
      district: welfare.district,
      name: welfare.name,
      address: welfare.address,
      phone: welfare.phone,
      remarks: welfare.remarks,
    });

    const filter = { district: welfareInstance.name };
    const update = {
      $set: {
        name: welfareInstance.name,
        address: welfareInstance.address,
        phone: welfareInstance.phone,
        remarks: welfareInstance.remarks,
      },
    };

    await Welfare.updateOne(filter, update, { upsert: true });
  } catch (error) {
    console.error("Could not save welfare", error);
  }
}

export { loadWelfareData, getAllWelfares };
