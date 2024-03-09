let currentSong = new Audio();
let songs;
let curFolder;
let soundNumber = 1;

function secondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${minutes}:${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds}`;
  return formattedTime;
}

async function getSongs(folder) {
  curFolder = folder;
  let a = await fetch(`https://karthikacharya1.github.io/VibeVerse/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`https://karthikacharya1.github.io/VibeVerse/${folder}/`)[1]);
    }
  }

  let songUL = document
    .querySelector(".songs-list")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    let sung = decodeURI(song);

    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
      <img class="invert" src="img/music.svg" />
                <div class="info">
                  <div>${sung} </div>
                 
                </div>
                  <div class="flex">
                <img class="invert lib-play" src="img/play.svg" alt=""/>
                </div>
      </li>`;
  }

  //attach an event listner to each songs
  Array.from(
    document.querySelector(".songs-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playsong(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

let play = document.querySelector(".play-");
const playsong = (track, pause = false) => {
  currentSong.src = `/${curFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".song-info").innerHTML = decodeURI(track);
  document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch("https://karthikacharya1.github.io/VibeVerse/songs/");

  console.log(a);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let container = document.querySelector(".container2");
  let array = Array.from(anchors);

  for (let index = 1; index < array.length; index++) {
    const e = array[index];

    // Array.from(anchors).forEach(async (e) => {
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-1)[0];
      if (folder !== "songs") {
        // get metadata of the folder

        let a = await fetch(`https://karthikacharya1.github.io/VibeVerse/songs/${folder}/info.json`);

        let response = await a.json();
        container.innerHTML =
          container.innerHTML +
          `<div data-folder=${folder} class="card">
        <div class="imgHolder">
        <img
        class="im1"
        src="/songs/${folder}/cover.jpg"/>
          <img class="play-circle-image" src="img/play.svg" />
        </div>
        <h2>${response.title}</h2>
        <br />
        <p>${response.discription}</p>
      </div>`;
      }
    }
  }

  //load the playlist while clicking card
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playsong(songs[0]);
    });
  });
}
async function main() {
  await getSongs(`songs/Alan_Walker`);
  //display all albums
  displayAlbums();

  playsong(decodeURI(songs[0]), true);

  //attach an event listner to play next and previous
  let play = document.querySelector(".play-");
  play.addEventListener("click", function () {
    if (currentSong.paused) {
      currentSong.play();

      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  //listen for timeupdate event
  currentSong.addEventListener("timeupdate", function () {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(
      Math.floor(currentSong.currentTime)
    )} / ${secondsToMinutesSeconds(Math.floor(currentSong.duration))}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // add event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click", function (e) {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    document.querySelector(".circle").style.left = Math.floor(percent) + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add An Event listener to Hamburger
  var hamburger = document
    .querySelector(".hamburg")
    .addEventListener("click", function () {
      document.querySelector(".left").style.left = 0;
      document.querySelector(".right").style.filter = "blur(3px)";
    });
  var Close = document
    .querySelector(".closeWind")
    .addEventListener("click", function () {
      document.querySelector(".left").style.left = "-120%";
      document.querySelector(".right").style.filter = "blur(0px)";
    });

  //add An Event listener to previous Button
  document.querySelector(".prev").addEventListener("click", function () {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if (index - 1 >= 0) {
      playsong(songs[index - 1]);
    }
  });
  // add An Event listener to next button
  document.querySelector(".next").addEventListener("click", function () {
    currentSong.pause();

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playsong(songs[index + 1]);
    }
  });

  // add an event listener to volume

  document
    .querySelector(".range1")
    .getElementsByTagName("input")[0]
    .addEventListener("change", function (e) {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  //change sound icom to mute
  document.querySelector(".sound").addEventListener("click", function (e) {
    if (soundNumber == 1) {
      e.target.src = "img/mute.svg";
      currentSong.volume = 0;
      document
        .querySelector(".range1")
        .getElementsByTagName("input")[0].value = 0;
      soundNumber = 0;
    } else {
      e.target.src = "img/sound.svg";
      currentSong.volume = 0.1;
      document
        .querySelector(".range1")
        .getElementsByTagName("input")[0].value = 10;
      soundNumber = 1;
    }
  });
}
main();
