document.addEventListener("DOMContentLoaded", () => {
  fetch("/arkive.json")
    .then(res => res.json())
    .then(releases => {
      const r = releases.find(r => r.id === pageId);
      if (!r) return;

      document.title = r.title;
      const coverUrl = r.cover;

      window.songs = r.tracks.map(t => ({
        name:   t.name,
        file:   t.file,
        artist: t.artist
      }));

      document.body.insertAdjacentHTML("beforeend", `
        <div style="--color1:${r.txt};--color2:${r.window};font-family:${r.font}">
          <a>${r.title}</a><br>
          <img id="pageArtwork" src="${coverUrl}"><br>
          <section id="track-list"></section><br>
        </div>
      `);

      // — player —
      const audio = new Audio();
      let currentIndex = 0;
      let isPlaying = false;
      const $ = id => document.getElementById(id);
      const playPauseBtn = $('play-pause');
      const prevBtn      = $('prev');
      const nextBtn      = $('next');
      const timeDisplay  = $('time-display');
      const progressBar  = $('progress');
      const scrubBar     = $('scrub-bar');
      const trackList    = $('track-list');

window.setSong = function(index, andPlay = true) {
  currentIndex = ((index % songs.length) + songs.length) % songs.length;
  audio.src = songs[currentIndex].file;
  audio.load();
  renderTrackList();
  if (andPlay) play();
}

      function play() {
        audio.play().catch(() => {});
        isPlaying = true;
        if (playPauseBtn) playPauseBtn.textContent = '⏸︎';
        syncMediaSession();
      }

      function pause() {
        audio.pause();
        isPlaying = false;
        if (playPauseBtn) playPauseBtn.textContent = '▶';
      }

      function formatTime(s) {
        if (!isFinite(s) || isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
      }

      function updateTimeDisplay() {
        const cur = audio.currentTime;
        const dur = audio.duration;
        if (timeDisplay) timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
        if (progressBar) progressBar.style.width = isNaN(dur) ? '0%' : `${(cur / dur) * 100}%`;
      }

      function renderTrackList() {
        if (!trackList) return;
        trackList.innerHTML = songs.map((song, i) => {
          const num = String(i + 1).padStart(2, '0');
          const active = i === currentIndex;
          return `<div class="${active ? 'active' : ''}" onclick="setSong(${i})">
            <strong>${num}</strong> ${active ? `<strong>${song.name}</strong>` : song.name}
          </div>`;
        }).join('');
      }

      function syncMediaSession() {
        if (!('mediaSession' in navigator)) return;
        navigator.mediaSession.metadata = new MediaMetadata({
          title:   songs[currentIndex].name,
          artist:  songs[currentIndex].artist,
          album:   document.title,
          artwork: coverUrl ? [{ src: coverUrl, sizes: '512x512', type: 'image/jpeg' }] : []
        });
        navigator.mediaSession.setActionHandler('play',          play);
        navigator.mediaSession.setActionHandler('pause',         pause);
        navigator.mediaSession.setActionHandler('previoustrack', () => setSong(currentIndex - 1));
        navigator.mediaSession.setActionHandler('nexttrack',     () => setSong(currentIndex + 1));
      }

      if (playPauseBtn) playPauseBtn.addEventListener('click', () => isPlaying ? pause() : play());
      if (prevBtn)      prevBtn.addEventListener('click', () => setSong(currentIndex - 1));
      if (nextBtn)      nextBtn.addEventListener('click', () => setSong(currentIndex + 1));
      if (scrubBar) {
        scrubBar.addEventListener('click', e => {
          if (isNaN(audio.duration)) return;
          audio.currentTime = (e.offsetX / scrubBar.clientWidth) * audio.duration;
        });
      }

      audio.addEventListener('timeupdate',     updateTimeDisplay);
      audio.addEventListener('loadedmetadata', updateTimeDisplay);
      audio.addEventListener('ended',          () => setSong(currentIndex + 1));

      setSong(0, false);
    })
    .catch(err => console.error("arkive load failed:", err));
});