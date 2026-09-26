import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
  {
    welfare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Welfare',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    type: {
      type: String,
      enum: ['notice', 'chat', 'feed'],
      required: true,
    },
  },
  { timestamps: true },
);

const Room = mongoose.model('Room', RoomSchema);

export default Room;
