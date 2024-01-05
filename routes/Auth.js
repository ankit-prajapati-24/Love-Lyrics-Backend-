const express = require("express");
const route = express.Router();

const { Signup,sendOTP,Login} = require("../controllers/AuthController");

route.post("/Signup", Signup);
route.post("/Sendotp",sendOTP);
route.post("/Login",Login);

module.exports = route;