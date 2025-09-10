const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// Get all users (without passwords)
const getUser = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password field
    return res.status(200).json({
      success: true,
      payload: users,
    });
  } catch (error) {
    console.error("GetUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Sign up new user
const Register = async (req, res) => {
  try {
    const { name, email, password, bloodgroup, district, phone, lastdonated, dateofbirth } = req.body;

    
    if (!name || !email || !password || !bloodgroup || !district || !phone || !dateofbirth) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      bloodgroup,
      district,
      phone,
      lastdonated,
      dateofbirth,
    });

    await newUser.save();

    
    const { password: _, ...userWithoutPassword } = newUser._doc;

    return res.status(201).json({
      success: true,
      payload: userWithoutPassword,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("SignUp error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret_key", // use env variable in production
      { expiresIn: "7d" } // token valid for 7 days
    );

    // 5. Return response without password
    const { password: _, ...userWithoutPassword } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      payload: userWithoutPassword,
    });
  } catch (error) {
    console.error("SignIn error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  Register,
  getUser,
  Login
};
