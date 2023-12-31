const mongoose = require("mongoose");

const trackSchema =  mongoose.Schema({
    Name:{
        type :String,
        require:true
    },
    Image:{
        type :String,
        require:true
    },
    Url:{
     type:String,
     require:true
    },
    Artists:[
        {
           type:String
        }
    ]
});

module.exports  = mongoose.model("Track",trackSchema);