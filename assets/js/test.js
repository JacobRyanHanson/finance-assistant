// the following code block is for testing error handling modal
// var alertBox = $('#alert')

// console.log(alertBox);
// let apiUrl = "hps://api.polygon.io/v3/reference/tickers?ticker=BTC&active=true&sort=ticker&order=asc&limit=10&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg";
//     fetch(apiUrl)
//     .then(function(response) {
//         if (!response.ok) {
//             throw Error(response.statusText);
//         }
//         return response;
//     }).then(function(response) {
//         console.log("ok");
//     }).catch(function(error) {
//         displayModal(error);
//         console.log(error);        
//     });

    var modalUrl = "https://api.polygon.io/v3/reference/tickers?ticker=A&market=stocks&active=true&sort=ticker&order=asc&limit=10&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p"
fetch(modalUrl)
.then(function (response) {
    if (response.ok) {
        console.log(response)
        response.json().then(function(data) {
            console.log(data)
        })
    }
})