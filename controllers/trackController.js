const Track = require("../models/track");
const Artist = require("../models/artist");
const Album = require ("../models/albums.js");

const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();



  // Example usage
  
exports.addTrack = async (req, res) => {
    try {
        // Destructuring values from the request body
        const { Name, Url, ArtistName} = req.body;


        // Assuming req.files.Image contains the image file
        const Image = req.files.Image;
        const ArtistImage = req.files.ArtistImage;


        // Uploading image to Cloudinary
        const uploaddata = await uploadImageToCloudinary(Image, process.env.FOLDER_NAME);
        const aritistimg = await uploadImageToCloudinary(ArtistImage, process.env.FOLDER_NAME);

        // Create payload with the provided information
        const payload = {
            Name: Name,
            Url: downloadLink,
            Image: uploaddata.secure_url,
            Artists: [ArtistName] // Assuming ArtistName is a single value, not an array
        };

        // Creating the track in the database
        const track = await Track.create(payload);

        // Check if the artist exists
        const artist = await Artist.findOne({ Name: ArtistName.trim("") });

        if (artist) {
            // If artist exists, update the artist's Songs array
            console.log("artist found");
            const updatedArtist = await Artist.findOneAndUpdate(
                { Name: ArtistName,
               
                 $push: { Songs: track._id } },
                { new: true },
            ).populate("Songs").exec();

            return res.status(200).json({
                msg: "Track added successfully",
                data: track,
                updatedArtist
            });
        } else {
            // If artist does not exist, create a new artist
            const payload = {
                Image:aritistimg.secure_url,
                Name: ArtistName,
                Songs: [track._id], // Assuming this is an array
            };

            const newArtist = await Artist.create(payload);

            return res.status(200).json({
                msg: "Track added successfully",
                data: track,
                newArtist
            });
        }
    } catch (err) {
        // Sending an error response in case of an exception
        res.status(500).json({
            msg: 'Could not add track',
            error: err.message // Optionally, include the error message for debugging
        });
    }
};

exports.getTrack = async (req, res) => {
    // Use req.params instead of req.body for retrieving parameters from the URL
    const { Name } = req.body;
   console.log(Name);
    try {
        const tracks = await Track.find({ Name: { $regex: new RegExp(Name, 'i') } });
    
        res.status(200).json({
            msg: "Song found",
            tracks: tracks
        });
    } catch (err) {
        res.status(500).json({
            msg: "Could not search the track",
            error: err.message
        });
    }}

    exports.getAllTrack = async (req, res) => {
      
        try {
            const tracks = await Track.find({ });
            res.status(200).json({
                msg: "Song found",
                tracks: tracks
            });
        } catch (err) {
            res.status(500).json({
                msg: "Could not search the track",
                error: err.message
            });
        }}
         
    exports.getArtists = async (req, res) => {
        try {
            const artist = await Artist.find({}).populate("Songs").exec();
            res.status(200).json({
                data:artist
            })
        } catch (err) {
            res.status(500).json({
                msg: "Could not get  the aritist",
                error: err.message
            });
        }}
    
        exports.getArtistsData = async (req, res) => {
            try {
                console.log("this are per", req.query.ArtistId);
                const Name = req.query.ArtistId;
                const artist = await Artist.findOne({Name:Name}).populate("Songs").exec();
                res.status(200).json({
                    data:artist
                })
            } catch (err) {
                res.status(500).json({
                    msg: "Could not get  the aritist",
                    error: err.message
                });
            }}
        
        
       
//  *******************************************************************************************************************
//  *                                      CreateAlbum                                                                *
//  *******************************************************************************************************************
        exports.CreateAlbum = async(req,res) =>{
              try{
                  
                  // Destructuring values from the request body
        const { Name,AlbumName, ArtistName,ArtistImage,AlbumImg,Image } = req.body;
        // const ArtistName = ArtistName.trim("");
        console.log(req.body);
        // const downloadLink = convertGoogleDriveLinkToDirectDownload(Url);

        // Assuming req.files.Image contains the image file
        // const Image = req.files.Image;
        // const ArtistImage = req.files.ArtistImage;        
        // const AlbumImg = req.files.AlbumImg;
        const music = req.files.music;

       
        console.log("step");
        console.log(music);

        // Uploading image to Cloudinary
        // const uploaddata = await uploadImageToCloudinary(Image, process.env.FOLDER_NAME);
        // const aritistimg = await uploadImageToCloudinary(ArtistImage, process.env.FOLDER_NAME);
        const musicurl = await uploadImageToCloudinary(music, process.env.FOLDER_NAME);
        console.log(musicurl);


        // Create payload with the provided information
        const payload = {
            Name: Name,
            Url: musicurl.secure_url,
            Image: Image,
            Artists: [ArtistName] // Assuming ArtistName is a single value, not an array
        };

        // Creating the track in the database
        const track = await Track.create(payload);

        // Check if the artist exists
        const artist = await Artist.findOne({ Name: ArtistName });

        if (artist) {
            // If artist exists, update the artist's Songs array
            console.log("aritst found");
            const updatedArtist = await Artist.findOneAndUpdate(
                { Name: ArtistName },
                {$push: { Songs: track._id } 
            },

                { new: true }
            ).populate("Songs").exec();

          
        } else {
            // If artist does not exist, create a new artist
            const payload = {
                Name: ArtistName,
                Image:ArtistImage,
                Songs: [track._id], // Assuming this is an array
            };
            const newArtist = await Artist.create(payload);
        }
        
        // const albumsimglink = await uploadImageToCloudinary(AlbumImg, process.env.FOLDER_NAME);
        
        const ExistAlbum = await Album.findOne({Name:AlbumName});
        console.log("everthing is fine above",ExistAlbum);
        if(ExistAlbum){
           const updatealbum = await Album.findOneAndUpdate({Name:AlbumName},{
            $push:{Songs:track._id}
           }).populate("Songs").exec();   
           return res.status(200).json({
            msg:"Album Updated successfully",
            data:updatealbum
        })
        }
        else{
            const AlbumData =await Album.create({
                Image:AlbumImg,
                Name:AlbumName,
                Songs:[track]
            });    
           return res.status(200).json({
                msg:"Album created successfully",
                data:AlbumData
            })
        }
     
     
              }
              catch(err){
                res.status(404).json({message: err.message});
              }
        }
    
        exports.test = async (req,res) => {
            try{
                console.log(req.files,req.body);
                const music = req.files.music;
                console.log(music);
                const data =await uploadImageToCloudinary(music,process.env.FOLDER_NAME);
                console.log(data);
                res.status(200).json({
                    data
                })                    
            }
            catch(err){
                res.status(404).json({message: err.message});
            }
        }



