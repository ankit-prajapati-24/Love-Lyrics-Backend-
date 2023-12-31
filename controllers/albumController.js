const Album = require ("../models/albums.js");

exports.GetAllAlbum = async(req,res) =>{
      try{
          const albums = await Album.find({}).populate("Songs").exec();
          return res.status(200).json({
            Data:albums
          })
      }
      catch(err){
        res.status(404).json({message: err.message});
      }
}