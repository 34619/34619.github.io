/* ============================================================
   Darkness Survival — Audio Module
   Extracted from game.js
   ============================================================ */
window.DS = window.DS || {};

// ═══════════════════════════════════════════════════════════════
//  SOUND ENGINE (Web Audio API procedural SFX)
// ═══════════════════════════════════════════════════════════════
DS.audioCtx = null;
DS.bgmGain = null; DS.bgmOsc1 = null; DS.bgmOsc2 = null; DS.bgmPlaying = false;

DS.initAudio = function() {
  if (DS.audioCtx) return;
  try { DS.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
};

DS.bgmOsc3 = null; DS.bgmInterval = null;

DS.startBGM = function() {
  if (!DS.audioCtx || DS.bgmPlaying) return;
  try {
    DS.bgmGain = DS.audioCtx.createGain();
    DS.bgmGain.gain.value = 0.03;
    DS.bgmGain.connect(DS.audioCtx.destination);
    // Low drone
    DS.bgmOsc1 = DS.audioCtx.createOscillator();
    DS.bgmOsc1.type = 'sine';
    DS.bgmOsc1.frequency.value = 55;
    var g1 = DS.audioCtx.createGain(); g1.gain.value = 0.4;
    DS.bgmOsc1.connect(g1); g1.connect(DS.bgmGain);
    DS.bgmOsc1.start();
    // Higher pad
    DS.bgmOsc2 = DS.audioCtx.createOscillator();
    DS.bgmOsc2.type = 'triangle';
    DS.bgmOsc2.frequency.value = 82.5;
    var g2 = DS.audioCtx.createGain(); g2.gain.value = 0.2;
    DS.bgmOsc2.connect(g2); g2.connect(DS.bgmGain);
    DS.bgmOsc2.start();
    // Third harmonic — eerie high tone
    DS.bgmOsc3 = DS.audioCtx.createOscillator();
    DS.bgmOsc3.type = 'sine';
    DS.bgmOsc3.frequency.value = 110;
    var g3 = DS.audioCtx.createGain(); g3.gain.value = 0.08;
    DS.bgmOsc3.connect(g3); g3.connect(DS.bgmGain);
    DS.bgmOsc3.start();
    DS.bgmPlaying = true;
    // Ambient drip/wind interval
    DS.bgmInterval = setInterval(function() {
      if (!DS.audioCtx || !G || !G.settings.sound) return;
      try {
        var ti = G.floor ? Math.min(Math.floor((G.floor-1)/3), 4) : 0;
        if (ti === 0 || ti === 1) {
          // Catacombs/Cavern: water drips + low rumble
          if (Math.random() < 0.3) {
            var o = DS.audioCtx.createOscillator(), ga = DS.audioCtx.createGain();
            o.connect(ga); ga.connect(DS.audioCtx.destination);
            o.frequency.value = 800 + Math.random() * 400; o.type = 'sine';
            ga.gain.setValueAtTime(0.02, DS.audioCtx.currentTime);
            ga.gain.exponentialRampToValueAtTime(0.001, DS.audioCtx.currentTime + 0.1);
            o.start(DS.audioCtx.currentTime); o.stop(DS.audioCtx.currentTime + 0.1);
          }
          if (Math.random() < 0.15) {
            var o2 = DS.audioCtx.createOscillator(), ga2 = DS.audioCtx.createGain();
            o2.connect(ga2); ga2.connect(DS.audioCtx.destination);
            o2.frequency.value = 30 + Math.random() * 20; o2.type = 'sine';
            ga2.gain.setValueAtTime(0.015, DS.audioCtx.currentTime);
            ga2.gain.exponentialRampToValueAtTime(0.001, DS.audioCtx.currentTime + 1.5);
            o2.start(DS.audioCtx.currentTime); o2.stop(DS.audioCtx.currentTime + 1.5);
          }
        } else if (ti === 2) {
          // Ruins: stone grinding + wind
          if (Math.random() < 0.25) {
            var b = DS.audioCtx.createBufferSource(), buf = DS.audioCtx.createBuffer(1, DS.audioCtx.sampleRate*0.3, DS.audioCtx.sampleRate);
            var d = buf.getChannelData(0); for(var i=0;i<d.length;i++) d[i] = (Math.random()*2-1)*0.1*Math.exp(-i/(d.length*0.5));
            b.buffer = buf; var bg = DS.audioCtx.createGain(); b.connect(bg); bg.connect(DS.audioCtx.destination);
            bg.gain.setValueAtTime(0.02, DS.audioCtx.currentTime);
            bg.gain.exponentialRampToValueAtTime(0.001, DS.audioCtx.currentTime + 0.3);
            b.start(DS.audioCtx.currentTime); b.stop(DS.audioCtx.currentTime + 0.3);
          }
          if (Math.random() < 0.15) {
            var o3 = DS.audioCtx.createOscillator(), ga3 = DS.audioCtx.createGain();
            o3.connect(ga3); ga3.connect(DS.audioCtx.destination);
            o3.frequency.setValueAtTime(200, DS.audioCtx.currentTime);
            o3.frequency.linearRampToValueAtTime(120, DS.audioCtx.currentTime + 2);
            o3.type = 'sawtooth';
            ga3.gain.setValueAtTime(0.008, DS.audioCtx.currentTime);
            ga3.gain.exponentialRampToValueAtTime(0.001, DS.audioCtx.currentTime + 2);
            o3.start(DS.audioCtx.currentTime); o3.stop(DS.audioCtx.currentTime + 2);
          }
        } else if (ti === 3) {
          // Abyss: eerie high tones + whispers
          if (Math.random() < 0.2) {
            var o4 = DS.audioCtx.createOscillator(), ga4 = DS.audioCtx.createGain();
            o4.connect(ga4); ga4.connect(DS.audioCtx.destination);
            o4.frequency.value = 600 + Math.random() * 800; o4.type = 'sine';
            ga4.gain.setValueAtTime(0.01, DS.audioCtx.currentTime);
            ga4.gain.exponentialRampToValueAtTime(0.001, DS.audioCtx.currentTime + 0.8);
            o4.start(DS.audioCtx.currentTime); o4.stop(DS.audioCtx.currentTime + 0.8);
          }
          if (Math.random() < 0.12) {
            var o5 = DS.audioCtx.createOscillator(), ga5 = DS.audioCtx.createGain();
            o5.connect(ga5); ga5.connect(DS.audioCtx.destination);
            o5.frequency.setValueAtTime(150 + Math.random()*100, DS.audioCtx.currentTime);
            o5.frequency.linearRampToValueAtTime(80, DS.audioCtx.currentTime + 1.2);
            o5.type = 'triangle';
            ga5.gain.setValueAtTime(0.012, DS.audioCtx.currentTime);
            ga5.gain.exponentialRampToValueAtTime(0.001, DS.audioCtx.currentTime + 1.2);
            o5.start(DS.audioCtx.currentTime); o5.stop(DS.audioCtx.currentTime + 1.2);
          }
        } else {
          // Inferno: crackling + deep rumbles
          if (Math.random() < 0.35) {
            var b2 = DS.audioCtx.createBufferSource(), buf2 = DS.audioCtx.createBuffer(1, DS.audioCtx.sampleRate*0.08, DS.audioCtx.sampleRate);
            var d2 = buf2.getChannelData(0); for(var j=0;j<d2.length;j++) d2[j] = (Math.random()*2-1)*Math.exp(-j/(d2.length*0.2));
            b2.buffer = buf2; var bg2 = DS.audioCtx.createGain(); b2.connect(bg2); bg2.connect(DS.audioCtx.destination);
            bg2.gain.setValueAtTime(0.025, DS.audioCtx.currentTime);
            bg2.gain.exponentialRampToValueAtTime(0.001, DS.audioCtx.currentTime + 0.08);
            b2.start(DS.audioCtx.currentTime); b2.stop(DS.audioCtx.currentTime + 0.08);
          }
          if (Math.random() < 0.2) {
            var o6 = DS.audioCtx.createOscillator(), ga6 = DS.audioCtx.createGain();
            o6.connect(ga6); ga6.connect(DS.audioCtx.destination);
            o6.frequency.value = 25 + Math.random() * 15; o6.type = 'sine';
            ga6.gain.setValueAtTime(0.02, DS.audioCtx.currentTime);
            ga6.gain.exponentialRampToValueAtTime(0.001, DS.audioCtx.currentTime + 2);
            o6.start(DS.audioCtx.currentTime); o6.stop(DS.audioCtx.currentTime + 2);
          }
        }
      } catch(e) {}
    }, 3000);
  } catch(e) {}
};

DS.updateBGM = function() {
  if (!DS.bgmPlaying || !DS.bgmOsc1 || !G) return;
  try {
    // Floor themes have different chord intervals
    var themeIdx = Math.min(Math.floor((G.floor-1)/3), 4);
    var chords = [
      [1, 1.5, 2],      // Catacombs — minor
      [1, 1.25, 1.5],   // Cavern — suspended
      [1, 1.335, 2],    // Ruins — medieval
      [1, 1.189, 1.5],  // Abyss — diminished
      [1, 1.5, 1.8]     // Inferno — power
    ];
    var ch = chords[themeIdx];
    var baseFreq = 45 - Math.min(G.floor * 1.2, 12);
    DS.bgmOsc1.frequency.setTargetAtTime(baseFreq * ch[0], DS.audioCtx.currentTime, 0.8);
    DS.bgmOsc2.frequency.setTargetAtTime(baseFreq * ch[1], DS.audioCtx.currentTime, 0.8);
    if (DS.bgmOsc3) DS.bgmOsc3.frequency.setTargetAtTime(baseFreq * ch[2], DS.audioCtx.currentTime, 0.8);
    // Volume based on settings
    var vol = G.settings.music ? 0.03 : 0;
    DS.bgmGain.gain.setTargetAtTime(vol, DS.audioCtx.currentTime, 0.3);
  } catch(e) {}
};

DS.stopBGM = function() {
  try {
    if (DS.bgmOsc1) { DS.bgmOsc1.stop(); DS.bgmOsc1 = null; }
    if (DS.bgmOsc2) { DS.bgmOsc2.stop(); DS.bgmOsc2 = null; }
    if (DS.bgmOsc3) { DS.bgmOsc3.stop(); DS.bgmOsc3 = null; }
    if (DS.bgmInterval) { clearInterval(DS.bgmInterval); DS.bgmInterval = null; }
    DS.bgmPlaying = false;
  } catch(e) {}
};

DS.sfx = function(type) {
  if (!DS.audioCtx || !G || !G.settings.sound) return;
  try {
    var t = DS.audioCtx.currentTime;
    if (type === 'step') {
      var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
      o.connect(g);g.connect(DS.audioCtx.destination);
      o.frequency.value=60+Math.random()*30;o.type='triangle';
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.04);
      o.start(t);o.stop(t+0.04);
    } else if (type === 'hit') {
      var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
      o.connect(g);g.connect(DS.audioCtx.destination);
      o.frequency.setValueAtTime(250,t);o.frequency.exponentialRampToValueAtTime(60,t+0.15);
      o.type='sawtooth';
      g.gain.setValueAtTime(0.18,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);
      var b=DS.audioCtx.createBufferSource(),buf=DS.audioCtx.createBuffer(1,DS.audioCtx.sampleRate*0.06,DS.audioCtx.sampleRate),
        d=buf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*0.4;
      b.buffer=buf;var bg=DS.audioCtx.createGain();b.connect(bg);bg.connect(DS.audioCtx.destination);
      bg.gain.setValueAtTime(0.12,t);bg.gain.exponentialRampToValueAtTime(0.001,t+0.06);
      b.start(t);b.stop(t+0.06);
    } else if (type === 'hurt') {
      var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
      o.connect(g);g.connect(DS.audioCtx.destination);
      o.frequency.setValueAtTime(180,t);o.frequency.linearRampToValueAtTime(80,t+0.2);
      o.type='square';
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);
    } else if (type === 'pickup') {
      [523,659,784].forEach(function(f,i){
        var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
        o.connect(g);g.connect(DS.audioCtx.destination);
        o.frequency.value=f;o.type='sine';
        var s=t+i*0.06;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.1,s+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.1);
        o.start(s);o.stop(s+0.1);
      });
    } else if (type === 'equip') {
      [440,554,659].forEach(function(f,i){
        var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
        o.connect(g);g.connect(DS.audioCtx.destination);
        o.frequency.value=f;o.type='triangle';
        var s=t+i*0.08;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.12,s+0.03);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.15);
        o.start(s);o.stop(s+0.15);
      });
    } else if (type === 'levelup') {
      [523,659,784,1047].forEach(function(f,i){
        var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
        o.connect(g);g.connect(DS.audioCtx.destination);
        o.frequency.value=f;o.type='sine';
        var s=t+i*0.1;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.15,s+0.03);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.25);
        o.start(s);o.stop(s+0.25);
      });
    } else if (type === 'stairs') {
      var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
      o.connect(g);g.connect(DS.audioCtx.destination);
      o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(120,t+0.4);
      o.type='sine';
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
      o.start(t);o.stop(t+0.4);
    } else if (type === 'craft') {
      [392,523,659,784].forEach(function(f,i){
        var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
        o.connect(g);g.connect(DS.audioCtx.destination);
        o.frequency.value=f;o.type='triangle';
        var s=t+i*0.07;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.1,s+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.18);
        o.start(s);o.stop(s+0.18);
      });
    } else if (type === 'death') {
      var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
      o.connect(g);g.connect(DS.audioCtx.destination);
      o.frequency.setValueAtTime(400,t);o.frequency.exponentialRampToValueAtTime(50,t+1.5);
      o.type='sawtooth';
      g.gain.setValueAtTime(0.2,t);g.gain.exponentialRampToValueAtTime(0.001,t+1.5);
      o.start(t);o.stop(t+1.5);
    } else if (type === 'boss') {
      [100,130,100,160,200].forEach(function(f,i){
        var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
        o.connect(g);g.connect(DS.audioCtx.destination);
        o.frequency.value=f;o.type='square';
        var s=t+i*0.15;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.15,s+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.15);
        o.start(s);o.stop(s+0.15);
      });
    } else if (type === 'heal') {
      [440,554,659,880].forEach(function(f,i){
        var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
        o.connect(g);g.connect(DS.audioCtx.destination);
        o.frequency.value=f;o.type='sine';
        var s=t+i*0.08;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.08,s+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.2);
        o.start(s);o.stop(s+0.2);
      });
    } else if (type === 'btn') {
      var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
      o.connect(g);g.connect(DS.audioCtx.destination);
      o.frequency.value=600;o.type='sine';
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.05);
      o.start(t);o.stop(t+0.05);
    } else if (type === 'bomb') {
      var b=DS.audioCtx.createBufferSource(),buf=DS.audioCtx.createBuffer(1,DS.audioCtx.sampleRate*0.3,DS.audioCtx.sampleRate),
        d=buf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(d.length*0.15));
      b.buffer=buf;var bg=DS.audioCtx.createGain();b.connect(bg);bg.connect(DS.audioCtx.destination);
      bg.gain.setValueAtTime(0.25,t);bg.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      b.start(t);b.stop(t+0.3);
    } else if (type === 'flee') {
      var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
      o.connect(g);g.connect(DS.audioCtx.destination);
      o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(800,t+0.15);
      o.type='sine';
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);
    } else if (type === 'shop') {
      [440,554,659].forEach(function(f,i){
        var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
        o.connect(g);g.connect(DS.audioCtx.destination);
        o.frequency.value=f;o.type='sine';
        g.gain.setValueAtTime(0.05,t+i*0.06);g.gain.exponentialRampToValueAtTime(0.001,t+i*0.06+0.1);
        o.start(t+i*0.06);o.stop(t+i*0.06+0.1);
      });
    } else if (type === 'dodge') {
      var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
      o.connect(g);g.connect(DS.audioCtx.destination);
      o.frequency.setValueAtTime(600,t);o.frequency.exponentialRampToValueAtTime(400,t+0.08);
      o.type='sine';
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
      o.start(t);o.stop(t+0.08);
    } else if (type === 'crit') {
      var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
      o.connect(g);g.connect(DS.audioCtx.destination);
      o.frequency.setValueAtTime(400,t);o.frequency.exponentialRampToValueAtTime(800,t+0.1);
      o.type='square';
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
      o.start(t);o.stop(t+0.12);
      // Extra impact
      var b=DS.audioCtx.createBufferSource(),buf=DS.audioCtx.createBuffer(1,DS.audioCtx.sampleRate*0.04,DS.audioCtx.sampleRate),
        d=buf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*0.3;
      b.buffer=buf;var bg=DS.audioCtx.createGain();b.connect(bg);bg.connect(DS.audioCtx.destination);
      bg.gain.setValueAtTime(0.08,t+0.05);bg.gain.exponentialRampToValueAtTime(0.001,t+0.09);
      b.start(t+0.05);b.stop(t+0.09);
    } else if (type === 'teleport') {
      [440,660,880,1320].forEach(function(f,i){
        var o=DS.audioCtx.createOscillator(),g=DS.audioCtx.createGain();
        o.connect(g);g.connect(DS.audioCtx.destination);
        o.frequency.value=f;o.type='sine';
        var s=t+i*0.05;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.1,s+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.15);
        o.start(s);o.stop(s+0.15);
      });
    }
  } catch(e) {}
};
