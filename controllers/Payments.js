const { instance } = require("../config/razorpay")
const mailSender = require("../utils/mailSender");
const User = require("../models/user");
const crypto = require("crypto");

exports.capturePayment = async(req,res) =>{
    const {userId,price} = req.body;
    const totalAmount = price;

  const options = {
    amount : totalAmount * 100,
    currency : "INR",
    receipt:Math.random(Date.now()).toString(),
  }

  try{
    const paymentResponse = await instance.orders.create(options);
    res.json({
        success:true,
        message:paymentResponse
    })
  }
  catch(err){
     console.error(err);
     res.status(500).json({message:"could not intiate Order" });
  }
}

exports.verifyPayment = async(req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const userId = req.body?.userId;

  if(!razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature  || !userId) {
          return res.status(200).json({success:false, message:"Payment Failed"});
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

      if(expectedSignature === razorpay_signature) {
          //enroll karwao student ko
          // await enrollStudents(courses, userId, res);
          //return res
           const user = await User.findOneAndUpdate({_id : userId},
             {
              subscriptionToken: body.toString(),
             }
            )
          return res.status(200).json({success:true, message:"Payment Verified",user});
      }
      return res.status(200).json({success:"false", message:"Payment Failed"});

}
