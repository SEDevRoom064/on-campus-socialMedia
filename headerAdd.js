document.addEventListener("DOMContentLoaded", () => {
  fetch("header")
    .then(res => {
      if (!res.ok) {
        return fetch("header.html"); // Try fallback
      }
      return res;
    })
    .then(res => res.text())
    .then(html => {
      document.getElementById("header-placeholder").innerHTML = html;
    })
    .catch(err => console.error("Header load error:", err));
});
