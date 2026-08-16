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

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
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