const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc Register a new user
// @route POST /api/v1/auth/signup
// @access Public

const signup = async (req,res) =>{
    try{
        const {name,email,password} = req.body;

        //validate
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:'Please provide all required fields'
            });
        }

        //check if user already exists
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                success:false,
                message:'User already exists'
            });
        }

        //create user
        const user = await User.create({
            name,
            email,
            password
        });

        if(user){
            res.status(201).json({
                success:true,
                data:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    token:generateToken(user._id)
                }
            });
        }else{
            res.status(400).json({
                success:false,
                message:'Invalid user data'
            });
        }
    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}

// @desc Login user
// @route POST /api/v1/auth/login
// @access Public

const login = async (req,res) =>{
    try{
        const{email, password} = req.body;

        //validate
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message : 'Please provide email and password'
            });
        }

        //check for user
        const user = await User.findOne({email}).select('+password');

        if(!user){
            return res.status(401).json({
                success:false,
                message:'Invalid credentials'
            })
        }

        //check if password matches
        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:'Invalid credentials'
            });
        }

        res.status(200).json({
            success:true,
            data:{
                _id:user._id,
                name:user.name,
                email:user.email,
                token:generateToken(user._id)
            }
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

// @desc Get current logged in user
// @route GET /api/v1/auth/me
// @access Private

const getMe = async (req,res) => {
    try{
        const user = await User.findById(req.user.id);
        
        res.status(200).json({
            success:true,
            data:user
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

module.exports = {
    signup,
    login,
    getMe
};