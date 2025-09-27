const express = require('express');
const imageRoute = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Images = require('../models/imgModel'); // make sure your model is correct

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', 
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// Upload multiple images
imageRoute.post('/upload-multiple', upload.array('images', 10), async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) {
      return res.status(401).json({ success: false, message: 'User not logged in' });
    }

    const { place, experience } = req.body;

    if (!place || !experience || !req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide place, experience, and at least one image' });
    }

    const imageUrls = req.files.map(file => file.path);

    const newImage = new Images({
      username,
      place,
      experience,
      imageUrls,
    });

    await newImage.save();

    res.json({ success: true, data: newImage });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
});

// Get all uploaded images
imageRoute.get('/upload-multiple', async (req, res) => {
  try {
    const data = await Images.find();
    res.json({ success: true, data });
  } catch (err) {
    console.error('Get images error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
});

module.exports = imageRoute;
