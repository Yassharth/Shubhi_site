/* Shubhi's Studio — shared behaviour: theme, progress, quiz, shortcuts */
(function () {
  "use strict";

  var STORE = "shubhi.progress.v1";
  var THEME = "shubhi.theme";

  /* ---------- storage helpers (never let a blocked localStorage break the page) ---------- */
  function read() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; }
    catch (e) { return {}; }
  }
  function write(data) {
    try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  /* ---------- theme ---------- */
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      if (!cur) {
        cur = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      var next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(THEME, next); } catch (e) { /* ignore */ }
      toggle.setAttribute("aria-label", next === "dark" ? "Switch to light paper" : "Switch to dark paper");
    });
  }

  /* ---------- collapsed subject menu (phones) ---------- */
  var navmenu = document.querySelector("[data-navmenu]");
  if (navmenu) {
    document.addEventListener("click", function (ev) {
      if (navmenu.open && !navmenu.contains(ev.target)) navmenu.open = false;
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && navmenu.open) {
        navmenu.open = false;
        navmenu.querySelector("summary").focus();
      }
    });
    // a link to the page you are already on would not navigate, so close it by hand
    navmenu.addEventListener("click", function (ev) {
      if (ev.target.closest("a")) navmenu.open = false;
    });
  }

  /* ---------- flag tables that scroll sideways, so the fade only shows when it should ---------- */
  /* Labs build their own tables after this file runs, so the list is re-queried
     each time rather than captured once. */
  function markScrollers() {
    document.querySelectorAll(".scroller").forEach(function (sc) {
      var more = sc.scrollWidth - sc.clientWidth - sc.scrollLeft > 4;
      sc.setAttribute("data-more", more ? "1" : "0");
    });
  }
  markScrollers();
  window.addEventListener("load", markScrollers);
  window.addEventListener("resize", markScrollers);
  document.addEventListener("scroll", function (ev) {
    if (ev.target && ev.target.classList && ev.target.classList.contains("scroller")) markScrollers();
  }, true);
  [250, 700, 1500].forEach(function (t) { setTimeout(markScrollers, t); });

  /* ---------- progress: opening a chapter counts as having looked at it ---------- */
  var subject = document.body.getAttribute("data-subject");

  if (subject) {
    var opened = read();
    var mine = opened[subject] || [];

    document.querySelectorAll(".chapter").forEach(function (det) {
      var id = det.getAttribute("data-ch");
      if (mine.indexOf(id) !== -1) det.setAttribute("data-seen", "true");

      det.addEventListener("toggle", function () {
        if (!det.open) return;
        var data = read();
        var list = data[subject] || [];
        if (list.indexOf(id) === -1) {
          list.push(id);
          data[subject] = list;
          write(data);
          det.setAttribute("data-seen", "true");
          paintSubjectProgress();
        }
      });
    });

    paintSubjectProgress();
  }

  function paintSubjectProgress() {
    var bar = document.querySelector("[data-progress-bar]");
    var label = document.querySelector("[data-progress-label]");
    if (!bar && !label) return;
    var total = document.querySelectorAll(".chapter").length;
    var done = (read()[subject] || []).length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    if (bar) bar.style.width = pct + "%";
    if (label) label.textContent = done + " of " + total + " opened";
  }

  /* ---------- home page: fill each chip's bar, and the tally ---------- */
  var chips = document.querySelectorAll("[data-chip]");
  if (chips.length) {
    var data = read();
    var totalDone = 0, totalAll = 0, started = 0;

    chips.forEach(function (chip) {
      var id = chip.getAttribute("data-chip");
      var count = parseInt(chip.getAttribute("data-count"), 10) || 0;
      var done = (data[id] || []).length;
      if (done > count) done = count;
      totalDone += done; totalAll += count;
      if (done > 0) started++;
      var fill = chip.querySelector(".chip-bar i");
      if (fill) fill.style.width = (count ? (done / count) * 100 : 0) + "%";
      var n = chip.querySelector(".chip-n");
      if (n) n.textContent = done ? done + " / " + count + " read" : count + " chapters";
    });

    set("[data-tally-chapters]", totalDone + " / " + totalAll);
    set("[data-tally-subjects]", started + " / " + chips.length);
    var pct = totalAll ? Math.round((totalDone / totalAll) * 100) : 0;
    set("[data-tally-pct]", pct + "%");
  }

  function set(sel, text) {
    var el = document.querySelector(sel);
    if (el) el.textContent = text;
  }

  /* ---------- surprise me: jump to a random chapter ---------- */
  var surprise = document.querySelector("[data-surprise]");
  if (surprise) {
    surprise.addEventListener("click", function (e) {
      e.preventDefault();
      var list = [];
      document.querySelectorAll("[data-chip]").forEach(function (chip) {
        var href = chip.querySelector("a").getAttribute("href");
        var n = parseInt(chip.getAttribute("data-count"), 10) || 1;
        list.push({ href: href, n: n });
      });
      if (!list.length) return;
      var pick = list[Math.floor(Math.random() * list.length)];
      var which = Math.floor(Math.random() * pick.n) + 1;
      window.location.href = pick.href + "?open=" + which;
    });
  }

  /* ---------- deep link: ?open=3 opens that chapter ---------- */
  var want = new URLSearchParams(window.location.search).get("open");
  if (want) {
    var all = document.querySelectorAll(".chapter");
    var target = all[parseInt(want, 10) - 1];
    if (target) {
      target.open = true;
      requestAnimationFrame(function () {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  /* ---------- expand / collapse all ---------- */
  var expander = document.querySelector("[data-expand]");
  if (expander) {
    expander.addEventListener("click", function () {
      var all = document.querySelectorAll(".chapter");
      var anyClosed = Array.prototype.some.call(all, function (d) { return !d.open; });
      all.forEach(function (d) { d.open = anyClosed; });
      expander.textContent = anyClosed ? "Collapse all" : "Open all";
    });
  }

  /* ---------- quiz ---------- */
  document.querySelectorAll("[data-quiz]").forEach(function (quiz) {
    var questions = quiz.querySelectorAll(".q");
    var answered = 0, correct = 0;

    questions.forEach(function (q) {
      var right = parseInt(q.getAttribute("data-a"), 10);
      var opts = q.querySelectorAll(".opt");
      var why = q.querySelector(".why");

      opts.forEach(function (opt, i) {
        opt.addEventListener("click", function () {
          if (q.getAttribute("data-done")) return;
          q.setAttribute("data-done", "1");

          opts.forEach(function (o, j) {
            o.disabled = true;
            if (j === right) o.classList.add("right");
          });
          if (i !== right) opt.classList.add("wrong"); else correct++;
          answered++;

          if (why) why.hidden = false;
          var verdict = q.querySelector("[data-verdict]");
          if (verdict) verdict.textContent = i === right ? "Correct." : "Not this time.";

          if (answered === questions.length) showScore();
        });
      });
    });

    function showScore() {
      var box = quiz.parentNode.querySelector("[data-score]");
      if (!box) return;
      box.hidden = false;
      box.querySelector("strong").textContent = correct + " / " + questions.length;
      var msg = box.querySelector("p");
      if (msg) {
        msg.textContent =
          correct === questions.length ? "Every one. Go and draw something." :
          correct >= questions.length - 1 ? "Nearly perfect. Reread the one you missed." :
          correct >= questions.length / 2 ? "Solid. The explanations above cover the gaps." :
          "Worth another pass through the chapters, then try again.";
      }
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    var reset = quiz.parentNode.querySelector("[data-retry]");
    if (reset) {
      reset.addEventListener("click", function () { window.location.reload(); });
    }
  });
})();
