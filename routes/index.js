const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const players = require('../public/assets/javascript/players.js');
const movies = require('../public/assets/javascript/movies.js')

// API Routes -----------------------------------------------------
router.use("/api", apiRoutes); 

// Route for seeing # of players ----------------------------------
router.use("/players", function(req, res) {
  res.send({results: players})
});

// Route for seeing # of players ----------------------------------
router.use("/movieData", function(req, res) {
  res.send({results: movies})
});

// Index Route ----------------------------------------------------
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "/../index.html"));
});

module.exports = router;
