const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const players = require('../public/assets/javascript/players.js');

// API Routes -----------------------------------------------------
router.use("/api", apiRoutes); 

// Route for seeing # of players ----------------------------------
router.use("/players", function(req, res) {
  res.send({results: players})
});

// Index Route ----------------------------------------------------
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "/../index.html"));
});

module.exports = router;
