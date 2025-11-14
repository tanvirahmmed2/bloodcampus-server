require('dotenv').config()
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')



const User = require("../models/user.model");
const { JWT_SECRET } = require('../config/secure');


const getUser = async (req, res) => {
  try {
    const users = (await User.find({}, "-password"))
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


    const existingUser = await User.findOne({ $or: [{ email: email }, { phone: phone }] });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already registered",
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
      message: "Failed to register",
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
    if (user.isBanned) {
      return res.status(401).send({
        success: false,
        message: "You're banned, please contact authority",
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


const updateProfile = async (req, res) => {
  try {
    const { id, name, email, phone, district, upazilla, lastdoneted } = req.body
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'User not found'
      })
    }

    user.name = name
    user.email = email
    user.phone = phone,
      user.district = district,
      user.upazilla = upazilla,
      user.lastdoneted = lastdoneted
    await user.save()
    return res.status(200).send({
      success: true,
      message: 'Successfully updated profile'
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    })
  }

}


const changeAvailabilty = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: 'Id not found'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'User not found'
      });
    }

    // If user is currently available, make them unavailable
    if (user.isAvailable) {
      user.isAvailable = false;
      await user.save();

      return res.status(200).send({
        success: true,
        message: 'User is unavailable to donate blood for now'
      });
    }

    // Check age before making user available
    const dob = new Date(user.dateofbirth);
    const today = new Date();
    const age = Math.floor((today - dob) / (1000 * 60 * 60 * 24 * 365.25));

    if (age < 18) {
      return res.status(409).send({
        success: false,
        message: 'User must be at least 18 years old'
      });
    }

    // Make user available
    user.isAvailable = true;
    await user.save();

    return res.status(200).send({
      success: true,
      message: 'User is available to donate blood now'
    });

  } catch (error) {
    console.error(error); // For debugging
    return res.status(500).send({
      success: false,
      message: 'Failed to change availability'
    });
  }
};


const changePassword = async (req, res) => {
  try {
    const { oldpass, newpass, id } = req.body
    if (!oldpass || !newpass || !id) {
      return res.status(400).send({
        success: false,
        message: 'All fields are required'
      });
    }
    const user = await User.findById(id)
    const passwordMatch = await bcrypt.compare(oldpass, user.password)
    if (!passwordMatch) {
      return res.status(400).send({
        success: false,
        message: 'Old password didnot matched'
      });
    }
    if (oldpass === newpass) {
      return res.status(400).send({
        success: false,
        message: "New password can't be same as old "
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpass, salt);
    user.password = hashedPassword
    await user.save()
    return res.status(200).send({
      success: true,
      message: 'successsfully changed password'
    });


  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed to changed password'
    });
  }

}



const requestDonor = async (req, res) => {
  try {
    const { donorId, userId } = req.body
    if (!donorId || !userId) {
      return res.status(400).send({
        success: false,
        message: ' Enough resource not found'
      })
    }
    if (donorId === userId) {
      return res.status(400).send({
        success: false,
        message: 'Select another profile'
      })
    }
    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).send({
        success: false,
        message: ' User not found'
      })
    }
    const donor = await User.findById(donorId)
    if (!donor) {
      return res.status(400).send({
        success: false,
        message: 'Donor not found'
      })
    }

    if (donor.bloodgroup !== user.bloodgroup) {
      return res.status(400).send({
        success: false,
        message: 'Blood group not matched'
      })
    }

    const existRequest = donor.requests.find((req) => req.userId.toString() === userId)
    if (existRequest) {
      return res.status(400).send({
        success: false,
        message: 'Already requested, wait for call'
      })
    }

    donor.requests.push({
      userId,
      name: user.name,
      number: user.phone,
      upazilla: user.upazilla,
      message: 'I need blood, please help'
    })
    await donor.save()
    return res.status(200).send({
      success: true,
      message: 'Successfully sent request'
    })

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed send request',
      error: error.message
    })
  }

}


