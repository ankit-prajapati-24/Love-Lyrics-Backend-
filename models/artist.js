const mongoose = require("mongoose");

const ArtistSchema =  mongoose.Schema({
    Name:{
        type :String,
        require:true
    },
    Image:{
        type :String,
    },
    Songs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Track"
        }
    ]
});

module.exports  = mongoose.model("Artist",ArtistSchema);