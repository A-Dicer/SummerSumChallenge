let oldMovie = []; let newMovie = []; 

//saveList --------------------------------------------------------------------------------------
saveList = () => (
    $.ajax({ url: "/api/movies", method: "POST", data: { movies: JSON.stringify(newMovie) }}).done((res) => {  
        // console.log(res.results)
    })
)

//compareLists ----------------------------------------------------------------------------------
compareLists = () => {
    // console.log(newMovie)
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
                    check ? saveList() : null
                )
                : null
        )  

        //if not create the first list in database
        : saveList()
        
    ))
}

//Check for change in movies --------------------------------------------------------------------
ajax = (url) => $.ajax({ url: url, method: "GET"})

ajax("/api/movies/check").done((res) => res.results.map((mov, i) => {
    newMovie.push(mov.title),
    $("tbody").append(
        "<tr>" +
            "<th scope='row'>" + (i+1) + "</th>" +    
            "<td class='text-truncate td-max' >" + mov.title + "</td>" + 
            "<td class='text-center'>" + mov.amount + " </td>" +
        "</tr>"
    )
}),    
compareLists,   
)
