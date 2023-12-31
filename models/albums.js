const mongoose = require("mongoose");

const albumSchema =  mongoose.Schema({
    Name:{
        type :String,
        require:true
    },
    Image:{
        type :String,
        require:true
    },
     Songs:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"Track"
        }
    ]
});

module.exports  = mongoose.model("Album",albumSchema);