$.ajax({ url: "/api/users", method: "GET"})
        .done((res) => { 
            res.results.map((user)=> {
                console.log(user)
                $("#data").append("<div>Name: " + user.username + " / guru: " + user.guru + " / twitter: " + user.twitter + "<hr/></div>")      
            })
        });