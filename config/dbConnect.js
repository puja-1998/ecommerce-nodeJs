const { default: mongoose } = require("mongoose")

const dbConnect = () =>{
   try{
    const conn = mongoose.connect(process.env.MONGODB_URL);
    console.log("Datase connected successfully");
   }
   catch (error){
    console.log("Database connection error");
   }
}

module.exports = dbConnect;