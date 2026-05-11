/* ============================================================
   Darkness Survival — Particle & Floating Text Module
   Extracted from game.js
   ============================================================ */
window.DS = window.DS || {};

// ═══════════════════════════════════════════════════════════════
//  PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════
DS.particles = [];
DS.screenShake = 0;

DS.spawnParticles = function(sx, sy, color, count, opts) {
  if (DS.particles.length > 500) return;
  opts = opts || {};
  for (var i = 0; i < count; i++) {
    DS.particles.push({
      x: sx, y: sy,
      vx: (Math.random()-0.5) * (opts.spread || 3),
      vy: (Math.random()-0.5) * (opts.spread || 3) - (opts.rise || 0),
      color: color,
      life: opts.life || (20 + Math.random()*20),
      maxLife: opts.life || (20 + Math.random()*20),
      size: opts.size || (1 + Math.random()*2)
    });
  }
};

DS.updateParticles = function() {
  for (var i = DS.particles.length-1; i >= 0; i--) {
    var p = DS.particles[i];
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.05; // gravity
    p.life--;
    if (p.life <= 0) DS.particles.splice(i, 1);
  }
  if (DS.screenShake > 0) DS.screenShake *= 0.85;
  if (DS.screenShake < 0.5) DS.screenShake = 0;
  if (playerHitTimer > 0) playerHitTimer--;
};

DS.drawParticles = function() {
  for (var i = 0; i < DS.particles.length; i++) {
    var p = DS.particles[i];
    var alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
};

// ═══════════════════════════════════════════════════════════════
//  ANIMATION STATE
// ═══════════════════════════════════════════════════════════════
DS.playerAnim = { frame: 0, walkCycle: 0, facing: 1 }; // facing: 1=right, -1=left

// ═══════════════════════════════════════════════════════════════
//  FLOATING TEXT SYSTEM
// ═══════════════════════════════════════════════════════════════
DS.floatingTexts = [];

DS.spawnFloat = function(sx, sy, text, color, size) {
  DS.floatingTexts.push({
    x: sx, y: sy, text: text, color: color || '#fff',
    size: size || 12, life: 40, maxLife: 40, vy: -1.2
  });
};

DS.updateFloats = function() {
  for (var i = DS.floatingTexts.length-1; i >= 0; i--) {
    var f = DS.floatingTexts[i];
    f.y += f.vy;
    f.vy *= 0.96;
    f.life--;
    if (f.life <= 0) DS.floatingTexts.splice(i, 1);
  }
};

DS.drawFloats = function() {
  for (var i = 0; i < DS.floatingTexts.length; i++) {
    var f = DS.floatingTexts[i];
    var alpha = Math.min(1, f.life / f.maxLife * 2);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = f.color;
    ctx.font = 'bold ' + f.size + 'px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Outline for readability
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 2;
    ctx.strokeText(f.text, f.x, f.y);
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.globalAlpha = 1;
};
