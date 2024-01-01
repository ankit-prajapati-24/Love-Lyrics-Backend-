const Track = require("../models/track");
const Artist = require("../models/artist");
const Album = require ("../models/albums.js");

const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();


function convertGoogleDriveLinkToDirectDownload(link) {
    // Extract the file ID from the Google Drive URL
    const fileIdMatch = link.match(/\/file\/d\/(.+?)\/view/);
    
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      
      // Construct the direct download link
      const directDownloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
      
      return directDownloadLink;
    } else {
      // Return the original link if it doesn't match the expected pattern
      return link;
    }
  }
  
  // Example usage
  
exports.addTrack = async (req, res) => {
    try {
        // Destructuring values from the request body
        const { Name, Url, ArtistName} = req.body;

        const downloadLink = convertGoogleDriveLinkToDirectDownload(Url);

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
        // if (tracks && tracks.lenght == 0) {
        //     return res.status(404).json({
        //         msg: "Song Not Found"
        //     });
        // }

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
    
        
       
//  *******************************************************************************************************************
//  *                                      CreateAlbum                                                                *
//  *******************************************************************************************************************
        exports.CreateAlbum = async(req,res) =>{
              try{
                  
                  // Destructuring values from the request body
        const { Name,AlbumName,Url, ArtistName } = req.body;
        // const ArtistName = ArtistName.trim("");
        console.log(req.body);
        const downloadLink = convertGoogleDriveLinkToDirectDownload(Url);

        // Assuming req.files.Image contains the image file
        const Image = req.files.Image;
        const ArtistImage = req.files.ArtistImage;        
        const AlbumImg = req.files.AlbumImg;

        console.log("step");

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
                Image:aritistimg.secure_url,
                Songs: [track._id], // Assuming this is an array
            };
            const newArtist = await Artist.create(payload);
        }
        
        const albumsimglink = await uploadImageToCloudinary(AlbumImg, process.env.FOLDER_NAME);
        
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
                Image:albumsimglink.secure_url,
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
    



