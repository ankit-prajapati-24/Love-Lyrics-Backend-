const mongoose = require("mongoose");

const PlaylistScheme =  mongoose.Schema({
    Name:{
        type :String,
        require:true
    },
    Image:{
        type :String,
        require:true
    },
    Privacy:{
        teype:Boolean,
    },
     Songs:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"Track"
        }
    ]
});

module.exports  = mongoose.model("Playlist",PlaylistScheme);