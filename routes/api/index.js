const router = require("express").Router();
const moviesRoutes = require("./movies");

router.use("/movies", moviesRoutes); // Movies routes

module.exports = router;
