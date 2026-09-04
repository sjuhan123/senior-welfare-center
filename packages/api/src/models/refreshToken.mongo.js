import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  tokenHash: {
    type: String,
    required: true,
  },
  clientType: {
    type: String,
    enum: ['admin', 'mobile'],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
