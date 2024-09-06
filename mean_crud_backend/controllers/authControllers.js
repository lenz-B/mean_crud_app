const User = require('../models/userModel');
const generateToken = require('../utils/jwtUtils');

exports.register = async (req, res) => {
  console.log('reg ethi');
  console.log(req.body);
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

exports.login = async (req, res) => {
  console.log('login ethi');
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log(user);

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
    console.log('asdfafda')
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

exports.adminLogin = async (req, res) => {
  console.log('ad log ethi');

  const { email, password } = req.body;

  const user = await User.findOne({ email, isAdmin: true });
  console.log(user,"from admin");
  

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};