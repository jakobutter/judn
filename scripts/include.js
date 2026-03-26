document.addEventListener("DOMContentLoaded", () => {
  fetch("/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;

      
      const d = new Date(document.lastModified);
      const fmt = d.getFullYear().toString() +
        (d.getMonth()+1).toString().padStart(2,'0') +
        d.getDate().toString().padStart(2,'0');
      document.getElementById("pagedate").innerHTML = fmt;
    })
    .catch(err => console.error("Header load failed:", err));

  
  document.querySelectorAll('body > div').forEach(div => {
    const title = div.querySelector(':scope > a:first-child');
    if (!title) return;
    title.addEventListener('click', () => {
      div.classList.toggle('collapsed');
    });
  });
});

function openPopup() {
  document.getElementById("popup").style.display = "block";
}
function closePopup() {
  document.getElementById("popup").style.display = "none";
}