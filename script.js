let allEpisodes = [];
let allTVShows = [];
let showID = 82
async function setup() {

  await getTVShows();
  displayShows(allTVShows);
  presentEpisodesOfShow();

}

//This function gets the episodes data from the API
//level 300
async function getEpisodes(showID) {
  try {

    const response = fetch(`https://api.tvmaze.com/shows/${showID}/episodes`);
    const result = await (await response).json();
    allEpisodes = result;
    // console.log(`Fetched episodes for showID: ${showID}`, allEpisodes);
  } catch (error) {
    alert("An error has occured with fetching episode data from the API", error);
    console.error("There is an error: ", error);
    displayShows(allTVShows)
  }
}

//This function gets the TV showdata from the API
//level 400
async function getTVShows() {
  try {

    const response = fetch(`https://api.tvmaze.com/shows`);
    const result = await (await response).json();
    allTVShows = result;
    //console.log(result)
  } catch (error) {
    alert("An error has occured with fetching TV show data from the API", error);
    console.error("There is an error: ", error);
    displayShows(allTVShows)
  }

}


//This function will display the retrieved data as cards on the page
//LEVEL 100
function displayEpisodes(episodesArray) {
  document.getElementById("user-changes").style.display = "block";
  const episodeSection = document.getElementById("episode-section");
  episodeSection.innerHTML = "";
  episodesArray.forEach(singleEpisode => {

    const episodeCard = document.getElementById("episode-card").content.cloneNode(true);

    episodeCard.querySelector("#episode-name").textContent = `${singleEpisode.name}`;
    let episodeCode = `S${(singleEpisode.season).toString().padStart(2, "0")}E${(singleEpisode.number).toString().padStart(2, "0")}`;
    episodeCard.querySelector("#episode-code").textContent = episodeCode;

    // Image must exist first
    const episodeImage = episodeCard.querySelector("#episode-image");

    if (singleEpisode.image && singleEpisode.image.medium) {
      episodeImage.src = singleEpisode.image.medium;
    } else {

      episodeImage.src = '';
      episodeImage.alt = 'No image available';
    }

    episodeCard.querySelector("#episode-summary").innerHTML = singleEpisode.summary;
    episodeCard.querySelector("#episode-link").textContent = `${singleEpisode.name} URL`;
    episodeCard.querySelector("#episode-link").href = singleEpisode.url;;
    episodeSection.appendChild(episodeCard);

  });

  //console.log(allEpisodes)

}
//this function deals with searching for an episode
//LEVEL 200
const searchBar = document.getElementById("search-bar");

function episodeSearch(episodesArray) {
  const searchCount = document.getElementById("search-count");
  const userInput = searchBar.value.toLowerCase();

  const filteredEpisodes = episodesArray.filter(function (singleEpisode) {
    return singleEpisode.name.toLowerCase().includes(userInput) || singleEpisode.summary.toLowerCase().includes(userInput);
  });

  if (userInput.length > 0) {
    searchCount.textContent = `No of episodes displayed: ${filteredEpisodes.length}`;
  }
  else {
    searchCount.textContent = "";
  }
  const episodeSection = document.getElementById("episode-section");
  episodeSection.innerHTML = "";
  displayEpisodes(filteredEpisodes);
}

//event listener for user input in the search bar

searchBar.addEventListener("input", function () {
  episodeSearch(allEpisodes);

})

//this function sets up the dropdown to display the names of the different episodes

const episodeDropdown = document.getElementById("episode-dropdown");

function setupEpisodeDropdown(episodesArray) {
  episodeDropdown.innerHTML = "";
  const placeholderOption = document.createElement("option");
  placeholderOption.textContent = "Select an episode";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  episodeDropdown.appendChild(placeholderOption);

  episodesArray.forEach(singleEpisode => {
    const option = document.createElement("option");

    let episodeCode = `S${(singleEpisode.season).toString().padStart(2, "0")}E${(singleEpisode.number).toString().padStart(2, "0")}`;
    option.value = singleEpisode.id;
    option.textContent = `${episodeCode} - ${singleEpisode.name}`;
    episodeDropdown.appendChild(option);
  });

}

episodeDropdown.addEventListener("change", function () {
  //when the choice is made that specific option has a unique ID

  const selectedEpisodeID = episodeDropdown.value;

  if (selectedEpisodeID) {

    const selectedEpisode = allEpisodes.find(singleEpisode => singleEpisode.id === parseInt(selectedEpisodeID));
    const episodeSection = document.getElementById("episode-section");
    episodeSection.innerHTML = "";
    displayEpisodes([selectedEpisode]);
  }
}
);

//this clear selection button will display all episodes once again

function clearSelection() {

  const clearButton = document.getElementById("clear-selection");
  clearButton.addEventListener("click", function () {
    const episodeSection = document.getElementById("episode-section");
    episodeSection.innerHTML = "";
    displayEpisodes(allEpisodes);

  })

}

//this function sets up the dropdown to display the names of the different TV shows in alphabetical order
//level 400

const tvShowDropdown = document.getElementById("tv-show-dropdown");

