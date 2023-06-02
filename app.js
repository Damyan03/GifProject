let next = "";

const apiKey = 'AIzaSyAi-yrQp7mZDSc29iHCukccaLzMnaHE9Qo';

const clientKey = "gifProject";
let lmt = 50;

const column = 5;

let urlParams = new URLSearchParams(window.location.search);
const searchContainer = document.getElementById("searchContainer")

window.addEventListener("load", (() => {
    window.addEventListener("scroll", handleInfiniteScroll);

    const  gifLoader = document.getElementById("gifLoader");

    const form = document.getElementById('searchForm');
    form.addEventListener('submit', loadSearchGifsInitial);

    document.getElementById('searchBar').addEventListener('input', function () {
        loadSuggestions().then(() => console.log("Suggestions Loaded"));
    });

    for (let i = 0; i < column; i++) {
        const gifRow = document.createElement("div");
        gifRow.id = "gifRow";
        gifRow.className = "flex flex-col flex-wrap items-start gap-4";
        gifLoader.appendChild(gifRow);
    }
    loadFeaturedGifs().then(() => console.log("Featured Gifs Loaded"));
    loadTrendingSuggestion().then(() => console.log("Trending Suggestions Loaded"));
}));

async function loadSuggestions(){
    const searchContainer = document.getElementById('searchContainer');
    while (searchContainer.firstChild) {
        searchContainer.removeChild(searchContainer.firstChild);
    }

    lmt = 8;
    const psearch_term = document.getElementById('searchBar').value;
    const request = "https://tenor.googleapis.com/v2/search_suggestions?key=" + apiKey + "&client_key=" + clientKey + "&q=" + psearch_term + "&limit=" + lmt;

    const response = await fetch(request);
    const jsonData = await response.json();

    const suggestions = jsonData["results"];

    createSuggestions(suggestions)
}
async function loadTrendingSuggestion(){
    const searchContainer = document.getElementById('searchContainer');
    while (searchContainer.firstChild) {
        searchContainer.removeChild(searchContainer.firstChild);
    }

    lmt = 8;
    const request = "https://tenor.googleapis.com/v2/trending_terms?key=" + apiKey + "&client_key=" + clientKey + "&limit=" + lmt;

    const response = await fetch(request);
    const jsonData = await response.json();

    const suggestions = jsonData["results"];

    createSuggestions(suggestions)
}

function createSuggestions(suggestions){
    const searchContainer = document.getElementById('searchContainer');
    for (let i = 0; i < suggestions.length; i++) {
        const suggestionContainer = document.createElement("div");
        suggestionContainer.id = "suggestionContainer";
        suggestionContainer.className = "flex justify-center items-center w-full h-10 bg-gray-800 rounded-md hover:bg-gray-900 cursor-pointer";

        const suggestionText = document.createElement("p");
        suggestionText.id = suggestions[i];
        suggestionText.className = "text-white p-2 text-sm text-center";
        suggestionText.innerHTML = suggestions[i];

        suggestionContainer.appendChild(suggestionText);
        searchContainer.appendChild(suggestionContainer);
    }

    document.querySelectorAll("#suggestionContainer").forEach(function (suggestionContainer) {
        suggestionContainer.addEventListener('click', function () {
            document.getElementById('searchBar').value = suggestionContainer.firstChild.innerHTML;
            loadSearchGifsInitial().then(() => console.log("Search Gifs Loaded"));
        });
    });
}
async function loadSearchGifsInitial() {
    lmt = 50;
    next = "";

    let search_term = document.getElementById('searchBar').value;

    if (search_term[0] === "-") {
        search_term = search_term.replace("-", "");
    }
    // Clear the existing GIFs
    clearGifs();

    let search_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
        apiKey + "&client_key=" + clientKey + "&limit=" + lmt + "&media_filter=gif,nanogif,nanomp4" + "&pos=" + next;

    window.history.replaceState('', '', "?q=" + search_term);

    const response = await fetch(search_url);
    const jsonData = await response.json();

    let gifs = jsonData["results"];

    next = jsonData["next"];
    console.log(gifs)

    createGifs(gifs);
}
async function loadSearchGifs() {
    lmt = 50;

    let search_url = "https://tenor.googleapis.com/v2/search?q=" + urlParams.get('q') + "&key=" +
        apiKey + "&client_key=" + clientKey + "&limit=" + lmt + "&media_filter=gif,nanogif,nanomp4" + "&pos=" + next;

    const response = await fetch(search_url)
    const jsonData = await response.json();


    let gifs = jsonData["results"];

    next = jsonData["next"];

    createGifs(gifs)
}

