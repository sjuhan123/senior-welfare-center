import mongoose from 'mongoose';

const RoomReadSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  lastReadAt: {
    type: Date,
    required: true,
  },
});

RoomReadSchema.index({ room: 1, userId: 1 }, { unique: true });

const RoomRead = mongoose.model('RoomRead', RoomReadSchema);

export default RoomRead;
