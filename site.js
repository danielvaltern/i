(function () {
  var nav = document.querySelector(".edge-navigation");
  var toggle = document.getElementById("edge-toggle");
  var menu = document.getElementById("edge-menu");
  if (!nav || !toggle || !menu) return;

  function setOpen(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) menu.removeAttribute("inert");
    else menu.setAttribute("inert", "");
  }

  toggle.addEventListener("click", function () {
    setOpen(!nav.classList.contains("open"));
  });

  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setOpen(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", function (e) {
    if (!nav.classList.contains("open")) return;
    if (!nav.contains(e.target)) setOpen(false);
  });
})();