async function loadFeaturedGifs(){
    event.preventDefault();
    lmt = 50;

    const featured_url = "https://tenor.googleapis.com/v2/featured?key=" + apiKey + "&client_key=" + clientKey + "&limit=" + lmt + "&media_filter=gif,nanogif,nanomp4" + "&pos=" + next;

    window.history.replaceState("", "", "?q=" + "featured");

    const response = await fetch(featured_url)
    const jsonData = await response.json();

    const gifs = jsonData["results"];

    next = jsonData["next"];

    console.log(gifs)
    createGifs(gifs)
}
const handleInfiniteScroll = () => {
    urlParams = new URLSearchParams(window.location.search);
    const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if (endOfPage) {
    console.log('what');
        if(urlParams.get('q') === "featured") {
            loadFeaturedGifs().then(() => console.log("loadFeaturedGifs at handleInfiniteScroll"));
        } else {
            loadSearchGifs().then(() => console.log("loadSearchGifs at handleInfiniteScroll"));
        }
    }
};

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

        if (count > column-1) {
            count = 0
        }
        document.querySelectorAll("#gifRow")[count].appendChild(gifContainer);
        gifContainer.appendChild(gifImage);

        count++;

        const enlargeContainer = document.getElementById('enlargeContainer')
        gifContainer.addEventListener('click', function () {
            enlargeContainer.className = "w-full h-full fixed flex justify-center items-center"

            const backgroundDim = document.createElement("div");
            backgroundDim.id = "backgroundDim";
            backgroundDim.className = "bg-black opacity-70 z-10 w-full h-full fixed flex justify-center items-center";
            enlargeContainer.appendChild(backgroundDim);

            const enlargeContainerInfoContainer = document.createElement("div");
            enlargeContainerInfoContainer.id = "enlargeContainerInfoContainer";
            enlargeContainerInfoContainer.className = "h-auto w-full flex flex-col flex-wrap items-center justify-center p-3 gap-3 z-20";
            enlargeContainer.appendChild(enlargeContainerInfoContainer);

            const gifNameContainer = document.createElement("div");
            gifNameContainer.id = "gifNameContainer";
            gifNameContainer.className = "h-10 flex justify-center items-center";
            enlargeContainerInfoContainer.appendChild(gifNameContainer);
            {
                const gifName = document.createElement("p");
                gifName.id = "gifName";
                gifName.className = "text-center text-2xl font-bold text-white";
                gifName.style.textShadow = "2px 2px 4px #000000";
                gifName.innerHTML = gifs[i]["content_description"];
                gifNameContainer.appendChild(gifName);
            }
            const gifImageContainer = document.createElement("div");
            gifImageContainer.id = "gifImageContainer";
            gifImageContainer.className = "w-auto h-auto flex-grow";
            enlargeContainerInfoContainer.appendChild(gifImageContainer);
            {
                const gifImage = document.createElement("img");
                gifImage.id = "gifImage";
                gifImage.src = gifs[i]["media_formats"]["gif"]["url"];
                gifImage.className = "border-2 w-full h-full rounded-xl";
                gifImageContainer.appendChild(gifImage);
            }
            const gifTagsContainer = document.createElement("div");
            gifTagsContainer.id = "gifTagsContainer";
            gifTagsContainer.className = "flex flex-row w-4/6 justify-center items-center gap-5 pl-5 pr-5";
            enlargeContainerInfoContainer.appendChild(gifTagsContainer);
            {
                for (let j = 0; j < gifs[i]["tags"].length; j++) {
                    const gifTagSpecificContainer = document.createElement("p");
                    gifTagSpecificContainer.id = "gifTagSpecificContainer";
                    gifTagSpecificContainer.className = "flex justify-center items-center w-4/6 h-10 bg-gray-600 rounded-md hover:bg-gray-900 cursor-pointer";
                    gifTagsContainer.appendChild(gifTagSpecificContainer);

                    const gifTag = document.createElement("p");
                    gifTag.id = "gifTag";
                    gifTag.className = "text-white p-2 text-sm text-center";
                    gifTag.innerHTML = gifs[i]["tags"][j];
                    gifTagSpecificContainer.appendChild(gifTag);

                    gifTagSpecificContainer.addEventListener("click", function (){
                        window.history.replaceState("", "", "?q=" + gifs[i]["tags"][j]);
                        document.getElementById('searchBar').value = gifs[i]["tags"][j];
                        loadSearchGifsInitial();
                    });
                }
            }

            const linkContainer = document.createElement("div");
            linkContainer.id = "linkContainer";
            linkContainer.className = "h-10 w-1/2 flex flex-row rounded-md bg-gray-900";
            enlargeContainerInfoContainer.appendChild(linkContainer);
            {
                const copyLinkContainer = document.createElement("div");
                copyLinkContainer.id = "copyLinkContainer";
                copyLinkContainer.className = "w-40 h-full bg-gray-700 flex justify-center items-center rounded-md border-white cursor-pointer hover:bg-gray-800 ";
                linkContainer.appendChild(copyLinkContainer);

                const copyLink = document.createElement("p");
                copyLink.id = "copyLink";
                copyLink.className = "text-center text-small text-white";
                copyLink.innerHTML = "Copy Link";
                copyLinkContainer.appendChild(copyLink);

                copyLinkContainer.addEventListener("click", function (){
                    navigator.clipboard.writeText(gifs[i]["media_formats"]["gif"]["url"]);
                    copyLink.innerHTML = "Copied!";
                })

                const linkBarContainer = document.createElement("div");
                linkBarContainer.id = "linkContainer";
                linkBarContainer.className = "h-full flex-grow flex justify-center items-center";
                linkContainer.appendChild(linkBarContainer);
                {
                    const linkBar = document.createElement("p");
                    linkBar.id = "linkBar";
                    linkBar.className = "text-center text-gray-300 text-sm select-text";
                    linkBar.innerHTML = gifs[i]["media_formats"]["gif"]["url"];
                    linkBarContainer.appendChild(linkBar);
                }
            }

            const detailsContainer = document.createElement("div");
            detailsContainer.id = "detailsContainer";
            detailsContainer.className = "w-1/6 h-32 flex flex-col gap-1 p-1";
            enlargeContainerInfoContainer.appendChild(detailsContainer);
            {
                for (let j = 0; j < 4; j++) {
                    const detailsSpecificContainer = document.createElement("div");
                    detailsSpecificContainer.id = "detailsSpecificContainer";
                    detailsSpecificContainer.className = "h-full w-full";
                    detailsContainer.appendChild(detailsSpecificContainer);
                    {
                        const detailsSpecific = document.createElement("p");
                        detailsSpecific.id = "detailsSpecific";
                        detailsSpecific.className = "text-center text-white text-sm";
                        switch(j) {
                            case 0:
                                detailsSpecific.innerHTML = `Duration: ${gifs[i]["media_formats"]["nanomp4"]["duration"]} seconds`;
                                break;
                            case 1:
                                detailsSpecific.innerHTML = `Width: ${gifs[i]["media_formats"]["gif"]["dims"]["0"]}x${gifs[i]["media_formats"]["gif"]["dims"]["1"]}`;
                                break;
                            case 2:
                                detailsSpecific.innerHTML = `Size: ${Math.round(gifs[i]["media_formats"]["gif"]["size"]/1024)}KB`;
                                break;
                            case 3:
                                const dateCreated = new Date(gifs[i]["created"]*1000);
                                detailsSpecific.innerHTML = `Created: ${dateCreated.toLocaleString()}`;
                        }
                        detailsSpecificContainer.appendChild(detailsSpecific);
                    }
                }
            }

            enlargeContainer.addEventListener('click', function () {
                if (event.target === enlargeContainerInfoContainer || event.target === backgroundDim) {
                    enlargeContainer.className = "w-full h-full fixed flex justify-center items-center invisible";
                    enlargeContainerInfoContainer.remove();
                    backgroundDim.remove();
                }
            });
        });
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


