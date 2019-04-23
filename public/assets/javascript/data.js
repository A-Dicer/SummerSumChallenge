$.ajax({ url: "/api/users", method: "GET"})
    .done((res) => { 
        res.results.sort(function(a, b){return b.guru - a.guru})
        res.results.map((user, i)=> {
            
            let guru = ""; let twitter = "";
            user.guru ? guru = "<i class='far fa-check-circle up'></i>" : guru = "<i class='far fa-times-circle down'></i>"
            user.twitter ? twitter = "<i class='far fa-check-circle up'></i>" : twitter = "<i class='far fa-times-circle down'></i>"

            $("#data").append("<div>" + (i+1) + ": " + user.username + 
            " - <i class='fas fa-user-astronaut guru '></i>  " + guru + 
            " - <i class='fab fa-twitter'></i> " + twitter + "<hr/></div>")      
        })
    });

    