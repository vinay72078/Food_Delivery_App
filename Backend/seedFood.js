import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import FoodItem from "./Model/FoodItem.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI;

const seedFoodItems = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    const filePath = path.join(
      __dirname,
      "Data",
      "food_items_data.json"
    );

    const fileData = fs.readFileSync(filePath, "utf-8");
    const foodItems = JSON.parse(fileData);

    if (!Array.isArray(foodItems) || foodItems.length === 0) {
      throw new Error("food_items_data.json does not contain valid food data");
    }

    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB");

    await FoodItem.deleteMany({});

    const insertedItems = await FoodItem.insertMany(foodItems);

    console.log(
      `${insertedItems.length} food items inserted successfully`
    );

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("Food seeding error:", error);

    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
};

seedFoodItems();