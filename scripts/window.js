document.querySelectorAll('body > div').forEach(div => {
  const title = div.querySelector(':scope > a:first-child');
  if (!title) return;
  title.addEventListener('click', () => {
    div.classList.toggle('collapsed');
  });
});

const d = new Date(document.lastModified);
const fmt = d.getFullYear().toString() +
  (d.getMonth()+1).toString().padStart(2,'0') +
  d.getDate().toString().padStart(2,'0');
document.getElementById("pagedate").innerHTML = fmt;