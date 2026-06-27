console.log("spotify clone loaded");

let currentSong = new Audio();

let songs = {
    album1: [
        "songs/album1/Dandelions.mp3"
    ],
    album2: [
        "songs/album2/ExtraL.mp3",
        "songs/album2/Like JENNIE.mp3",
        "songs/album2/Mantra.mp3",
        "songs/album2/With the IE.mp3"
    ],
    album3: [
        "songs/album3/My strange addiction.mp3"
    ],
    album4: [
        "songs/album4/1 Minute Piano Backsound.mp3",
        "songs/album4/Meditation Music.mp3",
        "songs/album4/Purity - Beautiful Piano Song.mp3"
    ],
    album5: [
        "songs/album5/Aarzu.mp3",
        "songs/album5/Banjaare - Bairan .mp3",
        "songs/album5/JO TUM MERE HO.mp3",
        "songs/album5/Tu aake dekh le (Lyrics) - King  Carnival.mp3"
    ],
    album6: [
        "songs/album6/Into You.mp3"
    ],
    album7: [
        "songs/album7/Espresso.mp3"
    ],
    album8: [
        "songs/album8/Living Hell.mp3"
    ],
    album9: [
        "songs/album9/Moonlight.mp3"
    ],
    album10: [
        "songs/album10/Dark Horse.mp3"
    ],
    album11: [
        "songs/album11/Breakin' Dishes.mp3"
    ],
    album12: [
        "songs/album12/Gabriela.mp3"
    ]
};

let currentSongs = [];
let currentSongIndex = 0;
let isPlaying = false;

/* ---------------- CLEAN SONG NAME ---------------- */
function cleanSongName(path) {
    return decodeURIComponent(path)
        .split("/")
        .pop()
        .replace(".mp3", "")
        .trim();
}

/* ---------------- TIME FORMAT ---------------- */
function secondsToMinutesSeconds(seconds) {
    if (!seconds || isNaN(seconds)) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

/* ---------------- PLAY MUSIC ---------------- */
function playMusic(track, pause = false) {
    currentSong.pause();
    currentSong.src = track;
    currentSong.currentTime = 0;
    currentSong.load();

    if (!pause) {
        currentSong.play();
        isPlaying = true;
        play.src = "pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = cleanSongName(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

/* ---------------- RENDER SONGS ---------------- */
function renderSongs(list) {
    let ul = document.querySelector(".songList ul");
    ul.innerHTML = "";

    list.forEach((song, i) => {
        let name = cleanSongName(song);
        ul.innerHTML += `
        <li data-index="${i}">
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${name}</div>
            </div>
            <div class="playnow">
                <span>play</span>
                <img width="28px" class="invert" src="play.svg">
            </div>
        </li>`;
    });

    Array.from(ul.getElementsByTagName("li")).forEach(li => {
        li.addEventListener("click", () => {
            currentSongIndex = Number(li.dataset.index);
            playMusic(list[currentSongIndex]);
        });
    });
}

/* ---------------- ALBUM HANDLER ---------------- */
function setupAlbums() {
    let cards = document.querySelectorAll(".card");
    let keys = Object.keys(songs);

    cards.forEach((card, index) => {
        let albumKey = keys[index];

        card.addEventListener("click", () => {
            if (!songs[albumKey] || songs[albumKey].length === 0) return;

            currentSongs = songs[albumKey];
            currentSongIndex = 0;
            renderSongs(currentSongs);
            playMusic(currentSongs[0], true);
        });
    });
}

/* ---------------- MAIN ---------------- */
function main() {
    setupAlbums();

    currentSongs = songs.album1;
    renderSongs(currentSongs);
    playMusic(currentSongs[0], true);

    /* PLAY/PAUSE */
    play.addEventListener("click", () => {
        if (isPlaying) {
            currentSong.pause();
            play.src = "play.svg";
        } else {
            currentSong.play();
            play.src = "pause.svg";
        }
        isPlaying = !isPlaying;
    });

    /* TIME + PROGRESS */
    currentSong.addEventListener("timeupdate", () => {
        if (!currentSong.duration) return;

        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    /* SEEKBAR */
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    /* PREVIOUS */
    previous.addEventListener("click", () => {
        if (currentSongIndex > 0) {
            currentSongIndex--;
            playMusic(currentSongs[currentSongIndex]);
        }
    });

    /* NEXT */
    next.addEventListener("click", () => {
        if (currentSongIndex < currentSongs.length - 1) {
            currentSongIndex++;
            playMusic(currentSongs[currentSongIndex]);
        }
    });

    /* VOLUME */
    document.querySelector(".range input").addEventListener("change", e => {
        currentSong.volume = e.target.value / 100;
    });
}

/* HAMBURGER */
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
});

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-140%";
});

/* MUTE TOGGLE */
document.querySelector(".volume>img").addEventListener("click", e => {
    if (e.target.src.includes("volume.svg")) {
        e.target.src = e.target.src.replace("volume.svg", "mute.svg");
        currentSong.volume = 0;
        document.querySelector(".range input").value = 0;
    } else {
        e.target.src = e.target.src.replace("mute.svg", "volume.svg");
        currentSong.volume = 0.10;
        document.querySelector(".range input").value = 30;
    }
});

main();