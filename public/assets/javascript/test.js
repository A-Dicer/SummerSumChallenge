

// boxofficeScrape = (url, number) => {
//   request(url, function(error, response, html) {
//     const $ = cheerio.load(html);
//     $('div#body').children('center').children('table').children('tbody').children().each(function(i, element) {  
//       if(i < number && i > 0) {
//       const title = $(element).children().eq(1).text();
//       const amt = $(element).children().eq(3).text();
//       let movieInfo = { title: title, amount: amt }
//       data.push(movieInfo)
//       }
//     })
//     if(number === 2)boxofficeScrape("http://www.boxofficemojo.com/seasonal/?view=releasedate&yr=2018&season=Summer", 10);
//   })
// }

$.ajax({ url: "/api/movies/check", method: "GET"}).done((res) => console.log(res.results))
$.ajax({ url: "/api/movies/", method: "GET"}).done((res) => console.log(res.results))




//first thing to do is scrape and get the movies list...
//this includes 2 scrapes... one for avengers(thanks bro)
//the other for the rest of the movies. 

//after scraping we will check to see if the new scrape is diff.
//if it is different we will run the code to update
//first players... 
//go through each player and update movement and pts.
//after players have been udpated update old' movie list to new movie list. 

//when someone loads the page it should run this. 

//ok, so what all do I really need to happen. 
//lets figure this out.  Someone visits the site... when they they get there the first thing is...

// ----------- get the current movie list
// -------------------- ajax movie data base to get old list
// -------------------- ajax movie/check to get the current movie list 
//------------ check current movie list to see if anything has changed
//--------------------- compare old and current array movie titles
//------------ if something has changed
//--------------------- update players score and position. 
//--------------------- Change boxoffice database to new data
//------------ if nothing has changed do nothing?
//------------ When finished updating start leaderboard.

// so I have a problem with gurus.... not sure how to keep track of them without a sepperate save check? 
// really not sure.. old way was everytime it woould run the points and possition twice basically.
// maybe we keep it like last time and and don't update the user database but instead generate it on the spot.
// it might be slower... not sure.  but right now I'm thinking that is the best option.
// that will keep it functioning basically the same as the year prior. 