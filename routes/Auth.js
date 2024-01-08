const express = require("express");
const route = express.Router();

const { Signup,sendOTP,Login,updateInformation} = require("../controllers/AuthController");

route.post("/Signup", Signup);
route.post("/Sendotp",sendOTP);
route.post("/Login",Login);
route.post("/updateInformation",updateInformation);


module.exports = route;