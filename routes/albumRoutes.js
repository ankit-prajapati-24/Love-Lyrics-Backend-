const express = require("express");
const route = express.Router();
const {getAllAlbum,removeFavorite,addFavorite,getFavoriteSongs,checkFavorite} = require("../controllers/albumController");
route.post("/GetAllAlbum",getAllAlbum);
route.post("/GetFavoriteSongs",getFavoriteSongs);
route.post("/AddFavorite",addFavorite);
route.post("/RemoveFavorite",removeFavorite);
route.post("/checkFavorite",checkFavorite);

module.exports = route;