const router = require("express").Router();
const moviesController = require("../../controllers/moviesController");

//--------------- Matches with "/api/movies" --------------------
router.route("/").get(moviesController.findAll);
 
module.exports = router;