let currentSong = new Audio();
let songs


async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs");
  let response = await a.text();
  //   console.log(response);

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  //   console.log(as);
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}




const playMusic = (track, pause=false)=> {
    currentSong.src = ("/songs/" + track);
    if(!pause){
      currentSong.play();
      play.src= "icons/pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";

  }



async function main() {
  // Get all songs
  songs = await getSongs();
  playMusic(songs[0], true)
  // console.log(songs);
  // currentSong.src = 

  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li>
    <img class="music" src="icons/music.svg" alt="Music" />
    <div class="info">
      <div>${song.replaceAll("%20", " ").replaceAll("%5", " ").replaceAll("_", " ")}</div>
      <div>Ojas</div>
    </div>
    <div class="playnow">
      <span>Play Now</span>
      <img src="icons/play.svg" class="border-black round invert" alt=""/>
    </div></li>
   `;
  }

  // Attach an event listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click", element=>{
      let song = e.querySelector(".info").querySelector("div").innerHTML;
      // console.log(song);
      playMusic(song.trim())
    })
  }) 

  // Attach event listeners to play and pause
  play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play();
      play.src = "icons/pause.svg"
    }
    else{
      currentSong.pause();
      play.src = "icons/play.svg"
    }
  })

  // Listen for timeupdate event

  currentSong.addEventListener("timeupdate", ()=>{
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
  })


  // Add an Event Listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", e=>{
    // console.log(e.target.getBoundingClientRect().width, e.offsetX);
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left = percent + "%";
    // console.log((e.offsetX/e.target.getBoundingClientRect().width)*100);
    currentSong.currentTime = (currentSong.duration*percent)/100;
  })

  // Add an event Listener to display the left block after clicking on hamburger icon

  document.querySelector(".hamburger").addEventListener("click",e=>{
  let menu =  document.querySelector(".left");
   menu.style.left = "0%";
   menu.style.width = "85vw";
   menu.style.indexZ = "50";  
  })

  // Add an event Listener close button
  document.querySelector(".close").addEventListener("click",e=>{
    document.querySelector(".left").style.left = "-100%"
  }
  )


  // Add event Listeners to previous and next
  previous.addEventListener("click", ()=>{
    console.log("Previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    if(index-1 > 0){
      playMusic(songs[index-1])
    }
    else{
      playMusic(songs[songs.length-1])
    }
  })

  next.addEventListener("click", ()=>{
    console.log(currentSong.src);
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    if(index+1 < songs.length){
      playMusic(songs[index+1])
    }
    else{
      playMusic(songs[0])
    }
  })

  // Add event Listener to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    console.log( "setting volume to ", e.target.value, " out of 100")
    currentSong.volume = parseInt(e.target.value / 100)
  })


}

main()
