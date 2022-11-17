import { fetchRequest } from "../api";
import { ENDPOINT, logout, SECTION_TYPE } from "../common";

const audio = new Audio();
const volume = document.querySelector("#volume");
const mute = document.querySelector(".volume-mute");
const pressToMute =  document.querySelector(".volume-mute-not-off");
const pressToOnVolume = document.querySelector(".volume-mute-off");

const playButton = document.querySelector("#play");
const totalDuration =  document.querySelector("#song-total-duration");
const currentDuration = document.querySelector("#song-duration-currently-played");
const progress = document.querySelector(".progress-white");
const nowPlaying = document.querySelector(".now-playing");

var currentTrackID;
var prevTrackID="0";
var currentTime=0; 
var nowPlayingTrack;
var nowPlayingPlaylist; 

playButton.querySelector("span").id = "play-circle";
const playCircle = playButton.querySelector("#play-circle");
const nextButton = document.querySelector("#next span");
const prevButton = document.querySelector("#prev span");
// console.log("nextButton", nextButton);
// console.log("prevButton", prevButton);


// console.log(progress);
let progressInterval; 

const onProfileClick = (event)=>{
    event.stopPropagation();

    const profileMenu = document.getElementById("profile-menu");
    profileMenu.classList.toggle("hidden");
    if(!profileMenu.classList.contains("hidden")){
        profileMenu.querySelector("li#logout").addEventListener("click", logout);
    }
}

const loadUserProfile = async() => {
    const defaultImage = document.getElementById("default-image");
    const profileButton = document.getElementById("user-profile-btn");
    const displayNameElement= document.getElementById("display-name");

    const {display_name: displayName, images} = await fetchRequest(ENDPOINT.userInfo);
    if(images?.length){
        defaultImage.classList.add("hidden");    
    } else {
        defaultImage.classList.remove("hidden");
    }

    profileButton.addEventListener("click", onProfileClick);
    displayNameElement.textContent = displayName;

}

const onPlaylistItemClick = (event,id)=>{
    // console.log(event.target);
    // const id = event.target.id;
    const section = {type: SECTION_TYPE.PLAYLIST, playlist: id};
    // console.log("A playlist was clicked with id: ", id);
    history.pushState(section,"", `playlist/${id}`);
    loadSection(section);
}



const loadPlaylist = async(endpoint,elementID) => {
    // console.log("calling loadPlaylist");
    // console.log("Element ID: ", elementID);

    const playlistContent = document.querySelector(`#page-content`);
    const {message, playlists:{items}} = await fetchRequest(endpoint);

    const playlistSection = document.createElement("section");
    playlistSection.className = "p-4";

     const playlistTitle = document.createElement("h1");
     playlistTitle.className = "font-sans text-2xl font-semibold";
     if(message) {
        playlistTitle.innerHTML = `<br>${message}<br>`;
        playlistSection.id = "featured-playlist-items";
        playlistSection.classList.add("order-first");
    } 
    else {
        playlistTitle.innerHTML = `<br>Top Lists<br>`;
    }
    playlistSection.appendChild(playlistTitle);

    const playlistSectionInner = document.createElement("section");
    playlistSectionInner.className = "grid grid-cols-auto-fill-cards grid-flow-row gap-x-2 py-2 gap-y-10 ";
        for(let {name, artists, description, images,album, id, duration_ms} of items){
            const [image] = images;
            // let artist = artists[0].name;
            const playlistItem = document.createElement("section");
            playlistItem.className = "playlist-instance hover:bg-light-black gap-2 pl-4 pr-4 pt-6 pb-14";
            playlistItem.setAttribute("data-type", "playlist");
            playlistItem.id = id;
            // console.log(id);
            playlistItem.addEventListener("click", (event)=> onPlaylistItemClick(event,id));
            playlistItem.innerHTML =    
            `<img src="${image.url}" alt="${name}" class="rounded mb-2 shadow"/>
            <h2 class="text-lg truncate mb-2 font-semibold">${name}</h2>
            <h3 class="text-s line-clamp-2 text-opacity-70 text-white">${description}</h3>`;
             playlistSectionInner.appendChild(playlistItem);
            //  playlistSectionInner.querySelector(".")
            //  if(index===1 && elementID==="featured-playlist-items"){
            //     loadNowPlaying(imageSong,name, artist,duration_ms);
            //  }
        } 

     playlistSection.appendChild(playlistSectionInner);   
     playlistContent.appendChild(playlistSection);   


     
        
}

