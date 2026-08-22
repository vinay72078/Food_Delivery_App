import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Beverages",
        "Starters",
        "Main Course",
        "Desserts",
        "Sides",
        "Snacks",
        "Breakfast",
        "Street Food",
        "Salad"
      ]
    },
    dietaryPreference: {
      type: String,
      required: true,
      enum: [
        "Vegetarian",
        "Vegan",
        "Non-Veg",
        "Gluten-Free",
        "None"
      ],
      default: "None"
    },
    offer: {
      type: String,
      default: "",
      trim: true
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

export default FoodItem;