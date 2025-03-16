document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const showID = urlParams.get("id");
    const title = decodeURIComponent(urlParams.get("title"));
    const type = urlParams.get("type");
    const poster = decodeURIComponent(urlParams.get("poster"));

    document.getElementById("show-title").innerText = title;
    document.getElementById("poster").src = poster && poster !== "null" ? poster : "placeholder.jpg";

    if (!showID) {
        console.error("No valid ID found!");
        return;
    }

    if (type === "movie") {
        loadMovieSources(showID, title);
        document.getElementById("play-movie-btn").style.display = "block";
    } else if (type === "anime") {
        loadAnimeSources(showID, title);
    } else {
        fetchSeasons(showID, title);
    }

    document.getElementById("fullscreen-btn").addEventListener("click", function () {
        const videoPlayer = document.getElementById("videoPlayer");
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.mozRequestFullScreen) {
            videoPlayer.mozRequestFullScreen();
        } else if (videoPlayer.webkitRequestFullscreen) {
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) {
            videoPlayer.msRequestFullscreen();
        }
    });

    document.getElementById("play-movie-btn").addEventListener("click", function () {
        document.getElementById("videoPlayer").src = document.querySelector("#sources button").getAttribute("data-url");
    });
});

// 🎬 Load Movies
function loadMovieSources(movieID, title) {
    const sources = [
        { name: `VidAPI - ${title}`, url: `https://vidapi.xyz/embed/movie/${movieID}` },
        { name: `VidSrc - ${title}`, url: `https://vidsrc.me/embed/${movieID}` },
        { name: `2Embed - ${title}`, url: `https://www.2embed.to/embed/imdb/${movieID}` },
        { name: `KM Movies - ${title}`, url: `https://kmmovies.biz/movie/${movieID}` }
    ];
    createSourceButtons(sources);
}

// 📺 Load TV Shows Seasons
function fetchSeasons(showID, title) {
    fetch(`https://api.tvmaze.com/lookup/shows?imdb=${showID}`)
        .then(response => response.json())
        .then(data => {
            fetch(`https://api.tvmaze.com/shows/${data.id}/seasons`)
                .then(response => response.json())
                .then(seasons => {
                    const seasonsDiv = document.getElementById("seasons");
                    seasonsDiv.innerHTML = "<h3>Select Season</h3>";
                    seasons.forEach(season => {
                        const button = document.createElement("button");
                        button.innerText = `S${season.number}`;
                        button.onclick = () => fetchEpisodes(data.id, season.id, season.number, title);
                        seasonsDiv.appendChild(button);
                    });
                })
                .catch(error => console.error("Error fetching seasons:", error));
        })
        .catch(error => console.error("Error fetching show data:", error));
}

// 📺 Load TV Show Episodes (Horizontal Scroll)
function fetchEpisodes(showID, seasonID, seasonNumber, title) {
    fetch(`https://api.tvmaze.com/seasons/${seasonID}/episodes`)
        .then(response => response.json())
        .then(episodes => {
            const episodesDiv = document.getElementById("episodes");
            episodesDiv.innerHTML = ""; // Clear previous episodes
            episodes.forEach(ep => {
                const episodeCard = document.createElement("div");
                episodeCard.classList.add("episode-card");
                episodeCard.onclick = () => loadEpisodeSources(showID, seasonNumber, ep.number, title);

                const episodeImage = document.createElement("img");
                episodeImage.src = ep.image ? ep.image.medium : "https://via.placeholder.com/100x150";
                const episodeTitle = document.createElement("p");
                episodeTitle.innerText = `S${seasonNumber}E${ep.number}`;

                episodeCard.appendChild(episodeImage);
                episodeCard.appendChild(episodeTitle);
                episodesDiv.appendChild(episodeCard);
            });

            episodesDiv.style.display = "flex"; // Enable horizontal scrolling
            episodesDiv.style.overflowX = "auto";
            episodesDiv.style.whiteSpace = "nowrap";
            episodesDiv.style.gap = "10px";
            episodesDiv.style.padding = "10px";
        })
        .catch(error => console.error("Error fetching episodes:", error));
}

// 🎥 Load TV Show Episode Sources (Only Name, Season, Episode)
function loadEpisodeSources(showID, season, episode, title) {
    const sources = [
        { name: `VidAPI - ${title} S${season}E${episode}`, url: `https://vidapi.xyz/embed/tv/${showID}&s=${season}&e=${episode}` },
        { name: `VidSrc - ${title} S${season}E${episode}`, url: `https://vidsrc.me/embed/tv/${showID}/${season}/${episode}` },
        { name: `2Embed - ${title} S${season}E${episode}`, url: `https://www.2embed.to/embed/imdb/${showID}/${season}/${episode}` },
        { name: `KM Movies - ${title} S${season}E${episode}`, url: `https://kmmovies.biz/tv/${showID}/${season}/${episode}` }
    ];
    createSourceButtons(sources);
}

