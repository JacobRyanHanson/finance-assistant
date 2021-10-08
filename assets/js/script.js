var coinTypeInput = document.querySelector(".coin-type");
var volumeInput = document.querySelector(".volume");
var form = document.addEventListener("submit", formSubmitHandler);


function formSubmitHandler(event) {
    event.preventDefault();
    var coinType = coinTypeInput.value.toUpperCase().trim();
    var volume = parseFloat(volumeInput.value);
    
    if (coinType) {
        coinType = coinType.split(" ");
        if (typeof(volume) === "number" && volume !== 0) {
            getInfo(coinType[0], coinType[1], volume);
        } else {
            alert("Please enter a valid amount!");
        }
    } else {
        alert("Please enter a cryptocurrency!");
    }
}

let getInfo = function (coin, exchange, vol) {
    let apiUrl = `https://rest-sandbox.coinapi.io/v1/exchangerate/${coin}?apikey=09391D71-51BB-4594-A7C1-9AE2C45D8099`;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    display(data, exchange, vol);

                })
            }
        })
}
let display = function (data, coin, volume) {
    let exchange = coin;
    for (let i = 0; i < data.rates.length; i++) {
        if (exchange == data.rates[i].asset_id_quote) {
            // dynamicly put the result on the page instead of window alert
            window.alert((data.rates[i].rate) * volume)
        }
    }
}

let stockApi = function () {}
stockApi();