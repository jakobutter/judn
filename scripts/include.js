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

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
} 

let panels = [];

fetch("/panels.json")
  .then(res => res.json())
  .then(data => { panels = data; });

function openPopup(id) {
  const panel = panels.find(p => p.id === id);
  if (!panel) return;
  const existing = document.getElementById("active-popup");
  if (existing) existing.remove();
  const div = document.createElement("div");
  div.id = "active-popup";
  div.style = "display:block; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:999";
  div.innerHTML = `
    <button onclick="closePopup()" style="position:absolute; top:2px; right:2px">x</button>
    ${panel.content}
  `;
  document.body.appendChild(div);
}

function closePopup() {
  const el = document.getElementById("active-popup");
  if (el) el.remove();
}
