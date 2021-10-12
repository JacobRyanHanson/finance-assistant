// the following code block is for testing error handling modal
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
        displayModal(error);
        console.log(error);        
    });