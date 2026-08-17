document.addEventListener("DOMContentLoaded", () => {
  fetch("/arkive.json")
    .then(res => res.json())
    .then(releases => {
      const r = releases.find(r => r.id === pageId);
      if (!r) return;

      document.title = r.title;

      window.songs = r.tracks.map(t => ({
        name:   t.name,
        file:   t.file,
        artist: t.artist
      }));

      document.body.insertAdjacentHTML("beforeend", `
        <div>
          <a>${r.title}</a><br>
          <img id="pageArtwork" src="${r.cover}"><br>
          <section id="track-list"></section><br>
        </div>
      `);

      window.pageArtwork = document.getElementById("pageArtwork");

      const script = document.createElement("script");
      script.src = "/scripts/musicscript.js";
      document.body.appendChild(script);
    })
    .catch(err => console.error("arkive load failed:", err));
});