// 🎥 Load TV Show Episode Sources (Now with 20 Providers)
function loadEpisodeSources(showID, season, episode, title) {
    const sources = [
        { name: `VidAPI - ${title} S${season}E${episode}`, url: `https://vidapi.xyz/embed/tv/${showID}&s=${season}&e=${episode}` },
        { name: `VidSrc - ${title} S${season}E${episode}`, url: `https://vidsrc.me/embed/tv/${showID}/${season}/${episode}` },
        { name: `2Embed - ${title} S${season}E${episode}`, url: `https://www.2embed.to/embed/imdb/${showID}/${season}/${episode}` },
        { name: `KM Movies - ${title} S${season}E${episode}`, url: `https://kmmovies.biz/tv/${showID}/${season}/${episode}` },
        { name: `Goku - ${title} S${season}E${episode}`, url: `https://goku.to/tv/${showID}/${season}/${episode}` },
        { name: `MoviesJoy - ${title} S${season}E${episode}`, url: `https://moviesjoy.to/tv/${showID}/${season}/${episode}` },
        { name: `MyFlixer - ${title} S${season}E${episode}`, url: `https://myflixer.to/tv/${showID}/${season}/${episode}` },
        { name: `WatchSeries - ${title} S${season}E${episode}`, url: `https://watchseries.to/tv/${showID}/${season}/${episode}` },
        { name: `Soap2Day - ${title} S${season}E${episode}`, url: `https://soap2day.to/tv/${showID}/${season}/${episode}` },
        { name: `CineB - ${title} S${season}E${episode}`, url: `https://cineb.to/tv/${showID}/${season}/${episode}` },
        { name: `FlixHQ - ${title} S${season}E${episode}`, url: `https://flixhq.to/tv/${showID}/${season}/${episode}` },
        { name: `LookMovie - ${title} S${season}E${episode}`, url: `https://lookmovie.to/tv/${showID}/${season}/${episode}` },
        { name: `YesMovies - ${title} S${season}E${episode}`, url: `https://yesmovies.to/tv/${showID}/${season}/${episode}` },
        { name: `FMovies - ${title} S${season}E${episode}`, url: `https://fmovies.to/tv/${showID}/${season}/${episode}` },
        { name: `HDO - ${title} S${season}E${episode}`, url: `https://hdo.to/tv/${showID}/${season}/${episode}` },
        { name: `XStream - ${title} S${season}E${episode}`, url: `https://xstream.to/tv/${showID}/${season}/${episode}` },
        { name: `StreamLounge - ${title} S${season}E${episode}`, url: `https://streamlounge.to/tv/${showID}/${season}/${episode}` },
        { name: `123Movies - ${title} S${season}E${episode}`, url: `https://123movies.to/tv/${showID}/${season}/${episode}` },
        { name: `Vumoo - ${title} S${season}E${episode}`, url: `https://vumoo.to/tv/${showID}/${season}/${episode}` },
        { name: `PrimeWire - ${title} S${season}E${episode}`, url: `https://primewire.to/tv/${showID}/${season}/${episode}` }
    ];
    createSourceButtons(sources);
}

// 🔘 Create Source Buttons (Updated for More Providers)
function createSourceButtons(sources) {
    const videoPlayer = document.getElementById("videoPlayer");
    const sourcesDiv = document.getElementById("sources");
    sourcesDiv.innerHTML = "<h3>Select Source</h3>";

    sources.forEach(source => {
        const button = document.createElement("button");
        button.innerText = source.name;
        button.setAttribute("data-url", source.url);
        button.onclick = () => {
            videoPlayer.src = source.url;
        };
        sourcesDiv.appendChild(button);
    });

    // Display source selection after clicking an episode
    sourcesDiv.style.display = "block";
}






// 🎌 Load Anime
function loadAnimeSources(animeLink, episode) {
    const sources = [
        { name: `VidAPI - Anime Episode ${episode}`, url: `https://vidapi.xyz/embed/anime/${animeLink}-${episode}` }
    ];
    createSourceButtons(sources);
}

// 🔘 Create Source Buttons
function createSourceButtons(sources) {
    const videoPlayer = document.getElementById("videoPlayer");
    const sourcesDiv = document.getElementById("sources");
    sourcesDiv.innerHTML = "<h3>Select Source</h3>";

    sources.forEach(source => {
        const button = document.createElement("button");
        button.innerText = source.name;
        button.setAttribute("data-url", source.url);
        button.onclick = () => {
            videoPlayer.src = source.url;
        };
        sourcesDiv.appendChild(button);
    });
}

// 🎬 Load Default Video
const showTitle = new URLSearchParams(window.location.search).get("title") || "Unknown Show";
const showID = new URLSearchParams(window.location.search).get("id");
const showType = new URLSearchParams(window.location.search).get("type") || "Movie";
const posterURL = new URLSearchParams(window.location.search).get("poster") || "placeholder.jpg";

document.querySelector("#show-title").innerText = showTitle;
document.querySelector("#poster").src = posterURL;

let embedKey = encodeURIComponent(showTitle.replace(/\s+/g, "+"));
let embedURL = `https://player4u.xyz/embed?key=${embedKey}`;
document.querySelector("#videoPlayer").src = embedURL;

// 🎥 Fullscreen Button
document.querySelector("#fullscreen-btn").addEventListener("click", function () {
    const iframe = document.querySelector("#videoPlayer");
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
});