const loadPlaylists = ()=>{
    // console.log("calling loadPlaylists");
    const playlistContent = document.querySelector(`#page-content`);
    playlistContent.innerHTML = ``;

    loadPlaylist(ENDPOINT.featuredPlaylist, "featured-playlist-items");
    loadPlaylist(ENDPOINT.topLists, "top-lists");
   
}

const formatTime = (duration_ms)=>{
    return (`${Math.trunc(duration_ms/(1000*60))}:${(Math.trunc(60*((duration_ms/(1000*60))-Math.trunc(duration_ms/(1000*60)))))
    .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`);
    // const min = Math.floor(duration/60_000);
    // const sec = ((duration%6_000)/1000).toFixed(0);
    // const formattedTime = sec==60?
    // min+1+":00":min+":"+(sec<10?"0":"")+sec;
    // return formattedTime;
}

//show play or pause button
//both used onTrackSelection(track is clicked) and onmouseover of track
// function showPlayButton(id,event) {
//     event.stopPropagation();
//     let track = document.querySelector(`#${CSS.escape(id)}`);
//     let nowPlaying = document.querySelector(".now-playing");
//     let playTrackNoButton = track.querySelector(`#track-no-play-button`);
//     let playButtonDiv = track.querySelector(`.track-no-play-button-div`);

//     // let pauseButton = track.querySelector(`.track-no-pause-button`);
//     let trackNo = track.querySelector(".track-no-actual");

//     if(nowPlaying.id===id){  //if track selected is also the one playing
//         if(!audio.ended){  //if it is the song selected for playing and not ended
//             // if playing , show pause
//                 playTrackNoButton.textContent = "pause"; //show pause if playing    
//             if(playButtonDiv.classList.contains("hidden"))
//                 playButtonDiv.classList.remove("hidden");       
            
//                 playTrackNoButton.textContent = "play_arrow"; //show play_arrow if paused 
//                 // playButton.querySelector("span").innerHTML = "play_circle"; //show play circle
//                 playCircle.textContent = "play_circle";
//                 // playButton.innerHTML = `<span class="material-symbols-outlined" style="font-size: 40px">
//                 // play_circle
//                 // </span>`;
//                 //make track no. and title color green
//                 trackNo.classList.remove("text-primary");
//                 trackNo.classList.add("text-spotifygreen");
//                 if(track.querySelector(".track-title").classList.contains("text-primary")){
//                     track.querySelector(".track-title").classList.remove("text-primary");    
//                 }
//                 if(!track.querySelector(".track-title").classList.contains("text-spotifygreen")){
//                     track.querySelector(".track-title").classList.add("text-spotifygreen");
//                 }
//                 // show the track no. and hide play button
//                 trackNo.classList.remove("hidden");
//                 playButtonDiv.classList.add("hidden");
            
//                 document.querySelector("#tracks").classList.add("paused");
//             }
//         }
        
//         }
//         else { // the audio has ended
//             playTrackNoButton.textContent = "play_arrow";
//             if(playButtonDiv.classList.contains("hidden"))
//              playButtonDiv.classList.remove("hidden");     
//         }
//     }
//     else {  //if track selected /hovered is not the one playing
//         //show play arrow and hide 
//         playTrackNoButton.textContent = "play_arrow";
//        if(playButtonDiv.classList.contains("hidden"))
//         playButtonDiv.classList.remove("hidden");              
//     }
    
