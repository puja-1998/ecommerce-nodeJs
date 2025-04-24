const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default: "user",
    }
});

// to encrypt/ hide password we use bcrypt
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt)
});

//to login need password
userSchema.methods.isPasswordMatched = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password); // if pass is correct return true else return false
}
//Export the model
module.exports = mongoose.model('User', userSchema);