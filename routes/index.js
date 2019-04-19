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

// SignUp Route ---------------------------------------------------
router.use("/signup", function(req, res) {
  res.sendFile(path.join(__dirname, "/../signup.html"));
});

router.use("/twit/:name", function(req, res){ 
  const params = {screen_name: req.params.name};
  const path = "https://api.twitter.com/1.1/users/show.json?"
  client.get(path, params, function(error, user, response) {

  let twitData;
  
  if(user.profile_image_url_https === "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"){
  twitData = {name: user.name, img: "http://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"}
  } else if( user.profile_image_url_https) {
  twitData = {name: user.name, img: user.profile_image_url_https.slice(0, -10) + "400x400.jpg"}
  } else twitData = {name: "none", img: "none"} // if(error) throw error;

    res.send({twitData}) 
});
  
})
// router.get("/", function(req, res) { res.sendFile(path.join(__dirname, "index.html")) });
// router.get("/signup", function(req, res) { res.sendFile(path.join(__dirname, "signup.html")) });
// router.get("/boxoffice", function(req, res){ res.send(data) })
// router.get("/players", function(req, res){ res.send(all) })
// router.get("/gurus", function(req, res){ res.send(gurus) })
// router.get("/list", function(req, res){ res.send(list) })

// Index Route ----------------------------------------------------
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "/../index.html"));
});


module.exports = router;
