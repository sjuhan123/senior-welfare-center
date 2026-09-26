import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    welfare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Welfare',
      required: true,
    },
    teacher: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const Course = mongoose.model('Course', CourseSchema);

export default Course;
