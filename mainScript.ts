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
        $.ajax({
            type: "GET",
            url: `https://api.coingecko.com/api/v3/coins/list`,
            success: (result) => {
                console.log(result);
                homeStart(result);
            },
            error: (error) => {
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















});

function moreInfo(coinid:any):any{
    console.log(coinid);
    $.ajax({
        type: "GET",
        url: `https://api.coingecko.com/api/v3/coins/${coinid}`,
        success: (result)=>{
            $("#"+coinid).html(`
            <img src="${result.image.thumb}" />
            <span style="display:block">USD: ${result.market_data.current_price.usd}$</span>
            <span style="display:block">EUR: ${result.market_data.current_price.eur}€</span>
            <span style="display:block">ILS: ${result.market_data.current_price.ils}₪</span>
            `);
        },
        error: (error)=>{

        }
    })
}