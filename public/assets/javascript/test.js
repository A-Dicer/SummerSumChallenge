

let oldMovie = []; let newMovie = []; 
const test =["Avengers: Startgame", "Pokemon Detective Pikachu", "John Wick: Chapter 3 - Parabellum", "The Intruder (2019) ", "Long Shot", "The Hustle", "Uglydolls", "Poms", "A Dog's Journey", "Tolkien"]; 
let check = false;

saveList = () => (
    $.ajax({ url: "/api/movies", method: "POST", data: { movies: JSON.stringify(newMovie) }}).done((res) => {  
        console.log(res.results)
    })
)

compareLists = () => {
    console.log(newMovie)
    ajax("/api/movies/").done((res) => (
        //check to see if there is a list in the database
        res.results.length 
        ? (
            //set oldMovies to the most recent list
            oldMovie = res.results[res.results.length - 1].movies,
            //scrape new list from boxOffice mojo
                //make sure scrape worked
                newMovie.length
                ? (
                    //reset check to false
                    check = false,
                    //go through and check to see if the old and new list match
                    newMovie.map((mov, i) => mov != oldMovie[i] ? check = true : null ),
                    //if they don't match add new list to database
                    check ? saveList() : console.log('false')
                )
                : null
        )  
        //if not create the first list in database
        : saveList()
        
    ))
}

ajax = (url) => $.ajax({ url: url, method: "GET"})
ajax("/api/movies/check").done((res) => res.results.map(mov => newMovie.push(mov.title)), compareLists)



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