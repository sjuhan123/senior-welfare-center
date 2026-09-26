import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    photos: {
      type: [String],
      default: [],
    },
    editable: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    hearts: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const Message = mongoose.model('Message', MessageSchema);

export default Message;
