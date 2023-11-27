import mongoose from "mongoose";

const WelfareSchema = new mongoose.Schema({
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
    required: true,
  },
  name: String,
  address: String,
  latitude: Number,
  longitude: Number,
  phone: String,
  homepage: String,
  remarks: String,
});

const Welfare = mongoose.model("Welfare", WelfareSchema);

export default Welfare;
