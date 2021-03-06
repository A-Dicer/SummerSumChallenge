const router = require("express").Router();
const moviesController = require("../../controllers/moviesController");

//--------------- Matches with "/api/movies" --------------------
router.route("/").get(moviesController.findAll).post(moviesController.create);
router.route('/check/').get(moviesController.check);
router.route('/daily/').get(moviesController.daily);
 
module.exports = router;