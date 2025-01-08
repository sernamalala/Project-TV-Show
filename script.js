// You can edit ALL of the code here
function setup() {
  getEpisodes();
}

async function fetchData() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching data", error);
    displayErrorMessage("Error fetching data. Please try again later.");
  }
}

async function getEpisodes() {
  const allEpisodes = await fetchData();
  if (allEpisodes) {
    makePageForEpisodes(allEpisodes);
    displayEpisodecard(allEpisodes);
    populateEpisodeSelector(allEpisodes);
  }
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

function displayEpisodecard(allEps) {
  const cardSection = document.getElementById("episode-section");
  cardSection.innerHTML = ""; // Clear previous episodes

  for (const episode of allEps) {
    const { name, season, number, image, summary } = episode;
    const episodeCard = document
      .getElementById("episode-template")
      .content.cloneNode(true);

    episodeCard.querySelector(
      "#episode-name"
    ).textContent = `Episode Name: ${name}`;
    episodeCard.querySelector(
      "#season-number"
    ).textContent = `Season: ${season}`;
    episodeCard.querySelector(
      "#episode-number"
    ).textContent = `Episode No: ${number}`;
    episodeCard.querySelector("#episode-code").textContent = `S${season
      .toString()
      .padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
    episodeCard.querySelector("#episode-image").src = image["medium"];
    episodeCard.querySelector("#episode-summary").innerHTML = summary;

    cardSection.appendChild(episodeCard);
  }
}

function filterEpisodes(allEpisodes) {
  const searchInput = document.getElementById("search-input");
  const searchCount = document.getElementById("search-count");
  const searchTerm = searchInput.value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm)
  );
  displayEpisodecard(filteredEpisodes);
  searchCount.textContent = `Displaying ${filteredEpisodes.length} episode(s)`;
}

function populateEpisodeSelector(allEpisodes) {
  const episodeSelector = document.getElementById("episode-selector");
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${
      episode.name
    }`;
    episodeSelector.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("search-input");
  const episodeSelector = document.getElementById("episode-selector");
  const clearButton = document.getElementById("clear-button");
  const allEpisodes = await getEpisodes();

  searchInput.addEventListener("input", () => filterEpisodes(allEpisodes));

  episodeSelector.addEventListener("change", () => {
    const selectedEpisodeId = episodeSelector.value;
    if (selectedEpisodeId) {
      const selectedEpisode = allEpisodes.find(
        (episode) => episode.id === parseInt(selectedEpisodeId)
      );
      displayEpisodecard([selectedEpisode]);
    } else {
      displayEpisodecard(allEpisodes);
    }
  });

  clearButton.addEventListener("click", () => {
    episodeSelector.value = "";
    displayEpisodecard(allEpisodes);
  });
});

setup();

window.onload = setup;
