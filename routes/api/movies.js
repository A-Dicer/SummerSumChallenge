const router = require("express").Router();
const moviesController = require("../../controllers/moviesController");

//--------------- Matches with "/api/movies" --------------------
router.route("/").get(moviesController.findAll);
router.route('/check/').get(moviesController.check);
 
module.exports = router;