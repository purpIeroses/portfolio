// ─────────────────────────────────────────────────────────────
// Asteroids engine — vanilla canvas, vector rendering.
// Exposes a Game class driven by main.js (start / input / events).
// Pure logic + draw; no DOM/leaderboard concerns leak in here.
// ─────────────────────────────────────────────────────────────

const W = 800;
const H = 600;
const TAU = Math.PI * 2;

// tuning ------------------------------------------------------
const SHIP = {
  turn: 5.0, // rad/sec
  thrust: 340, // px/sec^2
  friction: 0.72, // velocity retained per second
  maxRadius: 12,
  invuln: 2.5, // seconds after (re)spawn
  fireRate: 0.22, // seconds between shots
};
const BULLET = { speed: 560, life: 0.85, radius: 2 };
const ROCK = {
  // size tier → {radius, score, speed}
  3: { radius: 46, score: 20, speed: 60 },
  2: { radius: 24, score: 50, speed: 90 },
  1: { radius: 12, score: 100, speed: 130 },
};
const START_ROCKS = 4;

const rand = (a, b) => a + Math.random() * (b - a);
const wrap = (v, max) => (v < 0 ? v + max : v >= max ? v - max : v);

// ── entity factories ─────────────────────────────────────────
function makeShip() {
  return {
    x: W / 2,
    y: H / 2,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    thrusting: false,
    invuln: SHIP.invuln,
    cooldown: 0,
  };
}

function makeRock(tier, x, y) {
  const spec = ROCK[tier];
  const dir = rand(0, TAU);
  const spd = rand(spec.speed * 0.6, spec.speed);
  // irregular vector silhouette baked once per rock
  const points = [];
  const n = 10;
  for (let i = 0; i < n; i++) {
    points.push(rand(0.72, 1.15));
  }
  return {
    tier,
    x,
    y,
    vx: Math.cos(dir) * spd,
    vy: Math.sin(dir) * spd,
    radius: spec.radius,
    angle: rand(0, TAU),
    spin: rand(-1, 1),
    points,
  };
}

function spawnField(n) {
  const rocks = [];
  for (let i = 0; i < n; i++) {
    // keep them off the ship's start position
    let x, y;
    do {
      x = rand(0, W);
      y = rand(0, H);
    } while (Math.hypot(x - W / 2, y - H / 2) < 140);
    rocks.push(makeRock(3, x, y));
  }
  return rocks;
}

// ── the game ─────────────────────────────────────────────────
export class Game {
  constructor(canvas, callbacks = {}) {
    this.ctx = canvas.getContext("2d");
    this.cb = callbacks; // { onScore, onLives, onGameOver }
    this.keys = new Set();
    this.running = false;
    this.last = 0;
    this._loop = this._loop.bind(this);
  }

  start() {
    this.ship = makeShip();
    this.rocks = spawnField(START_ROCKS);
    this.bullets = [];
    this.particles = [];
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.shake = 0;
    this.running = true;
    this.cb.onScore?.(0);
    this.cb.onLives?.(this.lives);
    this.last = performance.now();
    requestAnimationFrame(this._loop);
  }

  stop() {
    this.running = false;
  }

  press(k) { this.keys.add(k); }
  release(k) { this.keys.delete(k); }

  // ── main loop ──────────────────────────────────────────────
  _loop(now) {
    if (!this.running) return;
    let dt = (now - this.last) / 1000;
    this.last = now;
    dt = Math.min(dt, 0.05); // clamp big frame gaps
    this._update(dt);
    this._draw();
    requestAnimationFrame(this._loop);
  }

  _update(dt) {
    const s = this.ship;

    // input
    if (this.keys.has("ArrowLeft")) s.angle -= SHIP.turn * dt;
    if (this.keys.has("ArrowRight")) s.angle += SHIP.turn * dt;
    s.thrusting = this.keys.has("ArrowUp");
    if (s.thrusting) {
      s.vx += Math.cos(s.angle) * SHIP.thrust * dt;
      s.vy += Math.sin(s.angle) * SHIP.thrust * dt;
      this._emitThrust();
    }
    // friction (frame-rate independent)
    const f = Math.pow(SHIP.friction, dt);
    s.vx *= f;
    s.vy *= f;

    s.x = wrap(s.x + s.vx * dt, W);
    s.y = wrap(s.y + s.vy * dt, H);
    s.invuln = Math.max(0, s.invuln - dt);
    s.cooldown = Math.max(0, s.cooldown - dt);

    if (this.keys.has("Space") && s.cooldown === 0) this._fire();
    if (this.keys.has("Shift")) this._hyperspace();

    // bullets
    for (const b of this.bullets) {
      b.x = wrap(b.x + b.vx * dt, W);
      b.y = wrap(b.y + b.vy * dt, H);
      b.life -= dt;
    }
    this.bullets = this.bullets.filter((b) => b.life > 0);

    // rocks
    for (const r of this.rocks) {
      r.x = wrap(r.x + r.vx * dt, W);
      r.y = wrap(r.y + r.vy * dt, H);
      r.angle += r.spin * dt;
    }

    // particles
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    this._collisions();

    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 60);