const deleteRequest = async (req, res) => {
  try {
    const { userId, requestId } = req.body
    if (!userId || !requestId) {
      return res.status(400).send({
        success: false,
        message: 'All fields are required'
      });
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'User not found'
      });
    }
    await User.findByIdAndUpdate(userId, { $pull: { requests: { _id: requestId } } }, { new: true })
    res.status(200).send({
      success: true,
      message: 'Removed request'
    })

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed to delete request, try again'
    });
  }

}


const getFilteredData = async (req, res) => {
  try {
    const { searchBloodgroup, searchDistrict, searchUpazilla } = req.query
    const filter = {}

    if (searchBloodgroup) filter.bloodgroup = searchBloodgroup
    if (searchDistrict) filter.district = searchDistrict
    if (searchUpazilla) filter.upazilla = searchUpazilla

    const donors = await User.find(filter).sort({ _id: -1 })

    if (!donors || donors === null) {
      return res.status(400).send({
        success: false,
        message: 'No donor found',
        payload: null
      })
    }
    return res.status(200).send({
      success: true,
      message: `Found ${donors.length} donor`,
      payload: donors
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: 'No donor found',
      error: error.message
    })
  }

}

const banuser = async (req, res) => {
  try {
    const { banUserEmail } = req.body
    if (!banUserEmail) {
      return res.status(400).send({
        success: false,
        message: 'user email not found'
      });
    }
    const user = await User.findOne({ email: banUserEmail })
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'User not found'
      });
    }
    if (user.isAdmin) {
      return res.status(400).send({
        success: false,
        message: 'Admin account can not be banned'
      });
    }
    if (user.isBanned) {
      user.isBanned = false
      await user.save()
      return res.status(200).send({
        success: true,
        message: 'Successfully unbanned user'
      });
    }
    user.isBanned = true
    await user.save()
    return res.status(200).send({
      success: true,
      message: 'Successfully banned user'
    });


  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed to ban/unban user'
    })
  }

}


const newaccess = async (req, res) => {
  try {
    const { newAdminEmail } = req.body
    if (!newAdminEmail) {
      return res.status(400).send({
        success: false,
        message: 'Email not found'
      })
    }
    const user = await User.findOne({ email: newAdminEmail })
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'Invalid email'
      })
    }
    if (user.isBanned) {
      return res.status(400).send({
        success: false,
        message: 'User is banned'
      });
    }
    user.isAdmin = true
    await user.save()
    return res.status(200).send({
      success: true,
      message: 'Successfully added new admin'
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed to add new admin'
    })
  }

}

const removeaccess = async (req, res) => {
  try {
    const { id } = req.body
    if (!id) {
      return res.status(400).send({
        success: false,
        message: 'Admin id not found'
      })
    }
    const user = await User.findById(id)
    if (!user) {
      return res.status(500).send({
        success: false,
        message: 'Invalid user'
      })
    }
    const admins = await User.find({ isAdmin: true })
    if (admins.length === 1) {
      return res.status(400).send({
        success: false,
        message: 'Should be at least one admin'
      })
    }
    user.isAdmin = false
    await user.save()
    return res.status(200).send({
      success: true,
      message: 'Successfully removed admin'
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed to remove admin'
    })
  }

}


const deletedUser = async (req, res) => {
  try {
    const { deleteUserEmail } = req.body
    if (!deleteUserEmail) {
      return res.status(400).send({
        success: false,
        message: 'Email not found'
      });
    }
    const user = await User.findOne({ emai: deleteUserEmail })
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'User not found'
      });
    }
    if (user.isAdmin) {
      return res.status(400).send({
        success: false,
        message: 'Admin account can not be deleted'
      });
    }
    await User.findOneAndDelete({ email: deleteUserEmail })
    return res.status(200).send({
      success: true,
      message: 'Successfully Deleted User'
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed to delete user'
    });

  }

}

module.exports = {
  Register,
  getUser,
  Login,
  Logout,
  protectedUser,
  changeAvailabilty,
  changePassword,
  requestDonor,
  deleteRequest,
  updateProfile,
  getFilteredData,
  banuser,
  newaccess,
  removeaccess
};
