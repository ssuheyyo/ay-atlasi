(() => {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const context = canvas.getContext('2d', { alpha: true });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let stars = [], width = 0, height = 0, lastFrame = 0, frame = 0;
  let driftX = 0, driftY = 0, meteor = null, nextMeteor = performance.now() + 7000;
  let seed = 41729;
  function random() { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; }
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    seed = 41729;
    stars = Array.from({ length: Math.round(Math.min(230, width * height / 3700)) }, (_, i) => ({
      x: random() * width, y: random() * height, radius: i % 23 === 0 ? 2 : .45 + random() * 1.15,
      phase: random() * Math.PI * 2, speed: .4 + random() * 1.4, depth: .25 + random() * .75,
      gold: random() > .72
    }));
    draw(performance.now());
  }
  function draw(now) {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    const still = reduced.matches || document.body.classList.contains('motion-off');
    const density = Math.max(.35, Math.min(1.6, Number(document.body.dataset.starDensity || 1)));
    const gold = getComputedStyle(document.body).getPropertyValue('--gold').trim() || '#e5c486';
    for (const star of stars) {
      const pulse = still ? .7 : .49 + .36 * Math.sin(now * .001 * star.speed + star.phase);
      const x = star.x + driftX * star.depth, y = star.y + driftY * star.depth;
      if (x < -5 || y < -5 || x > width + 5 || y > height + 5) continue;
      context.globalAlpha = Math.min(1, Math.max(.08, pulse * density));
      context.fillStyle = star.gold ? gold : '#dce5ff';
      context.beginPath(); context.arc(x, y, star.radius, 0, Math.PI * 2); context.fill();
      if (star.radius > 1.85) {
        context.globalAlpha *= .35;
        context.fillRect(x - 5, y - .35, 10, .7);
        context.fillRect(x - .35, y - 5, .7, 10);
      }
    }
    context.globalAlpha = 1;
    if (!still) {
      if (now > nextMeteor && !meteor) {
        meteor = { x: width * (.35 + random() * .55), y: height * (.04 + random() * .35), started: now };
        nextMeteor = now + 9000 + random() * 8000;
      }
      if (meteor) {
        const age = (now - meteor.started) / 780;
        if (age > 1) meteor = null;
        else {
          const x = meteor.x - age * 280, y = meteor.y + age * 120;
          const trail = context.createLinearGradient(x, y, x + 150, y - 65);
          trail.addColorStop(0, 'rgba(255,239,201,0)');
          trail.addColorStop(.55, 'rgba(255,239,201,.85)');
          trail.addColorStop(1, 'rgba(255,239,201,0)');
          context.strokeStyle = trail; context.lineWidth = 1.8;
          context.beginPath(); context.moveTo(x - 90, y + 39); context.lineTo(x + 145, y - 63); context.stroke();
        }
      }
    }
  }
  function tick(now) {
    frame = requestAnimationFrame(tick);
    if (document.hidden || now - lastFrame < 33) return;
    lastFrame = now; draw(now);
  }
  window.updateStarfield = () => draw(performance.now());
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', event => {
    if (reduced.matches || document.body.classList.contains('motion-off')) return;
    driftX = ((event.clientX / innerWidth) - .5) * 10;
    driftY = ((event.clientY / innerHeight) - .5) * 7;
  }, { passive: true });
  reduced.addEventListener?.('change', () => draw(performance.now()));
  resize(); frame = requestAnimationFrame(tick);
})();
