import mongoose from 'mongoose';

const WelfareInviteCodeSchema = new mongoose.Schema({
  welfare: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Welfare',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  scanCount: {
    type: Number,
    default: 0,
  },
});

const WelfareInviteCode = mongoose.model('WelfareInviteCode', WelfareInviteCodeSchema);

export default WelfareInviteCode;
