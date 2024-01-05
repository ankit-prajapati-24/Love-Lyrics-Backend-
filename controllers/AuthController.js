const User = require("../models/user");
const Track = require("../models/track");
const jwt = require('jsonwebtoken');
const OTP = require('../models/OTP');
const otpgenerator = require('otp-generator');
require("dotenv").config();

exports.sendOTP = async (req, res) => {
    try {
        // fetch email from req body
        console.log(req.body);
        const { Email } = req.body;
        console.log("email is here:", Email);

        let otp = otpgenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log(otp);

        const otpPayload = { Email, Otp : otp };

        // Create an entry for OTP
        const user = await User.findOne({ Email});
        if(user){
            return res.status(201).json({
                msg:"user already exists"
            })
        }
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        // Send the OTP via email (you can add this part)

        res.status(200).json({
            success: true,
            status: 200,
            message: "OTP sent successfully",
            Otp: otp
        });
        console.log("finished")
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Internal server error"
        });
    }
};


exports.Signup = async (req, res) => {

    try {
        console.log(req.body);
        const { credential, Email, Password, Otp,userinfo } = req.body;
     console.log(req.body,"this is give data");
        if (credential) {

            const decodedToken = jwt.decode(credential, { complete: true });

            const payload = {
                Name: decodedToken.payload.name,
                Image: decodedToken.payload.picture,
                Email: decodedToken.payload.email,
            }
            const user = await User.create(payload);
            return res.status(200).json({
                token:decodedToken.signature,
                user
            }
            );
        }
        else if(userinfo){
            const user = await User.findOne({Email:userinfo.email});
            if(user){
                return res.status(200).json({
                    token:userinfo.email,
                    user
                }
                );
            }
            else{
                const payload = {
                    Name: userinfo.name,
                    Image: userinfo.picture,
                    Email: userinfo.email,
                }
                const user = await User.create(payload);
                return res.status(200).json({
                    token:userinfo.email,
                    
                }
                );
            }
        }
        else {
            console.log("singh menualy");
            const existuser = await User.findOne({ Email });
            console.log(existuser);
            if (existuser) {
                return res.status(200).json({
                    // success: false,
                    msg: 'User already exists',
                });
            }
            else {
                const recentOtp = await OTP.find({Email}).sort({createdAt: -1}).limit(1);
                if (recentOtp[0].Otp == Otp) {
                    console.log(recentOtp[0].Otp);
                    const payload = {
                        Email,
                        Password
                    };
                    const newuser = await User.create(payload);
                    res.status(200).json({newuser});
                }
                else {
                    res.status(404).json({ msg: "OTP NOT MATCH " })
                }
            }
        }
    }
    catch (err) {
        res.status(400).json({
            error: err
        })

    }
}


exports.Login = async(req,res) => {
    try{
        const {credential, userinfo, Email, Password } = req.body;
        
        console.log(req.body);
        if(userinfo){
            const user = await User.findOne({Email:userinfo.email});
            if(user){
                return res.status(200).json({
                    token:userinfo.email,
                    user
                }
                );
            }
            else{
                const payload = {
                    Name: userinfo.name,
                    Image: userinfo.picture,
                    Email: userinfo.email,
                }
                const user = await User.create(payload);
                return res.status(200).json({
                    token:userinfo.email,
                    user
                }
                );
            }
        }
       else if (credential) {

            const decodedToken = jwt.decode(credential, { complete: true });
           
            const user = await User.findOne({Email:decodedToken.payload.email});
            if(user){
                return res.status(200).json({
                    token:decodedToken.signature,
                    user
                }
                );
            }
            else{
                const payload = {
                    Name: decodedToken.payload.name,
                    Image: decodedToken.payload.picture,
                    Email: decodedToken.payload.email,
                }
                const user = await User.create(payload);
                return res.status(200).json({
                    token:decodedToken.signature,
                    user
                }
                );
            }
        }
        else {
            const user = await User.findOne({Email});
        console.log(user);
        if(!user){
            return res.status(202).json({
                success:false,
                msg:"user  not ragistered"
            })
        }
        if(Password  != user.Password){
            return res.status(201).json({
                msg:"password  is incorrect"
            })
        }
        const payload = {
            email:user.Email,
            id:user._id,
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h"
        });
        user.token = token;

        const options = {
            expires:new Date(Date.now() + 3*60*60*1000),
            httpOnly:true
        }

        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user
        });
        }

    }
    catch(err){
        res.status(400).json({
            error: err
        })
    }
}