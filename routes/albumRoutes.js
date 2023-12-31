const express = require("express");
const route = express.Router();
const {GetAllAlbum} = require("../controllers/albumController");
route.post("/GetAllAlbum",GetAllAlbum);

module.exports = route;