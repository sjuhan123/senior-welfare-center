import mongoose from "mongoose";

const DistrictSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const District = mongoose.model("District", DistrictSchema);

export default District;
