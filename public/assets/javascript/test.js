const request   = require("request");
const cheerio   = require("cheerio");

boxofficeScrape = (url, number) => {
    request(url, function(error, response, html) {
      const $ = cheerio.load(html);
      $('div#body').children('center').children('table').children('tbody').children().each(function(i, element) {  
        if(i < number && i > 0) {
        const title = $(element).children().eq(1).text();
        const amt = $(element).children().eq(3).text();
        let movieInfo = { title: title, amount: amt }
        // data.push(movieInfo)
        console.log(movieInfo)
        }
      })
    })
}

boxofficeScrape("http://www.boxofficemojo.com/seasonal/?view=releasedate&yr=2018&season=Summer", 10)

//first thing to do is scrape and get the movies list...
//this includes 2 scrapes... one for avengers(thanks bro)
//the other for the rest of the movies. 

//after scraping we will check to see if the new scrape is diff.
//if it is different we will run the code to update
//first players... 
//go through each player and update movement and pts.
//after players have been udpated update old' movie list to new movie list. 

//when someone loads the page it should run this. 
