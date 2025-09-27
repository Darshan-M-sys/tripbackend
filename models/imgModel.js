const mongoose=require("mongoose");

const imgSchema= new mongoose.Schema({
  username:{type:String},
  place:{type:String},
  experience:{type:String},
  imageUrls:[String]
})
 const images= mongoose.model("images",imgSchema)
module.exports=images;