function setupTVShowDropdown(tvShowsArray) {

  tvShowsArray.sort((a, b) => a.name.localeCompare(b.name));

  tvShowDropdown.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.textContent = "Select a TV Show";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  tvShowDropdown.appendChild(placeholderOption);


  tvShowsArray.forEach(singleTVShow => {
    const option = document.createElement("option");
    option.value = singleTVShow.id;
    option.textContent = `${singleTVShow.name}`;
    tvShowDropdown.appendChild(option);
  });

}

tvShowDropdown.addEventListener("change", async function () {
  //when the choice is made that specific option has a unique ID for TV shows

  const selectedTVShowID = tvShowDropdown.value;

  if (selectedTVShowID) {

    const selectedTVShow = allTVShows.find(singleTVShow => singleTVShow.id === parseInt(selectedTVShowID));
    showID = selectedTVShow.id;
    //console.log(showID)
    await getEpisodes(showID);

    displayEpisodes(allEpisodes);
    setupEpisodeDropdown(allEpisodes);

  }
}
);

//This function will display the retrieved TV show data as cards on the page
//LEVEL 500
function displayShows(showsArray) {
  showsArray.sort((a, b) => a.name.localeCompare(b.name));
  document.getElementById("title").textContent = "All TV Shows listing";
  document.getElementById("user-changes").style.display = "none";
  const tvSearchDiv = document.getElementById("tv-search");
  if (!document.getElementById("tv-search-input")) {
    const tvSeachBar = document.createElement("input");
    tvSeachBar.id = "tv-search-input";
    tvSeachBar.placeholder = "Search for a TV Show";
    const searchCount = document.createElement("p");
    searchCount.id = "tv-search-count";
    tvSearchDiv.appendChild(searchCount);
    tvSearchDiv.appendChild(tvSeachBar);

    // Add event listener for user input in the search bar
    tvSeachBar.addEventListener("input", function () {
      tvShowSearch(allTVShows);
    });

  }

  const tvShowsSection = document.getElementById("tv-show-section");
  tvShowsSection.innerHTML = "";
  showsArray.forEach(singleShow => {

    const tvShowCard = document.getElementById("tv-show-card").content.cloneNode(true);

    const cardElement = tvShowCard.querySelector(".tv-show-card");
    cardElement.setAttribute("data-show-id", singleShow.id);

    tvShowCard.querySelector("#tv-show-name").textContent = `${singleShow.name}`;
    tvShowCard.querySelector("#tv-show-image").src = singleShow.image["medium"];
    tvShowCard.querySelector("#tv-show-summary").innerHTML = singleShow.summary;
    tvShowCard.querySelector("#tv-show-link").innerHTML = `<strong>URL : ${singleShow.name}`;
    tvShowCard.querySelector("#tv-show-link").href = singleShow.url;
    tvShowCard.querySelector("#genre").innerHTML = `<strong>Genre(s)</strong> : ${singleShow.genres}`;
    tvShowCard.querySelector("#status").innerHTML = `<strong>Status </strong>: ${singleShow.status}`;
    tvShowCard.querySelector("#rating").innerHTML = `<strong>Rating</strong> : ${singleShow.rating["average"]}`;
    tvShowCard.querySelector("#runtime").innerHTML = `<strong> Runtime</strong> : ${singleShow.runtime} minutes`;
    tvShowsSection.appendChild(tvShowCard);
    presentEpisodesOfShow();
  });
}

function tvShowSearch(tvShows) {


  const userInput = document.getElementById("tv-search-input").value.toLowerCase();
  const searchCount = document.getElementById("tv-search-count");
  console.log(userInput)
  const filteredShows = tvShows.filter(function (singleShow) {
    const genreSearch = singleShow.genres.some(genre => genre.toLowerCase().includes(userInput));
    return singleShow.name.toLowerCase().includes(userInput) || singleShow.summary.toLowerCase().includes(userInput) || genreSearch;
  });

  if (userInput.length > 0) {
    searchCount.textContent = `No of shows displayed: ${filteredShows.length}`;
  }
  else {
    searchCount.textContent = "";
  }
  const showSection = document.getElementById("tv-show-section");
  showSection.innerHTML = "";
  displayShows(filteredShows);
}
function presentEpisodesOfShow() {
  document.querySelectorAll(".tv-show-card #tv-show-name").forEach((title) => {
    title.addEventListener("click", async function () {
      const backToTVShows = document.getElementById("return-to-tv-show");
      const card = title.closest(".tv-show-card");
      const showID = card.getAttribute("data-show-id");
      backToTVShows.style.display = "inline-block";
      backToTVShows.textContent = "Return to TV Show Listings ⬅️";


      backToTVShows.addEventListener('click', async function () {
        document.getElementById("episode-section").style.display = "none";
        document.getElementById("user-changes").style.display = "none";
        document.getElementById("tv-episode-section").style.display = "block";
        document.getElementById("tv-search").style.display = "block";
        await setup();

      });


      document.getElementById("tv-show-section").style.display = "none";
      document.getElementById("tv-search").style.display = "none";
      document.getElementById("episode-section").style.display = "block";

      await getEpisodes(showID);
      displayEpisodes(allEpisodes);
      setupTVShowDropdown(allTVShows);
      setupEpisodeDropdown(allEpisodes);
      clearSelection();
      // Update the title to the show's name
      document.getElementById("title").textContent = `TV Show : ${title.textContent}`;
    });
  });
}


window.onload = setup;