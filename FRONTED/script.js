
const API_URL = "http://localhost:5000/api/songs";

const songList = document.getElementById("song-list");
const statusText = document.getElementById("status");
const songCount = document.getElementById("song-count");
const audio = document.getElementById("audio");

const playButton = document.getElementById("play");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const search = document.getElementById("search");

const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playerCover = document.getElementById("player-cover");
const currentTimeText = document.getElementById("current-time");
const durationText = document.getElementById("duration");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");

let songs = [];
let currentIndex = -1;
let isShuffleOn = false;
let repeatMode = "off";
let favoriteSongs = JSON.parse(
  localStorage.getItem("soundwaveFavorites") || "[]"
);

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${String(secs).padStart(2, "0")}`;
}
// Load songs from the backend.

function getSongId(song) {
  return String(song._id || song.id || song.audioUrl);
}

function toggleFavorite(song) {
  const id = getSongId(song);

  if (favoriteSongs.includes(id)) {
    favoriteSongs = favoriteSongs.filter(
      (favoriteId) => favoriteId !== id
    );
  } else {
    favoriteSongs.push(id);
  }

  localStorage.setItem(
    "soundwaveFavorites",
    JSON.stringify(favoriteSongs)
  );

  renderSongs(getVisibleSongs());
}
// Display the song cards.
function renderSongs(items) {
  songList.innerHTML = "";

  items.forEach((song) => {
  // Find this song in the complete list.
  const index = songs.indexOf(song);

  const card = document.createElement("article");
card.className = "song-card";

const isCurrentSong = index === currentIndex;
const isActivelyPlaying = isCurrentSong && !audio.paused;

if (isCurrentSong) {
  card.classList.add("playing");
}

if (isActivelyPlaying) {
  card.classList.add("is-playing");
}

    const cover = document.createElement("div");
    cover.className = "cover";

    if (song.coverImage) {
      const img = document.createElement("img");
      img.src = song.coverImage;
      img.alt = `${song.title} cover`;

      img.onerror = () => {
        cover.innerHTML = "♫";
      };

      cover.appendChild(img);
    } else {
      cover.textContent = "♫";
    }

 const title = document.createElement("h3");
title.textContent = song.title || "Unknown title";

const artist = document.createElement("p");
artist.textContent = song.artist || "Unknown artist";

let indicator = null;

if (isCurrentSong) {
  indicator = document.createElement("div");
  indicator.className = "now-playing-indicator";

  const bars = document.createElement("span");
  bars.className = "equalizer";

  for (let i = 0; i < 3; i++) {
    const bar = document.createElement("span");
    bar.className = "equalizer-bar";
    bars.appendChild(bar);
  }

  const label = document.createElement("span");
  label.className = "now-playing-label";
  label.textContent = isActivelyPlaying
    ? "Now playing"
    : "Selected";

  indicator.append(bars, label);
}
const favoriteButton = document.createElement("button");
favoriteButton.className = "favorite-button";

const isFavorite = favoriteSongs.includes(getSongId(song));

favoriteButton.textContent = isFavorite ? "♥" : "♡";
favoriteButton.title = isFavorite
  ? "Remove from favorites"
  : "Add to favorites";
favoriteButton.setAttribute("aria-label", favoriteButton.title);

if (isFavorite) {
  favoriteButton.classList.add("is-favorite");
}

favoriteButton.addEventListener("click", () => {
  toggleFavorite(song);
});
    const button = document.createElement("button");
    button.className = "card-play";

    button.textContent =
      index === currentIndex && !audio.paused
        ? "Ⅱ  Playing"
        : "▶  Play song";

    button.addEventListener("click", () => {
      if (index !== -1) {
        if (index === currentIndex && !audio.paused) {
          audio.pause();
        } else if (index === currentIndex) {
          audio.play().catch(handlePlaybackError);
        } else {
          playSong(index);
        }
      }
    });

card.append(cover, title, artist);

if (indicator) {
  card.appendChild(indicator);
}

card.append(favoriteButton, button);
songList.appendChild(card);

  songCount.textContent =
    `${items.length} track${items.length === 1 ? "" : "s"}`;

  statusText.textContent = items.length
    ? ""
    : "No songs found. Try another search or add a song.";

  if (items.length === 0 && songs.length === 0) {
    statusText.textContent =
      "No songs found. Add a song through your backend API.";
  }
}

// Load songs from the backend.
async function loadSongs() {
  try {
    statusText.textContent = "Loading your music...";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("The songs API did not return a song list.");
    }

    songs = data;
    renderSongs(songs);
  } catch (error) {
    console.error("Could not load songs:", error);

    songCount.textContent = "Unavailable";
    statusText.textContent =
      "Could not connect to the music server. Make sure your backend is running on port 5000.";
  }
}

// Display a playback error.
function handlePlaybackError(error) {
  console.error("Audio playback error:", error);

  statusText.textContent =
    "This song could not be played. Check its audio URL and try again.";

  playButton.textContent = "▶";
}

// Update the player details.
function updatePlayer(song) {
  playerTitle.textContent = song.title || "Unknown title";
  playerArtist.textContent = song.artist || "Unknown artist";

  playerCover.innerHTML = "";

  if (song.coverImage) {
    const img = document.createElement("img");

    img.src = song.coverImage;
    img.alt = `${song.title || "Song"} cover`;
    img.style.cssText =
      "width:100%;height:100%;object-fit:cover;border-radius:8px";

    img.onerror = () => {
      playerCover.innerHTML = "♫";
    };

    playerCover.appendChild(img);
  } else {
    playerCover.textContent = "♫";
  }
}

// Play a song by its position in the complete song list.
function playSong(index) {
  if (index < 0 || index >= songs.length) return;

  const song = songs[index];

  if (!song.audioUrl) {
    statusText.textContent =
      "This song has no audio URL. Please check the song in your database.";
    return;
  }

  currentIndex = index;

  updatePlayer(song);

  progress.value = 0;
  currentTimeText.textContent = "0:00";
  durationText.textContent = "0:00";

  audio.src = song.audioUrl;
  audio.load();

  renderSongs(getVisibleSongs());

  audio.play().catch(handlePlaybackError);
}

// Get the currently visible songs based on the search.
function getVisibleSongs() {
  const query = search.value.trim().toLowerCase();

  return songs.filter((song) =>
    `${song.title || ""} ${song.artist || ""} ${song.album || ""} ${song.genre || ""}`
      .toLowerCase()
      .includes(query)
  );
}

// Play or pause.
playButton.addEventListener("click", () => {
  if (currentIndex === -1) {
    if (songs.length > 0) {
      playSong(0);
    }
    return;
  }

  if (audio.paused) {
    audio.play().catch(handlePlaybackError);
  } else {
    audio.pause();
  }
});

// Previous song.

function playNextSong() {
  if (songs.length === 0) return;

  if (repeatMode === "one") {
    audio.currentTime = 0;
    audio.play().catch(handlePlaybackError);
    return;
  }

  let nextIndex;

  if (isShuffleOn && songs.length > 1) {
    do {
      nextIndex = Math.floor(Math.random() * songs.length);
    } while (nextIndex === currentIndex);
  } else if (currentIndex < songs.length - 1) {
    nextIndex = currentIndex + 1;
  } else if (repeatMode === "all") {
    nextIndex = 0;
  } else {
    return;
  }

  playSong(nextIndex);
}

function playPreviousSong() {
  if (songs.length === 0) return;

  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  let previousIndex;

  if (isShuffleOn && songs.length > 1) {
    do {
      previousIndex = Math.floor(Math.random() * songs.length);
    } while (previousIndex === currentIndex);
  } else {
    previousIndex =
      currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
  }

  playSong(previousIndex);
}

prevButton.addEventListener("click", playPreviousSong);
nextButton.addEventListener("click", playNextSong);
shuffleButton.addEventListener("click", () => {
  isShuffleOn = !isShuffleOn;

  shuffleButton.classList.toggle("active", isShuffleOn);
  shuffleButton.title = isShuffleOn ? "Shuffle on" : "Shuffle off";
  shuffleButton.setAttribute("aria-pressed", String(isShuffleOn));
});

repeatButton.addEventListener("click", () => {
  if (repeatMode === "off") {
    repeatMode = "all";
  } else if (repeatMode === "all") {
    repeatMode = "one";
  } else {
    repeatMode = "off";
  }

  repeatButton.classList.toggle("active", repeatMode !== "off");
  repeatButton.textContent = repeatMode === "one" ? "🔂" : "🔁";
  repeatButton.title =
    repeatMode === "off"
      ? "Repeat off"
      : repeatMode === "all"
      ? "Repeat playlist"
      : "Repeat current song";

  repeatButton.setAttribute(
    "aria-pressed",
    String(repeatMode !== "off")
  );
});



// Update the play button and song cards.
audio.addEventListener("play", () => {
  playButton.textContent = "Ⅱ";
  renderSongs(getVisibleSongs());
});

audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  renderSongs(getVisibleSongs());
});

// Update the progress bar and elapsed time.
audio.addEventListener("timeupdate", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }

  currentTimeText.textContent = formatTime(audio.currentTime);
});

// Show the total duration when available.
audio.addEventListener("loadedmetadata", () => {
  durationText.textContent = formatTime(audio.duration);
});

// Reset the player if the current song cannot load.
audio.addEventListener("error", () => {
  if (currentIndex !== -1) {
    statusText.textContent =
      "Unable to load this audio file. Check the audio URL or try another song.";
  }
});

// Automatically play the next song when the current one ends.
audio.addEventListener("ended", () => {
  if (songs.length === 0) return;

  if (repeatMode === "one") {
    audio.currentTime = 0;
    audio.play().catch(handlePlaybackError);
    return;
  }

  playNextSong();
});


// Seek to another position in the song.
progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime =
      (Number(progress.value) / 100) * audio.duration;
  }
});

// Control volume.
volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

audio.volume = Number(volume.value);

// Search by title, artist, album, or genre.
search.addEventListener("input", () => {
  renderSongs(getVisibleSongs());
});

// Start the application.
loadSongs();
