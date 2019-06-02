//Check for change in movies --------------------------------------------------------------------
ajax = (url) => $.ajax({ url: url, method: "GET"})
ajax("/api/movies/check").done((res) => 
    res.results.map((mov, i) => {
        $("tbody").append(
            "<tr>" +
                "<th scope='row'>" + (i+1) + "</th>" +    
                "<td class='text-truncate td-max' >" + mov.title + "</td>" + 
                "<td class='text-center'>" + mov.amount + " </td>" +
            "</tr>"
        )
    }),     
)

