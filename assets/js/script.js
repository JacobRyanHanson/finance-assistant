//TODO: Search History
//TODO: Make Forms Work
//TODO: Make Modals Work

// var popup = new Foundation.Reveal($('#exampleModal1'));
// var aboutModal = document.querySelector(".list-item-2")
// var modalbg = document.querySelector(".modal-bg")
// var closeBtn = document.getElementById("close-button")

var featuredArticles = [
    document.querySelector(".article-0"),
    document.querySelector(".article-1"),
    document.querySelector(".article-2"),
    document.querySelector(".article-3")
]

var priceForm = document.querySelector(".price-form");
var exchangeForm = document.querySelector(".exchange-rates-form")

document.addEventListener("click", inputFocusHandler);
priceForm.addEventListener("submit", priceFormSubmitHandler);
exchangeForm.addEventListener("submit", exchangeFormSubmitHandler);

getFeaturedNews();
// Gets featured news.
function getFeaturedNews() {
    let apiUrl = "https://api.polygon.io/v2/reference/news?limit=10&order=descending&sort=published_utc&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data);
                for (var i = 0; i < featuredArticles.length; i++) {
                    featuredArticles[i].setAttribute("href", data.results[i].article_url);
                    featuredArticles[i].setAttribute("target", "_blank");
                    if (data.results[i].image_url) {
                        featuredArticles[i].querySelector(".featured-image").style.backgroundImage = "url('" + data.results[i].image_url + "')";
                    } else {
                        featuredArticles[i].querySelector(".featured-image").style.backgroundImage = "url('./assets/images/piggy-bank-icon.jpg')";
                    }
                    featuredArticles[i].querySelector(".featured-article-title").textContent = data.results[i].title;
                    featuredArticles[i].querySelector(".featured-article-author").textContent = data.results[i].publisher.name;
                }
            });
        }
    });
}

function inputFocusHandler(event) {
    if (event.target.matches(".price-input") || event.target.matches(" .base-input") ||
        event.target.matches(".exchange-input") || event.target.matches(".volume-input")) {
        event.target.value = "";
    }
}

function priceFormSubmitHandler(event) {
    event.preventDefault();
    var priceInput = priceForm.querySelector(".price-input").value.toUpperCase().trim();
    if (priceInput) {
        stockApi(priceInput)
    } else {
        alert("Please enter a stock or cryptocurrency.");
    }
}

function exchangeFormSubmitHandler(event) {
    event.preventDefault();
    var baseInput = exchangeForm.querySelector(".base-input").value.toUpperCase().trim();
    var exchangeInput = exchangeForm.querySelector(".exchange-input").value.toUpperCase().trim();
    var volumeInput = exchangeForm.querySelector(".volume-input").value.toUpperCase().trim();


}


// Gets stock prices.
function stockApi(ticker) {
    let test = false;
    let counter = 1;
    while(!test){
        let testdate = moment().subtract(counter,"days").format('dddd');
        if(testdate === "Sunday" || testdate === "Saturday"){
            counter++
        } else{
            test = true;
        }
    }
    let date = moment().subtract(counter, "days").format('YYYY-MM-DD');
    document.querySelector(".price-date").textContent = "(" + date + ")";
    let apiUrl = `https://api.polygon.io/v1/open-close/${ticker}/${date}?adjusted=true&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg`;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                priceForm.querySelector(".open").textContent = data.open;
                priceForm.querySelector(".high").textContent = data.high;
                priceForm.querySelector(".low").textContent = data.low;
                priceForm.querySelector(".volume").textContent = data.volume;
            });
        } else if (response.status === 404) {
            getCryptoPrice(ticker);
        }
    });
}

// Gets the Crypto Price.
function getCryptoPrice(ticker) {
    let date = moment().subtract(1, "days").format("YYYY-MM-DD");
    let apiUrl = `https://api.polygon.io/v1/open-close/crypto/${ticker}/USD/${date}?adjusted=true&apiKey=bOZCwGtAFurvAO_gqOPxaOvqmw8ALJWg`
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                priceForm.querySelector(".open").textContent = data.open;
                priceForm.querySelector(".high").textContent = "--";
                priceForm.querySelector(".low").textContent = "--";
                priceForm.querySelector(".volume").textContent = "--";
            });
        }
    });
}

function getInfo(coin, exchange, vol) {
    let apiUrl = `https://rest-sandbox.coinapi.io/v1/exchangerate/${coin}?apikey=09391D71-51BB-4594-A7C1-9AE2C45D8099`;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
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
            // window.alert((data.rates[i].rate) * volume)
        }
    }
}

function getPreviousDate() {
    var d = new Date();
    var date = d.getFullYear() + "-";
    date += (d.getMonth() + 1) + "-";
    date += (d.getDate() - 1);
    return date;
}



// // Makes About Modal Visible
// aboutModal.addEventListener('click',function(){
//     modalbg.classList.add("bg-active");
// });
// // Closes About modal
// closeBtn.addEventListener('click',function(){
//     modalbg.classList.remove("bg-active");
// });



// function displayModal(text) {
//     var new_rgba_str = "rgba(215, 54, 29, 1)";

//     $('#warningBox').hide()
//     $('#successBox').hide()
//     $('#alertBox').css("background-color", new_rgba_str);
//     $('#alert').text(text)
//     popup.open();
// }





// var coinType = coinTypeInput.value.toUpperCase().trim();
// var convertType = convertTypeInput.value.toUpperCase().trim();
// var volume = parseFloat(volumeInput.value);

// if (coinType) {
//     if (convertType) {
//         if (typeof (volume) === "number" && volume > 0) {
//             getInfo(coinType, convertType, volume);
//         } else {
//             // alert("Please enter a valid amount!");
//             displayModal("Please enter a valid amount!")
//         }
//     } else {
//         //alert("Please enter a valid stock or cryptocurrecty converstion!")
//         displayModal("Please enter a valid stock or cryptocurrecty converstion!")
//     }
// } else {
//     //alert("Please enter a valid stock or cryptocurrency!");
//     displayModal("Please enter a valid stock or cryptocurrency!")
// }