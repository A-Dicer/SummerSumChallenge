
setTimeout(() => {
    $.ajax({
        url: "/movies/check",
        method: "GET"
      }).done(function(res) {
          
          res.forEach( function(movie, i) {
            let correct =  group.filter((player) => movie.title === player.picks[i])
            const percent = (correct.length / 63) * 100

            $("tbody").append(
                "<tr>" +
                    "<th scope='row'>" + (i+1) + "</th>" +    
                    "<td class='text-truncate td-max' >" + movie.title + "</td>" + 
                   
                    "<td class='text-center'>" + percent.toFixed() + "% </td>" +
                "</tr>"
            );
        })       
    });
    
}, 500);

