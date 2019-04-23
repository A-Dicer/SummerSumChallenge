const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const Twitter = require("twitter");
const configAuth = require('../config/twitterAuth.js');

const client = new Twitter({
  consumer_key: configAuth.twitterAuth.consumer_key,
  consumer_secret: configAuth.twitterAuth.consumer_secret,
  access_token_key: configAuth.twitterAuth.token_key,
  access_token_secret: configAuth.twitterAuth.token_secret
});

// API Routes -----------------------------------------------------
router.use("/api", apiRoutes); 

// Route for seeing # of players-----------------------------------
router.use("/players", function(req, res) {
  res.sendFile(path.join(__dirname, "/../players.html"));
});

// Twitter look up Route ------------------------------------------
router.use("/twit/:name", function(req, res){ 
  const params = {screen_name: req.params.name};
  const path = "https://api.twitter.com/1.1/users/show.json?"
  client.get(path, params, function(error, user, response) {
    let twitData;
    
    if(user.profile_image_url_https === "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"){
      twitData = {name: user.name, img: "http://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"}
    } else if( user.profile_image_url_https) {
      twitData = {name: user.name, img: user.profile_image_url_https.slice(0, -10) + "400x400.jpg"}
    } else twitData = {name: "none", img: "none"}
    
    res.send({twitData}) 
  });
})

// Index Route ----------------------------------------------------
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "/../index.html"));
});

module.exports = router;
