
const API_URL = "http://localhost:5000/api/songs";

const songList = document.getElementById("song-list");
const statusText = document.getElementById("status");
const songCount = document.getElementById("song-count");
const audio = document.getElementById("audio");
const playButton = document.getElementById("play");
const progress = document.getElementById("progress");

let songs = [];
let currentIndex = -1;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function renderSongs(items) {
  songList.innerHTML = "";

  items.forEach((song) => {
    const index = songs.indexOf(song);
    const card = document.createElement("article");
    card.className = "song-card";

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
    title.textContent = song.title;

    const artist = document.createElement("p");
    artist.textContent = song.artist;

    const button = document.createElement("button");
    button.className = "card-play";
    button.textContent = "▶  Play song";
    button.addEventListener("click", () => playSong(index));

    card.append(cover, title, artist, button);
    songList.appendChild(card);
  });

  songCount.textContent = `${items.length} track${items.length === 1 ? "" : "s"}`;
  statusText.textContent = items.length
    ? ""
    : "No songs found. Add a song through your backend API.";
}

async function loadSongs() {
  try {
    statusText.textContent = "Loading your music...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    songs = await response.json();
    renderSongs(songs);
  } catch (error) {
    console.error(error);
    songCount.textContent = "Unavailable";
    statusText.textContent =
      "Could not connect. Make sure your backend is running on port 5000.";
  }
}

function playSong(index) {
  if (index < 0 || index >= songs.length) return;

  currentIndex = index;
  const song = songs[currentIndex];

  audio.src = song.audioUrl;
  document.getElementById("player-title").textContent = song.title;
  document.getElementById("player-artist").textContent = song.artist;

  const playerCover = document.getElementById("player-cover");
  playerCover.innerHTML = "";

  if (song.coverImage) {
    const img = document.createElement("img");
    img.src = song.coverImage;
    img.alt = "";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:8px";
    playerCover.appendChild(img);
  } else {
    playerCover.textContent = "♫";
  }

  
audio.play()
  .then(() => {
    playButton.textContent = "Ⅱ";
    statusText.textContent = "";
    console.log("Song is playing!");
  })
  .catch((error) => {
    console.error("Audio playback error:", error);
    statusText.textContent = "Error: " + error.message;
    playButton.textContent = "▶";
  });

}

playButton.addEventListener("click", () => {
  if (currentIndex === -1) {
    if (songs.length) playSong(0);
    return;
  }

  if (audio.paused) {
    audio.play()
      .then(() => { playButton.textContent = "Ⅱ"; })
      .catch(console.error);
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => { playButton.textContent = "Ⅱ"; });
audio.addEventListener("pause", () => { playButton.textContent = "▶"; });

document.getElementById("next").addEventListener("click", () => {
  if (songs.length) playSong((currentIndex + 1) % songs.length);
});

document.getElementById("prev").addEventListener("click", () => {
  if (songs.length) {
    const index = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
    playSong(index);
  }
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    document.getElementById("current-time").textContent =
      formatTime(audio.currentTime);
  }
});

audio.addEventListener("loadedmetadata", () => {
  document.getElementById("duration").textContent =
    formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  if (songs.length) playSong((currentIndex + 1) % songs.length);
});

progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  }
});

document.getElementById("volume").addEventListener("input", (event) => {
  audio.volume = Number(event.target.value);
});

audio.volume = 0.7;

document.getElementById("search").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();

  const filtered = songs.filter((song) =>
    `${song.title} ${song.artist} ${song.album} ${song.genre}`
      .toLowerCase()
      .includes(query)
  );

  renderSongs(filtered);
});

loadSongs();
