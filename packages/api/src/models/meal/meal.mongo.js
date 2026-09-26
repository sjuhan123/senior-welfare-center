import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema(
  {
    welfare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Welfare',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    items: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

MealSchema.index({ welfare: 1, date: 1 }, { unique: true });

const Meal = mongoose.model('Meal', MealSchema);

export default Meal;
