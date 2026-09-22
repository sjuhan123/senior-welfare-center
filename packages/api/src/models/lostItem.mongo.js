import mongoose from 'mongoose';

const LostItemSchema = new mongoose.Schema(
  {
    welfare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Welfare',
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    where: {
      type: String,
      default: '',
    },
    when: {
      type: String,
      default: '',
    },
    keep: {
      type: String,
      default: '',
    },
    claimed: {
      type: Boolean,
      default: false,
    },
    notifyNotice: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const LostItem = mongoose.model('LostItem', LostItemSchema);

export default LostItem;
