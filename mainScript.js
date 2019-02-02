$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "Pages/Main.html",
        success: function (result) {
            $("#navcont").append(result);
            getCoins();
        },
        error: function (error) {
            $("#navcont").html("Failed to retrieve navbar, check for missing files, error code:" + error.statusText + error.status);
        }
    });
    function getCoins() {
        startLoader();
        $.ajax({
            type: "GET",
            url: "https://api.coingecko.com/api/v3/coins/list",
            success: function (result) {
                stopLoader();
                console.log(result);
                homeStart(result);
            },
            error: function (error) {
                stopLoader();
                $("#pagecont").html("Could not retrieve data from api error:" + error.statusText + error.status);
            }
        });
    }
    function homeStart(coins) {
        var divcreate = document.createElement("div");
        for (var i = 0; i < 100; i++) {
            console.log(coins[i]);
            divcreate.innerHTML += "\n            <div class=\"card text-dark bg-primary m-auto makeinline\" id=\"" + coins[i].id + i + "\" style=\"max-width: 18rem;\">\n                <div class=\"card-header\">\n                    <div class=\"flexalign\">\n                        <span class=\"coinsymbol\">" + coins[i].symbol + "</span>\n                        <label class=\"switch\">\n                            <input type=\"checkbox\">\n                            <span class=\"slider round\"></span>\n                        </label>\n                    </div>\n                </div>\n                <div class=\"card-body\">\n                    <div class=\"\">\n                        <h5 class=\"card-title coinname\">" + coins[i].name + "</h5>\n                        <button type=\"button\" class=\"btn btn-secondary\" data-toggle=\"collapse\" href=\"#collapseExample" + i + "\" role=\"button\"\n                        aria-expanded=\"false\" aria-controls=\"collapseExample" + i + "\" onclick=\"moreInfo('" + coins[i].id + "')\">More info</button>\n                    </div>\n                </div>\n                <div class=\"collapse\" id=\"collapseExample" + i + "\">\n                    <div class=\" card-body\" id=\"" + coins[i].id + "\">\n                        \n                    </div>\n                </div>\n            </div>";
            $("#pagecont").append(divcreate);
        }
    }
    function startLoader() {
        $("#pagecont").append("\n        <div class=\"d-flex justify-content-center\" id=\"loadingcircle\">\n        <div class=\"spinner-border text-primary\" role=\"status\">\n        <span class=\"sr-only\">Loading...</span>\n        </div>\n        </div>\n        ");
    }
    function stopLoader() {
        $("#loadingcircle").remove();
    }
});
function moreInfo(coinid) {
    var coin = JSON.parse(localStorage.getItem(coinid));
    // console.log(coin.time);
    if (coin != null) {
        console.log("local storage is not null amigo");
        if (coin.time + 120000 < Date.now()) {
            console.log("shit man this data is too old now lemme get a fresh copy");
            startInfoLoader(coinid);
            $.ajax({
                type: "GET",
                url: "https://api.coingecko.com/api/v3/coins/" + coinid,
                success: function (result) {
                    stopInfoLoader(coinid);
                    result.time = Date.now();
                    localStorage.setItem(coinid, JSON.stringify(result));
                    var usdprice = Math.floor(result.market_data.current_price.usd * 10000) / 10000;
                    var eurprice = Math.floor(result.market_data.current_price.eur * 10000) / 10000;
                    var ilsprice = Math.floor(result.market_data.current_price.ils * 10000) / 10000;
                    $("#" + coinid).html("\n                    <img src=\"" + result.image.small + "\" />\n                    <span class=\"displaycurrency\">USD: " + usdprice.toFixed(4) + "$</span>\n                    <span class=\"displaycurrency\">EUR: " + eurprice.toFixed(4) + "\u20AC</span>\n                    <span class=\"displaycurrency\">ILS: " + ilsprice.toFixed(4) + "\u20AA</span>\n                    ");
                },
                error: function (error) {
                    $("#" + coinid).html("\n                    Could not retrieve data from api error:" + error.statusText + error.status + "\n                    ");
                }
            });
        }
        //This else is in case the information existing in localstorage isnt too old (2 minutes is the cutoff)
        else {
            console.log("why go to the store when we have perfectly good data already here");
            var usdprice = Math.floor(coin.market_data.current_price.usd * 10000) / 10000;
            var eurprice = Math.floor(coin.market_data.current_price.eur * 10000) / 10000;
            var ilsprice = Math.floor(coin.market_data.current_price.ils * 10000) / 10000;
            $("#" + coinid).html("\n            <img src=\"" + coin.image.small + "\" />\n            <span class=\"displaycurrency\">USD: " + usdprice.toFixed(4) + "$</span>\n            <span class=\"displaycurrency\">EUR: " + eurprice.toFixed(4) + "\u20AC</span>\n            <span class=\"displaycurrency\">ILS: " + ilsprice.toFixed(4) + "\u20AA</span>\n            ");
        }
    }
    //This else is in case whats in localstorage is null(it is checked by ID)
    else {
        console.log("there is nothing with the correct id in the localstorage so ima get you a fresh copy of all those coins and shit");
        startInfoLoader(coinid);
        $.ajax({
            type: "GET",
            url: "https://api.coingecko.com/api/v3/coins/" + coinid,
            success: function (result) {
                stopInfoLoader(coinid);
                result.time = Date.now();
                localStorage.setItem(coinid, JSON.stringify(result));
                var usdprice = Math.floor(result.market_data.current_price.usd * 10000) / 10000;
                var eurprice = Math.floor(result.market_data.current_price.eur * 10000) / 10000;
                var ilsprice = Math.floor(result.market_data.current_price.ils * 10000) / 10000;
                $("#" + coinid).html("\n                <img src=\"" + result.image.small + "\" />\n                <span class=\"displaycurrency\">USD: " + usdprice.toFixed(4) + "$</span>\n                <span class=\"displaycurrency\">EUR: " + eurprice.toFixed(4) + "\u20AC</span>\n                <span class=\"displaycurrency\">ILS: " + ilsprice.toFixed(4) + "\u20AA</span>\n                ");
            },
            error: function (error) {
                $("#" + coinid).html("\n                Could not retrieve data from api error:" + error.statusText + error.status + "\n                ");
            }
        });
    }
    // $.ajax({
    //     type: "GET",
    //     url: `https://api.coingecko.com/api/v3/coins/${coinid}`,
    //     success: (result) => {
    //         stopInfoLoader(coinid);
    //         result.time = Date.now();
    //         localStorage.setItem(coinid, JSON.stringify(result));
    //         var usdprice = Math.floor(result.market_data.current_price.usd * 10000) / 10000;
    //         var eurprice = Math.floor(result.market_data.current_price.eur * 10000) / 10000;
    //         var ilsprice = Math.floor(result.market_data.current_price.ils * 10000) / 10000;
    //         $("#" + coinid).html(`
    //         <img src="${result.image.small}" />
    //         <span class="displaycurrency">USD: ${usdprice.toFixed(4)}$</span>
    //         <span class="displaycurrency">EUR: ${eurprice.toFixed(4)}€</span>
    //         <span class="displaycurrency">ILS: ${ilsprice.toFixed(4)}₪</span>
    //         `);
    //     },
    //     error: (error) => {
    //         $("#" + coinid).html(`
    //         Could not retrieve data from api error:${error.statusText}${error.status}
    //         `)
    //     }
    // })
}
function startInfoLoader(coinid) {
    $("#" + coinid).append("\n    <div class=\"d-flex justify-content-center\" id=\"loadingcircle" + coinid + "\">\n    <div class=\"spinner-border\" role=\"status\">\n    <span class=\"sr-only\">Loading...</span>\n    </div>\n    </div>\n    ");
}
function stopInfoLoader(coinid) {
    $("#loadingcircle" + coinid).remove();
}
