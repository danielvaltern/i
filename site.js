(function () {
  var themeKey = "valtern-theme";
  var stored = localStorage.getItem(themeKey);
  document.documentElement.dataset.theme = stored === "light" ? "light" : "dark";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function initTheme() {
    var btn = qs("[data-theme-toggle]");
    if (!btn) return;

    function sync() {
      var light = document.documentElement.dataset.theme === "light";
      btn.setAttribute("aria-label", light ? "Тёмная тема" : "Светлая тема");
      btn.setAttribute("title", light ? "Тёмная тема" : "Светлая тема");
    }

    sync();
    btn.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      localStorage.setItem(themeKey, next);
      sync();
    });
  }

  function initMenu() {
    var menu = qs("#site-menu");
    var btn = qs("[data-menu-toggle]");
    if (!menu || !btn) return;

    function setOpen(open) {
      menu.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    }

    btn.addEventListener("click", function () {
      setOpen(!menu.classList.contains("open"));
    });

    qsa("a", menu).forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function initReveal() {
    var nodes = qsa(".reveal");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function initPath() {
    qsa("[data-path-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-path-btn");
        var panel = qs('[data-path-panel="' + id + '"]');
        var open = panel && panel.classList.contains("open");
        qsa("[data-path-panel]").forEach(function (p) {
          p.classList.remove("open");
        });
        qsa("[data-path-btn]").forEach(function (b) {
          b.setAttribute("aria-expanded", "false");
        });
        if (!open && panel) {
          panel.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
    var first = qs("[data-path-btn]");
    if (first) first.click();
  }

  function initWorkFilter() {
    var buttons = qsa("[data-filter]");
    var items = qsa("[data-status]");
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        buttons.forEach(function (b) {
          b.classList.toggle("btn-primary", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        var visible = 0;
        items.forEach(function (item) {
          var show = filter === "all" || item.getAttribute("data-status") === filter;
          item.classList.toggle("hidden", !show);
          if (show) visible += 1;
        });
        var empty = qs("[data-filter-empty]");
        if (empty) empty.classList.toggle("hidden", visible > 0);
      });
    });
  }

  function initNotes() {
    var input = qs("[data-notes-search]");
    var tags = qsa("[data-tag]");
    var notes = qsa("[data-note]");
    if (!notes.length) return;
    var activeTag = "все";

    function apply() {
      var needle = input ? input.value.trim().toLowerCase() : "";
      var visible = 0;
      notes.forEach(function (note) {
        var tagsStr = (note.getAttribute("data-tags") || "").toLowerCase();
        var text = (note.getAttribute("data-text") || "").toLowerCase();
        var tagOk = activeTag === "все" || tagsStr.indexOf(activeTag) !== -1;
        var searchOk = !needle || text.indexOf(needle) !== -1;
        var show = tagOk && searchOk;
        note.classList.toggle("hidden", !show);
        if (show) visible += 1;
      });
      var empty = qs("[data-notes-empty]");
      if (empty) empty.classList.toggle("hidden", visible > 0);
    }

    if (input) input.addEventListener("input", apply);
    tags.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeTag = btn.getAttribute("data-tag") || "все";
        tags.forEach(function (b) {
          b.classList.toggle("btn-primary", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        apply();
      });
    });
  }

  function initContact() {
    var form = qs("[data-contact-form]");
    if (!form) return;
    var result = qs("[data-contact-result]");
    var error = qs("[data-contact-error]");
    var copyBtn = qs("[data-contact-copy]");
    var composed = qs("[data-contact-composed]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (error) {
        error.textContent = "";
        error.classList.add("hidden");
      }
      var name = (qs('[name="name"]', form) || {}).value || "";
      var reply = (qs('[name="reply"]', form) || {}).value || "";
      var message = (qs('[name="message"]', form) || {}).value || "";
      var company = (qs('[name="company"]', form) || {}).value || "";

      if (company.trim()) {
        if (result) result.classList.remove("hidden");
        return;
      }
      if (name.trim().length < 2) {
        if (error) {
          error.textContent = "Имя — хотя бы два символа.";
          error.classList.remove("hidden");
        }
        return;
      }
      if (message.trim().length < 10) {
        if (error) {
          error.textContent = "Нужно хотя бы одно короткое предложение.";
          error.classList.remove("hidden");
        }
        return;
      }

      var text = ["Daniel Valtern, Уфа", "От: " + name.trim(), reply.trim() ? "Ответ: " + reply.trim() : "", "", message.trim()]
        .filter(Boolean)
        .join("\n");
      if (composed) composed.value = text;
      if (result) result.classList.remove("hidden");
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (!composed) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(composed.value).then(function () {
            copyBtn.textContent = "Скопировано";
          });
        } else {
          composed.select();
          document.execCommand("copy");
          copyBtn.textContent = "Скопировано";
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initMenu();
    initReveal();
    initPath();
    initWorkFilter();
    initNotes();
    initContact();
  });
})();
