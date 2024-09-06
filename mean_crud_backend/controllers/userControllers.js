const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

exports.getUserProfile = async (req, res) => {
  console.log(',.,.,.,.,.,');
  
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
    });
    console.log(profileImage, 'qweds');
    
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.updateUserProfile = async (req, res) => {
  console.log('Received update request. Body:', req.body);
  console.log('User ID from token:', req.user._id);
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    console.log('Updated user:', updatedUser);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      profileImage: updatedUser.profileImage,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  console.log('yuyuyuyuy',users);
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne(user._id);
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.uploadProfileImage = async (req, res) => {
  console.log('Uploading image...');
  
  const user = await User.findById(req.user._id);

  if (user) {
    console.log('bkfvb');
    
    if (req.file) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, req.file.filename);
      user.profileImage = `/uploads/${req.file.filename}`;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        profileImage: updatedUser.profileImage,
      });
      console.log('.............', updatedUser.profileImage);
      
    } else {
      res.status(400).json({ message: 'No image file provided' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.createUser = async (req, res) => {
  console.log('create user: ', req.body);
  
  const { name, email, password, isAdmin } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, isAdmin });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

exports.updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.searchUsers = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { email: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find({ ...keyword }).select('-password');
  res.json(users);
};