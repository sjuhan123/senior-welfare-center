import welfaresInfo from "../../data/welfares.data.js";
import { saveDistrict } from "./districts.model.js";
import District from "./districts.mongo.js";
import Welfare from "./welfares.mongo.js";

async function loadWelfareData() {
  try {
    for (const welfare of welfaresInfo) {
      await saveWelfare(welfare);
    }
  } catch (error) {
    console.error("Error loading welfare data", error);
    throw error;
  } finally {
    const welfaresFound = (await getAllWelfares()).length;
    console.info(`${welfaresFound} welfares found`);
  }
}

async function saveWelfare(welfare) {
  try {
    const existingDistrict = await District.findOne({ name: welfare.district });

    if (existingDistrict) {
      const welfareInstance = new Welfare({
        district: existingDistrict._id,
        name: welfare.name,
        address: welfare.address,
        phone: welfare.phone,
        remarks: welfare.remarks,
      });

      const filter = { address: welfareInstance.address };
      const update = {
        $set: {
          district: welfareInstance.district,
          name: welfareInstance.name,
          address: welfareInstance.address,
          phone: welfareInstance.phone,
          remarks: welfareInstance.remarks,
        },
      };

      await Welfare.updateOne(filter, update, { upsert: true });
    } else {
      const districtId = await saveDistrict(welfare.district);

      const welfareInstance = new Welfare({
        district: districtId,
        name: welfare.name,
        address: welfare.address,
        phone: welfare.phone,
        remarks: welfare.remarks,
      });

      const filter = { address: welfareInstance.address };
      const update = {
        $set: {
          district: welfareInstance.district,
          name: welfareInstance.name,
          address: welfareInstance.address,
          phone: welfareInstance.phone,
          remarks: welfareInstance.remarks,
        },
      };

      await Welfare.updateOne(filter, update, { upsert: true });
    }
  } catch (error) {
    console.error("Could not save welfare", error);
  }
}

async function getWelfaresBy(districtId) {
  return await Welfare.find({ district: districtId }, "-__v").populate(
    "district",
    "name -_id"
  );
}

async function getAllWelfares() {
  return await Welfare.find({}, { _id: 0, __v: 0 }).populate("district", {
    __v: 0,
  });
}

export { loadWelfareData, getWelfaresBy, getAllWelfares };
