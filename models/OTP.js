const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true
    },
    Otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60
    }
});

// A function to send email
async function sendVerificationEmail(Email, Otp) {
    try {
        const result = await mailSender(Email, "Verification Email from Love Lyrics", Otp);
        console.log(result);
    } catch (err) {
        console.log("Error in OTP verification", err);
        throw err;
    }
}

otpSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.Email, this.Otp);
    next();
});

module.exports = mongoose.model('OTP', otpSchema);
