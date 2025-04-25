const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModels');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');

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
            const refreshToken = await generateRefreshToken(findUser?._id);
            const updateuser = await User.findByIdAndUpdate(
            findUser.id, 
            {
                refreshToken: refreshToken,
            },
            {
                new: true,
            }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72*60*60*1000,
        });
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
    validateMongoDbId(_id);
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
    validateMongoDbId(id);
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

// todo user blocked 
const blockUser = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const block = await User.findByIdAndUpdate(id,{
            isBlocked:true,

        },
        {
            new:true,
        }
    );
    res.json({
        message: "User Blocked",
    });
       
    }catch(err){
        throw new Error(err);
    }
});

// todo user unblocked or 
const unblockUser = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const block = await User.findByIdAndUpdate(id,{
            isBlocked:false,

        },
        {
            new:true,
        }
    );
    res.json({
        message: "User is UnBlocked",
    });

    }catch(err){
        throw new Error(err);
    }
});

//Handle Refresh Token
const handleRefreshToken = asyncHandler(async (req, res) =>{
    const cookie = req.cookies;
    console.log(cookie);
    if(!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error("No Refresh Token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET,(err, decoded) =>{
        if(err || user.id !== decoded.id){
            throw new Error("There is something wrong withrefresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken});
    });
   
});

module.exports = {
    createUser, 
    loginUserCntrl, 
    getAllUser, 
    getSingleUser, 
    deleteUser, 
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken
};