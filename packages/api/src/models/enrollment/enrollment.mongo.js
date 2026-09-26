import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

export default Enrollment;
