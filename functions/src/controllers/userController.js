const User = require('../models/User');

async function listUsers(req, res, next) {
  try {
    const { role, phone } = req.query;
    const q = {};
    if (role) q.role = role;
    if (phone) q.phone = phone;
    const users = await User.find(q).sort({ createdAt: -1 }).lean();
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { name, phone, role } = req.body;
    if (!name || !phone) return res.status(400).json({ message: 'name and phone required' });
    const existing = await User.findOne({ phone });
    if (existing) return res.status(409).json({ message: 'Phone already exists' });
    const saved = await User.create({ name, phone, role });
    res.status(201).json({ data: saved });
  } catch (err) {
    next(err);
  }
}

async function updateBiometricSettings(req, res, next) {
  try {
    const { phone, fingerprintEnabled } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number required' });
    }
    
    if (typeof fingerprintEnabled !== 'boolean') {
      return res.status(400).json({ message: 'fingerprintEnabled must be a boolean' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fingerprintEnabled = fingerprintEnabled;
    await user.save();

    res.json({ 
      success: true,
      data: {
        phone: user.phone,
        fingerprintEnabled: user.fingerprintEnabled,
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getBiometricSettings(req, res, next) {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number required' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      success: true,
      data: {
        phone: user.phone,
        fingerprintEnabled: user.fingerprintEnabled,
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getUserProfile(req, res, next) {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number required' });
    }

    const user = await User.findOne({ phone }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
}

async function updateUserProfile(req, res, next) {
  try {
    const { userId, name, phoneNumber } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) {
      // Check if new phone number already exists for another user
      const existingUser = await User.findOne({ 
        phone: phoneNumber, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(409).json({ message: 'Phone number already in use' });
      }
      updateData.phone = phoneNumber;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      message: 'Profile updated successfully'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  listUsers, 
  createUser, 
  updateBiometricSettings, 
  getBiometricSettings,
  getUserProfile,
  updateUserProfile
};

