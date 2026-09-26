import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    welfare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Welfare',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    when: {
      type: String,
      default: '',
    },
    place: {
      type: String,
      default: '',
    },
    cap: {
      type: Number,
      default: 20,
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    teacher: {
      type: String,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Course = mongoose.model('Course', CourseSchema);

export default Course;