//     trackNo.classList.add("hidden");
    
//     if(track.classList.contains("paused")){  //if paused
//         playButton.classList.remove("hidden");
//         track.querySelector(".track-no-pause-button").classList.add("hidden");
//         track.querySelector(".track-no-play-button").onclick = function() {
//             audio.play();
//             if(track.classList.contains("paused")){
//                 track.classList.remove("paused");
//             }
//             document.querySelector("#play-circle").innerText = pause_circle;
//             if(track.classList.contains("paused"))
//                 track.classList.remove("paused");
//         };
//         return
//     }
  

// }

//show play or pause button
//both used onTrackSelection(track is clicked) and onmouseover of track
function showPlayButton(id,event) {
    let track = document.querySelector(`#${CSS.escape(id)}`);
    let playTrackNoButtonDiv = track.querySelector(".track-no-play-button-div");
    let trackNo = track.querySelector(".track-no-actual");
    // let nowPlaying = document.querySelector(".now-playing");
//    console.log("inside showPlayButton,track id and nowPlaying: ", track.id, nowPlaying.id);

if(track.id===nowPlaying.id){ //selecting the currently playing track
    if(document.querySelector("#tracks").classList.contains("paused")){  //if paused while hovering , then show play
        track.querySelector("#track-no-play-button").textContent = "play_arrow";
    } else{  //if playing while hovering, then show pause
        // console.log("show pause button");
        track.querySelector("#track-no-play-button").textContent = "pause";
        // console.log(track.querySelector("#track-no-play-button"));
    }
}
else {  // selecting the other tracks 
    //mouse-over
    track.querySelector("#track-no-play-button").textContent = "play_arrow";
    // if(!document.querySelector("#tracks").classList.contains("paused")){  //if currently playing, show pause
    //     document.querySelector("#track-no-play-button").textContent = "pause";
    // }
}

    //show the play or pause button
    if(playTrackNoButtonDiv.classList.contains("hidden")){
        playTrackNoButtonDiv.classList.remove("hidden");
    }
    //hide the track no.
    if(!trackNo.classList.contains("hidden")){
        trackNo.classList.add("hidden");
    }

}

function mouseOut(id, event) {
    let track = document.querySelector(`#${CSS.escape(id)}`);

    // if(!track.classList.contains("selected")){
        let playTrackNoButton = track.querySelector(`#track-no-play-button`);
        let playButtonDiv = track.querySelector(".track-no-play-button-div");
        playButtonDiv.classList.add("hidden");
    
        let trackNo = track.querySelector(".track-no-actual");
        trackNo.classList.remove("hidden");    
    // }

}

const onTrackSelection = (id, event)=>{
  
    document.querySelectorAll("#tracks .track").forEach(trackItem=>{
        if(trackItem.id===id){
            trackItem.classList.add("bg-gray", "selected");
             showPlayButton(id, event);
            
            }
        else {
            trackItem.classList.remove("bg-gray", "selected");
            mouseOut(id, event);
        }
    })
    }



// const timeline = document.querySelector("");

const onAudioMetadataLoaded = ()=>{
    // console.log(audio.duration);
    //Use below code when not using previewURL and using actual song duration
    // totalDuration.textContent = formatTime(audio.duration);
    // 30seconds preview URL
    totalDuration.textContent = formatTime(audio.duration*1000);

};

