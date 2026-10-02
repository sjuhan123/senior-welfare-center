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
    schedule: {
      type: [
        {
          day: {
            type: String,
            enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            required: true,
          },
          startTime: {
            type: String,
            required: true,
          },
          endTime: {
            type: String,
            required: true,
          },
          _id: false,
        },
      ],
      default: [],
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
