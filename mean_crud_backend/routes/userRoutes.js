const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  getUserProfile, 
  updateUserProfile, 
  uploadProfileImage, 
  getUsers, 
  deleteUser,
  createUser,
  updateUser,
  searchUsers
} = require('../controllers/userControllers');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/profile/image')
  .post(protect, upload.single('image'), uploadProfileImage);

router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

router.route('/search')
  .get(protect, admin, searchUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

module.exports = router;