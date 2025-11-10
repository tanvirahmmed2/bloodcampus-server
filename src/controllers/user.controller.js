require('dotenv').config()
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')



const User = require("../models/user.model");


const getUser = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); 
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


const Register = async (req, res) => {
  try {
    const { name, email, password, bloodgroup, district, phone, lastdonated, dateofbirth, } = req.body;


    if (!name || !email || !password || !bloodgroup || !district || !phone || !dateofbirth) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }


    const existingUser = await User.findOne({ email: email });
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


    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },   // ✅ plain object
      process.env.JWT_SECRET || "sara",
      { expiresIn: "7d" }                    // optional expiry
    );

    req.header = token

    // 5. Return structured response
    return res.status(200).json({
      success: true,
      token: token
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const Logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successfully completed"
  });
};


module.exports = {
  Register,
  getUser,
  Login,
  Logout,
};
