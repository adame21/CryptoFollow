$(document).ready(function () {


    $.ajax({
        type: "GET",
        url: "Pages/Main.html",
        success: (result) => {
            $("#navcont").append(result);
            getCoins();
        },
        error: (error) => {
            $("#navcont").html(`Failed to retrieve navbar, check for missing files, error code:${error.status}${error.statusText}`);
        }
    })


    function getCoins(): void {
        startLoader();
        $.ajax({
            type: "GET",
            url: `https://api.coingecko.com/api/v3/coins/list`,
            success: (result) => {
                stopLoader();
                console.log(result);
                homeStart(result);
            },
            error: (error) => {
                stopLoader();
                console.log(error.status);
            }




        })
    }
    function homeStart(coins: any[]): void {
        var divcreate = document.createElement("div");

        for (var i = 0; i < 100; i++) {
            console.log(coins[i]);
            divcreate.innerHTML += `
            <div class="card text-dark bg-primary m-auto makeinline" id="${coins[i].id}${i}" style="max-width: 18rem;">
                <div class="card-header">
                    <div class="flexalign">
                        <span class="coinsymbol">${coins[i].symbol}</span>
                        <label class="switch">
                            <input type="checkbox">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
                <div class="card-body">
                    <div class="">
                        <h5 class="card-title coinname">${coins[i].name}</h5>
                        <button type="button" class="btn btn-secondary" data-toggle="collapse" href="#collapseExample${i}" role="button"
                        aria-expanded="false" aria-controls="collapseExample${i}" onclick="moreInfo('${coins[i].id}')">More info</button>
                    </div>
                </div>
                <div class="collapse" id="collapseExample${i}">
                    <div class=" card-body" id="${coins[i].id}">
                        
                    </div>
                </div>
            </div>`;
            $("#pagecont").append(divcreate);



        }


    }


    function startLoader() {
        $("#pagecont").append(`
        <div class="d-flex justify-content-center" id="loadingcircle">
        <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
        </div>
        </div>
        `);
    }
    function stopLoader() {
        $("#loadingcircle").remove();
    }











});

function moreInfo(coinid: any): void {
    startInfoLoader(coinid);
    $.ajax({
        type: "GET",
        url: `https://api.coingecko.com/api/v3/coins/${coinid}`,
        success: (result) => {
            stopInfoLoader(coinid);
            var usdprice = Math.floor(result.market_data.current_price.usd * 10000) / 10000;
            var eurprice = Math.floor(result.market_data.current_price.eur * 10000) / 10000;
            var ilsprice = Math.floor(result.market_data.current_price.ils * 10000) / 10000;
            $("#" + coinid).html(`
            <img src="${result.image.small}" />
            <span class="displaycurrency">USD: ${usdprice.toFixed(4)}$</span>
            <span class="displaycurrency">EUR: ${eurprice.toFixed(4)}€</span>
            <span class="displaycurrency">ILS: ${ilsprice.toFixed(4)}₪</span>
            `);
        },
        error: (error) => {
            $("#" + coinid).html(`
            Could not retrieve data from api error:${error.status}${error.statusText}    
            `)
        }
    })
}

function startInfoLoader(coinid: any){
    $("#"+coinid).append(`
    <div class="d-flex justify-content-center" id="loadingcircle${coinid}">
    <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
    </div>
    </div>
    `);
}
function stopInfoLoader(coinid:any){
    $(`#loadingcircle${coinid}`).remove();
}