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

   
function addHistory(data){

    

    var html = $(`<div class="product-card">
    <div class="product-card-thumbnail">
    <h1>${data.symbol}</h1>
    </div>
    <ul class="card-list">
    <li>
        <h2 class="product-card-title">Date: ${data.from}</h2>
    </li>
    <li>
        <h2 class="product-card-title">Close: ${data.close}</h2>
    </li>
    <li>
        <h2 class="product-card-title">High: ${data.high}</h2>
    </li>
    <li>
        <h2 class="product-card-title">Low: ${data.low}</h2>
    </li>
    <li>
        <h2 class="product-card-title">Open: ${data.open}</h2>
    </li>
    </ul>
    `)
    $('#test').append(html)
    }

    $("#previous-close-price-form").submit(function(event) {
        var inputTest = $(".input-group-field").val().toUpperCase().trim()
        console.log(inputTest)
        event.preventDefault()

        var todayDate = new Date().toISOString().slice(0, 10);
    console.log(todayDate);

        var modalUrl = `https://api.polygon.io/v1/open-close/${inputTest}/2021-10-12?adjusted=true&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p`
        // https://api.polygon.io/v1/open-close/${inputTest}/${todayDate}?adjusted=true&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p
        fetch(modalUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response)
                response.json().then(function(data) {
                    console.log(data)
                    addHistory(data)
                })
            }
        })
    })