    // next wave
    if (this.rocks.length === 0) {
      this.wave++;
      this.rocks = spawnField(Math.min(START_ROCKS + this.wave - 1, 9));
      this.ship.invuln = Math.max(this.ship.invuln, 1.0);
    }
  }

  _fire() {
    const s = this.ship;
    this.bullets.push({
      x: s.x + Math.cos(s.angle) * SHIP.maxRadius,
      y: s.y + Math.sin(s.angle) * SHIP.maxRadius,
      vx: Math.cos(s.angle) * BULLET.speed + s.vx,
      vy: Math.sin(s.angle) * BULLET.speed + s.vy,
      life: BULLET.life,
    });
    s.cooldown = SHIP.fireRate;
    this.cb.onFire?.();
  }

  _hyperspace() {
    const s = this.ship;
    if (s.cooldown > 0) return;
    s.x = rand(0, W);
    s.y = rand(0, H);
    s.vx = s.vy = 0;
    s.invuln = 0.8;
    s.cooldown = 0.5;
  }

  _collisions() {
    // bullets vs rocks
    for (let bi = this.bullets.length - 1; bi >= 0; bi--) {
      const b = this.bullets[bi];
      for (let ri = this.rocks.length - 1; ri >= 0; ri--) {
        const r = this.rocks[ri];
        if (Math.hypot(b.x - r.x, b.y - r.y) < r.radius) {
          this.bullets.splice(bi, 1);
          this._destroyRock(ri);
          break;
        }
      }
    }
    // ship vs rocks
    const s = this.ship;
    if (s.invuln === 0) {
      for (const r of this.rocks) {
        if (Math.hypot(s.x - r.x, s.y - r.y) < r.radius + SHIP.maxRadius * 0.7) {
          this._loseLife();
          break;
        }
      }
    }
  }

  _destroyRock(index) {
    const r = this.rocks[index];
    this.rocks.splice(index, 1);
    this.score += ROCK[r.tier].score;
    this.cb.onScore?.(this.score);
    this._emitExplosion(r.x, r.y, r.tier);
    this.shake = Math.min(8, this.shake + r.tier * 1.5);
    this.cb.onBoom?.(r.tier);
    if (r.tier > 1) {
      this.rocks.push(makeRock(r.tier - 1, r.x, r.y));
      this.rocks.push(makeRock(r.tier - 1, r.x, r.y));
    }
  }

  _loseLife() {
    this.lives--;
    this.cb.onLives?.(this.lives);
    this._emitExplosion(this.ship.x, this.ship.y, 3);
    this.shake = 10;
    this.cb.onBoom?.(3);
    if (this.lives <= 0) {
      this.running = false;
      this.cb.onGameOver?.(this.score);
      return;
    }
    this.ship = makeShip(); // respawn center with invuln
  }

  // ── particles ──────────────────────────────────────────────
  _emitExplosion(x, y, tier) {
    const count = 8 + tier * 4;
    for (let i = 0; i < count; i++) {
      const a = rand(0, TAU);
      const sp = rand(40, 160);
      this.particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rand(0.4, 0.9),
        max: 0.9,
      });
    }
  }
  _emitThrust() {
    const s = this.ship;
    const back = s.angle + Math.PI;
    this.particles.push({
      x: s.x + Math.cos(back) * SHIP.maxRadius,
      y: s.y + Math.sin(back) * SHIP.maxRadius,
      vx: Math.cos(back) * rand(60, 120) + s.vx,
      vy: Math.sin(back) * rand(60, 120) + s.vy,
      life: rand(0.15, 0.35),
      max: 0.35,
    });
  }

  // ── rendering ──────────────────────────────────────────────
  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (this.shake > 0) {
      ctx.translate(rand(-this.shake, this.shake), rand(-this.shake, this.shake));
    }

    ctx.strokeStyle = "#5cff9d";
    ctx.fillStyle = "#5cff9d";
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";
    ctx.shadowColor = "#5cff9d";
    ctx.shadowBlur = 8;

    // particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }
    ctx.globalAlpha = 1;

    // rocks
    for (const r of this.rocks) this._drawRock(r);

    // bullets
    for (const b of this.bullets) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, BULLET.radius, 0, TAU);
      ctx.fill();
    }

    // ship (blink while invulnerable)
    const s = this.ship;
    if (s.invuln === 0 || Math.floor(s.invuln * 10) % 2 === 0) {
      this._drawShip(s);
    }

    ctx.restore();
  }

  _drawShip(s) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-10, -9);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-10, 9);
    ctx.closePath();
    ctx.stroke();
    // thrust flame
    if (s.thrusting && Math.random() > 0.3) {
      ctx.beginPath();
      ctx.moveTo(-6, -4);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-6, 4);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawRock(r) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(r.x, r.y);
    ctx.rotate(r.angle);
    ctx.beginPath();
    const n = r.points.length;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      const rad = r.radius * r.points[i];
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

export { W, H };