const onTrackPlayButtonClick = (event,image,name, artist,duration_ms,previewURL, track,playlist)=>{
    console.log("inside onTrackPlayButtonClick");
    // event.stopPropagation();
    console.log("beginning, inside onTrackPlayButtonClick, passed playlist: ", playlist);
    if((prevTrackID===currentTrackID) &&(document.querySelector("#tracks").classList.contains("paused"))){ //if this is a new song
        // console.log("trackIDs: ", prevTrackID, currentTrackID);
        // console.log("inside playTrackButton.onclick and from paused");
        // console.log("currentTIme: ", currentTime);
        audio.currentTime = currentTime;
        // console.log("audio.currentTIme: ", audio.currentTime);
    }
    else {
        audio.src = previewURL;  //use new source for audio if not the same id
    }

    
    // let nowPlaying = document.querySelector(".now-playing");
    nowPlaying.id=track.id;
    nowPlayingTrack = track;
    nowPlayingPlaylist = playlist;
    console.log("nowPlayingPlaylist inside onTrackPlayButtonClick: ", nowPlayingPlaylist);
    const nowPlayingImage = document.querySelector(".now-playing-image");
    nowPlayingImage.src = image.url;

    const nowPlayingTitle = document.querySelector(".now-playing-name");
    nowPlayingTitle.textContent = name;

    const nowPlayingArtist = document.querySelector(".now-playing-artist");
    nowPlayingArtist.textContent = artist;

    audio.removeEventListener("loadedmetadata", onAudioMetadataLoaded);
    audio.addEventListener("loadedmetadata",onAudioMetadataLoaded);
   
    clearInterval(progressInterval); 
    
    //remove green highlight to title and track no for those not playing track
    document.querySelectorAll("#tracks .track").forEach(trackItem=>{
        if(!(trackItem.id===track.id)) {
            // console.log("inside !trackItem.id===track.id");
             trackItem.querySelector(".track-title").classList.add("text-primary");
             trackItem.querySelector(".track-title").classList.remove("text-spotifygreen");
     
             trackItem.querySelector(".track-no-actual").classList.add("text-primary");
             trackItem.querySelector(".track-no-actual").classList.remove("text-spotifygreen");

             if(!trackItem.querySelector(".track-no-play-button-div").classList.contains("hidden")){
                 trackItem.querySelector(".track-no-play-button-div").classList.add("hidden");
             }
            }
            
    })

        //change track title to green
        track.querySelector(".track-title").classList.remove("text-primary");
        track.querySelector(".track-title").classList.add("text-spotifygreen");
        //change track no. to green
        track.querySelector(".track-no-actual").classList.remove("text-primary");
        track.querySelector(".track-no-actual").classList.add("text-spotifygreen");

        // hide play button and show track no. 
        track.querySelector(".track-no-play-button-div").classList.add("hidden");
        track.querySelector(".track-no-actual").classList.remove("hidden");
    if(document.querySelector("#tracks").classList.contains("paused")){  //if paused before click, then play
        // console.log("audio time at play: ", audio.currentTime);
        // console.log("audio source at play: ", audio.src);
        document.querySelector("#tracks").classList.remove("paused");
        playCircle.textContent = "pause_circle "; //while playing, set button to pause
        track.querySelector("#track-no-play-button").textContent = "pause";
        audio.play(); 
        progressInterval = setInterval(() => {
            if(audio.paused){
               return
            } 
            // 30-second preview URL
            currentDuration.textContent = formatTime(audio.currentTime*1000);
            //progress bar width in percentage: 
            progress.style.width = `${((audio.currentTime/audio.duration)*100).toFixed(0)}%`;
            playCircle.textContent = "pause_circle";
            currentTime= audio.currentTime;
            // console.log(currentTime);

        }, 100);
        
        // console.log("Now playing");
    } else if ((prevTrackID!==currentTrackID)){  //playing another track 
        // console.log("inside playing another track");
        document.querySelector("#tracks").classList.remove("paused");
        playCircle.textContent = "pause_circle";  //while playing, set button to pause
        track.querySelector("#track-no-play-button").textContent = "pause";
        audio.play(); 
        progressInterval = setInterval(() => {
            if(audio.paused){
               return
            } 
            // 30-second preview URL
            currentDuration.textContent = formatTime(audio.currentTime*1000);
            //progress bar width in percentage: 
            progress.style.width = `${((audio.currentTime/audio.duration)*100).toFixed(0)}%`;
            playCircle.textContent = "pause_circle";
            currentTime= audio.currentTime;
            // console.log(currentTime);

        }, 100);
        
        console.log("Now playing");
    }
    else{  //if playing before click, then pause if the same id
        if(prevTrackID===currentTrackID){
            document.querySelector("#tracks").classList.add("paused");
            playCircle.textContent = "play_circle"; //while paused show play buttons
            track.querySelector("#track-no-play-button").textContent = "play_arrow";
            // console.log("inside pause");
            audio.pause();
            // currentTime= audio.currentTime;
            // console.log("current time: ", currentTime);
        }
       
    } 



    // track.onmousover = function() {
    //     track.querySelector(".track-no-play-button-div").classList.remove("hidden");
    //     track.querySelector(".track-no-actual").classList.add("hidden");
    // };
    // track.onmouseout = function(event){
    //     track.querySelector(".track-no-actual").classList.remove("hidden");
    //     track.querySelector(".track-no-play-button-div").classList.add("hidden");
    // }
    prevTrackID = track.id;
}

