const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModels');
const asyncHandler = require('express-async-handler');

// create user api
const createUser = asyncHandler(
    async (req, res) =>{
        const email = req.body.email;
        const findUser = await User.findOne({email: email});
        if(!findUser){
            //Create new User
            const newUser = await User.create(req.body);
            res.json(newUser);
        }
        else{
            //User already Exists
            // res.json({
            //     message: "User already exists",
            //     success: false,
            // });

            throw new Error("User already exists");
        }
});

// user login 
const loginUserCntrl = asyncHandler(
    async (req, res) =>{
        const {email, password} = req.body;
        //console.log(email, password);
        // check if user exist or not
        const findUser = await User.findOne({email});
        if(findUser && (await findUser.isPasswordMatched(password))){ // user and password matched then login
            res.json({
                _id: findUser?._id,
                firstname: findUser?.firstname,
                lastname: findUser?.lastname,
                email: findUser?.email,
                mobile: findUser?.mobile,
                token: generateToken(findUser?._id),
            });
        }else{
            throw new Error("Invalid Credentials")
        }
    }
) 

module.exports = {createUser, loginUserCntrl};