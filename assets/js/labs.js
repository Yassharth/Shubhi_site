/* Shubhi's Studio — interactive labs.
   build.py emits <div class="lab" data-lab="NAME"></div>; each builder below
   fills in its own markup and wires itself up. */
(function () {
  "use strict";

  var LABS = {};
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function head(root, title, sub) {
    return '<h3>' + title + '</h3><p class="lab-sub">' + sub + '</p>';
  }

  /* =========================================================
     MATHS — Venn diagram set builder
     ========================================================= */
  LABS.venn = function (root) {
    var items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var state = { 3: "both", 4: "both", 1: "a", 2: "a", 5: "b", 6: "b" };
    var ORDER = { none: "a", a: "both", both: "b", b: "none" };

    root.innerHTML = head(root, "Build your own Venn diagram",
      "Click a number to move it: set A, then the overlap, then set B, then out again.") +
      '<div class="chipset" data-nums style="margin-bottom:1rem"></div>' +
      '<div class="lab-stage"><svg viewBox="0 0 420 240" role="img" aria-label="Venn diagram of sets A and B">' +
      '<circle cx="165" cy="120" r="92" fill="var(--subject)" fill-opacity=".16" stroke="var(--ink)" stroke-width="2.5"/>' +
      '<circle cx="255" cy="120" r="92" fill="var(--subject)" fill-opacity=".16" stroke="var(--ink)" stroke-width="2.5"/>' +
      '<text x="88" y="48" font-size="20" font-weight="800" fill="var(--ink)">A</text>' +
      '<text x="320" y="48" font-size="20" font-weight="800" fill="var(--ink)">B</text>' +
      '<text x="120" y="120" data-zone="a" text-anchor="middle" font-size="15" fill="var(--ink)"></text>' +
      '<text x="210" y="120" data-zone="both" text-anchor="middle" font-size="15" fill="var(--ink)"></text>' +
      '<text x="300" y="120" data-zone="b" text-anchor="middle" font-size="15" fill="var(--ink)"></text>' +
      '</svg></div>' +
      '<div class="lab-readout">' +
      '<span class="pill" data-union></span><span class="pill" data-inter></span>' +
      '<span class="pill muted" data-outside></span></div>';

    var holder = $("[data-nums]", root);

    function render() {
      holder.innerHTML = "";
      items.forEach(function (n) {
        var where = state[n] || "none";
        var b = document.createElement("button");
        b.className = "tog" + (where !== "none" ? " on" : "");
        b.type = "button";
        b.textContent = n;
        b.setAttribute("aria-label", n + ", currently " +
          (where === "none" ? "outside both sets" : where === "both" ? "in both sets" : "in set " + where.toUpperCase()));
        b.addEventListener("click", function () {
          state[n] = ORDER[state[n] || "none"];
          render();
        });
        holder.appendChild(b);
      });

      var zones = { a: [], b: [], both: [], none: [] };
      items.forEach(function (n) { zones[state[n] || "none"].push(n); });

      ["a", "b", "both"].forEach(function (z) {
        $('[data-zone="' + z + '"]', root).textContent = zones[z].join("  ");
      });

      var A = zones.a.concat(zones.both).sort(num);
      var B = zones.b.concat(zones.both).sort(num);
      var union = zones.a.concat(zones.both, zones.b).sort(num);

      $("[data-union]", root).textContent = "A ∪ B = {" + union.join(", ") + "}  ·  n = " + union.length;
      $("[data-inter]", root).textContent = "A ∩ B = {" + zones.both.join(", ") + "}  ·  n = " + zones.both.length;
      $("[data-outside]", root).textContent = "n(A) = " + A.length + ", n(B) = " + B.length +
        (zones.none.length ? "  ·  outside: " + zones.none.length : "");
    }
    function num(x, y) { return x - y; }
    render();
  };

  /* =========================================================
     MATHS — mean, median, mode with a live bar graph
     ========================================================= */
  LABS.stats = function (root) {
    var vals = [4, 7, 4, 9, 11, 6];

    root.innerHTML = head(root, "Mean, median and mode",
      "Change the numbers and watch the three averages disagree.") +
      '<div class="lab-row"><label class="lab-field" style="flex:1 1 240px">' +
      '<span>Numbers, separated by commas</span>' +
      '<input type="text" data-in value="' + vals.join(", ") + '" inputmode="numeric"></label>' +
      '<button class="btn btn-sm" type="button" data-skew>Add an outlier</button></div>' +
      '<div class="lab-stage"><svg viewBox="0 0 440 200" data-chart role="img" aria-label="Bar graph of the numbers"></svg></div>' +
      '<div class="lab-readout"><span class="pill" data-mean></span><span class="pill" data-median></span>' +
      '<span class="pill" data-mode></span></div><p class="lab-sub" data-note style="margin:.8rem 0 0"></p>';

    var input = $("[data-in]", root);

    function parse() {
      return input.value.split(/[,\s]+/).map(Number).filter(function (n) {
        return !isNaN(n) && isFinite(n);
      }).slice(0, 14);
    }

    function draw() {
      var v = parse();
      var svg = $("[data-chart]", root);
      if (!v.length) { svg.innerHTML = ""; return; }

      var max = Math.max.apply(null, v.concat([1]));
      var w = 440 / v.length, bw = Math.min(w * 0.62, 46);
      var parts = [];
      v.forEach(function (n, i) {
        var h = Math.max(2, (n / max) * 140);
        var x = i * w + (w - bw) / 2;
        parts.push('<rect x="' + x.toFixed(1) + '" y="' + (160 - h).toFixed(1) + '" width="' + bw.toFixed(1) +
          '" height="' + h.toFixed(1) + '" rx="4" fill="var(--subject)" stroke="var(--ink)" stroke-width="2"/>');
        parts.push('<text x="' + (x + bw / 2).toFixed(1) + '" y="180" text-anchor="middle" font-size="13" fill="var(--ink)">' + n + '</text>');
      });

      var mean = v.reduce(function (a, b) { return a + b; }, 0) / v.length;
      var my = 160 - (mean / max) * 140;
      parts.push('<line x1="0" y1="' + my.toFixed(1) + '" x2="440" y2="' + my.toFixed(1) +
        '" stroke="var(--ink)" stroke-width="2" stroke-dasharray="7 5"/>');
      parts.push('<text x="436" y="' + (my - 6).toFixed(1) + '" text-anchor="end" font-size="12" font-weight="700" fill="var(--ink)">mean</text>');
      svg.innerHTML = parts.join("");

      var sorted = v.slice().sort(function (a, b) { return a - b; });
      var mid = Math.floor(sorted.length / 2);
      var median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

      var tally = {}, best = 0;
      sorted.forEach(function (n) { tally[n] = (tally[n] || 0) + 1; best = Math.max(best, tally[n]); });
      var modes = Object.keys(tally).filter(function (k) { return tally[k] === best; });
      var modeText = best < 2 ? "no mode" : modes.join(", ");

      $("[data-mean]", root).textContent = "Mean " + round(mean);
      $("[data-median]", root).textContent = "Median " + round(median);
      $("[data-mode]", root).textContent = "Mode " + modeText;

      var gap = Math.abs(mean - median);
      $("[data-note]", root).textContent = gap < 0.5
        ? "Mean and median agree closely, so the data is fairly evenly spread."
        : "Mean and median are " + round(gap) + " apart. An extreme value is dragging the mean away from the middle.";
    }

    function round(n) { return Math.round(n * 100) / 100; }

    input.addEventListener("input", draw);
    $("[data-skew]", root).addEventListener("click", function () {
      input.value = parse().concat([98]).join(", ");
      draw();
    });
    draw();
  };

  /* =========================================================
     PHYSICS — reflection bench
     ========================================================= */
  LABS.reflection = function (root) {
    var mode = "one", kind = "plane", angle = 45;

    root.innerHTML = head(root, "Reflection bench",
      "Angles are always measured from the normal, the dotted line. That is the whole trick.") +
      '<div class="lab-row">' +
      '<div class="chipset" data-mode>' +
      '<button class="tog on" type="button" data-m="one">One ray</button>' +
      '<button class="tog" type="button" data-m="many">Parallel rays</button></div>' +
      '<div class="chipset" data-kind hidden>' +
      '<button class="tog on" type="button" data-k="plane">Plane</button>' +
      '<button class="tog" type="button" data-k="concave">Concave</button>' +
      '<button class="tog" type="button" data-k="convex">Convex</button></div></div>' +
      '<div class="lab-row" data-anglerow><label class="lab-field" style="flex:1 1 220px">' +
      '<span>Angle of incidence</span><input type="range" min="5" max="85" value="45" data-angle></label></div>' +
      '<div class="lab-stage"><svg viewBox="0 0 460 205" data-stage role="img" aria-label="Ray diagram"></svg></div>' +
      '<div class="lab-readout" data-out></div>';

    var svg = $("[data-stage]", root);

    function drawOne() {
      svg.setAttribute("viewBox", "0 0 460 205");
      var a = angle * Math.PI / 180;
      var P = { x: 230, y: 170 };       // point of incidence on a horizontal mirror
      var L = 150;
      // incident ray arrives from upper left, reflected leaves to upper right
      var inc = { x: P.x - Math.sin(a) * L, y: P.y - Math.cos(a) * L };
      var ref = { x: P.x + Math.sin(a) * L, y: P.y - Math.cos(a) * L };

      svg.innerHTML =
        '<line x1="40" y1="170" x2="420" y2="170" stroke="var(--ink)" stroke-width="4"/>' +
        hatch(40, 420, 170) +
        '<line x1="' + P.x + '" y1="40" x2="' + P.x + '" y2="190" stroke="var(--ink-soft)" stroke-width="2" stroke-dasharray="6 5"/>' +
        '<text x="' + (P.x + 6) + '" y="36" font-size="12" fill="var(--ink-soft)">normal</text>' +
        ray(inc.x, inc.y, P.x, P.y, true) +
        ray(P.x, P.y, ref.x, ref.y, false) +
        arc(P, -a, "i = " + angle + "°") +
        arc(P, a, "r = " + angle + "°") +
        '<circle cx="' + P.x + '" cy="' + P.y + '" r="4.5" fill="var(--ink)"/>';

      $("[data-out]", root).innerHTML =
        '<span class="pill">Angle of incidence ' + angle + '°</span>' +
        '<span class="pill">Angle of reflection ' + angle + '°</span>' +
        '<span class="pill muted">Measured from the normal, not the mirror</span>';
    }

    function arc(P, signed, label) {
      var r = 46, a0 = -Math.PI / 2, a1 = -Math.PI / 2 + signed;
      var x0 = P.x + r * Math.cos(a0), y0 = P.y + r * Math.sin(a0);
      var x1 = P.x + r * Math.cos(a1), y1 = P.y + r * Math.sin(a1);
      var sweep = signed > 0 ? 1 : 0;
      var mid = -Math.PI / 2 + signed / 2;
      return '<path d="M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 0 ' + sweep + ' ' +
        x1.toFixed(1) + ' ' + y1.toFixed(1) + '" fill="none" stroke="var(--subject)" stroke-width="2"/>' +
        '<text x="' + (P.x + (r + 20) * Math.cos(mid)).toFixed(1) + '" y="' + (P.y + (r + 20) * Math.sin(mid)).toFixed(1) +
        '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--subject)">' + label + '</text>';
    }

    function ray(x1, y1, x2, y2, incoming) {
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      var ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) +
        '" stroke="' + (incoming ? "var(--subject)" : "var(--ink)") + '" stroke-width="3"/>' +
        '<path d="M-7,-5 L0,0 L-7,5" fill="none" stroke="' + (incoming ? "var(--subject)" : "var(--ink)") +
        '" stroke-width="3" transform="translate(' + mx.toFixed(1) + ',' + my.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')"/>';
    }

    function hatch(x0, x1, y) {
      var out = [];
      for (var x = x0; x < x1; x += 14) {
        out.push('<line x1="' + x + '" y1="' + (y + 2) + '" x2="' + (x - 9) + '" y2="' + (y + 13) +
          '" stroke="var(--ink-soft)" stroke-width="2"/>');
      }
      return out.join("");
    }

    function drawMany() {
      svg.setAttribute("viewBox", "0 0 460 260");
      var R = 230, cx, parts = [], heights = [-54, -27, 0, 27, 54], axisY = 130, poleX = 300;
      var surf, note;

      if (kind === "plane") { note = "Parallel rays stay parallel. A plane mirror never focuses light."; }
      else if (kind === "concave") { note = "Parallel rays converge to the principal focus, halfway to the centre of curvature."; }
      else { note = "Parallel rays spread apart. Traced back, they seem to come from a focus behind the mirror."; }

      cx = kind === "concave" ? poleX - R : poleX + R;

      // mirror surface
      if (kind === "plane") {
        surf = '<line x1="' + poleX + '" y1="' + (axisY - 75) + '" x2="' + poleX + '" y2="' + (axisY + 75) + '" stroke="var(--ink)" stroke-width="4"/>';
      } else {
        var pts = [];
        for (var y = -75; y <= 75; y += 3) {
          var dx = Math.sqrt(Math.max(0, R * R - y * y));
          var x = kind === "concave" ? cx + dx : cx - dx;
          pts.push(x.toFixed(1) + "," + (axisY + y).toFixed(1));
        }
        surf = '<polyline points="' + pts.join(" ") + '" fill="none" stroke="var(--ink)" stroke-width="4"/>';
      }

      parts.push('<line x1="30" y1="' + axisY + '" x2="440" y2="' + axisY + '" stroke="var(--ink-soft)" stroke-width="1.5" stroke-dasharray="5 5"/>');
      parts.push(surf);

      heights.forEach(function (h) {
        var px, nx, ny;
        if (kind === "plane") {
          px = poleX; nx = -1; ny = 0;
        } else {
          var dx = Math.sqrt(Math.max(0, R * R - h * h));
          px = kind === "concave" ? cx + dx : cx - dx;
          nx = (cx - px); ny = (axisY - (axisY + h));
          var len = Math.hypot(nx, ny); nx /= len; ny /= len;
        }
        var py = axisY + h;
        // incident ray, parallel to the axis
        parts.push('<line x1="40" y1="' + py + '" x2="' + px.toFixed(1) + '" y2="' + py + '" stroke="var(--subject)" stroke-width="2.5"/>');

        // reflect d=(1,0) about the normal
        var dot = 1 * nx + 0 * ny;
        var rx = 1 - 2 * dot * nx, ry = 0 - 2 * dot * ny;
        var t = 190;
        parts.push('<line x1="' + px.toFixed(1) + '" y1="' + py + '" x2="' + (px + rx * t).toFixed(1) + '" y2="' + (py + ry * t).toFixed(1) +
          '" stroke="var(--ink)" stroke-width="2.5"/>');

        if (kind === "convex") {
          parts.push('<line x1="' + px.toFixed(1) + '" y1="' + py + '" x2="' + (px - rx * 120).toFixed(1) + '" y2="' + (py - ry * 120).toFixed(1) +
            '" stroke="var(--ink-soft)" stroke-width="1.5" stroke-dasharray="4 4"/>');
        }
      });

      if (kind !== "plane") {
        var fx = kind === "concave" ? poleX - R / 2 : poleX + R / 2;
        parts.push('<circle cx="' + fx.toFixed(1) + '" cy="' + axisY + '" r="4" fill="var(--subject)"/>');
        parts.push('<text x="' + fx.toFixed(1) + '" y="' + (axisY + 22) + '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--subject)">F</text>');
      }

      svg.innerHTML = parts.join("");
      $("[data-out]", root).innerHTML = '<span class="pill">' + kind + ' mirror</span><span class="pill muted">' + note + '</span>';
    }

    function render() { mode === "one" ? drawOne() : drawMany(); }

    $$("[data-mode] .tog", root).forEach(function (b) {
      b.addEventListener("click", function () {
        mode = b.getAttribute("data-m");
        $$("[data-mode] .tog", root).forEach(function (o) { o.classList.toggle("on", o === b); });
        $("[data-kind]", root).hidden = mode === "one";
        $("[data-anglerow]", root).hidden = mode !== "one";
        render();
      });
    });
    $$("[data-kind] .tog", root).forEach(function (b) {
      b.addEventListener("click", function () {
        kind = b.getAttribute("data-k");
        $$("[data-kind] .tog", root).forEach(function (o) { o.classList.toggle("on", o === b); });
        render();
      });
    });
    $("[data-angle]", root).addEventListener("input", function (e) {
      angle = +e.target.value; render();
    });
    render();
  };

  /* =========================================================
     CHEMISTRY — particle box
     ========================================================= */
  LABS.states = function (root) {
    root.innerHTML = head(root, "The particle box",
      "Same particles throughout. Only their spacing and speed change.") +
      '<div class="lab-row"><label class="lab-field" style="flex:1 1 260px">' +
      '<span>Heat the box</span><input type="range" min="0" max="100" value="12" data-temp></label></div>' +
      '<div class="lab-stage"><canvas data-canvas width="440" height="240" style="width:100%;height:auto;border-radius:10px" aria-label="Particles in a box, arranged by temperature"></canvas></div>' +
      '<div class="lab-readout"><span class="pill" data-state></span><span class="pill muted" data-desc></span></div>';

    var cv = $("[data-canvas]", root), ctx = cv.getContext("2d");
    var N = 64, parts = [], temp = 12;

    for (var i = 0; i < N; i++) {
      var col = i % 8, row = Math.floor(i / 8);
      parts.push({
        hx: 70 + col * 40, hy: 40 + row * 24,          // home position in the solid lattice
        x: 70 + col * 40, y: 40 + row * 24,
        vx: (Math.random() - .5), vy: (Math.random() - .5)
      });
    }

    function label() {
      if (temp < 34) return ["Solid", "Particles vibrate about fixed positions. Fixed shape, fixed volume."];
      if (temp < 67) return ["Liquid", "Particles stay close but slide past each other. Fixed volume, shape of the container."];
      return ["Gas", "Particles are far apart and fast. No fixed shape and no fixed volume."];
    }

    function step() {
      var L = label();
      $("[data-state]", root).textContent = L[0];
      $("[data-desc]", root).textContent = L[1];

      ctx.clearRect(0, 0, 440, 240);
      ctx.strokeStyle = getComputedStyle(root).getPropertyValue("--paper-edge");
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 14, 400, 212);

      var fill = getComputedStyle(root).getPropertyValue("--subject").trim() || "#0E95D6";
      var ink = getComputedStyle(root).getPropertyValue("--ink").trim() || "#241B4A";
      var energy = temp / 100;

      parts.forEach(function (p) {
        if (temp < 34) {
          var j = energy * 11;
          p.x = p.hx + (Math.random() - .5) * j;
          p.y = p.hy + (Math.random() - .5) * j;
        } else {
          var sp = (temp - 30) / 22;
          p.x += p.vx * sp; p.y += p.vy * sp;
          if (temp < 67) {
            // liquid: particles settle under a loose surface, free to slide
            p.y += 0.28;
            if (p.y > 212) { p.y = 212; p.vy *= -0.45; }
          }
          if (p.x < 28 || p.x > 412) { p.vx *= -1; p.x = Math.max(28, Math.min(412, p.x)); }
          if (p.y < 22 || p.y > 218) { p.vy *= -1; p.y = Math.max(22, Math.min(218, p.y)); }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = fill; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke();
      });
    }

    $("[data-temp]", root).addEventListener("input", function (e) {
      temp = +e.target.value;
      if (reduced) step();
    });

    if (reduced) { step(); }
    else { (function loop() { step(); requestAnimationFrame(loop); })(); }
  };

  /* =========================================================
     CHEMISTRY — pick the separation method
     ========================================================= */
  LABS.separation = function (root) {
    var cases = [
      { m: "Sand in water", a: "Filtration", why: "Sand is insoluble, so it stays on the filter paper as residue." },
      { m: "Salt dissolved in water, and you want the salt", a: "Evaporation", why: "Boil the water off and the dissolved salt is left behind as crystals." },
      { m: "Salt dissolved in water, and you want the water", a: "Distillation", why: "Evaporate, then condense the vapour back. That is the only way to keep the liquid." },
      { m: "The different dyes in black ink", a: "Chromatography", why: "Each dye travels a different distance up the paper, so they separate into bands." },
      { m: "Iron filings mixed with sulphur powder", a: "Magnetic separation", why: "Iron is magnetic and sulphur is not, so a magnet lifts out the filings." },
      { m: "Cream from milk", a: "Centrifugation", why: "Spinning fast throws the denser liquid outward, leaving lighter cream nearer the centre." }
    ];
    var methods = ["Filtration", "Evaporation", "Distillation", "Chromatography", "Magnetic separation", "Centrifugation"];
    var i = 0, score = 0, done = false;

    root.innerHTML = head(root, "Which separation method?",
      "Every method exploits one difference between the parts of the mixture. Name the method, then check which difference.") +
      '<p style="font-weight:800;font-size:var(--t-md)" data-prompt></p>' +
      '<div class="chipset" data-methods style="margin-bottom:.9rem"></div>' +
      '<p class="why" data-why hidden></p>' +
      '<div class="lab-readout"><span class="pill muted" data-prog></span></div>';

    function render() {
      $("[data-prompt]", root).textContent = cases[i].m;
      $("[data-why]", root).hidden = true;
      $("[data-prog]", root).textContent = "Mixture " + (i + 1) + " of " + cases.length + "  ·  " + score + " right";
      var box = $("[data-methods]", root);
      box.innerHTML = "";
      done = false;
      methods.forEach(function (m) {
        var b = document.createElement("button");
        b.className = "tog"; b.type = "button"; b.textContent = m;
        b.addEventListener("click", function () {
          if (done) return;
          done = true;
          var right = m === cases[i].a;
          if (right) score++;
          $$(".tog", box).forEach(function (o) {
            o.disabled = true;
            if (o.textContent === cases[i].a) o.classList.add("on");
          });
          var w = $("[data-why]", root);
          w.hidden = false;
          w.textContent = (right ? "Correct. " : "The answer is " + cases[i].a + ". ") + cases[i].why;
          setTimeout(function () {
            i = (i + 1) % cases.length;
            if (i === 0) score = 0;
            render();
          }, 2600);
        });
        box.appendChild(b);
      });
    }
    render();
  };

  /* =========================================================
     BIOLOGY — photosynthesis and limiting factors
     ========================================================= */
  LABS.photosynthesis = function (root) {
    var f = { light: 60, co2: 60, water: 80, temp: 25 };

    root.innerHTML = head(root, "The photosynthesis machine",
      "The rate is set by whichever factor is in shortest supply. That one is the limiting factor.") +
      '<div class="lab-row">' +
      field("Light intensity", "light", 0, 100, f.light) +
      field("Carbon dioxide", "co2", 0, 100, f.co2) + '</div><div class="lab-row">' +
      field("Water supply", "water", 0, 100, f.water) +
      field("Temperature (°C)", "temp", 0, 50, f.temp) + '</div>' +
      '<div class="lab-stage"><svg viewBox="0 0 400 190" data-leaf role="img" aria-label="Leaf releasing oxygen bubbles"></svg></div>' +
      '<div class="lab-readout"><span class="pill" data-rate></span><span class="pill" data-limit></span></div>' +
      '<p class="lab-sub" data-note style="margin:.8rem 0 0"></p>';

    function field(label, key, min, max, val) {
      return '<label class="lab-field" style="flex:1 1 180px"><span>' + label + '</span>' +
        '<input type="range" min="' + min + '" max="' + max + '" value="' + val + '" data-f="' + key + '"></label>';
    }

    function tempFactor(t) {
      // enzymes: rises to about 30 C, then falls away sharply as they denature
      if (t <= 30) return Math.max(0, t / 30);
      return Math.max(0, 1 - (t - 30) / 14);
    }

    function render() {
      var scores = {
        "light": f.light / 100,
        "carbon dioxide": f.co2 / 100,
        "water": f.water / 100,
        "temperature": tempFactor(f.temp)
      };
      var limiting = Object.keys(scores).reduce(function (a, b) { return scores[a] <= scores[b] ? a : b; });
      var rate = Math.round(Math.min.apply(null, Object.keys(scores).map(function (k) { return scores[k]; })) * 100);

      var bubbles = [];
      var n = Math.round(rate / 7);
      for (var i = 0; i < n; i++) {
        var bx = 250 + (i % 5) * 26 + (i % 2 ? 8 : 0);
        var by = 120 - Math.floor(i / 5) * 26;
        var r = 4 + (i % 3);
        bubbles.push('<circle cx="' + bx + '" cy="' + by + '" r="' + r + '" fill="none" stroke="var(--subject)" stroke-width="2"/>');
      }

      var green = rate > 15 ? "var(--subject)" : "var(--ink-soft)";
      $("[data-leaf]", root).innerHTML =
        '<path d="M40 150 C 40 70, 110 30, 190 34 C 196 110, 140 158, 40 150 Z" fill="' + green +
        '" fill-opacity=".3" stroke="var(--ink)" stroke-width="3"/>' +
        '<path d="M40 150 C 90 120, 140 90, 190 34" fill="none" stroke="var(--ink)" stroke-width="2.5"/>' +
        '<path d="M78 135 L 96 104 M108 124 L 126 88 M140 110 L 156 72" stroke="var(--ink)" stroke-width="1.8" fill="none"/>' +
        bubbles.join("") +
        (rate > 15 ? '<text x="320" y="170" text-anchor="middle" font-size="13" font-weight="700" fill="var(--subject)">oxygen</text>' : '');

      $("[data-rate]", root).textContent = "Rate " + rate + "%";
      $("[data-limit]", root).textContent = "Limiting factor: " + limiting;

      var note;
      if (f.temp > 40) note = "Above about 40 °C the enzymes start to denature, so the rate collapses however much light you give it.";
      else if (rate > 85) note = "Everything is in good supply. Raising any single factor now barely helps.";
      else note = "Raising " + limiting + " will increase the rate. Raising anything else will not, because " + limiting + " is the bottleneck.";
      $("[data-note]", root).textContent = note;
    }

    $$("[data-f]", root).forEach(function (inp) {
      inp.addEventListener("input", function () { f[inp.getAttribute("data-f")] = +inp.value; render(); });
    });
    render();
  };

  /* =========================================================
     HISTORY — Delhi Sultanate to Mughal timeline
     ========================================================= */
  LABS.timeline = function (root) {
    var eras = [
      { from: 1206, to: 1290, name: "Slave (Mamluk)", who: "Qutb-ud-din Aibak, Iltutmish, Razia Sultan, Balban",
        note: "Aibak founded it and began the Qutb Minar. Razia Sultan became the only woman to rule from Delhi." },
      { from: 1290, to: 1320, name: "Khilji", who: "Jalaluddin and Alauddin Khilji",
        note: "Alauddin fixed market prices, kept a large standing army and pushed into the Deccan." },
      { from: 1320, to: 1414, name: "Tughlaq", who: "Ghiyasuddin, Muhammad-bin-Tughlaq, Firoz Shah",
        note: "Muhammad-bin-Tughlaq moved the capital to Daulatabad and issued token currency. Both failed." },
      { from: 1414, to: 1451, name: "Sayyid", who: "Khizr Khan and successors",
        note: "A weak dynasty ruling little beyond Delhi itself." },
      { from: 1451, to: 1526, name: "Lodi", who: "Bahlul, Sikandar and Ibrahim Lodi",
        note: "Sikandar founded Agra. Ibrahim lost to Babur at Panipat in 1526, ending the Sultanate." },
      { from: 1526, to: 1707, name: "Mughal", who: "Babur, Humayun, Akbar, Jahangir, Shah Jahan, Aurangzeb",
        note: "Akbar built the administration and abolished the jizya. Aurangzeb expanded furthest and overstretched it." }
    ];
    var year = 1556;

    root.innerHTML = head(root, "Five hundred years on one slider",
      "Drag through from the Slave dynasty to the end of Aurangzeb's reign.") +
      '<div class="lab-row"><label class="lab-field" style="flex:1 1 100%">' +
      '<span>Year</span><input type="range" min="1206" max="1707" value="1556" data-year></label></div>' +
      '<div class="lab-stage" style="display:block"><svg viewBox="0 0 460 80" data-band role="img" aria-label="Timeline of dynasties"></svg></div>' +
      '<div class="lab-readout"><span class="pill" data-year-out></span><span class="pill" data-era></span></div>' +
      '<p style="margin:.9rem 0 .3rem"><b data-who></b></p><p class="lab-sub" data-note style="margin:0"></p>';

    function render() {
      var era = eras.filter(function (e) { return year >= e.from && year < e.to; })[0] || eras[eras.length - 1];
      var span = 1707 - 1206;
      var parts = [];

      eras.forEach(function (e) {
        var x = ((e.from - 1206) / span) * 440 + 10;
        var w = ((e.to - e.from) / span) * 440;
        var on = e === era;
        parts.push('<rect x="' + x.toFixed(1) + '" y="18" width="' + w.toFixed(1) + '" height="30" rx="5" fill="var(--subject)" fill-opacity="' +
          (on ? ".85" : ".2") + '" stroke="var(--ink)" stroke-width="2"/>');
        if (w > 44) {
          parts.push('<text x="' + (x + w / 2).toFixed(1) + '" y="38" text-anchor="middle" font-size="11" font-weight="700" fill="' +
            (on ? "#fff" : "var(--ink)") + '">' + e.name.split(" ")[0] + '</text>');
        }
      });

      var px = ((year - 1206) / span) * 440 + 10;
      parts.push('<line x1="' + px.toFixed(1) + '" y1="8" x2="' + px.toFixed(1) + '" y2="58" stroke="var(--ink)" stroke-width="3"/>');
      parts.push('<circle cx="' + px.toFixed(1) + '" cy="8" r="5" fill="var(--ink)"/>');
      parts.push('<text x="10" y="72" font-size="11" fill="var(--ink-soft)">1206</text>');
      parts.push('<text x="450" y="72" text-anchor="end" font-size="11" fill="var(--ink-soft)">1707</text>');

      $("[data-band]", root).innerHTML = parts.join("");
      $("[data-year-out]", root).textContent = year + " CE";
      $("[data-era]", root).textContent = era.name + " dynasty";
      $("[data-who]", root).textContent = era.who;
      $("[data-note]", root).textContent = era.note;
    }

    $("[data-year]", root).addEventListener("input", function (e) { year = +e.target.value; render(); });
    render();
  };

  /* =========================================================
     GEOGRAPHY — layers of the atmosphere
     ========================================================= */
  LABS.atmosphere = function (root) {
    var layers = [
      { name: "Exosphere", top: 10000, base: 700, temp: "Rises, but the air is almost nothing",
        note: "Fades into space. Satellites orbit here and gas molecules escape Earth's gravity." },
      { name: "Thermosphere", top: 700, base: 80, temp: "Rises sharply, past 1000 °C",
        note: "Reflects radio waves back to Earth, which is how long-distance radio works. The auroras glow here." },
      { name: "Mesosphere", top: 80, base: 50, temp: "Falls to about -90 °C, the coldest layer",
        note: "Meteors burn up here from friction with the air, which is what we see as shooting stars." },
      { name: "Stratosphere", top: 50, base: 12, temp: "Rises with height, because ozone absorbs UV",
        note: "Holds the ozone layer, which absorbs harmful ultraviolet radiation. Stable air, so aircraft fly here." },
      { name: "Troposphere", top: 12, base: 0, temp: "Falls about 6.5 °C per kilometre",
        note: "Almost all weather and nearly all the water vapour sit here. This is the air we breathe." }
    ];
    var pick = 4;

    root.innerHTML = head(root, "Climb through the atmosphere",
      "Five layers. Pick one to see how high it reaches and what happens in it.") +
      '<div class="lab-stage" style="display:block"><svg viewBox="0 0 420 300" data-sky role="img" aria-label="Layers of the atmosphere"></svg></div>' +
      '<div class="lab-readout"><span class="pill" data-alt></span><span class="pill" data-temp></span></div>' +
      '<p class="lab-sub" data-note style="margin:.9rem 0 0"></p>';

    function render() {
      var parts = [], y = 12, h = 50;
      layers.forEach(function (L, i) {
        var on = i === pick;
        parts.push('<g data-i="' + i + '" style="cursor:pointer">' +
          '<rect x="14" y="' + y + '" width="392" height="' + (h - 6) + '" rx="8" fill="var(--subject)" fill-opacity="' +
          (on ? ".8" : (0.1 + (4 - i) * 0.04).toFixed(2)) + '" stroke="var(--ink)" stroke-width="' + (on ? 3 : 2) + '"/>' +
          '<text x="30" y="' + (y + 28) + '" font-size="15" font-weight="800" fill="' + (on ? "#fff" : "var(--ink)") + '">' + L.name + '</text>' +
          '<text x="392" y="' + (y + 28) + '" text-anchor="end" font-size="12" fill="' + (on ? "#fff" : "var(--ink-soft)") + '">' +
          L.base + "–" + (L.top >= 10000 ? "10 000" : L.top) + ' km</text></g>');
        y += h;
      });
      parts.push('<rect x="14" y="' + y + '" width="392" height="18" rx="4" fill="var(--ink)"/>');
      parts.push('<text x="210" y="' + (y + 13) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--paper)">GROUND</text>');

      var sky = $("[data-sky]", root);
      sky.innerHTML = parts.join("");
      $$("g[data-i]", sky).forEach(function (g) {
        g.addEventListener("click", function () { pick = +g.getAttribute("data-i"); render(); });
      });

      var L = layers[pick];
      $("[data-alt]", root).textContent = L.name + "  ·  " + L.base + " to " + (L.top >= 10000 ? "10 000" : L.top) + " km up";
      $("[data-temp]", root).textContent = "Temperature: " + L.temp;
      $("[data-note]", root).textContent = L.note;
    }
    render();
  };

  /* =========================================================
     COMPUTER — number base converter
     ========================================================= */
  LABS.bases = function (root) {
    var bits = [0, 0, 1, 0, 1, 1, 0, 1];   // 45

    root.innerHTML = head(root, "Flip the bits",
      "Eight switches, each worth double the one to its right. Add up the ones that are on.") +
      '<div class="scroller"><table class="grid" style="margin-bottom:1rem"><tbody>' +
      '<tr data-place></tr><tr data-bits></tr></tbody></table></div>' +
      '<div class="lab-row"><label class="lab-field" style="flex:1 1 160px"><span>Or type a decimal number (0–255)</span>' +
      '<input type="number" min="0" max="255" value="45" data-dec></label></div>' +
      '<div class="lab-readout">' +
      '<span class="pill" data-b></span><span class="pill" data-o></span>' +
      '<span class="pill" data-d></span><span class="pill" data-h></span></div>' +
      '<p class="lab-sub" data-sum style="margin:.9rem 0 0"></p>';

    var placeRow = $("[data-place]", root), bitRow = $("[data-bits]", root);

    function render() {
      placeRow.innerHTML = ""; bitRow.innerHTML = "";
      bits.forEach(function (b, i) {
        var place = Math.pow(2, 7 - i);
        var th = document.createElement("th");
        th.textContent = place; th.style.textAlign = "center";
        placeRow.appendChild(th);

        var td = document.createElement("td");
        td.style.textAlign = "center"; td.style.padding = "0";
        var btn = document.createElement("button");
        btn.type = "button"; btn.className = "tog" + (b ? " on" : "");
        btn.textContent = b;
        btn.style.width = "100%"; btn.style.borderRadius = "0"; btn.style.border = "none";
        btn.setAttribute("aria-label", "Bit worth " + place + ", currently " + b);
        btn.addEventListener("click", function () { bits[i] = b ? 0 : 1; render(); });
        td.appendChild(btn); bitRow.appendChild(td);
      });

      var dec = bits.reduce(function (acc, b, i) { return acc + b * Math.pow(2, 7 - i); }, 0);
      $("[data-dec]", root).value = dec;
      $("[data-b]", root).textContent = "Binary " + bits.join("");
      $("[data-o]", root).textContent = "Octal " + dec.toString(8);
      $("[data-d]", root).textContent = "Decimal " + dec;
      $("[data-h]", root).textContent = "Hex " + dec.toString(16).toUpperCase();

      var on = bits.map(function (b, i) { return b ? Math.pow(2, 7 - i) : 0; }).filter(Boolean);
      $("[data-sum]", root).textContent = on.length
        ? on.join(" + ") + " = " + dec
        : "Every switch is off, so the value is 0.";
    }

    $("[data-dec]", root).addEventListener("input", function (e) {
      var n = Math.max(0, Math.min(255, parseInt(e.target.value, 10) || 0));
      for (var i = 0; i < 8; i++) bits[i] = (n >> (7 - i)) & 1;
      render();
    });
    render();
  };

  /* =========================================================
     COMPUTER — live HTML playground
     ========================================================= */
  LABS.htmlplay = function (root) {
    var samples = {
      "Lists": '<h2>My art supplies</h2>\n<ul>\n  <li>Watercolours</li>\n  <li>Ink pens</li>\n</ul>\n<ol>\n  <li>Sketch first</li>\n  <li>Then colour</li>\n</ol>',
      "Table": '<table border="1" cellpadding="6">\n  <tr><th>Subject</th><th>Marks</th></tr>\n  <tr><td>Maths</td><td>92</td></tr>\n  <tr><td>Art</td><td>98</td></tr>\n</table>',
      "Link": '<h2>Useful pages</h2>\n<p>Visit <a href="https://example.com">this page</a> to read more.</p>',
      "Image": '<h2>With alt text</h2>\n<img src="nothing.png" alt="A description that shows if the image cannot load" width="200">'
    };

    root.innerHTML = head(root, "Write HTML, see it immediately",
      "Type on the left and the browser renders it on the right, exactly as it would in a real page.") +
      '<div class="chipset" data-samples style="margin-bottom:.8rem"></div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:.9rem">' +
      '<label class="lab-field"><span>Your HTML</span>' +
      '<textarea rows="12" data-code spellcheck="false"></textarea></label>' +
      '<div class="lab-field"><span>What the browser shows</span>' +
      '<iframe data-out sandbox="" title="Preview of your HTML" ' +
      'style="width:100%;height:260px;border:2px solid var(--ink);border-radius:10px;background:#fff"></iframe></div></div>';

    var ta = $("[data-code]", root), out = $("[data-out]", root);

    function run() {
      out.srcdoc = '<!doctype html><meta charset="utf-8"><style>body{font:16px/1.5 system-ui,sans-serif;' +
        'padding:14px;color:#241B4A}table{border-collapse:collapse}</style>' + ta.value;
    }

    var box = $("[data-samples]", root);
    Object.keys(samples).forEach(function (k, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "tog" + (i === 0 ? " on" : ""); b.textContent = k;
      b.addEventListener("click", function () {
        $$(".tog", box).forEach(function (o) { o.classList.toggle("on", o === b); });
        ta.value = samples[k]; run();
      });
      box.appendChild(b);
    });

    ta.value = samples.Lists;
    ta.addEventListener("input", run);
    run();
  };

  /* =========================================================
     SANSKRIT — shabd roop, dhatu roop and a drill
     ========================================================= */
  LABS.sanskritdrill = function (root) {
    var VIB = ["प्रथमा", "द्वितीया", "तृतीया", "चतुर्थी", "पञ्चमी", "षष्ठी", "सप्तमी", "सम्बोधन"];
    var PUR = ["प्रथम पुरुष", "मध्यम पुरुष", "उत्तम पुरुष"];

    var shabd = {
      "बालक": [["बालकः","बालकौ","बालकाः"],["बालकम्","बालकौ","बालकान्"],["बालकेन","बालकाभ्याम्","बालकैः"],
        ["बालकाय","बालकाभ्याम्","बालकेभ्यः"],["बालकात्","बालकाभ्याम्","बालकेभ्यः"],["बालकस्य","बालकयोः","बालकानाम्"],
        ["बालके","बालकयोः","बालकेषु"],["हे बालक","हे बालकौ","हे बालकाः"]],
      "लता": [["लता","लते","लताः"],["लताम्","लते","लताः"],["लतया","लताभ्याम्","लताभिः"],
        ["लतायै","लताभ्याम्","लताभ्यः"],["लतायाः","लताभ्याम्","लताभ्यः"],["लतायाः","लतयोः","लतानाम्"],
        ["लतायाम्","लतयोः","लतासु"],["हे लते","हे लते","हे लताः"]],
      "नदी": [["नदी","नद्यौ","नद्यः"],["नदीम्","नद्यौ","नदीः"],["नद्या","नदीभ्याम्","नदीभिः"],
        ["नद्यै","नदीभ्याम्","नदीभ्यः"],["नद्याः","नदीभ्याम्","नदीभ्यः"],["नद्याः","नद्योः","नदीनाम्"],
        ["नद्याम्","नद्योः","नदीषु"],["हे नदि","हे नद्यौ","हे नद्यः"]]
    };
    var dhatu = {
      "लट् (present)": [["पठति","पठतः","पठन्ति"],["पठसि","पठथः","पठथ"],["पठामि","पठावः","पठामः"]],
      "लृट् (future)": [["पठिष्यति","पठिष्यतः","पठिष्यन्ति"],["पठिष्यसि","पठिष्यथः","पठिष्यथ"],["पठिष्यामि","पठिष्यावः","पठिष्यामः"]],
      "लङ् (past)": [["अपठत्","अपठताम्","अपठन्"],["अपठः","अपठतम्","अपठत"],["अपठम्","अपठाव","अपठाम"]]
    };

    var tab = "बालक";

    root.innerHTML = head(root, "Roop tables and a quick drill",
      "Read the table, then hide it and try the drill. The drill picks a random form every time.") +
      '<div class="chipset" data-tabs style="margin-bottom:.9rem"></div>' +
      '<div class="scroller"><table class="grid" data-table></table></div>' +
      '<div style="margin-top:1.4rem;border-top:2px dashed var(--paper-edge);padding-top:1.2rem">' +
      '<p style="font-weight:800;margin:0 0 .7rem" data-ask></p>' +
      '<div class="chipset" data-choices></div>' +
      '<p class="why" data-fb hidden></p>' +
      '<div class="lab-readout"><span class="pill muted" data-sc></span>' +
      '<button class="btn btn-sm" type="button" data-next>Another one</button></div></div>';

    var tabBox = $("[data-tabs]", root);
    Object.keys(shabd).concat(Object.keys(dhatu)).forEach(function (k) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "tog" + (k === tab ? " on" : ""); b.textContent = k;
      b.addEventListener("click", function () {
        tab = k;
        $$(".tog", tabBox).forEach(function (o) { o.classList.toggle("on", o === b); });
        drawTable();
      });
      tabBox.appendChild(b);
    });

    function drawTable() {
      var isNoun = !!shabd[tab];
      var rows = isNoun ? shabd[tab] : dhatu[tab];
      var labels = isNoun ? VIB : PUR;
      var html = '<caption>' + (isNoun ? "शब्द रूप — " + tab : "धातु रूप — पठ्, " + tab) + '</caption>' +
        '<thead><tr><th>' + (isNoun ? "विभक्ति" : "पुरुष") + '</th><th>एकवचन</th><th>द्विवचन</th><th>बहुवचन</th></tr></thead><tbody>';
      rows.forEach(function (r, i) {
        html += '<tr><th>' + labels[i] + '</th><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>';
      });
      $("[data-table]", root).innerHTML = html + '</tbody>';
    }

    var right = 0, asked = 0, answer = "";

    function newQuestion() {
      var isNoun = Math.random() < 0.6;
      var key = isNoun
        ? Object.keys(shabd)[Math.floor(Math.random() * 3)]
        : Object.keys(dhatu)[Math.floor(Math.random() * 3)];
      var rows = isNoun ? shabd[key] : dhatu[key];
      var labels = isNoun ? VIB : PUR;
      var r = Math.floor(Math.random() * rows.length);
      var c = Math.floor(Math.random() * 3);
      var vach = ["एकवचन", "द्विवचन", "बहुवचन"][c];
      answer = rows[r][c];

      $("[data-ask]", root).textContent = isNoun
        ? "What is " + labels[r] + ", " + vach + " of " + key + "?"
        : "पठ् in " + key + ", " + labels[r] + ", " + vach + " is?";

      // three wrong options drawn from the same table, so the choices are plausible
      var pool = [];
      rows.forEach(function (row) { row.forEach(function (v) { if (v !== answer) pool.push(v); }); });
      var opts = [answer];
      while (opts.length < 4 && pool.length) {
        var p = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
        if (opts.indexOf(p) === -1) opts.push(p);
      }
      opts.sort(function () { return Math.random() - .5; });

      var box = $("[data-choices]", root);
      box.innerHTML = "";
      $("[data-fb]", root).hidden = true;
      opts.forEach(function (o) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "tog"; b.textContent = o;
        b.addEventListener("click", function () {
          if (box.getAttribute("data-done")) return;
          box.setAttribute("data-done", "1");
          asked++;
          var ok = o === answer;
          if (ok) right++;
          $$(".tog", box).forEach(function (x) {
            x.disabled = true;
            if (x.textContent === answer) x.classList.add("on");
          });
          var fb = $("[data-fb]", root);
          fb.hidden = false;
          fb.textContent = ok ? "Correct." : "The answer is " + answer + ".";
          $("[data-sc]", root).textContent = right + " right out of " + asked;
        });
        box.appendChild(b);
      });
      box.removeAttribute("data-done");
      $("[data-sc]", root).textContent = right + " right out of " + asked;
    }

    $("[data-next]", root).addEventListener("click", newQuestion);
    drawTable();
    newQuestion();
  };

  /* =========================================================
     ENGLISH — the twelve tenses, built from one verb
     ========================================================= */
  LABS.tenses = function (root) {
    var verbs = {
      write:  { past: "wrote",   pp: "written", ing: "writing" },
      go:     { past: "went",    pp: "gone",    ing: "going" },
      eat:    { past: "ate",     pp: "eaten",   ing: "eating" },
      paint:  { past: "painted", pp: "painted", ing: "painting" },
      draw:   { past: "drew",    pp: "drawn",   ing: "drawing" },
      sing:   { past: "sang",    pp: "sung",    ing: "singing" }
    };
    var verb = "write", subj = "I";

    root.innerHTML = head(root, "All twelve tenses at once",
      "Three times across, four aspects down. Pick a verb and the whole grid fills in.") +
      '<div class="lab-row">' +
      '<label class="lab-field"><span>Verb</span><select data-verb></select></label>' +
      '<label class="lab-field"><span>Subject</span><select data-subj>' +
      '<option>I</option><option>She</option><option>They</option></select></label></div>' +
      '<div class="scroller"><table class="grid" data-grid></table></div>' +
      '<p class="lab-sub" style="margin:.9rem 0 0">Simple states a fact. Continuous is still happening. ' +
      'Perfect is finished. Perfect continuous started earlier and is still going.</p>';

    var sel = $("[data-verb]", root);
    Object.keys(verbs).forEach(function (v) {
      var o = document.createElement("option"); o.textContent = v; sel.appendChild(o);
    });

    function build() {
      var f = verbs[verb];
      var third = subj === "She";
      var s = third ? verb + (/(s|sh|ch|x|o)$/.test(verb) ? "es" : "s") : verb;
      var be_pres = third ? "is" : (subj === "I" ? "am" : "are");
      var be_past = (third || subj === "I") ? "was" : "were";
      var have = third ? "has" : "have";

      var rows = [
        ["Simple", s, f.past, "will " + verb],
        ["Continuous", be_pres + " " + f.ing, be_past + " " + f.ing, "will be " + f.ing],
        ["Perfect", have + " " + f.pp, "had " + f.pp, "will have " + f.pp],
        ["Perfect continuous", have + " been " + f.ing, "had been " + f.ing, "will have been " + f.ing]
      ];

      var html = '<thead><tr><th></th><th>Present</th><th>Past</th><th>Future</th></tr></thead><tbody>';
      rows.forEach(function (r) {
        html += '<tr><th>' + r[0] + '</th>';
        for (var i = 1; i <= 3; i++) html += '<td>' + subj + " " + r[i] + '</td>';
        html += '</tr>';
      });
      $("[data-grid]", root).innerHTML = html + '</tbody>';
    }

    sel.addEventListener("change", function () { verb = sel.value; build(); });
    $("[data-subj]", root).addEventListener("change", function (e) { subj = e.target.value; build(); });
    build();
  };

  /* =========================================================
     ENGLISH — active to passive, step by step
     ========================================================= */
  LABS.voice = function (root) {
    var set = [
      { a: "The gardener watered the plants.", p: "The plants were watered by the gardener.",
        t: "Simple past", s: ["Object the plants moves to the front and becomes the subject.",
          "Simple past, plural subject, so the verb becomes were plus the past participle watered.",
          "The original subject the gardener follows by."] },
      { a: "Shubhi paints a mural.", p: "A mural is painted by Shubhi.",
        t: "Simple present", s: ["Object a mural becomes the subject.",
          "Simple present, singular subject, so the verb becomes is plus painted.",
          "Shubhi moves to the end after by."] },
      { a: "The students have completed the project.", p: "The project has been completed by the students.",
        t: "Present perfect", s: ["Object the project becomes the subject.",
          "Present perfect passive is has or have been plus the past participle.",
          "The project is singular, so has been completed."] },
      { a: "They will announce the results tomorrow.", p: "The results will be announced tomorrow.",
        t: "Simple future", s: ["Object the results becomes the subject.",
          "Simple future passive is will be plus the past participle.",
          "They is vague, so the by phrase is dropped entirely."] },
      { a: "Someone has stolen my bicycle.", p: "My bicycle has been stolen.",
        t: "Present perfect", s: ["Object my bicycle becomes the subject.",
          "Present perfect passive: has been plus stolen.",
          "Someone is unknown, so by someone is left out. This is exactly when the passive is most useful."] }
    ];
    var i = 0, shown = false;

    root.innerHTML = head(root, "Active to passive, one step at a time",
      "Read the active sentence, work out the passive in your head, then check the steps.") +
      '<p style="font-size:var(--t-md);font-weight:800;margin:0 0 .3rem" data-active></p>' +
      '<p class="lab-sub" data-tense style="margin:0 0 1rem"></p>' +
      '<div data-reveal hidden>' +
      '<ol style="padding-left:1.2rem;display:grid;gap:.35rem;font-size:var(--t-sm)" data-steps></ol>' +
      '<p class="why" data-passive style="margin-top:.9rem"></p></div>' +
      '<div class="lab-readout"><button class="btn btn-sm" type="button" data-show>Show the passive</button>' +
      '<button class="btn btn-sm" type="button" data-nx>Next sentence</button>' +
      '<span class="pill muted" data-count></span></div>';

    function render() {
      var c = set[i];
      $("[data-active]", root).textContent = c.a;
      $("[data-tense]", root).textContent = "Tense: " + c.t + ". The passive must keep it.";
      $("[data-steps]", root).innerHTML = c.s.map(function (x) { return "<li>" + x + "</li>"; }).join("");
      $("[data-passive]", root).textContent = c.p;
      $("[data-reveal]", root).hidden = !shown;
      $("[data-show]", root).textContent = shown ? "Hide the steps" : "Show the passive";
      $("[data-count]", root).textContent = "Sentence " + (i + 1) + " of " + set.length;
    }

    $("[data-show]", root).addEventListener("click", function () { shown = !shown; render(); });
    $("[data-nx]", root).addEventListener("click", function () {
      i = (i + 1) % set.length; shown = false; render();
    });
    render();
  };

  /* ---------- boot ---------- */
  function boot() {
    $$("[data-lab]").forEach(function (node) {
      var name = node.getAttribute("data-lab");
      var fn = LABS[name];
      if (!fn) { node.remove(); return; }
      try { fn(node); }
      catch (err) {
        node.innerHTML = '<h3>This one is not loading</h3><p class="lab-sub">' +
          'The rest of the page still works. Try reloading.</p>';
        if (window.console) console.error("lab " + name + " failed", err);
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
