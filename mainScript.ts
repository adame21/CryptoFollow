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

        function homeStart(coins: any[]): void {
            var divcreate = document.createElement("div");

            for (var i = 0; i < 100; i++) {
                console.log(coins[i]);
                divcreate.innerHTML += `
            <div class="card text-dark bg-primary mb-3 makeinline" style="max-width: 18rem;">
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
                    <div class="flexalign">
                        <h5 class="card-title coinname">${coins[i].name}</h5>
                        <button type="button" class="btn btn-secondary">More info</button>
                    </div>
                </div>
            </div>`;
                $("#pagecont").append(divcreate);



            }
        }

    }















})