const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { JWT_SECRET } = require("../config/secure");

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.user_token
    if (!token) {
      return res.status(400).send({
        success: false,
        message: 'Please log in'
      })
    }
    const decode = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decode.id)
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'Invalid user'
      })
    }
    req.header = user
    next()
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed to authenticate user',
      error: error.message
    })
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.user_token
    if (!token) {
      return res.status(400).send({
        success: false,
        message: 'Please log in'
      })
    }
    const decode = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decode.id)
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'Invalid user'
      })
    }
    if (user.role !== 'admin') {
      return res.status(400).send({
        success: false,
        message: 'Only admin accessable'
      })
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed to authenticate admin',
      error: error.message
    })
  }

}

module.exports = {
  isLogin, isAdmin
};
