const mongoose=require("mongoose");
const connectDB=()=>{
  mongoose.connect(process.env.MoNGO_URL)
  .then(()=>console.log("Database is connected"))
  .catch(()=>console.log("something error in the database connection"))
}

module.exports=connectDB;
