// ═══════════════════════════════════════════════════════════════
//  ISOMETRIC RENDERING ENGINE + MINIMAP
//  Part of Darkness Survival (黑暗生存)
// ═══════════════════════════════════════════════════════════════
(function() {
  'use strict';

  window.DS = window.DS || {};

  // ── Canvas references ──────────────────────────────────────
  DS.cv = null;
  DS.ctx = null;
  DS.mmCv = null;
  DS.mmCtx = null;
  DS.time = 0;
  DS.dyingMons = []; // death animation queue
  DS.playerHitTimer = 0; // frames of hit reaction

  // Local helper - no longer used for display
  function getMonsterChar(m) {
    return ' ';
  }

  // ── Coordinate conversion ──────────────────────────────────
  DS.isoToScreen = function isoToScreen(gx, gy) {
    return {
      x: (gx - gy) * HW,
      y: (gx + gy) * HH
    };
  };

  // ── Isometric cube drawing ─────────────────────────────────
  DS.drawIsoCube = function drawIsoCube(sx, sy, topColor, leftColor, rightColor, h) {
    var ctx = DS.ctx;
    h = h || CH;
    // Top face
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.moveTo(sx, sy - h);
    ctx.lineTo(sx + HW, sy + HH - h);
    ctx.lineTo(sx, sy + TH - h);
    ctx.lineTo(sx - HW, sy + HH - h);
    ctx.closePath(); ctx.fill();
    // Top face highlight (subtle light edge)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx, sy - h); ctx.lineTo(sx - HW, sy + HH - h);
    ctx.stroke();
    // Left face
    ctx.fillStyle = leftColor;
    ctx.beginPath();
    ctx.moveTo(sx - HW, sy + HH - h);
    ctx.lineTo(sx, sy + TH - h);
    ctx.lineTo(sx, sy + TH);
    ctx.lineTo(sx - HW, sy + HH);
    ctx.closePath(); ctx.fill();
    // Right face
    ctx.fillStyle = rightColor;
    ctx.beginPath();
    ctx.moveTo(sx + HW, sy + HH - h);
    ctx.lineTo(sx, sy + TH - h);
    ctx.lineTo(sx, sy + TH);
    ctx.lineTo(sx + HW, sy + HH);
    ctx.closePath(); ctx.fill();
    // Bottom edge shadow
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx, sy + TH); ctx.lineTo(sx + HW, sy + HH);
    ctx.moveTo(sx, sy + TH); ctx.lineTo(sx - HW, sy + HH);
    ctx.stroke();
    // Edge lines
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy - h); ctx.lineTo(sx + HW, sy + HH - h);
    ctx.moveTo(sx, sy - h); ctx.lineTo(sx - HW, sy + HH - h);
    ctx.moveTo(sx, sy - h); ctx.lineTo(sx, sy + TH - h);
    ctx.stroke();
  };

  // ── Isometric floor tile drawing ───────────────────────────
  DS.drawIsoFloor = function drawIsoFloor(sx, sy, color, altColor) {
    var ctx = DS.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + HW, sy + HH);
    ctx.lineTo(sx, sy + TH);
    ctx.lineTo(sx - HW, sy + HH);
    ctx.closePath(); ctx.fill();
    // Subtle inner shadow for depth
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.beginPath();
    ctx.moveTo(sx, sy + TH - 2);
    ctx.lineTo(sx + HW - 1, sy + HH - 1);
    ctx.lineTo(sx, sy + TH);
    ctx.lineTo(sx - HW + 1, sy + HH - 1);
    ctx.closePath(); ctx.fill();
    // Grid lines
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 0.5;
    ctx.stroke();
  };

  // ── Isometric entity drawing ───────────────────────────────
  DS.drawIsoEntity = function drawIsoEntity(sx, sy, char, color, scale) {
    var ctx = DS.ctx;
    var s = scale || 16;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(sx, sy+6, 8*s/16, 4*s/16, 0, 0, Math.PI*2);
    ctx.fill();
    // Character
    ctx.fillStyle = color;
    ctx.font = s + 'px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, sx, sy - 2);
  };

  // ── Utility: darken a hex color ────────────────────────────
  DS.shadeColor = function shadeColor(color, amount) {
    var r = parseInt(color.slice(1,3), 16), g = parseInt(color.slice(3,5), 16), b = parseInt(color.slice(5,7), 16);
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    return '#' + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + b.toString(16).padStart(2,'0');
  };

  // ── Utility: hex to RGB string ─────────────────────────────
  DS.hexToRgb = function hexToRgb(hex) {
    var r = parseInt(hex.slice(1,3), 16), g = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16);
    return r + ',' + g + ',' + b;
  };

  // ── Monster pixel-art drawing ──────────────────────────────
  DS.drawMonster = function drawMonster(sx, sy, mon, scale) {
    var ctx = DS.ctx;
    var time = DS.time;
    var s = scale || 14;
    var baseY = sy + 4;
    var color = mon.color;
    var darkColor = DS.shadeColor(color, -30);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.ellipse(sx, baseY + 4, s * 0.5, s * 0.2, 0, 0, Math.PI * 2); ctx.fill();

    // Elite glow aura
    if (mon.tp === 'e') {
      var eliteAlpha = 0.15 + Math.sin(time * 0.1) * 0.08;
      ctx.fillStyle = 'rgba(255,170,51,' + eliteAlpha + ')';
      ctx.beginPath(); ctx.ellipse(sx, baseY, s * 0.9, s * 0.7, 0, 0, Math.PI * 2); ctx.fill();
    }

    if (mon.name.indexOf('Slime') >= 0) {
      // Slime - bouncy blob
      var squish = Math.sin(time * 0.15 + mon.x) * 1.5;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(sx, baseY, s * 0.5 + squish, s * 0.4 - squish * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#fff';
      ctx.fillRect(sx - 3, baseY - 3, 2, 2); ctx.fillRect(sx + 2, baseY - 3, 2, 2);
      ctx.fillStyle = '#111';
      ctx.fillRect(sx - 2, baseY - 2, 1, 1); ctx.fillRect(sx + 3, baseY - 2, 1, 1);
    } else if (mon.name.indexOf('Bat') >= 0 || mon.name.indexOf('Goblin') >= 0) {
      // Bat/Goblin - small creature
      ctx.fillStyle = color;
      ctx.fillRect(sx - 3, baseY - 5, 6, 6); // body
      ctx.fillStyle = darkColor;
      ctx.fillRect(sx - 6, baseY - 4, 3, 3); // left wing
      ctx.fillRect(sx + 3, baseY - 4, 3, 3); // right wing
      // Eyes
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(sx - 2, baseY - 4, 1, 1); ctx.fillRect(sx + 1, baseY - 4, 1, 1);
    } else if (mon.name.indexOf('Skeleton') >= 0 || mon.name.indexOf('Zombie') >= 0) {
      // Skeleton/Zombie - humanoid
      ctx.fillStyle = color;
      ctx.fillRect(sx - 3, baseY - 10, 6, 4); // head
      ctx.fillRect(sx - 2, baseY - 6, 4, 6); // body
      ctx.fillRect(sx - 4, baseY - 5, 1, 4); // left arm
      ctx.fillRect(sx + 3, baseY - 5, 1, 4); // right arm
      ctx.fillRect(sx - 2, baseY, 1, 3); // left leg
      ctx.fillRect(sx + 1, baseY, 1, 3); // right leg
      // Eyes
      ctx.fillStyle = '#ff3333';
      ctx.fillRect(sx - 2, baseY - 9, 1, 1); ctx.fillRect(sx + 1, baseY - 9, 1, 1);
    } else if (mon.name.indexOf('Spider') >= 0) {
      // Spider
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.ellipse(sx, baseY - 2, s * 0.35, s * 0.25, 0, 0, Math.PI * 2); ctx.fill();
      // Legs
      ctx.strokeStyle = color; ctx.lineWidth = 1;
      for (var i = -1; i <= 1; i += 2) {
        ctx.beginPath(); ctx.moveTo(sx + i * 3, baseY - 1); ctx.lineTo(sx + i * 8, baseY - 4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(sx + i * 3, baseY); ctx.lineTo(sx + i * 7, baseY + 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(sx + i * 3, baseY - 3); ctx.lineTo(sx + i * 8, baseY - 6); ctx.stroke();
      }
      // Eyes (many!)
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(sx - 2, baseY - 4, 1, 1); ctx.fillRect(sx + 1, baseY - 4, 1, 1);
    } else if (mon.name.indexOf('Ghost') >= 0 || mon.name.indexOf('Wraith') >= 0) {
      // Ghost - floating, translucent
      var bobY = Math.sin(time * 0.08 + mon.x) * 2;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(sx - 4, baseY - 10 + bobY, 8, 10);
      ctx.fillRect(sx - 5, baseY - 5 + bobY, 1, 3);
      ctx.fillRect(sx + 4, baseY - 5 + bobY, 1, 3);
      ctx.globalAlpha = 1;
      // Eyes
      ctx.fillStyle = '#fff';
      ctx.fillRect(sx - 2, baseY - 7 + bobY, 2, 2); ctx.fillRect(sx + 1, baseY - 7 + bobY, 2, 2);
    } else if (mon.name.indexOf('Mage') >= 0 || mon.name.indexOf('Lich') >= 0) {
      // Mage - robed figure
      ctx.fillStyle = color;
      ctx.fillRect(sx - 4, baseY - 12, 8, 3); // hat
      ctx.fillRect(sx - 3, baseY - 9, 6, 3); // head
      ctx.fillRect(sx - 4, baseY - 6, 8, 8); // robe
      // Staff
      ctx.fillStyle = '#885533';
      ctx.fillRect(sx + 5, baseY - 14, 1, 16);
      ctx.fillStyle = '#aa44aa';
      ctx.fillRect(sx + 4, baseY - 15, 3, 2); // orb
      // Eyes
      ctx.fillStyle = '#ff44ff';
      ctx.fillRect(sx - 2, baseY - 8, 1, 1); ctx.fillRect(sx + 1, baseY - 8, 1, 1);
    } else if (mon.name.indexOf('Mimic') >= 0) {
      // Mimic - chest with teeth
      ctx.fillStyle = '#886633';
      ctx.fillRect(sx - 5, baseY - 6, 10, 6); // chest body
      ctx.fillStyle = '#aa8844';
      ctx.fillRect(sx - 5, baseY - 7, 10, 2); // lid
      // Teeth
      ctx.fillStyle = '#fff';
      for (var t = -3; t <= 3; t += 2) ctx.fillRect(sx + t, baseY - 1, 1, 2);
      // Eye
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(sx - 1, baseY - 5, 2, 2);
    } else if (mon.name.indexOf('Demon') >= 0 || mon.name.indexOf('Reaper') >= 0) {
      // Demon/Reaper - large dark figure
      ctx.fillStyle = color;
      ctx.fillRect(sx - 4, baseY - 12, 8, 4); // head
      ctx.fillRect(sx - 5, baseY - 8, 10, 10); // body
      ctx.fillRect(sx - 7, baseY - 7, 2, 6); // left arm
      ctx.fillRect(sx + 5, baseY - 7, 2, 6); // right arm
      // Horns
      ctx.fillStyle = darkColor;
      ctx.fillRect(sx - 5, baseY - 15, 2, 4); ctx.fillRect(sx + 3, baseY - 15, 2, 4);
      // Eyes
      ctx.fillStyle = '#ff2222';
      ctx.fillRect(sx - 2, baseY - 10, 2, 1); ctx.fillRect(sx + 1, baseY - 10, 2, 1);
      // Weapon (scythe for Reaper)
      if (mon.name.indexOf('Reaper') >= 0) {
        ctx.fillStyle = '#aaaacc';
        ctx.fillRect(sx + 7, baseY - 16, 1, 18);
        ctx.fillRect(sx + 5, baseY - 17, 4, 1);
      }
    } else if (mon.name.indexOf('Wolf') >= 0) {
      // Shadow Wolf - quadruped
      ctx.fillStyle = color;
      ctx.fillRect(sx - 4, baseY - 5, 8, 4); // body
      ctx.fillRect(sx + 3, baseY - 7, 4, 3); // head
      ctx.fillRect(sx - 5, baseY - 1, 1, 3); // legs
      ctx.fillRect(sx - 2, baseY - 1, 1, 3);
      ctx.fillRect(sx + 2, baseY - 1, 1, 3);
      ctx.fillRect(sx + 5, baseY - 1, 1, 3);
      // Eyes
      ctx.fillStyle = '#ffcc44';
      ctx.fillRect(sx + 5, baseY - 6, 1, 1); ctx.fillRect(sx + 6, baseY - 6, 1, 1);
      // Tail
      ctx.fillStyle = darkColor;
      ctx.fillRect(sx - 6, baseY - 5, 2, 1);
    } else if (mon.name.indexOf('Fire') >= 0) {
      // Fire Elemental - flickering flame shape
      var flicker2 = Math.sin(time * 0.2 + mon.x) * 1;
      ctx.fillStyle = '#ff4411';
      ctx.beginPath();
      ctx.moveTo(sx, baseY - 14 + flicker2);
      ctx.lineTo(sx - 5, baseY + 1);
      ctx.lineTo(sx + 5, baseY + 1);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffaa22';
      ctx.beginPath();
      ctx.moveTo(sx, baseY - 10 + flicker2);
      ctx.lineTo(sx - 3, baseY + 1);
      ctx.lineTo(sx + 3, baseY + 1);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffcc66';
      ctx.beginPath();
      ctx.moveTo(sx, baseY - 6);
      ctx.lineTo(sx - 1, baseY + 1);
      ctx.lineTo(sx + 1, baseY + 1);
      ctx.closePath(); ctx.fill();
      // Eyes
      ctx.fillStyle = '#fff';
      ctx.fillRect(sx - 2, baseY - 6, 1, 1); ctx.fillRect(sx + 1, baseY - 6, 1, 1);
    } else if (mon.name.indexOf('Golem') >= 0) {
      // Ice/Stone Golem - bulky
      ctx.fillStyle = color;
      ctx.fillRect(sx - 5, baseY - 12, 10, 6); // head
      ctx.fillRect(sx - 6, baseY - 6, 12, 8); // body
      ctx.fillRect(sx - 8, baseY - 5, 2, 6); // left arm
      ctx.fillRect(sx + 6, baseY - 5, 2, 6); // right arm
      ctx.fillRect(sx - 4, baseY + 2, 3, 3); // left leg
      ctx.fillRect(sx + 1, baseY + 2, 3, 3); // right leg
      // Eyes
      ctx.fillStyle = mon.name.indexOf('Ice') >= 0 ? '#88ddff' : '#ffaa44';
      ctx.fillRect(sx - 3, baseY - 9, 2, 2); ctx.fillRect(sx + 1, baseY - 9, 2, 2);
    } else if (mon.name.indexOf('Plague') >= 0) {
      // Plague Bearer - hooded figure with green aura
      ctx.fillStyle = color;
      ctx.fillRect(sx - 4, baseY - 12, 8, 3); // hood
      ctx.fillRect(sx - 3, baseY - 9, 6, 3); // head
      ctx.fillRect(sx - 4, baseY - 6, 8, 8); // cloak
      ctx.fillStyle = '#aacc44';
      ctx.fillRect(sx - 2, baseY - 8, 1, 1); ctx.fillRect(sx + 1, baseY - 8, 1, 1); // eyes
      // Green aura
      ctx.fillStyle = 'rgba(100,180,50,0.15)';
      ctx.beginPath(); ctx.arc(sx, baseY - 5, 10, 0, Math.PI * 2); ctx.fill();
    } else if (mon.name.indexOf('Gargoyle') >= 0) {
      // Stone Gargoyle - winged statue
      ctx.fillStyle = color;
      ctx.fillRect(sx - 4, baseY - 10, 8, 4); // head
      ctx.fillRect(sx - 3, baseY - 6, 6, 6); // body
      // Wings
      ctx.fillRect(sx - 8, baseY - 8, 4, 5);
      ctx.fillRect(sx + 4, baseY - 8, 4, 5);
      ctx.fillRect(sx - 9, baseY - 9, 2, 3);
      ctx.fillRect(sx + 7, baseY - 9, 2, 3);
      // Eyes
      ctx.fillStyle = '#cc8844';
      ctx.fillRect(sx - 2, baseY - 8, 1, 1); ctx.fillRect(sx + 1, baseY - 8, 1, 1);
    } else if (mon.name.indexOf('Imp') >= 0) {
      // Void Imp - small floating demon
      var impBob = Math.sin(time * 0.12 + mon.x * 3) * 1.5;
      ctx.fillStyle = color;
      ctx.fillRect(sx - 2, baseY - 6 + impBob, 4, 4); // body
      ctx.fillRect(sx - 3, baseY - 8 + impBob, 6, 2); // head
      // Wings
      ctx.fillStyle = darkColor;
      ctx.fillRect(sx - 4, baseY - 6 + impBob, 1, 3);
      ctx.fillRect(sx + 3, baseY - 6 + impBob, 1, 3);
      // Eyes
      ctx.fillStyle = '#ff44ff';
      ctx.fillRect(sx - 1, baseY - 7 + impBob, 1, 1); ctx.fillRect(sx + 1, baseY - 7 + impBob, 1, 1);
    } else if (mon.name.indexOf('Bone') >= 0 || mon.name.indexOf('Dragon') >= 0) {
      // Bone Dragon - large skeletal
      ctx.fillStyle = color;
      ctx.fillRect(sx - 5, baseY - 12, 10, 5); // skull
      ctx.fillRect(sx - 4, baseY - 7, 8, 8); // body
      ctx.fillRect(sx - 8, baseY - 8, 3, 6); // left wing
      ctx.fillRect(sx + 5, baseY - 8, 3, 6); // right wing
      // Jaw
      ctx.fillStyle = darkColor;
      ctx.fillRect(sx - 3, baseY - 7, 6, 2);
      // Eyes
      ctx.fillStyle = '#ff2200';
      ctx.fillRect(sx - 3, baseY - 10, 2, 2); ctx.fillRect(sx + 1, baseY - 10, 2, 2);
    } else if (mon.name.indexOf('Chaos') >= 0 && mon.tp !== 'b') {
      // Chaos Spawn - swirling mass
      var chaosPhase = time * 0.1 + mon.x + mon.y;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(sx + Math.sin(chaosPhase) * 2, baseY - 5, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff44ff';
      ctx.beginPath();
      ctx.arc(sx + Math.cos(chaosPhase) * 3, baseY - 3, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(sx - 1, baseY - 6, 1, 1); ctx.fillRect(sx + 1, baseY - 6, 1, 1);
    } else if (mon.name.indexOf('Dread') >= 0 || mon.name.indexOf('Knight') >= 0) {
      // Dread Knight - armored warrior
      ctx.fillStyle = color;
      ctx.fillRect(sx - 3, baseY - 12, 6, 4); // helmet
      ctx.fillRect(sx - 4, baseY - 13, 8, 1); // helm crest
      ctx.fillRect(sx - 3, baseY - 8, 6, 3); // head
      ctx.fillRect(sx - 4, baseY - 5, 8, 7); // body/armor
      ctx.fillRect(sx - 5, baseY - 4, 1, 5); // left arm
      ctx.fillRect(sx + 4, baseY - 4, 1, 5); // right arm
      // Eyes through visor
      ctx.fillStyle = '#ff2222';
      ctx.fillRect(sx - 2, baseY - 7, 1, 1); ctx.fillRect(sx + 1, baseY - 7, 1, 1);
      // Sword
      ctx.fillStyle = '#aaaacc';
      ctx.fillRect(sx + 6, baseY - 10, 1, 12);
      ctx.fillStyle = '#885533';
      ctx.fillRect(sx + 5, baseY - 1, 3, 1);
    } else if (mon.tp === 'b') {
      // Boss rendering - unique per boss
      var pulse = Math.sin(time * 0.06) * 0.15 + 0.85;
      // Boss aura
      ctx.fillStyle = 'rgba(' + DS.hexToRgb(color) + ',0.1)';
      ctx.beginPath(); ctx.arc(sx, baseY - 8, 18, 0, Math.PI * 2); ctx.fill();

      if (mon.name.indexOf('Serpent') >= 0) {
        // Shadow Serpent - snake body
        ctx.fillStyle = color;
        ctx.fillRect(sx - 3, baseY - 10, 6, 4); // head
        ctx.fillRect(sx - 2, baseY - 6, 4, 3);
        ctx.fillRect(sx - 3, baseY - 3, 6, 3);
        ctx.fillRect(sx - 2, baseY, 4, 3);
        ctx.fillRect(sx - 4, baseY + 3, 3, 2); // tail
        // Fangs
        ctx.fillStyle = '#fff';
        ctx.fillRect(sx - 1, baseY - 7, 1, 2); ctx.fillRect(sx + 1, baseY - 7, 1, 2);
        // Eyes
        ctx.fillStyle = '#44ff88';
        ctx.fillRect(sx - 2, baseY - 9, 1, 1); ctx.fillRect(sx + 1, baseY - 9, 1, 1);
      } else if (mon.name.indexOf('Drake') >= 0) {
        // Inferno Drake - dragon
        ctx.fillStyle = color;
        ctx.fillRect(sx - 5, baseY - 14, 10, 6); // head
        ctx.fillRect(sx - 5, baseY - 8, 10, 10); // body
        ctx.fillRect(sx - 8, baseY - 10, 3, 6); // left wing
        ctx.fillRect(sx + 5, baseY - 10, 3, 6); // right wing
        ctx.fillRect(sx - 8, baseY - 12, 2, 3); // wing tip
        ctx.fillRect(sx + 6, baseY - 12, 2, 3);
        // Horns
        ctx.fillStyle = darkColor;
        ctx.fillRect(sx - 5, baseY - 17, 2, 4); ctx.fillRect(sx + 3, baseY - 17, 2, 4);
        // Eyes
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(sx - 3, baseY - 12, 2, 2); ctx.fillRect(sx + 1, baseY - 12, 2, 2);
        // Fire breath glow
        ctx.fillStyle = 'rgba(255,100,0,'+(pulse*0.2)+')';
        ctx.beginPath(); ctx.arc(sx, baseY - 10, 12, 0, Math.PI * 2); ctx.fill();
      } else if (mon.name.indexOf('Wraith') >= 0) {
        // Void Wraith - ethereal
        var wraithBob = Math.sin(time * 0.07) * 2;
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = color;
        ctx.fillRect(sx - 5, baseY - 14 + wraithBob, 10, 6);
        ctx.fillRect(sx - 6, baseY - 8 + wraithBob, 12, 10);
        ctx.fillRect(sx - 8, baseY - 6 + wraithBob, 2, 6);
        ctx.fillRect(sx + 6, baseY - 6 + wraithBob, 2, 6);
        ctx.globalAlpha = 1;
        // Eyes
        ctx.fillStyle = '#aa88ff';
        ctx.fillRect(sx - 3, baseY - 11 + wraithBob, 2, 2); ctx.fillRect(sx + 1, baseY - 11 + wraithBob, 2, 2);
        // Void particles
        ctx.fillStyle = 'rgba(100,68,204,'+pulse*0.3+')';
        ctx.beginPath(); ctx.arc(sx, baseY - 8 + wraithBob, 14, 0, Math.PI * 2); ctx.fill();
      } else if (mon.name.indexOf('Emperor') >= 0) {
        // Chaos Emperor - regal dark figure
        ctx.fillStyle = color;
        ctx.fillRect(sx - 5, baseY - 14, 10, 4); // head/helm
        ctx.fillRect(sx - 4, baseY - 10, 8, 3); // face
        ctx.fillRect(sx - 6, baseY - 7, 12, 9); // body
        ctx.fillRect(sx - 8, baseY - 6, 2, 7); // left arm
        ctx.fillRect(sx + 6, baseY - 6, 2, 7); // right arm
        // Crown
        ctx.fillStyle = '#ffcc44';
        ctx.fillRect(sx - 4, baseY - 16, 8, 2);
        ctx.fillRect(sx - 3, baseY - 17, 1, 1); ctx.fillRect(sx - 1, baseY - 18, 2, 1); ctx.fillRect(sx + 2, baseY - 17, 1, 1);
        // Eyes
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(sx - 3, baseY - 9, 2, 2); ctx.fillRect(sx + 1, baseY - 9, 2, 2);
        // Staff
        ctx.fillStyle = '#8844aa';
        ctx.fillRect(sx + 8, baseY - 18, 1, 20);
        ctx.fillStyle = '#cc44cc';
        ctx.fillRect(sx + 7, baseY - 19, 3, 2);
      } else {
        // Default boss - Gate Giant, Abyss Worm, Dark Lord
        ctx.fillStyle = color;
        ctx.fillRect(sx - 6, baseY - 14, 12, 8); // head
        ctx.fillRect(sx - 5, baseY - 6, 10, 8); // body
        // Crown/horns
        ctx.fillStyle = '#ffaa22';
        ctx.fillRect(sx - 5, baseY - 17, 2, 4); ctx.fillRect(sx - 1, baseY - 18, 2, 5);
        ctx.fillRect(sx + 3, baseY - 17, 2, 4);
        // Eyes
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(sx - 3, baseY - 11, 3, 2); ctx.fillRect(sx + 1, baseY - 11, 3, 2);
        // Mouth
        ctx.fillStyle = '#111';
        ctx.fillRect(sx - 2, baseY - 7, 5, 2);
      }
    } else {
      // Default - colored blob
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.ellipse(sx, baseY - 2, s * 0.4, s * 0.35, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(sx - 2, baseY - 4, 1, 1); ctx.fillRect(sx + 1, baseY - 4, 1, 1);
    }
  };

  // ── Main render function ───────────────────────────────────
  DS.render = function render() {
    var ctx = DS.ctx;
    var cv = DS.cv;
    var time = DS.time;
    var dyingMons = DS.dyingMons;
    var playerHitTimer = DS.playerHitTimer;

    if (!G || !G.maze) return;
    var cw = cv.width, ch = cv.height;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, cw, ch);

    // Screen shake offset
    var shX = screenShake > 0 ? (Math.random()-0.5)*screenShake : 0;
    var shY = screenShake > 0 ? (Math.random()-0.5)*screenShake : 0;

    // Camera centered on player
    var ps = DS.isoToScreen(G.px, G.py);
    var camX = cw/2 - ps.x + shX;
    var camY = ch/2 - ps.y - 10 + shY;

    var m = G.maze, f = G.fog;
    var flicker = Math.sin(time*0.05)*0.02;
    var theme = getFloorTheme(G.floor);

    // Render tiles back-to-front for correct depth
    var minGX = Math.max(0, G.px - 20), maxGX = Math.min(m.w-1, G.px + 20);
    var minGY = Math.max(0, G.py - 20), maxGY = Math.min(m.h-1, G.py + 20);

    for (var sum = minGX+minGY; sum <= maxGX+maxGY; sum++) {
      for (var gx = minGX; gx <= maxGX; gx++) {
        var gy = sum - gx;
        if (gy < minGY || gy > maxGY) continue;

        var rev = f[gy] ? f[gy][gx] : 0;
        if (rev === 0) {
          // Hidden - draw black
          var ps2 = DS.isoToScreen(gx, gy);
          ctx.fillStyle = '#050505';
          ctx.beginPath();
          ctx.moveTo(ps2.x+camX, ps2.y+camY);
          ctx.lineTo(ps2.x+camX+HW, ps2.y+camY+HH);
          ctx.lineTo(ps2.x+camX, ps2.y+camY+TH);
          ctx.lineTo(ps2.x+camX-HW, ps2.y+camY+HH);
          ctx.closePath(); ctx.fill();
          continue;
        }

        var tile = m.grid[gy][gx];
        var p = DS.isoToScreen(gx, gy);
        var sx = p.x + camX, sy = p.y + camY;
        var visible = rev === 2;

        // Distance-based light
        var dist = Math.sqrt((gx-G.px)*(gx-G.px)+(gy-G.py)*(gy-G.py));
        var vr = totalVis();
        var light = visible ? Math.max(0.25, 1 - dist/vr + flicker) : 0.15;

        // Tile rendering
        if (tile === TILE.WALL) {
          var tc = visible ? theme.wallTop : '#2a2a2a';
          var lc = visible ? theme.wallLeft : '#1e1e1e';
          var rc = visible ? theme.wallRight : '#141414';
          DS.drawIsoCube(sx, sy, tc, lc, rc, CH);
          // Brick pattern on top face
          if (visible) {
            ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 0.5;
            // Cross lines on top
            ctx.beginPath();
            ctx.moveTo(sx, sy-CH); ctx.lineTo(sx, sy+TH-CH);
            ctx.moveTo(sx-HW, sy+HH-CH); ctx.lineTo(sx+HW, sy+HH-CH);
            ctx.stroke();
            // Brick lines on left face
            var brickAlpha = 'rgba(0,0,0,0.15)';
            ctx.strokeStyle = brickAlpha; ctx.lineWidth = 0.4;
            for (var bi = 0; bi < 3; bi++) {
              var by2 = sy+TH-CH + bi*(CH/3);
              var bxOff = (bi%2===0) ? 0 : HW*0.25;
              ctx.beginPath();
              ctx.moveTo(sx-HW+bxOff, by2);
              ctx.lineTo(sx+bxOff, by2+(CH/3)*0.5);
              ctx.stroke();
            }
            // Brick lines on right face
            for (var bi2 = 0; bi2 < 3; bi2++) {
              var by3 = sy+TH-CH + bi2*(CH/3);
              var bxOff2 = (bi2%2===0) ? 0 : -HW*0.25;
              ctx.beginPath();
              ctx.moveTo(sx+HW+bxOff2, by3);
              ctx.lineTo(sx+bxOff2, by3+(CH/3)*0.5);
              ctx.stroke();
            }
            // Moss/cracks on walls for deeper floors
            if (G.floor > 3 && ((gx*7+gy*13)%11) < 3) {
              ctx.fillStyle = 'rgba(40,80,30,0.2)';
              ctx.fillRect(sx-HW+2, sy+TH-CH+4, 4, 3);
            }
            // Dripping effect on some walls
            if (G.floor > 5 && ((gx*3+gy*7)%17) < 2) {
              ctx.fillStyle = 'rgba(60,80,100,0.15)';
              ctx.fillRect(sx-1, sy+TH-CH, 2, CH);
            }
            // Torch light warm glow on nearby walls
            if (dist < 3) {
              var warmth = Math.max(0, (3 - dist) / 3) * 0.15;
              ctx.fillStyle = 'rgba(255,160,60,' + warmth + ')';
              ctx.beginPath();
              ctx.moveTo(sx, sy - CH); ctx.lineTo(sx + HW, sy + HH - CH);
              ctx.lineTo(sx, sy + TH - CH); ctx.lineTo(sx - HW, sy + HH - CH);
              ctx.closePath(); ctx.fill();
            }
          }
        } else if (tile === TILE.FLOOR) {
          var fc = visible ? ((gx+gy)%2===0 ? theme.floor1 : theme.floor2) : '#1a1610';
          var fc2 = visible ? theme.accent : '#121008';
          DS.drawIsoFloor(sx, sy, fc, fc2);
          // Floor detail: small cracks/pebbles based on deterministic hash
          if (visible) {
            var hash = (gx*31 + gy*17) % 23;
            if (hash < 3) {
              // Small crack
              ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(sx - 3 + hash*2, sy + HH - 1);
              ctx.lineTo(sx + hash, sy + HH + 2);
              ctx.stroke();
            } else if (hash < 5) {
              // Small pebble
              ctx.fillStyle = 'rgba(80,70,60,0.3)';
              ctx.beginPath(); ctx.arc(sx + hash - 2, sy + HH, 1.5, 0, Math.PI*2); ctx.fill();
            } else if (hash < 7 && G.floor > 4) {
              // Puddle (deeper floors)
              ctx.fillStyle = 'rgba(40,60,80,0.15)';
              ctx.beginPath();
              ctx.ellipse(sx, sy + HH + 1, 4, 2, 0, 0, Math.PI*2);
              ctx.fill();
            } else if (hash < 9 && G.floor > 6) {
              // Blood stain
              ctx.fillStyle = 'rgba(120,20,20,0.12)';
              ctx.beginPath();
              ctx.ellipse(sx + hash % 5 - 2, sy + HH + hash % 3, 3, 2, hash * 0.5, 0, Math.PI*2);
              ctx.fill();
            } else if (hash < 10 && G.floor > 8) {
              // Rune mark
              ctx.strokeStyle = 'rgba(100,60,140,0.12)';
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(sx - 2, sy + HH - 1); ctx.lineTo(sx, sy + HH + 2); ctx.lineTo(sx + 2, sy + HH - 1);
              ctx.stroke();
            }
          }
        } else if (tile === TILE.STAIRS) {
          DS.drawIsoFloor(sx, sy, visible ? '#2a3a2a' : '#1a2a1a');
          if (visible) {
            // Green glow stairs
            var pulse = Math.sin(time*0.08)*0.3+0.7;
            ctx.fillStyle = 'rgba(60,180,60,'+pulse*0.4+')';
            ctx.beginPath();
            ctx.moveTo(sx, sy); ctx.lineTo(sx+HW, sy+HH); ctx.lineTo(sx, sy+TH); ctx.lineTo(sx-HW, sy+HH);
            ctx.closePath(); ctx.fill();
            // Staircase icon
            ctx.fillStyle = '#44cc44';
            ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('▼', sx, sy+3);
            // Pulsing glow ring
            ctx.strokeStyle = 'rgba(60,200,60,'+(pulse*0.5)+')';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(sx, sy+HH, 8+pulse*3, 0, Math.PI*2);
            ctx.stroke();
            // Ambient glow
            var stairGlow = ctx.createRadialGradient(sx, sy+HH, 0, sx, sy+HH, 20);
            stairGlow.addColorStop(0, 'rgba(60,200,60,'+(pulse*0.15)+')');
            stairGlow.addColorStop(1, 'rgba(60,200,60,0)');
            ctx.fillStyle = stairGlow;
            ctx.beginPath(); ctx.arc(sx, sy+HH, 20, 0, Math.PI*2); ctx.fill();
          }
        } else if (tile === TILE.RESOURCE) {
          DS.drawIsoFloor(sx, sy, visible ? '#3a2a1a' : '#1a1610');
          if (visible) {
            // Slightly glowing resource node
            var resGlow = Math.sin(time*0.07+gx*gy)*0.15+0.25;
            ctx.fillStyle = 'rgba(180,140,60,'+resGlow+')';
            ctx.beginPath();
            ctx.moveTo(sx, sy); ctx.lineTo(sx+HW, sy+HH); ctx.lineTo(sx, sy+TH); ctx.lineTo(sx-HW, sy+HH);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ccaa44';
            ctx.font = '12px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('◆', sx, sy+2);
          }
        } else if (tile === TILE.SHOP) {
          DS.drawIsoFloor(sx, sy, visible ? '#3a2a4a' : '#1a1610');
          if (visible) {
            var shopPulse = Math.sin(time*0.06)*0.2+0.6;
            ctx.fillStyle = 'rgba(180,140,255,'+shopPulse*0.3+')';
            ctx.beginPath();
            ctx.moveTo(sx, sy); ctx.lineTo(sx+HW, sy+HH); ctx.lineTo(sx, sy+TH); ctx.lineTo(sx-HW, sy+HH);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ccaaff';
            ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('🏪', sx, sy+2);
            // Shop ambient glow
            var shopGlow = ctx.createRadialGradient(sx, sy+HH, 0, sx, sy+HH, 18);
            shopGlow.addColorStop(0, 'rgba(180,140,255,'+(shopPulse*0.12)+')');
            shopGlow.addColorStop(1, 'rgba(180,140,255,0)');
            ctx.fillStyle = shopGlow;
            ctx.beginPath(); ctx.arc(sx, sy+HH, 18, 0, Math.PI*2); ctx.fill();
          }
        } else if (tile === TILE.TRAP) {
          // Traps look like floor until stepped on (but show a subtle hint)
          DS.drawIsoFloor(sx, sy, visible ? ((gx+gy)%2===0 ? theme.floor1 : theme.floor2) : '#1a1610');
          if (visible && dist < 2 + G.stats.int * 0.3) {
            // INT helps spot traps - subtle crack pattern
            ctx.strokeStyle = 'rgba(180,60,60,0.25)'; ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(sx - 3, sy + HH); ctx.lineTo(sx + 1, sy + HH + 1); ctx.lineTo(sx + 3, sy + HH - 1);
            ctx.stroke();
          }
        } else if (tile === TILE.CHEST) {
          DS.drawIsoFloor(sx, sy, visible ? '#3a2a1a' : '#1a1610');
          if (visible) {
            // Chest glow
            var chestPulse = Math.sin(time * 0.08) * 0.15 + 0.4;
            ctx.fillStyle = 'rgba(255,200,50,' + chestPulse * 0.3 + ')';
            ctx.beginPath();
            ctx.moveTo(sx, sy); ctx.lineTo(sx+HW, sy+HH); ctx.lineTo(sx, sy+TH); ctx.lineTo(sx-HW, sy+HH);
            ctx.closePath(); ctx.fill();
            // Chest icon
            ctx.fillStyle = '#cc8822';
            ctx.fillRect(sx - 4, sy + HH - 3, 8, 5);
            ctx.fillStyle = '#ffaa33';
            ctx.fillRect(sx - 4, sy + HH - 4, 8, 2);
            ctx.fillStyle = '#ffee66';
            ctx.fillRect(sx - 1, sy + HH - 2, 2, 2);
            // Ambient glow
            var chestGlow = ctx.createRadialGradient(sx, sy+HH, 0, sx, sy+HH, 15);
            chestGlow.addColorStop(0, 'rgba(255,200,50,'+(chestPulse*0.15)+')');
            chestGlow.addColorStop(1, 'rgba(255,200,50,0)');
            ctx.fillStyle = chestGlow;
            ctx.beginPath(); ctx.arc(sx, sy+HH, 15, 0, Math.PI*2); ctx.fill();
          }
        }

        // Light overlay for far tiles
        if (visible && dist > 2) {
          var alpha = Math.min(0.6, (dist-2)*0.1);
          ctx.fillStyle = 'rgba(0,0,0,'+alpha+')';
          ctx.beginPath();
          ctx.moveTo(sx, sy - (tile===TILE.WALL?CH:0));
          ctx.lineTo(sx+HW, sy+HH - (tile===TILE.WALL?CH:0));
          ctx.lineTo(sx, sy+TH - (tile===TILE.WALL?CH:0));
          ctx.lineTo(sx-HW, sy+HH - (tile===TILE.WALL?CH:0));
          ctx.closePath(); ctx.fill();
        }

        // Fog for revealed-but-not-visible
        if (!visible) {
          ctx.fillStyle = 'rgba(5,5,5,0.7)';
          ctx.beginPath();
          ctx.moveTo(sx, sy - (tile===TILE.WALL?CH:0));
          ctx.lineTo(sx+HW, sy+HH - (tile===TILE.WALL?CH:0));
          ctx.lineTo(sx, sy+TH - (tile===TILE.WALL?CH:0));
          ctx.lineTo(sx-HW, sy+HH - (tile===TILE.WALL?CH:0));
          ctx.closePath(); ctx.fill();
        }

        // Items on ground (only on visible floor tiles)
        if (visible && tile !== TILE.WALL) {
          var groundItem = G.items.find(function(i) { return i.x===gx && i.y===gy; });
          if (groundItem) {
            var bounce = Math.sin(time*0.1+gx+gy)*1.5;
            var iData = ITEMS[groundItem.id];
            var orbColor = iData ? (iData.q==='l'?'#ffaa22':iData.q==='e'?'#aa44dd':iData.q==='u'?'#44cc44':'#4488ff') : '#4488ff';
            var orbGlow = iData ? (iData.q==='l'?'rgba(255,170,34,':iData.q==='e'?'rgba(170,68,221,':iData.q==='u'?'rgba(68,204,68,':'rgba(68,136,255,') : 'rgba(68,136,255,';
            // Glow aura
            var glowPulse = Math.sin(time*0.08+gx)*0.15+0.3;
            ctx.fillStyle = orbGlow+glowPulse+')';
            ctx.beginPath(); ctx.arc(sx, sy+2+bounce, 8, 0, Math.PI*2); ctx.fill();
            // Outer orb
            ctx.fillStyle = orbColor;
            ctx.beginPath(); ctx.arc(sx, sy+2+bounce, 4, 0, Math.PI*2); ctx.fill();
            // Inner highlight
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(sx-1, sy+bounce, 2, 0, Math.PI*2); ctx.fill();
            // Icon
            if (iData) {
              ctx.font = '8px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillText(iData.icon, sx, sy+bounce);
            }
          }

          // Monsters
          var mon = G.mons.find(function(mm) { return mm.alive && mm.x===gx && mm.y===gy; });
          if (mon) {
            DS.drawMonster(sx, sy, mon, mon.tp==='b'?20:14);
            // HP bar
            var pct = Math.max(0, mon.hp/mon.maxHp);
            ctx.fillStyle = '#222'; ctx.fillRect(sx-10, sy-18, 20, 3);
            ctx.fillStyle = pct>0.5?'#44cc44':pct>0.25?'#cccc44':'#cc4444';
            ctx.fillRect(sx-10, sy-18, 20*pct, 3);
            // Boss name
            if (mon.tp==='b') {
              ctx.fillStyle = '#ff6644'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
              ctx.fillText(mon.name, sx, sy-22);
            }
          }
        }
      }
    }

    // Dying monster animations
    for (var di = dyingMons.length - 1; di >= 0; di--) {
      var dm = dyingMons[di];
      dm.timer--;
      if (dm.timer <= 0) { dyingMons.splice(di, 1); continue; }
      var dmP = DS.isoToScreen(dm.x, dm.y);
      var dmSX = dmP.x + camX, dmSY = dmP.y + camY;
      var dmFog = G.fog[dm.y] && G.fog[dm.y][dm.x] === 2;
      if (!dmFog) continue;
      var dmAlpha = dm.timer / 30;
      // Expanding color burst
      ctx.globalAlpha = dmAlpha * 0.4;
      var burstR = (30 - dm.timer) * 1.2;
      var burst = ctx.createRadialGradient(dmSX, dmSY, 0, dmSX, dmSY, burstR);
      burst.addColorStop(0, dm.color);
      burst.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = burst;
      ctx.beginPath(); ctx.arc(dmSX, dmSY, burstR, 0, Math.PI * 2); ctx.fill();
      // Fading monster sprite
      ctx.globalAlpha = dmAlpha;
      DS.drawMonster(dmSX, dmSY, dm, 14);
      ctx.globalAlpha = 1;
    }

    // Player
    var ppos = DS.isoToScreen(G.px, G.py);
    var psx = ppos.x+camX, psy = ppos.y+camY;
    var walkBob = Math.sin(playerAnim.walkCycle * 0.8) * 1.5;
    var face = playerAnim.facing;

    // Player glow (torch-like warm light)
    var glowA = Math.sin(time*0.06)*0.08+0.18;
    var glowFlicker = Math.sin(time*0.13)*0.03 + Math.sin(time*0.21)*0.02;
    var grd = ctx.createRadialGradient(psx, psy, 0, psx, psy, TW*2.5);
    grd.addColorStop(0, 'rgba(255,220,150,'+(glowA+glowFlicker)+')');
    grd.addColorStop(0.3, 'rgba(255,200,120,'+(glowA*0.5+glowFlicker)+')');
    grd.addColorStop(0.6, 'rgba(255,160,80,'+(glowA*0.2)+')');
    grd.addColorStop(1, 'rgba(255,140,60,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(psx, psy, TW*2.5, 0, Math.PI*2); ctx.fill();
    // Secondary glow (inner bright core)
    var grd2 = ctx.createRadialGradient(psx, psy - 8, 0, psx, psy - 8, TW);
    grd2.addColorStop(0, 'rgba(255,240,200,'+(glowA*0.4+glowFlicker*0.5)+')');
    grd2.addColorStop(1, 'rgba(255,200,100,0)');
    ctx.fillStyle = grd2;
    ctx.beginPath(); ctx.arc(psx, psy - 8, TW, 0, Math.PI*2); ctx.fill();

    // Torch flame particles
    if (time % 2 === 0) {
      spawnParticles(psx + face*5, psy - 12, '#ffaa33', 1, {spread:1, rise:2.5, life:14, size:2});
      if (Math.random() < 0.5) spawnParticles(psx + face*5, psy - 14, '#ff6622', 1, {spread:1.5, rise:3, life:10, size:1.5});
      if (Math.random() < 0.3) spawnParticles(psx + face*5, psy - 10, '#ffcc66', 1, {spread:0.5, rise:1.5, life:8, size:1});
    }

    // Ambient dust motes
    if (time % 8 === 0 && Math.random() < 0.5) {
      var dustX = psx + (Math.random()-0.5) * TW * 4;
      var dustY = psy + (Math.random()-0.5) * TH * 4;
      spawnParticles(dustX, dustY, 'rgba(200,180,150,0.4)', 1, {spread:0.3, rise:0.2, life:60, size:1});
    }
    // Water drip particles near walls
    if (time % 15 === 0 && Math.random() < 0.3) {
      var dripX = psx + (Math.random()-0.5) * TW * 3;
      var dripY = psy + (Math.random()-0.5) * TH * 3;
      spawnParticles(dripX, dripY, 'rgba(100,150,200,0.5)', 1, {spread:0.2, rise:0, life:20, size:1.5});
    }
    // Theme-specific ambient particles
    var themeIdx = Math.min(Math.floor((G.floor-1)/3), 4);
    if (themeIdx === 1 && time % 12 === 0 && Math.random() < 0.4) {
      // Cavern: dripping water
      spawnParticles(psx + (Math.random()-0.5)*TW*5, psy + (Math.random()-0.5)*TH*3, 'rgba(80,120,160,0.4)', 1, {spread:0.1, rise:0.5, life:30, size:1.5});
    } else if (themeIdx === 2 && time % 10 === 0 && Math.random() < 0.3) {
      // Ruins: falling dust
      spawnParticles(psx + (Math.random()-0.5)*TW*4, psy + (Math.random()-0.5)*TH*2, 'rgba(160,140,120,0.3)', 1, {spread:0.5, rise:0.8, life:25, size:1});
    } else if (themeIdx === 3 && time % 6 === 0 && Math.random() < 0.3) {
      // Abyss: floating wisps
      spawnParticles(psx + (Math.random()-0.5)*TW*5, psy + (Math.random()-0.5)*TH*4, 'rgba(100,80,180,0.3)', 1, {spread:1, rise:-0.5, life:40, size:1.5});
    } else if (themeIdx === 4 && time % 5 === 0 && Math.random() < 0.4) {
      // Inferno: embers
      spawnParticles(psx + (Math.random()-0.5)*TW*4, psy + (Math.random()-0.5)*TH*3, 'rgba(255,120,30,0.5)', 1, {spread:0.8, rise:-1.5, life:35, size:1.5});
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.ellipse(psx, psy+4, 7, 3, 0, 0, Math.PI*2); ctx.fill();

    // Compact player character - pixel girl with sword
    var ox = psx, oy = psy + walkBob;

    // Armor color based on equipped armor
    var armorColor = '#cc3333'; // default red
    var armorDark = '#aa2222';
    if (G.eq.a) {
      var ad = ITEMS[G.eq.a];
      if (ad) {
        if (ad.q === 'l') { armorColor = '#cc8833'; armorDark = '#aa6622'; }
        else if (ad.q === 'e') { armorColor = '#8844aa'; armorDark = '#663388'; }
        else if (ad.q === 'u') { armorColor = '#4477aa'; armorDark = '#335588'; }
      }
    }

    // Hair (back layer - long brown hair)
    ctx.fillStyle = '#7a4422';
    ctx.fillRect(ox-4*face, oy-13, 2, 7);
    ctx.fillRect(ox+2*face, oy-13, 2, 7);
    // Hair strands detail
    ctx.fillStyle = '#6a3a1a';
    ctx.fillRect(ox-3*face, oy-8, 1, 4);
    ctx.fillRect(ox+3*face, oy-8, 1, 4);

    // Legs with walk animation
    var legOff = Math.sin(playerAnim.walkCycle * 0.8) * 1.5;
    ctx.fillStyle = '#2a2a2a'; // dark pants
    ctx.fillRect(ox-2, oy-1+legOff, 2, 3);
    ctx.fillRect(ox+1, oy-1-legOff, 2, 3);

    // Boots (color based on equipped boots)
    var bootColor = '#553311';
    if (G.eq.b) {
      var bd = ITEMS[G.eq.b];
      if (bd) {
        if (bd.q === 'l') bootColor = '#8866aa';
        else if (bd.q === 'e') bootColor = '#665544';
        else if (bd.q === 'u') bootColor = '#664433';
      }
    }
    ctx.fillStyle = bootColor;
    ctx.fillRect(ox-3, oy+2+legOff, 2, 2);
    ctx.fillRect(ox+1, oy+2-legOff, 2, 2);
    // Boot soles
    ctx.fillStyle = '#332211';
    ctx.fillRect(ox-3, oy+3+legOff, 2, 1);
    ctx.fillRect(ox+1, oy+3-legOff, 2, 1);

    // Body - armor colored outfit
    ctx.fillStyle = armorColor;
    ctx.fillRect(ox-3, oy-8, 6, 7);
    // Belt
    var beltColor = '#664422';
    if (G.eq.l) { beltColor = '#aa8833'; } // golden belt
    ctx.fillStyle = beltColor;
    ctx.fillRect(ox-3, oy-2, 6, 1);
    // Belt buckle
    ctx.fillStyle = '#ccaa44';
    ctx.fillRect(ox, oy-2, 1, 1);
    // Outfit details
    ctx.fillStyle = armorDark;
    ctx.fillRect(ox-1, oy-8, 2, 7); // center line
    // Shoulder pads (if armor equipped)
    if (G.eq.a) {
      ctx.fillStyle = armorColor;
      ctx.fillRect(ox-6, oy-8, 1, 2);
      ctx.fillRect(ox+5, oy-8, 1, 2);
    }

    // Arms
    ctx.fillStyle = armorColor;
    ctx.fillRect(ox-5, oy-7, 2, 5); // left arm
    ctx.fillRect(ox+3, oy-7, 2, 5); // right arm

    // Hands (skin)
    ctx.fillStyle = '#ffd4a8';
    ctx.fillRect(ox-5, oy-2, 2, 2);
    ctx.fillRect(ox+3, oy-2, 2, 2);

    // Head
    ctx.fillStyle = '#ffd4a8'; // skin
    ctx.fillRect(ox-3, oy-12, 6, 5);
    // Face shading
    ctx.fillStyle = '#eec898';
    ctx.fillRect(ox-3, oy-10, 1, 2);
    ctx.fillRect(ox+2, oy-10, 1, 2);
    // Cheek blush
    ctx.fillStyle = 'rgba(255,150,150,0.3)';
    ctx.fillRect(ox-3, oy-10, 1, 1);
    ctx.fillRect(ox+2, oy-10, 1, 1);

    // Hair (front)
    ctx.fillStyle = '#885533';
    ctx.fillRect(ox-4, oy-13, 8, 2); // top
    ctx.fillRect(ox-4, oy-11, 1, 3); // left bang
    ctx.fillRect(ox+3, oy-11, 1, 3); // right bang
    // Hair highlight
    ctx.fillStyle = '#aa7744';
    ctx.fillRect(ox-2, oy-13, 3, 1);

    // Eyes (larger, more expressive)
    ctx.fillStyle = '#222';
    ctx.fillRect(ox-2, oy-11, 1, 1);
    ctx.fillRect(ox+1, oy-11, 1, 1);
    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.fillRect(ox-2, oy-11, 1, 1);
    ctx.fillRect(ox+1, oy-11, 1, 1);

    // Mouth (subtle smile)
    ctx.fillStyle = '#cc8888';
    ctx.fillRect(ox-1, oy-9, 1, 1);
    ctx.fillRect(ox, oy-9, 1, 1);

    // Ring glow (if equipped)
    if (G.eq.r) {
      var rd = ITEMS[G.eq.r];
      if (rd && rd.q === 'l') {
        ctx.fillStyle = 'rgba(255,200,50,'+(Math.sin(time*0.1)*0.2+0.4)+')';
        ctx.fillRect(ox+3, oy-2, 1, 1);
      } else if (rd && rd.q === 'e') {
        ctx.fillStyle = 'rgba(170,100,220,'+(Math.sin(time*0.1)*0.2+0.3)+')';
        ctx.fillRect(ox+3, oy-2, 1, 1);
      }
    }

    // Sword (based on equipped weapon)
    var eqW = G.eq.w;
    var swordColor = '#aaaacc'; // default steel
    var swordLen = 8;
    var swordGlow = null;
    if (eqW) {
      var wd = ITEMS[eqW];
      if (wd) {
        if (wd.q === 'l') { swordColor = '#ffaa44'; swordLen = 11; swordGlow = 'rgba(255,170,68,'; }
        else if (wd.q === 'e') { swordColor = '#aa66dd'; swordLen = 10; swordGlow = 'rgba(170,102,221,'; }
        else if (wd.q === 'u') { swordColor = '#66aaff'; swordLen = 9; }
      }
    }
    // Sword glow aura
    if (swordGlow) {
      ctx.fillStyle = swordGlow+(Math.sin(time*0.08)*0.1+0.15)+')';
      ctx.fillRect(ox+4*face-1, oy-7-swordLen+1, 3, swordLen+1);
    }
    // Sword blade
    ctx.fillStyle = swordColor;
    ctx.fillRect(ox+4*face, oy-7-swordLen+2, 1, swordLen);
    // Sword edge highlight
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ox+4*face, oy-7-swordLen+1, 1, 1);
    ctx.fillRect(ox+4*face, oy-7-swordLen+3, 1, swordLen-3);
    // Sword guard
    ctx.fillStyle = '#885533';
    ctx.fillRect(ox+2*face, oy-3, 4, 1);
    // Sword pommel
    ctx.fillStyle = '#ccaa44';
    ctx.fillRect(ox+4*face, oy-1, 1, 1);
    // Sword grip
    ctx.fillStyle = '#553311';
    ctx.fillRect(ox+4*face, oy-3, 1, 2);

    // Shield (if equipped)
    if (G.eq.s) {
      var sd = ITEMS[G.eq.s];
      var shieldColor = '#667788';
      var shieldHighlight = '#8899aa';
      if (sd) {
        if (sd.q === 'l') { shieldColor = '#aa8833'; shieldHighlight = '#ccaa44'; }
        else if (sd.q === 'e') { shieldColor = '#775588'; shieldHighlight = '#9977aa'; }
        else if (sd.q === 'u') { shieldColor = '#556677'; shieldHighlight = '#7788aa'; }
      }
      ctx.fillStyle = shieldColor;
      ctx.fillRect(ox-5*face, oy-7, 2, 5);
      ctx.fillStyle = shieldHighlight;
      ctx.fillRect(ox-4*face, oy-6, 1, 3);
      // Shield emblem
      ctx.fillStyle = '#ccaaff';
      ctx.fillRect(ox-4*face, oy-5, 1, 1);
    }

    // Helmet (if equipped - show crown/helm on top)
    if (G.eq.h) {
      var hd = ITEMS[G.eq.h];
      if (hd && hd.q === 'l') {
        ctx.fillStyle = '#ffcc44'; // golden crown
        ctx.fillRect(ox-3, oy-14, 6, 1);
        ctx.fillRect(ox-2, oy-15, 1, 1);
        ctx.fillRect(ox, oy-15, 1, 1);
        ctx.fillRect(ox+2, oy-15, 1, 1);
        // Crown jewels
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(ox, oy-15, 1, 1);
      } else if (hd && hd.q === 'e') {
        ctx.fillStyle = '#553366'; // purple hood
        ctx.fillRect(ox-4, oy-14, 8, 2);
        ctx.fillRect(ox-3, oy-15, 6, 1);
      } else {
        ctx.fillStyle = '#667788'; // iron helm
        ctx.fillRect(ox-3, oy-14, 6, 2);
        ctx.fillRect(ox-2, oy-15, 4, 1);
      }
    }

    // Necklace glow (if equipped)
    if (G.eq.n) {
      var nd = ITEMS[G.eq.n];
      if (nd) {
        var nColor = nd.q==='l' ? 'rgba(255,200,50,' : nd.q==='e' ? 'rgba(170,100,220,' : 'rgba(100,150,200,';
        ctx.fillStyle = nColor+(Math.sin(time*0.12)*0.15+0.35)+')';
        ctx.fillRect(ox-1, oy-8, 2, 1);
      }
    }

    // Pet rendering
    if (G.pet && G.pet.hp > 0) {
      var petBob = Math.sin(time * 0.15) * 2;
      var petX = psx + 14, petY = psy + petBob;
      // Pet shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(petX, psy+4, 4, 2, 0, 0, Math.PI*2); ctx.fill();
      // Pet body
      ctx.fillStyle = G.pet.color;
      if (G.pet.type === 'slime') {
        ctx.beginPath(); ctx.ellipse(petX, petY, 6, 5, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillRect(petX-2, petY-3, 1, 1); ctx.fillRect(petX+1, petY-3, 1, 1);
      } else if (G.pet.type === 'bat') {
        // Wings
        var wingFlap = Math.sin(time * 0.3) * 3;
        ctx.fillRect(petX-6, petY-2+wingFlap, 4, 3);
        ctx.fillRect(petX+2, petY-2-wingFlap, 4, 3);
        // Body
        ctx.fillStyle = '#553366';
        ctx.fillRect(petX-2, petY-2, 4, 3);
        // Eyes
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(petX-1, petY-2, 1, 1); ctx.fillRect(petX+1, petY-2, 1, 1);
      } else if (G.pet.type === 'skull') {
        // Floating skull
        ctx.fillStyle = '#dde';
        ctx.beginPath(); ctx.ellipse(petX, petY-1, 5, 5, 0, 0, Math.PI*2); ctx.fill();
        // Eyes
        ctx.fillStyle = '#44ff44';
        ctx.fillRect(petX-2, petY-2, 2, 2); ctx.fillRect(petX+1, petY-2, 2, 2);
        // Jaw
        ctx.fillStyle = '#bbc';
        ctx.fillRect(petX-2, petY+2, 4, 2);
      }
      // HP indicator
      var petPct = G.pet.hp / G.pet.mhp;
      ctx.fillStyle = '#333';
      ctx.fillRect(petX-6, petY-9, 12, 2);
      ctx.fillStyle = petPct > 0.5 ? '#44cc44' : petPct > 0.25 ? '#cccc22' : '#cc2222';
      ctx.fillRect(petX-6, petY-9, Math.floor(12*petPct), 2);
    }

    // Player hit reaction - red flash overlay
    if (playerHitTimer > 0) {
      var hitAlpha = (playerHitTimer / 15) * 0.5;
      ctx.fillStyle = 'rgba(255,0,0,' + hitAlpha + ')';
      ctx.beginPath(); ctx.ellipse(psx, psy, 12, 16, 0, 0, Math.PI*2); ctx.fill();
    }

    // Draw particles
    drawParticles();
    drawFloats();

    // Radial vignette
    var vr2 = totalVis() * TW * 0.6;
    var fog = ctx.createRadialGradient(psx, psy, vr2*0.25, psx, psy, vr2);
    fog.addColorStop(0, 'rgba(0,0,0,0)');
    fog.addColorStop(0.5, 'rgba(0,0,0,0)');
    fog.addColorStop(0.75, 'rgba(0,0,0,0.3)');
    fog.addColorStop(0.9, 'rgba(0,0,0,0.7)');
    fog.addColorStop(1, 'rgba(0,0,0,0.95)');
    ctx.fillStyle = fog;
    ctx.fillRect(0, 0, cw, ch);

    // Outer vignette (screen-edge darkening)
    var vig = ctx.createRadialGradient(cw/2, ch/2, cw*0.2, cw/2, ch/2, cw*0.55);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, cw, ch);

    // Theme-tinted atmosphere overlay
    if (G.floor > 6) {
      var tintAlpha = Math.min(0.05, (G.floor - 6) * 0.005);
      var tintColor = theme.accent || '#220000';
      var tr = parseInt(tintColor.slice(1,3),16);
      var tg = parseInt(tintColor.slice(3,5),16);
      var tb = parseInt(tintColor.slice(5,7),16);
      ctx.fillStyle = 'rgba('+tr+','+tg+','+tb+','+tintAlpha+')';
      ctx.fillRect(0, 0, cw, ch);
    }

    // Day/night cycle visual tint
    if (G.stepCount) {
      var cp = G.stepCount % 120;
      if (cp >= 40 && cp < 80) {
        // Dusk - warm orange/red tint
        var duskA = Math.sin((cp - 40) / 40 * Math.PI) * 0.08;
        ctx.fillStyle = 'rgba(180,80,20,' + duskA + ')';
        ctx.fillRect(0, 0, cw, ch);
      } else if (cp >= 80) {
        // Night - blue/dark tint
        var nightA = Math.sin((cp - 80) / 40 * Math.PI) * 0.1;
        ctx.fillStyle = 'rgba(10,10,60,' + nightA + ')';
        ctx.fillRect(0, 0, cw, ch);
      }
    }

    // Poison visual - pulsing green tint
    if (G.poison > 0) {
      var poisonAlpha = 0.06 + Math.sin(time * 0.1) * 0.03;
      ctx.fillStyle = 'rgba(40,180,40,' + poisonAlpha + ')';
      ctx.fillRect(0, 0, cw, ch);
    }

    // Day/night cycle - vision shrinks every 60 steps (night phase)
    if (G.stepCount) {
      var cyclePos = G.stepCount % 120; // 120-step cycle
      if (cyclePos >= 80) {
        // Night phase: darken vision
        var nightAlpha = Math.min(0.15, (cyclePos - 80) * 0.004);
        ctx.fillStyle = 'rgba(0,0,20,' + nightAlpha + ')';
        ctx.fillRect(0, 0, cw, ch);
      }
    }
  };

  // ── Minimap ────────────────────────────────────────────────
  DS.renderMinimap = function renderMinimap() {
    if (!G || !G.maze) return;
    if (!DS.mmCv) { DS.mmCv = document.getElementById('mm'); if (!DS.mmCv) return; DS.mmCtx = DS.mmCv.getContext('2d'); }
    var mmCtx = DS.mmCtx;
    var m = G.maze, f = G.fog;
    DS.mmCv.width = 80; DS.mmCv.height = 80;
    var scale = Math.min(80/m.w, 80/m.h);
    var mmOX = (80 - m.w*scale)/2;
    var mmOY = (80 - m.h*scale)/2;
    // Circular clip
    mmCtx.save();
    mmCtx.beginPath();
    mmCtx.arc(40, 40, 39, 0, Math.PI*2);
    mmCtx.clip();
    mmCtx.fillStyle = '#000';
    mmCtx.fillRect(0, 0, 80, 80);

    for (var y = 0; y < m.h; y++) {
      for (var x = 0; x < m.w; x++) {
        var rev = f[y] ? f[y][x] : 0;
        if (rev === 0) continue;
        var t = m.grid[y][x];
        if (t === TILE.WALL) {
          mmCtx.fillStyle = rev===2 ? '#444' : '#222';
        } else if (t === TILE.STAIRS) {
          mmCtx.fillStyle = '#44cc44';
        } else if (t === TILE.SHOP) {
          mmCtx.fillStyle = '#ccaaff';
        } else if (t === TILE.RESOURCE) {
          mmCtx.fillStyle = rev===2 ? '#aa8844' : '#553311';
        } else if (t === TILE.CHEST) {
          mmCtx.fillStyle = rev===2 ? '#ffcc44' : '#886622';
        } else if (t === TILE.TRAP) {
          mmCtx.fillStyle = rev===2 ? '#663333' : '#331818';
        } else {
          mmCtx.fillStyle = rev===2 ? '#665544' : '#332211';
        }
        mmCtx.fillRect(mmOX+x*scale, mmOY+y*scale, Math.ceil(scale), Math.ceil(scale));
      }
    }

    // Monsters on minimap
    G.mons.forEach(function(mon) {
      if (!mon.alive) return;
      if (f[mon.y] && f[mon.y][mon.x] === 2) {
        mmCtx.fillStyle = mon.tp==='b' ? '#ff3333' : mon.tp==='e' ? '#ffaa33' : '#cc4444';
        mmCtx.fillRect(mmOX+mon.x*scale-0.5, mmOY+mon.y*scale-0.5, Math.ceil(scale)+1, Math.ceil(scale)+1);
      }
    });

    // Ground items on minimap
    G.items.forEach(function(item) {
      if (f[item.y] && f[item.y][item.x] === 2) {
        mmCtx.fillStyle = '#cccc44';
        mmCtx.fillRect(mmOX+item.x*scale, mmOY+item.y*scale, Math.ceil(scale), Math.ceil(scale));
      }
    });

    // Player
    mmCtx.fillStyle = '#44ff44';
    mmCtx.fillRect(mmOX+G.px*scale-1, mmOY+G.py*scale-1, Math.ceil(scale)+2, Math.ceil(scale)+2);

    mmCtx.restore();
  };

})();
