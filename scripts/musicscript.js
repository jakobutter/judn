
    let currentSongIndex = 0;
    let audio = new Audio(songs[currentSongIndex].file);
    let isPlaying = false;

const albumName = document.title;
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const timeDisplay = document.getElementById('time-display');
    const progressBar = document.getElementById('progress');
    const scrubBar = document.getElementById('scrub-bar');
    const trackList = document.getElementById('track-list');

function updateTrackList() {
    trackList.innerHTML = songs.map((song, index) => {
        // Format number with leading zero if under 10
        const trackNumber = String(index + 1).padStart(2, '0');

        // Song name: bold if active, plain otherwise
        const songName = index === currentSongIndex 
            ? `<strong>${song.name}</strong>` 
            : song.name;

        // Number is always bold
        return `<div class="${index === currentSongIndex ? 'active' : ''}" onclick="playSelectedSong(${index})">
            <strong>${trackNumber}</strong> ${songName}
        </div>`;
    }).join('');
}

    function updateTimeDisplay() {
        const currentTime = Math.floor(audio.currentTime);
        const duration = Math.floor(audio.duration);
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        progressBar.style.width = `${(currentTime / duration) * 100}%`;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function playSong() {
        audio.play();
        isPlaying = true;
        playPauseButton.textContent = "⏸︎";
        updateMediaSession();
    }

    function pauseSong() {
        audio.pause();
        isPlaying = false;
        playPauseButton.textContent = "▶";
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        audio.src = songs[currentSongIndex].file;
        updateTrackList();
        playSong();
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        audio.src = songs[currentSongIndex].file;
        updateTrackList();
        playSong();
    }

    function playSelectedSong(index) {
        currentSongIndex = index;
        audio.src = songs[currentSongIndex].file;
        updateTrackList();
        playSong();
    }

function updateMediaSession() {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songs[currentSongIndex].name,
            artist: songs[currentSongIndex].artist,
            album: albumName, // use <title> from the HTML
            artwork: [
                { src: pageArtwork.src, sizes: '512x512', type: 'image/jpeg' }
            ]
        });
        navigator.mediaSession.setActionHandler('play', playSong);
        navigator.mediaSession.setActionHandler('pause', pauseSong);
        navigator.mediaSession.setActionHandler('previoustrack', prevSong);
        navigator.mediaSession.setActionHandler('nexttrack', nextSong);
    }
}

    playPauseButton.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    prevButton.addEventListener('click', prevSong);
    nextButton.addEventListener('click', nextSong);

    scrubBar.addEventListener('click', (event) => {
        const scrubberWidth = scrubBar.clientWidth;
        const clickPosition = event.offsetX;
        const newTime = (clickPosition / scrubberWidth) * audio.duration;
        audio.currentTime = newTime;
    });

    audio.addEventListener('timeupdate', updateTimeDisplay);
    audio.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length; // Move to the next song
        audio.src = songs[currentSongIndex].file; // Update the audio source
        updateTrackList(); // Refresh the track list display
        playSong(); // Play the next song
    });

    updateTrackList();