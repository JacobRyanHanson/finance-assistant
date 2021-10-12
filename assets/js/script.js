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

    if (baseInput && exchangeInput && volumeInput) {
        if (parseFloat(volumeInput)) {
            getInfo(baseInput, exchangeInput, volumeInput);
        } else {
            alert("Please enter a number for Conversion Amount")
        }
    } else {
        alert("Please fill all inputs in the form")
    }
}

// Gets stock prices.
function stockApi(ticker) {
    let apiUrl = "https://api.polygon.io/v1/open-close/" + ticker + "/" + getPreviousDate() + "?adjusted=true&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data);
                priceForm.querySelector(".close").textContent = "$" + data.close.toFixed(2);
                priceForm.querySelector(".high").textContent = "$" + data.high.toFixed(2);
                priceForm.querySelector(".low").textContent = "$" + data.low.toFixed(2);
                priceForm.querySelector(".volume").textContent = data.volume.toFixed(2);
            });
        } else if (response.status === 404) {
            getCryptoPrice(ticker);
        } else {
            alert("Unexpected Error")
        }
    }).catch(function () {
        alert("Unable to connect to Polygon");
    });
}

// Gets the Crypto Price.
function getCryptoPrice(ticker) {
    let apiUrl = "https://api.polygon.io/v1/open-close/crypto/" + ticker + "/USD/" + getPreviousDate() + "?adjusted=true&apiKey=rSbWvupXYcUkBP6mLKFppfHMRHKEmL1p"
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (data.close > 0) {
                    priceForm.querySelector(".close").textContent = "$" + data.close.toFixed(2);
                    priceForm.querySelector(".high").textContent = "--";
                    priceForm.querySelector(".low").textContent = "--";
                    priceForm.querySelector(".volume").textContent = "--";
                } else {
                    alert("Not found");
                } 
            });
        } else {
            alert("Unexpected Error");
        }
    }).catch(function () {
        alert("Unable to connect to Polygon");
    });
}

function getInfo(coin, exchange, vol) {
    let apiUrl = "https://rest-sandbox.coinapi.io/v1/exchangerate/" + coin + "?apikey=09391D71-51BB-4594-A7C1-9AE2C45D8099";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
                if (data.rates.length === 0) {
                    alert("Did not regonise Cryptocurrency (Base)");
                } else {
                    var updated = false;
                    for (let i = 0; i < data.rates.length; i++) {
                        if (exchange === data.rates[i].asset_id_quote) {
                            document.querySelector(".exchange-rates-flex-container p").className = "border-visable";
                            document.querySelector(".base-amount").textContent = vol + " ";
                            document.querySelector(".base").textContent = coin + " = ";
                            document.querySelector(".exchange-amount").textContent = (data.rates[i].rate * vol).toFixed(2) + " ";
                            document.querySelector(".exchange").textContent = exchange;
                            updated = true;
                        }
                    }
                    if (!updated) {
                        alert("Did not regonise Cryptocurrency (Exchange)")
                    }
                }
            });
        } else {
            alert("Unexpected error")
        }
    }).catch(function () {
        alert("Unable to connect to Sandbox");
    });
}

function getPreviousDate() {
    var d = new Date();
    var date = d.getFullYear() + "-";
    date += (d.getMonth() + 1) + "-";
    date += (d.getDate() - 1);
    return date;
}
//----------------------------------------------------------------------------------------------------------


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