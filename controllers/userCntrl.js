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
) ;

//update user
const updateUser = asyncHandler(async (req, res) =>{
    const {_id} = req.user;
    try{
        const updateUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,  // ? ==> if there is any err for that
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        }, {
            new: true,
        });
        res.json({
            updateUser,
            message: "User Updated Successfully",
        });

    }catch(err){
        throw new Error(err);
    }
})

//get all user
const getAllUser = asyncHandler(async (req, res) =>{
    try{
        const getUsers = await User.find();
        res.json({
            message: "Fetch all users successfully",
            getUsers,
        });

    }catch (err){
        throw new Error(err);
    }
});

//get a single user
const getSingleUser = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    try{
        const getSingleUser = await User.findById(id);
        res.json({
            getSingleUser,
            message: "Fetch a single user successfully",
        });

    }catch(err){
        throw new Error(err);
    }
});

//delete a single user
const deleteUser = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    try{
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({
            deleteUser,
            message: "User deleted Successfully",
        });

    }catch(err){
        throw new Error(err);
    }
});
module.exports = {createUser, loginUserCntrl, getAllUser, getSingleUser, deleteUser, updateUser};