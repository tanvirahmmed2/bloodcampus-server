const User = require("../models/user.model");

const SignUp = async (req, res) => {
  try {
    const { name, email, password, bloodgroup, district, phone, lastdonated } = req.body;

    
    const newUser = new User({
      name,
      email,
      password,
      bloodgroup,
      district,
      phone,
      lastdonated,
    });

    await newUser.save();

    
    return res.status(201).json({
      success: true,
      payload: newUser,
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

module.exports = {
  SignUp,
};
