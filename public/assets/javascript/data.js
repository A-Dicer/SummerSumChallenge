$.ajax({ url: "/api/users", method: "GET"})
        .done((res) => { 
            res.results.map((user, i)=> {
                $("#data").append("<div>" + i + " - Name: " + user.username + " / guru: " + user.guru + " / twitter: " + user.twitter + "<hr/></div>")      
            })
        });