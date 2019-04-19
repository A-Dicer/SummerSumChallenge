let list;
let disableCheck = {
    twitter: {  
        check: false,  
        reason: 'Twitter User Not Found',
        location: ''
    },
    dupe: {
        check: false, 
        reason: '',
        location: ''
    },
    empty: {
        check: false,
        reason: 'All Fields Must Be Filled In',
        location: ''
    }
}

let twitStatus;
//Builds the Selects -----------------------------------------------------
selectBuild = () => {
    for(let i = 0; i < 13; i++){
        if(i===0) $("#picks").append('<label for=""> <i class="fas fa-film"></i> Movie Selections</label>')
        $("#picks").append("<div class='row uds'>" +
        '<div class="col-12 ">' + 
        '<select class="form-control form-control-sm list" name="mov'+ (i+1) +'"><option></option></select>'+
        "</div>")
        if(i === 9) $("#picks").append('<hr/><label for=""> <i class="fas fa-horse-head"></i> Dark Horse Picks</label>')
    }
}

selectBuild()
//Adds options -----------------------------------------------------------
listOptions = () => { 
    list.forEach(mov => $("select").append( "<option>" + mov.title + "</option>"))
}

$(".twitter, .notTwit").on('input', (event)=> 
    event.target.value === ""
    ?  $(".nameSubmit").attr('disabled', true)
    :  $(".nameSubmit").attr('disabled', false)
)
//switch over for none twitter users -------------------------------------
$(".notTwitter").on('click', () =>{
    $(".nameSubmit").attr('disabled', true)
    $("#twitInput").fadeOut(1000)
    setTimeout(() => $("#notTwitInput").fadeIn(1000), 1100); 
})


//twitter and not twitter submit -----------------------------------------
$(".nameSubmit").on('click', function(event){
    let same = false; 
    event.preventDefault(),
    eventName = event.target.offsetParent.children[0]
    console.log(eventName.name)

    //check to see if name is already used
    $.ajax({ url: "/api/users", method: "GET"})
        .done((res) => { 
            res.results.map((user)=> {
                user.username.toLowerCase() === eventName.value.toLowerCase()
                ? same = true
                : null
            })

            same
                ? (
                    $("#reason").html("User Name Already In Use"),
                    $("#reason").fadeIn(1000)  
                )
                : (
                    eventName.name === "twitter"
                    ? (formTwit(eventName.value), twitStatus = true )
                    : (formNotTwit(eventName.value), twitStatus = false)
                )
  
        });
    
    
})

//Summer Movie List ------------------------------------------------------
$.ajax({ url: "/api/list", method: "GET"})
.done((res) => { list = res.results.sort(function(a, b){
    const mov1 = a.title.toLowerCase(), mov2 = b.title.toLowerCase()
    if (mov1 < mov2) return -1 
    if (mov1 > mov2) return 1
    return 0 
    }), listOptions() });

//Input Change --------------------------------------------------------
$(".list").on('change',  function(event) {
    const { value,  name } = event.target;
    movSelect(value, name)
    $("#" + name).html(value);
    // if(name !== "twitter")btnCheck()
    // let test = list.filter(loc => loc.title.toLowerCase().match(value.toLowerCase()) !== null)
});

//Not Twitter Search ---------------------------------------------------
formNotTwit = (name) => {
    //look up db to see if name is there
    $(".userBgImg, #playerImg").attr("src", "http://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"),
    $("#name").html(name),
    disableCheck.twitter.check = true,

    $("#notTwitInput").fadeOut("1000"),
    // $("#sumText").fadeOut(1500),
    setTimeout( () =>{
        $("#userHeader").fadeIn(1000),
        $("#picks").fadeIn(),
        $("#formCard").animate({height: '730px'}, 3000),
        // $("#formCard").animate({height: '150px'}, 2000),
        $("#reason").fadeOut(1000),
        $("#formSubmit").fadeIn(2000)
        
        setTimeout(() => $("#reason").html(''), 1500);
    }, 1100)    
}
//Twitter Search -------------------------------------------------------
formTwit = (name) =>{
    $.ajax({ url: "/twit/" + name, method: "GET"})
    .done((res) => { 
        res.twitData.img !== "none" ? (
            $(".userBgImg, #playerImg").attr("src", res.twitData.img),
            $("#name").html(res.twitData.name),
            disableCheck.twitter.check = true,

            $("#twitInput").fadeOut("1000"),
            // $("#sumText").fadeOut(1500),
            setTimeout( () =>{
                $("#userHeader").fadeIn(1000),
                $("#picks").fadeIn(),
                $("#formCard").animate({height: '730px'}, 3000),
                // $("#formCard").animate({height: '150px'}, 2000),
                $("#reason").fadeOut(1000),
                $("#formSubmit").fadeIn(2000)
                
                setTimeout(() => $("#reason").html(''), 1500);
            }, 1100)    
        )
        :  (
            disableCheck.twitter.check = false,
            $("#reason").html(disableCheck.twitter.reason).fadeIn(1000)
        )
        btnCheck()
    });
    
}

//moview Selection  ---------------------------------------------------
movSelect = (value, name) => {
    const form = $("#picks").children().children().children()

    disableCheck.dupe.check = true
    //no duplicate movie entries
    form.map((i, data) => {
        form.map((j, data2) =>  
            data2.value === data.value && i !== j && data2.value !== undefined && data.value !== ""
            ? (
                disableCheck.dupe.reason = data.value + " Selected More Than Once.", 
                disableCheck.dupe.check = false    
            )
            :null
        )
    })

     //no empty fields
     disableCheck.empty.check = true
     form.map((i, data) =>
            data.value === ""  && data.value !== undefined
            ? disableCheck.empty.check = false
            : null
     );

    disableCheck.empty.check && disableCheck.dupe.check
    ? (
        console.log("ready"),
        $("#reason").fadeOut(1000)
    )
    : (
        console.log(disableCheck),
        disableCheck.empty.check
        ? null
        : (
            $("#reason").html(disableCheck.empty.reason),
            $("#reason").fadeIn(1000)  
        ),
        disableCheck.dupe.check
        ? null
        : (
            $("#reason").html(disableCheck.dupe.reason),
            $("#reason").fadeIn(1000)
        )
    )
    btnCheck()
}

//Button Check --------------------------------------------------------
btnCheck = () => {
    
    disableCheck.twitter.check && disableCheck.dupe.check && disableCheck.empty.check
    ? (
        $("#formSubmit").attr('disabled', false)
       
    )
    : $("#formSubmit").attr('disabled', true)
}

//Form Submit ---------------------------------------------------------
$("#formSubmit").on('click',  function(event) { 
    event.preventDefault()
    
    let user = new Object({});
    let picksArr = []
    user.picks = new Array()

    //grab all movie picks and place them in picks array
    for(let i = 0; i < 13; i++){  
        picksArr.push($("select[name*='mov"+(i+1)+"']").val())
    }
    
    //place information into object
    twitStatus
    ? user.username = $(".twitter").val().trim()
    : user.username = $(".notTwit").val().trim()

    user.picks = JSON.stringify(picksArr)
    user.twitter = twitStatus

    //create user
    $.ajax({ url: "/api/users", method: "POST", data: user})
        .done((res) => {  
            $("#userHeader").fadeOut(1000)
            $("#picks").fadeOut(1000)
            $("#formCard").animate({height: '170px'}, 3000)
            $("#formSubmit").fadeOut(1000)
            $("#endText").fadeIn(2500)
        });
});

$("#testSubmit").on('click',  function(event) {
    event.preventDefault()

    
})



