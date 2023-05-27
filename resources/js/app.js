import './bootstrap';
import {list} from "postcss";

const form = document.getElementById('searchForm');
form.addEventListener('submit', loadSearchGifsInitial);

let next = "";

const apiKey = "AIzaSyBBWKWlLXhTl7r3nInPnAwbwuFRgDql4qo";
const clientKey = "gifProject";
let lmt = 25;

const gifLoader = document.getElementById("gifLoader");
const body = document.getElementsByTagName("body")[0];
const column = 5;
const divider = lmt / column;

const urlParams = new URLSearchParams(window.location.search);

createGifRows();

window.addEventListener("load", (event) => {
    // if(urlParams.get('q') === "featured") {
    //     loadFeaturedGifs();
    // } else {
    //     window.history.replaceState(null, null, "?q=" + urlParams.get('q'));
    //     console.log(urlParams.get('q'))
    //     loadSearchGifsInitial();
    // }
    loadFeaturedGifs();
});

async function loadSearchGifsInitial() {
    const search_term = document.getElementById('searchBar').value;
    next = "";

    // Clear the existing GIFs
    clearGifs();

    let search_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
        apiKey + "&client_key=" + clientKey + "&limit=" + lmt + "&pos=" + next;

    window.history.replaceState(null, null, "?q=" + search_term);



    const response = await fetch(search_url);
    const jsonData = await response.json();

    let gifs = jsonData["results"];

    next = jsonData["next"];

    createGifs(gifs);
}

async function loadSearchGifs() {

    let search_url = "https://tenor.googleapis.com/v2/search?q=" + urlParams.get('q') + "&key=" +
        apiKey + "&client_key=" + clientKey + "&limit=" + lmt + "&pos=" + next;

    const response = await fetch(search_url)
    const jsonData = await response.json();


    let gifs = jsonData["results"];

    next = jsonData["next"];

    createGifs(gifs)
}

async function loadFeaturedGifs(){
    // lmt = 25;
    const featured_url = "https://tenor.googleapis.com/v2/featured?key=" + apiKey + "&client_key=" + clientKey + "&limit=" + lmt + "&pos=" + next;

    window.history.pushState("", "", "?q=" + "featured");

    const response = await fetch(featured_url)
    const jsonData = await response.json();

    const gifs = jsonData["results"];

    next = jsonData["next"];

    createGifs(gifs)
}

function createGifRows() {
    for (let i = 0; i < column; i++) {
        const gifRow = document.createElement("div");
        gifRow.id = "gifRow";
        gifRow.className = "flex flex-col flex-wrap items-start gap-4";
        gifLoader.appendChild(gifRow);
    }
}


function clearGifs() {
    const gifRows = document.querySelectorAll("#gifRow");
    gifRows.forEach(function (gifRow) {
        while (gifRow.firstChild) {
            gifRow.removeChild(gifRow.firstChild);
        }
    });
}

function createGifs(gifs) {
    let count = 0;

    for (let i = 0; i < gifs.length; i++) {
        const gifContainer = document.createElement("div");
        gifContainer.id = "gifContainer";
        gifContainer.className = "flex justify-center items-center";

        const gifImage = document.createElement("img");
        gifImage.id =  gifs[i]["id"];
        gifImage.src = gifs[i]["media_formats"]["nanogif"]["url"];
        gifImage.width = 220;
        gifImage.height = 164;
        gifImage.className = "rounded-md border-2 border-transparent hover:border-white";

        if (count + 1> divider) {count = 0}

        document.querySelectorAll("#gifRow")[count].appendChild(gifContainer);
        gifContainer.appendChild(gifImage);

        count++;

        gifContainer.addEventListener('click', function () {

            const gifLarge = document.createElement("img");
            gifLarge.id = "gif_large";
            gifLarge.src = gifs[i]["media_formats"]["gif"]["url"];
            gifLarge.width = 440;
            gifLarge.height = 328;
            gifLarge.className = "border-2 z-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed";
            body.appendChild(gifLarge);

            document.getElementById('backgroundDim').className = "fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10 visible";

            const backgroundDim = document.getElementById('backgroundDim');

            backgroundDim.addEventListener('click', function () {
                backgroundDim.className = "fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10 invisible";
                gifLarge.remove();
            });
        });
    }
}

const handleInfiniteScroll = () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage) {
        console.log(urlParams.get('q'))
        if(urlParams.get('q') === "featured") {
            console.log("loadFeaturedGifs at handleInfiniteScroll")
            loadFeaturedGifs();
        } else {
            console.log("loadSearchGifs at handleInfiniteScroll")
            loadSearchGifs();
        }
    }
};


window.addEventListener("scroll", handleInfiniteScroll);
