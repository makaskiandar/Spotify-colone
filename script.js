console.log("spotify clone loaded");

let currentSong = new Audio();

let albums = {
    album1: "songs/album1",
    album2: "songs/album2",
    album3: "songs/album3",
    album4: "songs/album4",
    album5: "songs/album5",
    album6: "songs/album6",
    album7: "songs/album7",
    album8: "songs/album8",
    album9: "songs/album9",
    album10: "songs/album10",
    album11: "songs/album11",
    album12: "songs/album12"
    
};

let currentSongs = [];
let currentSongIndex = 0;
let isPlaying = false;

/* ---------------- CLEAN SONG NAME ---------------- */

function cleanSongName(path) {
    return decodeURIComponent(path)
        .split("/")
        .pop()
        .replaceAll("\\", "")
        .replace(/songsalbum\d+/gi, "")
        .replace(/album\d+/gi, "")
        .trim();
}

/* ---------------- TIME FORMAT ---------------- */

function secondsToMinutesSeconds(seconds) {
    if (!seconds || isNaN(seconds)) return "00:00";

    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    return String(mins).padStart(2, "0") + ":" +
           String(secs).padStart(2, "0");
}

/* ---------------- GET SONGS ---------------- */

async function getSongs(folder) {
    let res = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let html = await res.text();

    let div = document.createElement("div");
    div.innerHTML = html;

    let links = div.getElementsByTagName("a");

    let songs = [];

    for (let a of links) {
        if (a.href.endsWith(".mp3")) {
            songs.push(a.href);
        }
    }

    return songs;
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

/* ---------------- RENDER SONGS (FIXED MUSIC ICON) ---------------- */

function renderSongs(list) {
    let ul = document.querySelector(".songList ul");
    ul.innerHTML = "";

    list.forEach((song, i) => {

        let name = cleanSongName(song);

        ul.innerHTML += `
        <li data-index="${i}">

            <!-- LEFT ICON (RESTORED) -->
            <img class="invert" src="music.svg" alt="">

            <div class="info">
                <div>${name}</div>
            </div>

            <!-- RIGHT PLAY ICON -->
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

    cards.forEach((card, index) => {

        let keys = Object.keys(albums);
        let albumKey = keys[index];

        card.addEventListener("click", async () => {

            currentSongs = await getSongs(albums[albumKey]);

            currentSongIndex = 0;

            renderSongs(currentSongs);
            playMusic(currentSongs[0], true);
            
        });
    });
}

/* ---------------- MAIN ---------------- */

async function main() {

    setupAlbums();

    currentSongs = await getSongs(albums.album1);
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
document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left="0"
})

document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left="-140%"
})
document.querySelector(".volume>img").addEventListener("click",e=>{
    console.log(e.target)
    console.log("changing",e.target.src)
    if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src=e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume=.10;
        document.querySelector(".range").getElementsByTagName("input")[0].value=30;
    }
})

console.log(Object.keys(albums));
main();