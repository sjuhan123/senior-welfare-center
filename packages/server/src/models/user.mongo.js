import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userAvatar: {
    type: String,
    default: '',
  },
  qualificationChecked: {
    type: Boolean,
    default: false,
  },
  bookmarkWelfares: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Welfare',
    },
  ],
});

const User = mongoose.model('User', UserSchema);

export default User;
