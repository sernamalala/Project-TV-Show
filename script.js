//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  displayEpisodecard(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}


function displayEpisodecard(allEps) {
  const cardSection = document.getElementById("episode-section");

  for (const episode of allEps) {

    const { name, season, number, image, summary } = episode;

    const episodeCard = document.getElementById("episode-template").content.cloneNode(true);

    episodeCard.querySelector("#episode-name").textContent = `Episode Name: ${name}`;
    episodeCard.querySelector("#season-number").textContent = `Season: ${season}`;
    episodeCard.querySelector("#episode-number").textContent = `Episode No: ${number}`;
    episodeCard.querySelector("#episode-code").textContent = `S${season.toString().padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
    episodeCard.querySelector("#episode-image").src = image["medium"];
    episodeCard.querySelector("#episode-summary").innerHTML = summary;

    cardSection.appendChild(episodeCard);
  }
}

window.onload = setup;
