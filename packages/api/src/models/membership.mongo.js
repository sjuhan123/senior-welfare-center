import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  welfare: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Welfare',
    required: true,
  },
  role: {
    type: String,
    enum: ['member', 'teacher', 'admin', 'super'],
    default: 'member',
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
  },
  joinedVia: {
    type: String,
    enum: ['qr', 'manual'],
    required: true,
  },
});

const Membership = mongoose.model('Membership', MembershipSchema);

export default Membership;
