const express = require('express');
const routes = express.Router();
const {CreatePlaylist,getPlaylists,removeTracksToPlaylist,addTracksToPlaylist} = require('../controllers/PlaylistController');

routes.post("/CreatePlaylist", CreatePlaylist);
routes.post("/getPlaylists", getPlaylists);
routes.post("/addTracksToPlaylist", addTracksToPlaylist);
routes.delete("/removeTracksToPlaylist", removeTracksToPlaylist);

module.exports = routes;

