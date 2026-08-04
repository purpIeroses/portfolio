(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var container = document.querySelector(".floaties");
  if (!container) return;

  var DOTS_PER_SIDE = 14;
  var SPEED_MIN = 8;   // px/sec
  var SPEED_MAX = 18;  // px/sec
  var BOUNCE_JITTER = 0.5; // radians of random nudge applied on each bounce
  var EDGE_BUFFER = 10;    // px clearance from the content column's edge
  var MIN_MARGIN = 50;     // below this margin width, there's no room to float — hide

  // cycled per dot so the mix stays varied without one CSS rule per element
  var VARIANTS = [
    { size: 13, color: "var(--accent)",   opacity: .16 },
    { size: 11, color: "var(--ink-soft)", opacity: .22 },
    { size: 18, color: "var(--accent)",   opacity: .13, blur: 0.5 },
    { size: 12, color: "var(--ink-soft)", opacity: .2 },
    { size: 10, color: "var(--accent)",   opacity: .18 },
    { size: 14, color: "var(--ink-soft)", opacity: .18 },
    { size: 12, color: "var(--accent)",   opacity: .2 },
    { size: 10, color: "var(--ink-soft)", opacity: .24 },
    { size: 19, color: "var(--ink-soft)", opacity: .11, blur: 0.75 }
  ];

  var fragment = document.createDocumentFragment();
  var dots = [];
  for (var i = 0; i < DOTS_PER_SIDE * 2; i++) {
    var v = VARIANTS[i % VARIANTS.length];
    var el = document.createElement("span");
    el.style.width = v.size + "px";
    el.style.height = v.size + "px";
    el.style.background = v.color;
    el.style.opacity = v.opacity;
    if (v.blur) el.style.filter = "blur(" + v.blur + "px)";
    fragment.appendChild(el);
    dots.push(el);
  }
  container.appendChild(fragment);

  var bounds = { height: 0 };
  var zones = { left: { min: 0, max: 0 }, right: { min: 0, max: 0 } };
  var hasRoom = true;

  function measure() {
    bounds.height = container.clientHeight;

    var viewportWidth = document.documentElement.clientWidth;
    var wrapPx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--wrap")) || 1080;
    var margin = Math.max((viewportWidth - wrapPx) / 2, 0);

    hasRoom = margin >= MIN_MARGIN;
    container.style.visibility = hasRoom ? "" : "hidden";
    if (!hasRoom) return;

    zones.left = { min: 0, max: margin - EDGE_BUFFER };
    zones.right = { min: viewportWidth - margin + EDGE_BUFFER, max: viewportWidth };
  }

  var particles = dots.map(function (el, i) {
    return {
      el: el,
      size: el.offsetWidth,
      side: i % 2 === 0 ? "left" : "right",
      x: 0,
      y: 0,
      vx: 0,
      vy: 0
    };
  });

  function randomVelocity() {
    var angle = Math.random() * Math.PI * 2;
    var speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
    return [Math.cos(angle) * speed, Math.sin(angle) * speed];
  }

  function place() {
    measure();
    particles.forEach(function (p) {
      var zone = zones[p.side];
      var maxY = Math.max(bounds.height - p.size, 0);
      var zoneWidth = Math.max(zone.max - zone.min - p.size, 0);
      p.x = zone.min + Math.random() * zoneWidth;
      p.y = Math.random() * maxY;
      var v = randomVelocity();
      p.vx = v[0];
      p.vy = v[1];
    });
  }

  place();
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }

  function jitter(vx, vy) {
    var a = Math.atan2(vy, vx) + (Math.random() - 0.5) * BOUNCE_JITTER;
    var s = Math.hypot(vx, vy);
    return [Math.cos(a) * s, Math.sin(a) * s];
  }

  var last = performance.now();

  function tick(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (!hasRoom) {
      requestAnimationFrame(tick);
      return;
    }

    var maxY = Math.max(bounds.height, 0);

    particles.forEach(function (p) {
      var zone = zones[p.side];
      var left = zone.min;
      var right = Math.max(zone.max - p.size, zone.min);

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // clamp into zone in case a resize shrank it since the last frame
      if (p.x < left) {
        p.x = left;
        p.vx = Math.abs(p.vx);
        var j1 = jitter(p.vx, p.vy); p.vx = j1[0]; p.vy = j1[1];
      } else if (p.x > right) {
        p.x = right;
        p.vx = -Math.abs(p.vx);
        var j2 = jitter(p.vx, p.vy); p.vx = j2[0]; p.vy = j2[1];
      }

      var bottom = maxY - p.size;
      if (p.y < 0) {
        p.y = 0;
        p.vy = Math.abs(p.vy);
        var j3 = jitter(p.vx, p.vy); p.vx = j3[0]; p.vy = j3[1];
      } else if (p.y > bottom) {
        p.y = bottom;
        p.vy = -Math.abs(p.vy);
        var j4 = jitter(p.vx, p.vy); p.vx = j4[0]; p.vy = j4[1];
      }

      p.el.style.transform = "translate(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px)";
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(function (t) {
    last = t;
    requestAnimationFrame(tick);
  });
})();
