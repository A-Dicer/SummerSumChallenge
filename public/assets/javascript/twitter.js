const Twitter = require("twitter");

var client = new Twitter({
    consumer_key: 'cTG2wQqlTod844vZh4KkogaAb',
    consumer_secret: 'gV6Qb3PRwtxpL6y9Nj6HNImbTpf9ah6hfBXrvVHOVNudRN5nvJ',
    access_token_key: '885224216005685251-ISjjWOj0amarhPuckHetW8xPjqqSS4X',
    access_token_secret: 'FTOtAMd18v1dG91JSk5fiJk2Jfexh8Ey5qXFdgpou2GII'
  });

  

  twitSearch = (name) => { 
   
    var params = {screen_name: name};
    var path = "https://api.twitter.com/1.1/users/show.json?"
    
    client.get(path, params, function(error, tweets, response) {
        if(error) throw error;
        console.log(tweets.profile_background_image_url_https); 
    });
}