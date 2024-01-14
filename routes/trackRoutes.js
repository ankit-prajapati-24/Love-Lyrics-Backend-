const express = require("express");
const route = express.Router();
const {addTrack,getTrack,CreateAlbum,getArtists,getAllTrack,test,getArtistsData} = require("../controllers/trackController");
route.post("/addTrack",addTrack);
route.post("/getTrack",getTrack);
route.post("/CreateAlbum",CreateAlbum);
route.post("/getArtists",getArtists);
route.get("/getArtistsData",getArtistsData);
route.post("/getAllTrack",getAllTrack);
route.post("/test",test);


module.exports = route;