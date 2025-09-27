const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  experience: { type: String, required: true },
  image_url: { type: String }
});

const visitor = mongoose.model("visitor", VisitorSchema);

module.exports = visitor;
