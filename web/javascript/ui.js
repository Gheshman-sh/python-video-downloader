const toggle_theme = document.querySelector(".toggle-theme");
const video_container = document.querySelector(".video");
let ThemeState = 0;

window.addEventListener("load", () => {
  video_container.style.display = "none";

  if (localStorage.getItem("theme") == 0) {
    if (document.classList == "dark") {
      document.body.classList.remove("dark");
    }
    document.body.classList.add("light");
  } else {
    if (document.classList == "light") {
      document.body.classList.remove("light");
    }
    document.body.classList.add("dark");
  }
});

window.addEventListener("resize", () => {
  const minWidth = 1200;
  const minHeight = 800;
  if (window.outerWidth < minWidth || window.outerHeight < minHeight) {
    window.resizeTo(minWidth, minHeight);
  }
});

toggle_theme.addEventListener("click", () => {
  if (document.body.classList == "light") {
    ThemeState = 1;
    localStorage.setItem("theme", ThemeState);
    document.body.classList.remove("light");
    document.body.classList.add("dark");
  } else {
    ThemeState = 0;
    localStorage.setItem("theme", ThemeState);
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }
});

document.getElementById('paste').addEventListener('click', async function() {
  try {
      const text = await navigator.clipboard.readText();
      document.getElementById('Url').value = text;
  } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
  }
});
