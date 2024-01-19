const express = require("express");
const route = express.Router();

const { Signup,sendOTP,Login,updateInformation} = require("../controllers/AuthController");
const {capturePayment,verifyPayment} = require("../controllers/Payments");

route.post("/Signup", Signup);
route.post("/Sendotp",sendOTP);
route.post("/Login",Login);
route.post("/updateInformation",updateInformation);
route.post("/capturePayment",capturePayment);
route.post("/verifyPayment",verifyPayment);


module.exports = route;