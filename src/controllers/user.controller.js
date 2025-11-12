require('dotenv').config()
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')



const User = require("../models/user.model");
const { JWT_SECRET } = require('../config/secure');


const getUser = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    return res.status(200).send({
      success: true,
      message: 'successfully fetched data',
      payload: users
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


const Register = async (req, res) => {
  try {
    const { name, email, password, bloodgroup, district, phone, upazilla, dateofbirth } = req.body;


    if (!name || !email || !password || !bloodgroup || !district || !phone || !dateofbirth || !upazilla) {
      return res.status(400).send({
        success: false,
        message: "Please fill all required fields",
      });
    }


    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Email already registered",
      });
    }

    const dob = new Date(dateofbirth);
    const today = new Date();
    const diffMs = today - dob;
    const age = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));

    if (age < 15) {
      return res.status(409).send({
        success: false,
        message: "User must be atleast 15 years old",
      });
    }

    let isAvailable
    if (age >= 18) {
      isAvailable = true
    }
    else {
      isAvailable = false
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
      upazilla,
      dateofbirth,
      isAvailable
    });

    await newUser.save();


    return res.status(201).send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).send({
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
      return res.status(400).send({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const payload = { id: user._id, role: user.role, email: user.email };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    const cookieOptions = {
      httpOnly: true,      // Prevents client-side JS from accessing the cookie
      secure: false,         // Ensures cookie is sent only over HTTPS
      sameSite: "lax",     // Required for cross-site cookies (like frontend ↔ backend on different domains)
      maxAge: 1000 * 60 * 60 * 24,
    };

    res.cookie("user_token", token, cookieOptions);

    return res.status(200).send({
      success: true,
      message: 'Log in successfully',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const Logout = (req, res) => {
  try {
    const token = req.cookies.user_token
    if (!token) {
      return res.status(400).send({
        success: false,
        message: "Token not found"
      });
    }
    res.clearCookie("user_token", {
      httpOnly: true,      // Prevents client-side JS from accessing the cookie
      secure: false,         // Ensures cookie is sent only over HTTPS
      sameSite: "lax", //none for https and lax for local host
      path: "/",
    })
    return res.status(200).send({
      success: true,
      message: "Logout successfull"
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to log out",
      error: error.message
    });
  }
};


const protectedUser = async (req, res) => {
  try {
    const token = req.cookies.user_token
    if (!token) {
      return res.status(400).send({
        success: false,
        message: 'Token not  found'
      })
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'Invalid user'
      })
    }
    return res.status(200).send({
      success: true,
      message: 'succsessfully authenticated user',
      payload: user,
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed to authenticate user',
      error: error.message
    })
  }

}


module.exports = {
  Register,
  getUser,
  Login,
  Logout,
  protectedUser,
};
