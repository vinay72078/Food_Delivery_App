import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./Model/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const admins = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
  },
  {
    username: "admin2",
    email: "admin2@example.com",
    password: "admin123",
    role: "admin"
  }
];

const isBcryptHash = (password) => {
  return (
    typeof password === "string" &&
    (password.startsWith("$2a$") ||
      password.startsWith("$2b$") ||
      password.startsWith("$2y$"))
  );
};

const seedAdmins = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB");

    for (const admin of admins) {
      const existingUser = await User.findOne({
        email: admin.email
      });

      if (!existingUser) {
        await User.create(admin);
        console.log(`Admin ${admin.username} created`);
      } else {
        let needsUpdate = false;

        // Fix plaintext password (stored before the model's pre-save hook existed)
        if (!isBcryptHash(existingUser.password)) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(existingUser.password, salt);

          // Use updateOne to bypass the pre-save hook and avoid double hashing
          await User.updateOne(
            { _id: existingUser._id },
            { $set: { password: hashedPassword } }
          );

          console.log(
            `Admin ${admin.username} password was fixed (was stored in plaintext)`
          );
          needsUpdate = true;
        }

        // Sync the username and role if they don't match the seed definition
        if (
          existingUser.username !== admin.username ||
          existingUser.role !== admin.role
        ) {
          await User.updateOne(
            { _id: existingUser._id },
            {
              $set: {
                username: admin.username,
                role: admin.role
              }
            }
          );
          needsUpdate = true;
        }

        if (!needsUpdate) {
          console.log(`Admin ${admin.username} already exists`);
        }
      }
    }

    console.log("Admin seeding completed");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);

    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
};

seedAdmins();