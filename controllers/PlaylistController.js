const Playlist = require("../models/Playlist");
const User = require("../models/user");

const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
exports.CreatePlaylist = async(req,res) =>{
    try{
        // console.log(req.files.Image);
        const { Name,privacy,id} = req.body;
        var URL ;
        if(req.files && req.files.Image){
            const Image= req.files.Image;
            const imagedata = await uploadImageToCloudinary(Image,process.env.FOLDER_NAME);
            URL = imagedata.secure_url;
    
        }
        else{
         URL = "https://cdn2.iconfinder.com/data/icons/audio-6/24/playlist-1-1024.png";
        //  URL = "https://cdn3.iconfinder.com/data/icons/flat-icons-web/40/Playlist-1024.png";
        }
        console.log(URL,"img url");
        const playlist = await Playlist.create({
            Name:Name,
            Image: URL,
            Privacy:privacy
        });
        // 65a02a0119ede5f7f11ef485
        const user = await User.findOneAndUpdate({_id:id},
            {$push:{Playlist :[playlist._id]}},
            {new : true} ).populate("Playlist").exec();
          
        return res.status(200).json({
            user
        })
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.getPlaylists = async(req,res) =>{
    try{
        const {id} = req.body; const user = await User.findOne({ _id: id })
        .populate('Playlist')
        .populate({
          path: 'Playlist',
          populate: {
            path: 'Songs',
            model: 'Track',
          },
        })
        .exec();
    
        return res.status(200).json({playlists: user.Playlist});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.addTracksToPlaylist = async(req,res) =>{
    try{
        const {id,trackId,playlistId} = req.body;
        const playlist = await  Playlist.findOneAndUpdate(
            {_id:playlistId},
            {$push:{Songs:[trackId]}},
            { new:true}
            ).populate("Songs").exec();

        return res.status(200).json({playlist});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
exports.removeTracksToPlaylist = async(req,res) =>{
    try{
        const {id,trackId,playlistId} = req.body;
        const playlist = await  Playlist.findOneAndUpdate(
            {_id:playlistId},
            {$pull:{Songs:[trackId]}},
            { new:true}
            ).populate("Songs").exec();

        return res.status(200).json({playlist});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
