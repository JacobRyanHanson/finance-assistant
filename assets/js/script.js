var run = $(document).foundation();

var alertBox = $('#alert')
console.log(alertBox);
let apiUrl = "hps://api.polygon.io/v3/reference/tickers?ticker=BTC&active=true&sort=ticker&order=asc&limit=10&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg";
    fetch(apiUrl)


    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }).then(function(response) {
        console.log("ok");
    }).catch(function(error) {
       update(error);
        console.log(error);        
    });

    var update = function(error) {
			
			
			var new_rgba_str ="rgba(215, 54, 29, 1)";	
             

            alertBox.text(error)
            .css("background-color",new_rgba_str);
     
		}