const playOrPauseCircleClicked=()=>{
    let id = nowPlaying.id;
    currentTrackID = nowPlaying.id;
    let tracks = document.querySelector("#tracks");
     let track = tracks?.querySelector(`#${CSS.escape(id)}`);
    // let {artists, name, album, duration_ms, preview_url} = nowPlaying;
    // console.log("nowPlayingTrack: ", nowPlayingTrack);
    if((prevTrackID!==currentTrackID)){
        audio.src = nowPlayingTrack.track.preview_url; 
    }
    // console.log("nowPlayingTrack.preview_url: ", nowPlayingTrack.preview_url);
    audio.currentTime = currentTime;
    // console.log("currenttime in play circle:", currentTime);
    // console.log("audio.ended: ", audio.ended);

    audio.removeEventListener("loadedmetadata", onAudioMetadataLoaded);
    audio.addEventListener("loadedmetadata",onAudioMetadataLoaded);

    if(document.querySelector("#tracks")?.classList.contains("paused") || nowPlaying.classList.contains("paused")){

     document.querySelector("#tracks")?.classList.remove("paused");
     nowPlaying.classList.remove("paused");
     playCircle.textContent = "pause_circle "; //while playing, set button to pause
     if(track){
        track.querySelector("#track-no-play-button").textContent = "pause";
     }
    //  console.log("inside to play on play circle");
     audio.play(); 
     progressInterval = setInterval(() => {
         if(audio.paused){
            return
         } 
         // 30-second preview URL
         currentDuration.textContent = formatTime(audio.currentTime*1000);
         //progress bar width in percentage: 
         progress.style.width = `${((audio.currentTime/audio.duration)*100).toFixed(0)}%`;
         playCircle.textContent = "pause_circle";
         currentTime= audio.currentTime;
         // console.log(currentTime);

     }, 100);

     
    //  console.log("Now playing");
 } 
 else{  //if playing before click, then pause 
         document.querySelector("#tracks")?.classList.add("paused");
         nowPlaying.classList.add("paused");
         playCircle.textContent = "play_circle"; //while paused show play buttons
         if(track){
            track.querySelector("#track-no-play-button").textContent = "play_arrow";
         }
        //  console.log("inside pause");
         audio.pause();
     }

     audio.onended = function(){
        console.log("inside onended");
        document.querySelector("#tracks")?.classList.add("paused");
        nowPlaying.classList.add("paused");
        playCircle.textContent = "play_circle"; //while paused show play buttons
        if(track){
           track.querySelector("#track-no-play-button").textContent = "play_arrow";
        }
     }
     prevTrackID = nowPlaying.id;
}

const prevButtonClicked=()=>{
console.log("nowPlayingPlaylist: ", nowPlayingPlaylist);

}

