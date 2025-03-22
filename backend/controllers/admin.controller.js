const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // 2️⃣ Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign({email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
}

async function createDefaultAdmin() {
  try {
      const existingAdmin = await Admin.findOne({ email: "admin@example.com" });

      if (existingAdmin) {
          const token = jwt.sign({ email: existingAdmin.email }, process.env.JWT_SECRET, {
              expiresIn: "1h",
          });
          // console.log("✅ Admin already exists, Token:", token);
          return token;  // ✅ Return token instead of trying to send response
      }

      // 🔹 Create new admin if not found
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const newAdmin = new Admin({
          email: "admin@example.com",
          password: hashedPassword,
      });

      await newAdmin.save();

      // 🔹 Generate token for new admin
      const token = jwt.sign({ email: newAdmin.email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
      });

      console.log("✅ Default admin created: admin@example.com / admin123");
      console.log("🔑 Token:", token);
      return token; // ✅ Return token
  } catch (error) {
      console.error("❌ Error creating admin:", error);
  }
}

module.exports = { loginAdmin, createDefaultAdmin };
