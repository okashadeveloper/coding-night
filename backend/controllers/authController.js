const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hardcoded platform admin (DB password check skipped for this path)
const HARDCODED_ADMIN = {
  email: 'admin@assetcare.demo',
  password: 'admin123',
  name: 'Alen Malkoč'
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Register a technician only (public)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Public signup cannot create admins
    if (req.body.role && req.body.role !== 'technician') {
      return res.status(403).json({
        success: false,
        message: 'Public registration is limited to Technician accounts only'
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'technician'
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Login a technician (or any DB user)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Hardcoded admin login — skips normal password compare
// @route   POST /api/auth/admin-login
// @access  Public (credential-gated)
exports.adminLogin = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (
      email !== HARDCODED_ADMIN.email ||
      password !== HARDCODED_ADMIN.password
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Ensure an admin user exists so JWT maps to a real record
    let user = await User.findOne({ email: HARDCODED_ADMIN.email });

    if (!user) {
      user = await User.create({
        name: HARDCODED_ADMIN.name,
        email: HARDCODED_ADMIN.email,
        password: HARDCODED_ADMIN.password,
        role: 'admin'
      });
    } else {
      let dirty = false;
      if (user.role !== 'admin') {
        user.role = 'admin';
        dirty = true;
      }
      if (user.name !== HARDCODED_ADMIN.name) {
        user.name = HARDCODED_ADMIN.name;
        dirty = true;
      }
      if (dirty) await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        _id: user._id,
        name: HARDCODED_ADMIN.name,
        email: user.email,
        role: 'admin',
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
