// const Album = require ("../models/albums.js");

// exports.GetAllAlbum = async(req,res) =>{
//       try{
//           const albums = await Album.find({}).populate("Songs").exec();
//           return res.status(200).json({
//             Data:albums
//           })
//       }
//       catch(err){
//         res.status(404).json({message: err.message});
//       }
// }
const Album = require("../models/albums.js");
const User = require("../models/user");

// Get all albums and their songs
exports.getAllAlbum = async (req, res) => {
  try {
    const albums = await Album.find({}).populate("Songs").exec();
    return res.status(200).json({
      Data: albums,
    });
  } catch (err) {
    console.error("Error fetching albums:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add a song to the user's favorites
exports.addFavorite = async (req, res) => {
  try {
    const { SongId, UserId } = req.body;
    console.log(req.body, "add fav");

    const updatedUser = await User.findOneAndUpdate(
      { _id: UserId },
      { $push: { Favorite: SongId } },
      { new: true }
    );

    return res.status(200).json({
      favoriteSongs: updatedUser.Favorite,
    });
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove a song from the user's favorites
exports.removeFavorite = async (req, res) => {
  try {
    const { SongId, UserId } = req.body;
    console.log(req.body, "removing favorite");

    const updatedUser = await User.findOneAndUpdate(
      { _id: UserId },
      { $pull: { Favorite: SongId } },
      { new: true }
    );

    return res.status(200).json({
      favoriteSongs: updatedUser.Favorite,
    });
  } catch (err) {
    console.error("Error removing favorite:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get the user's favorite songs
exports.getFavoriteSongs = async (req, res) => {
  try {
    console.log("get fav songs",req.body);
    const { UserId } = req.body;

    const user = await User.findOne({ _id: UserId }).populate("Favorite").exec();

    return res.status(200).json({
      songs: user.Favorite || [],
    });
  } catch (err) {
    console.error("Error fetching favorite songs:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const { SongId, UserId } = req.body;

    const user = await User.findOne({ _id: UserId });
    console.log(user);
    if(user.Favorite ) {
      
      const check = user.Favorite.includes(SongId);
      console.log(check,"current situation");
      return res.status(200).json({
        check,
        msg:"Favorite"
      });
    }
    else{
      return res.status(200).json({
        check:false,
        msg:"Favorite"
      });
    }
  } catch (err) {
    console.error("Error fetching favorite songs:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

