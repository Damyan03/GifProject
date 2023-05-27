import './bootstrap';

const form = document.getElementById('searchForm');
form.addEventListener('submit', logJSONData);
let next = "";

async function logJSONData() {
    const gifLoader = document.getElementById("gifLoader");
    let gifRow;

    while (gifLoader.firstChild) {
        gifLoader.removeChild(gifLoader.firstChild);
    }

    // set the apikey and limit
    const apiKey = "AIzaSyBBWKWlLXhTl7r3nInPnAwbwuFRgDql4qo";
    const clientKey = "gifProject";
    const lmt = 25;

    const devider = lmt / 5;
    let count = 0;

    const search_term = document.getElementById('searchBar').value;

    let search_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
            apiKey + "&client_key=" + clientKey + "&limit=" + lmt + "&pos=" + next;

    const response = await fetch(search_url)
    const jsonData = await response.json();

    const gifs = jsonData["results"];

    next = jsonData["next"];

    for (let i = 0; i < 6; i++) {
        gifRow = document.createElement("div");
        gifRow.id = "gifRow";
        gifRow.className = "flex flex-col flex-wrap items-start gap-4";
        gifLoader.appendChild(gifRow);
    }

    for (let i = 0; i < gifs.length; i++) {
        const gifContainer = document.createElement("div");
        gifContainer.id = "gifContainer";
        gifContainer.className = "flex justify-center items-center";

        const gifImage = document.createElement("img");
        gifImage.id =  `${i}`;
        gifImage.src = gifs[i]["media_formats"]["nanogif"]["url"];
        gifImage.alt = search_term + " gif"
        gifImage.width = 220;
        gifImage.height = 164;
        gifImage.className = "rounded-md border-2 border-transparent hover:border-white";

        // gifLoader.appendChild(gifContainer);
        // gifContainer.appendChild(gifImage);
        if (count + 1> devider) {count = 0}
        console.log(count)
        // gifRow = document.querySelectorAll("#gifRow")[count - 1];
        document.querySelectorAll("#gifRow")[count].appendChild(gifContainer);
        gifContainer.appendChild(gifImage);
        count++;
    }
    document.querySelectorAll("#gifContainer").forEach(element => element.addEventListener('click', function () {
        const body = document.getElementsByTagName("body")[0];
        const backgroundDim = document.createElement("div")
        backgroundDim.id = "backgroundDim";
        backgroundDim.className = "fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10";

        const gifLarge = document.createElement("img");
        gifLarge.id = "gif";
        gifLarge.src = gifs[element.firstChild.id]["media_formats"]["gif"]["url"];
        gifLarge.alt = search_term + " gif"
        gifLarge.width = 440;
        gifLarge.height = 328;
        gifLarge.className = "border-2 z-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed";
        body.appendChild(backgroundDim);
        body.appendChild(gifLarge);

        backgroundDim.addEventListener('click', function () {
            body.removeChild(backgroundDim);
            body.removeChild(gifLarge);
        });
    }));
    console.log(jsonData);
}
