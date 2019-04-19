const router = require("express").Router();
const userRoutes = require("./users");
const listRoutes = require("./list");
const moviesRoutes = require("./movies");

router.use("/users", userRoutes); // User routes
router.use("/list", listRoutes); // List routes
router.use("/movies", moviesRoutes); // Movies routes


module.exports = router;