const nextButtonClicked=()=>{
    console.log("nowPlayingPlaylist: ", nowPlayingPlaylist);
}



const loadPlaylistTracks = (playlist)=>{
    let {tracks} = playlist;
    const trackSections = document.querySelector("#tracks");
    let trackNo=1;
    for (let trackItem of tracks.items){
        let {id, artists, name, album, duration_ms, preview_url} = trackItem.track;
        let track = document.createElement("section");
        track.className = " mb-2 p-1 rounded-md hover:bg-light-black track items-center justify-items-start grid grid-cols-[58px_3fr_2fr_120px] gap-4 text-secondary";
        track.id = id;
       
        let image = album.images.find(img=>img.height===64);
        let artist = Array.from(artists, artist=>artist.name).join(", ");
        track.innerHTML =  
        `<div class="justify-self-end track-no">
            <div class="track-no-actual justify-self-end">${trackNo++}</div>
            <div class="track-no-play-button-div hidden">
                <span id="track-no-play-button" class="material-symbols-outlined" style="font-size:16px">play_arrow</span>
            </div>
        </div>
        <section class="grid  gap-2 grid-cols-[50px_1fr]">
          <img class="h-10 w-10 self-end mb-1" src="${image.url}" alt="">
          <article class="flex flex-col gap-0 justify-items-start">
            <h2 class="track-title text-primary text-base line-clamp-1">${name}</h2>
            <p class="text-xm justify-self-start self-start mb-px">${artist}</p>
          </article>
        </section>
        <p class="text-xm">${album.name} </p>
        <p class="text-xm">${formatTime(duration_ms)} </p> `;


        // const divButton = document.createElement("div");
        // divButton.className = "button-div";
        // const playButton = document.createElement("button");
        // playButton.id = (`play-track${id}`);
        // playButton.className = `track-no-play-button w-full left-0 text-lg invisible`;
        // playButton.textContent = "▷";
        // divButton.appendChild(playButton);
        // track.querySelector(".track-no").appendChild(divButton);
        // console.log("track: ", track);
        trackSections.appendChild(track);
        track.onmouseover = function(event) {showPlayButton(id, event)};
        track.onmouseout = function(event) {mouseOut(id, event)};
        track.onclick =  function(event){onTrackSelection(id,event)};
        let previewURL = preview_url;
        let playButtonDiv = track.querySelector(".track-no-play-button-div");
        let playTrackNoButton = track.querySelector("#track-no-play-button");

        // console.log("trackItem.id and nowPlaying.id: ", id, nowPlaying.id);
        if(!(id===nowPlaying.id)) {
            // console.log("inside !trackItem.id===track.id");
             track.querySelector(".track-title").classList.add("text-primary");
             track.querySelector(".track-title").classList.remove("text-spotifygreen");
     
             track.querySelector(".track-no-actual").classList.add("text-primary");
             track.querySelector(".track-no-actual").classList.remove("text-spotifygreen");

             if(!track.querySelector(".track-no-play-button-div").classList.contains("hidden")){
                 track.querySelector(".track-no-play-button-div").classList.add("hidden");
             }
            }
        else {
            track.querySelector(".track-title").classList.remove("text-primary");
            track.querySelector(".track-title").classList.add("text-spotifygreen");
    
            track.querySelector(".track-no-actual").classList.remove("text-primary");
            track.querySelector(".track-no-actual").classList.add("text-spotifygreen");

            if(!track.querySelector(".track-no-play-button-div").classList.contains("hidden")){
                 track.querySelector(".track-no-play-button-div").classList.add("hidden");
             }
            }
        
        
         playTrackNoButton.onclick = function(event){
            currentTrackID=track.id;
            console.log("playlist passed on onTrackPlayButton: ", tracks.items);
            onTrackPlayButtonClick(event,image,name, artist,duration_ms,previewURL,track, tracks.items);  
         }
         playCircle.onclick = function(){
            console.log("called inside loadPlaylistTracks");
            playOrPauseCircleClicked();  
            // onTrackPlayButtonClick(event,image,name, artist,duration_ms,previewURL,track);  
         }
        
         nextButton.onclick = function(event){
            console.log("called inside loadNowPlayingDefault");
            nextButtonClicked();  
            // onTrackPlayButtonClick(event,image,name, artist,duration_ms,previewURL,nowPlayingTrack);  
         }
         
         prevButton.onclick = function(event){
            console.log("called inside loadNowPlayingDefault");
            prevButtonClicked();  
            // onTrackPlayButtonClick(event,image,name, artist,duration_ms,previewURL,nowPlayingTrack);  
         }
         
    }
}   


