const express = require("express");
const route = express.Router();
const {addTrack,getTrack,CreateAlbum,getArtists} = require("../controllers/trackController");
route.post("/addTrack",addTrack);
route.post("/getTrack",getTrack);
route.post("/CreateAlbum",CreateAlbum);
route.post("/getArtists",getArtists);


module.exports = route;