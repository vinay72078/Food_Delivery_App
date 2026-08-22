import express from "express";
import FoodItem from "../Model/FoodItem.js";
import User from "../Model/User.js";
import { generateToken, authMiddleware, adminMiddleware } from "../Middleware/Auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const user = await User.findOne({
      $or: [
        { username },
        { email: username }
      ]
    });

    if (!user || !(await user.comparePassword(password)) || user.role !== "admin") {
      return res.status(401).json({
        message: "Invalid admin credentials"
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});

router.get("/food-items", async (req, res) => {
  try {
    const foodItems = await FoodItem.find().sort({
      createdAt: -1
    });

    res.status(200).json(
      foodItems.map((item) => ({
        ...item.toObject(),
        dietaryPreference: item.dietaryPreference || "None",
        offer: item.offer || ""
      }))
    );
  } catch (error) {
    console.error("Get food items error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/food-items/category/:category", async (req, res) => {
  try {
    const foodItems = await FoodItem.find({
      category: req.params.category,
      isAvailable: true
    });

    res.status(200).json(foodItems);
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

router.post("/food-items", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      dietaryPreference,
      offer,
      image,
      isAvailable
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Name is required"
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        message: "Description is required"
      });
    }

    if (price === undefined || Number.isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        message: "Valid price is required"
      });
    }

    if (!image?.trim()) {
      return res.status(400).json({
        message: "Image URL is required"
      });
    }

    const validCategories = [
      "Beverages",
      "Starters",
      "Main Course",
      "Desserts",
      "Sides",
      "Snacks",
      "Breakfast",
      "Street Food",
      "Salad"
    ];

    const validDietaryPreferences = [
      "Vegetarian",
      "Vegan",
      "Non-Veg",
      "Gluten-Free",
      "None"
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid category"
      });
    }

    if (!validDietaryPreferences.includes(dietaryPreference)) {
      return res.status(400).json({
        message: "Invalid dietary preference"
      });
    }

    const foodItem = await FoodItem.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      dietaryPreference,
      offer: offer?.trim() || "",
      image: image.trim(),
      isAvailable: isAvailable ?? true
    });

    res.status(201).json({
      message: "Food item created successfully",
      foodItem
    });
  } catch (error) {
    console.error("Create food item error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

router.put("/food-items/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      dietaryPreference,
      offer,
      image,
      isAvailable
    } = req.body;

    const updateData = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name is required"
        });
      }

      updateData.name = name.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          message: "Description is required"
        });
      }

      updateData.description = description.trim();
    }

    if (price !== undefined) {
      if (Number.isNaN(Number(price)) || Number(price) < 0) {
        return res.status(400).json({
          message: "Valid price is required"
        });
      }

      updateData.price = Number(price);
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (dietaryPreference !== undefined) {
      updateData.dietaryPreference = dietaryPreference;
    }

    if (offer !== undefined) {
      updateData.offer = offer.trim();
    }

    if (image !== undefined) {
      if (!image.trim()) {
        return res.status(400).json({
          message: "Image URL is required"
        });
      }

      updateData.image = image.trim();
    }

    if (isAvailable !== undefined) {
      updateData.isAvailable = isAvailable;
    }

    const foodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!foodItem) {
      return res.status(404).json({
        message: "Food item not found"
      });
    }

    res.status(200).json({
      message: "Food item updated successfully",
      foodItem
    });
  } catch (error) {
    console.error("Update food item error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

router.delete("/food-items/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);

    if (!foodItem) {
      return res.status(404).json({
        message: "Food item not found"
      });
    }

    res.status(200).json({
      message: "Food item deleted successfully"
    });
  } catch (error) {
    console.error("Delete food item error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

router.patch("/food-items/:id/availability", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);

    if (!foodItem) {
      return res.status(404).json({
        message: "Food item not found"
      });
    }

    foodItem.isAvailable = !foodItem.isAvailable;

    await foodItem.save();

    res.status(200).json({
      message: "Availability updated successfully",
      foodItem
    });
  } catch (error) {
    console.error("Availability update error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

router.post("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role
    } = req.body;

    if (!username?.trim()) {
      return res.status(400).json({
        message: "Username is required"
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    if (!password?.trim()) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists"
      });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: role || "admin"
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1
      });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/check", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin API is working"
  });
});

export default router;