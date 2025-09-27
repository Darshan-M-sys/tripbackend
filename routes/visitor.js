const express = require("express");
const visitorRoute = express.Router();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const Visitor = require("../models/visitor");

//
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// POST visitor
visitorRoute.post("/visitor", upload.single("file"), async (req, res) => {
  try {
    const { username, experience } = req.body;
    const imageUrl = req.file?.path;

    const newVisitor = new Visitor({
      username:username,
      experience:experience,
      image_url:imageUrl,
    });

    await newVisitor.save();

    res.status(201).json({ success: true, data: newVisitor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all visitors
visitorRoute.get("/visitor", async (req, res) => {
  try {
    const data = await Visitor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = visitorRoute;