const fillContentForPlaylist = async(playlistID)=>{
    const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistID}`); 
    // console.log("playlist from fillContentForPlaylist: ", playlist);
    const playlistContent = document.querySelector(`#page-content`);
    playlistContent.innerHTML = `
    <header id="playlist-header" class=" border-gray border-b-[0.5px] z-10">
            <nav>
              <ul class="grid grid-cols-[58px_3fr_2fr_120px] gap-4 text-secondary py-2">
                <li class="justify-self-end">#</li>
                <li>TITLE</li>
                <li>ALBUM</li>
                <li>🕒</li>
              </ul>
            </nav>
    </header>   
    <section class="mt-4 paused" id="tracks">
    </section>`;

//     <section class="rounded-md hover:bg-light-black track items-center justify-items-start grid grid-cols-[50px_2fr_1fr_50px] gap-4 text-secondary">
//     <p class="justify-self-center">1</p>
//     <section class="grid grid-cols-2 gap-2">
//       <img class="h-8 w-8" src="" alt="">
//       <article class="flex flex-col gap-2">
//         <h2 class="text-primary text-xl">song</h2>
//         <p class="text-xm">artists</p>
//       </article>
//     </section>
//     <p>album</p>
//     <p>1:36</p>
//   </section>
    // console.log("playlist: ", playlist);
    // console.log("playlistContent: ", playlistContent);
    loadPlaylistTracks(playlist);
    // console.log("playlist in loadPlaylistTracks: ", playlist);
     
    

}

const onContentScroll = (event)=>{
    const {scrollTop} = event.target;
    const header = document.querySelector(".header");
    
    
    if(scrollTop >= (header.offsetHeight)){
        header.classList.add("sticky", "top-0", "px-14", "bg-black");
        header.classList.remove("bg-transparent");
    } else 
        {
        header.classList.remove("sticky", "top-0", "bg-black");
        header.classList.add("px-14");
        header.classList.add("bg-transparent");
        }

    if(history.state.type===SECTION_TYPE.PLAYLIST){
        const coverElement = document.querySelector("#cover-content");
        const playlistHeader = document.querySelector("#playlist-header");
        let diff = coverElement.offsetHeight-header.offsetHeight;
        if(scrollTop >=diff){
            playlistHeader.classList.add("fixed","bg-black-secondary");
            playlistHeader.style.width = `calc(100% - 250px)`;
            playlistHeader.style.top = `${header.offsetHeight}px`;
        }
        else {
            playlistHeader.classList.remove("fixed", "bg-spotifyblack");
            playlistHeader.style.width = `revert`;
            playlistHeader.style.top = `revert`;

            // console.log(playlistHeader.style.top);
        }
        // console.log(scrollTop);
        // console.log(playlistHeader.attributes);
    }
}




const loadSection = (section)=>{
    console.log("section: ", section);
    console.log("section.playlist: ", section.playlist);
    if(section.type ==="DASHBOARD"){
        loadPlaylists();
    } else if (section.type==="PLAYLIST") {
        // fillContentForPlaylist(section.playlist);
         fillContentForPlaylist(section.playlist);
    }

     //set #nav-header position:static before using the ff:
     document.querySelector(".content").removeEventListener("scroll", onContentScroll);
     document.querySelector(".content").addEventListener("scroll", onContentScroll);


}

