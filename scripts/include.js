document.addEventListener("DOMContentLoaded", () => {
  fetch("/header.html")
    .then(res => res.text())
    .then(html => {
      const header = document.getElementById("header");
      if (!header) return;
      header.innerHTML = html;
      bindHeaderPopup();
      bindHeaderDate();
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

function bindHeaderPopup() {
  const button = document.getElementById("header-info-button");
  const popup = document.getElementById("header-info-popup");
  if (!button || !popup) return;

  const open = () => {
    popup.hidden = false;
    popup.style.display = "block";
  };

  const close = () => {
    popup.hidden = true;
    popup.style.display = "none";
  };

  button.addEventListener("click", open);
  const closeButton = popup.querySelector(".close-button");
  if (closeButton) closeButton.addEventListener("click", close);

  popup.addEventListener("click", (event) => {
    if (event.target === popup) close();
  });
}

function bindHeaderDate() {
  const pagedate = document.getElementById("pagedate");
  if (!pagedate) return;

  const d = new Date(document.lastModified);
  const fmt = d.getFullYear().toString() +
    (d.getMonth()+1).toString().padStart(2,'0') +
    d.getDate().toString().padStart(2,'0');

  pagedate.textContent = fmt;
}

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
  div.className = "popup-window";
  div.setAttribute("aria-modal", "true");
  div.innerHTML = `
    <button class="close-button" aria-label="Close">x</button>
    ${panel.content}
  `;

  const closeButton = div.querySelector(".close-button");
  if (closeButton) {
    closeButton.addEventListener("click", () => div.remove());
  }

  div.addEventListener("click", (event) => {
    if (event.target === div) div.remove();
  });

  document.body.appendChild(div);
}

function closePopup() {
  const el = document.getElementById("active-popup");
  if (el) el.remove();
}