const loadNowPlayingDefault = async()=>{
    // let playlistID = "featured-playlist-items";
    // const section = {type: SECTION_TYPE.PLAYLIST, playlist:"37i9dQZF1DXcZQSjptOQtk"};
    // history.pushState(section, "","");
    // history.pushState(section, "",`/dashboard/playlist/${section.playlist}`);

    const {playlists} = await fetchRequest(`${ENDPOINT.featuredPlaylist}`); 
    console.log("playlists in loadNow: ", playlists);
    let index=1;
    for (let trackItem of playlists.items){
        if(index >1){break}
        var {id} = trackItem;
        
        index++;       
    }
    console.log("id: ", id);

    
 const {tracks} = await fetchRequest(`${ENDPOINT.playlist}/${id}`);
console.log("tracks: ", tracks);
    let trackNo=1;
    nowPlayingPlaylist = tracks.items;
        console.log("nowPlayingPlaylist inside loadNowPlayingDefault : ", nowPlayingPlaylist);

    for (let trackItem of tracks.items){
        if(trackNo > 1){
            break;
        }
        var {name,album,artists, duration_ms,id,preview_url} = trackItem.track;
        nowPlaying.id=id;
        currentTrackID = id;
        nowPlayingTrack = trackItem;
        var previewURL = preview_url;
       var image = album.images.find(img=>img.height===64);
      var artist = Array.from(artists, artist=>artist.name).join(", ");
     totalDuration.textContent = formatTime(duration_ms);
     currentDuration.textContent = "0:00";
      trackNo++;
    }
 console.log("${image.url}   , ${name}, ${artist}, ${formatTime(duration_ms)}: ", image.url, name, artist,formatTime(duration_ms));
 const nowPlayingImage = document.querySelector(".now-playing-image");
 nowPlayingImage.src = image.url;

 const nowPlayingTitle = document.querySelector(".now-playing-name");
 nowPlayingTitle.textContent = name;

 const nowPlayingArtist = document.querySelector(".now-playing-artist");
 nowPlayingArtist.textContent = artist;
 nowPlaying.classList.add("paused");


 playCircle.onclick = function(event){
    console.log("called inside loadNowPlayingDefault");
    playOrPauseCircleClicked();  
    // onTrackPlayButtonClick(event,image,name, artist,duration_ms,previewURL,nowPlayingTrack);  
 }

 nextButton.onclick = function(event){
    console.log("called inside loadNowPlayingDefault");
    nextButtonClicked();  
    // onTrackPlayButtonClick(event,image,name, artist,duration_ms,previewURL,nowPlayingTrack);  
 }
 
 prevButton.onclick = function(event){
    console.log("called inside loadNowPlayingDefault");
    prevButtonClicked();  
    // onTrackPlayButtonClick(event,image,name, artist,duration_ms,previewURL,nowPlayingTrack);  
 }

}




document.addEventListener("DOMContentLoaded",()=>{
    loadUserProfile();
    loadNowPlayingDefault();
    const section = {type: SECTION_TYPE.DASHBOARD};
    // const section = {type: SECTION_TYPE.PLAYLIST, playlist:"37i9dQZF1DXcZQSjptOQtk"};
    history.pushState(section, "","");
    // history.pushState(section, "",`/dashboard/playlist/${section.playlist}`);
    loadSection(section);
    
    


    document.addEventListener("click",()=>{
        const profileMenu = document.getElementById("profile-menu");
        if(!profileMenu.classList.contains("hidden")){
            profileMenu.classList.add("hidden");
        }
    })


    //whenever back button is pressed, it goes back to dashboard
    window.addEventListener("popstate", (event)=>{
        // console.log("event.state", event.state);
        loadSection(event.state);
    })

    

})

