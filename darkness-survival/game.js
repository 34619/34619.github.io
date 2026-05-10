/* ============================================================
   Darkness Survival — Complete Isometric 3D Engine
   Faithful recreation of the original mobile game
   ============================================================ */

// ═══════════════════════════════════════════════════════════════
//  CONSTANTS & CONFIG
// ═══════════════════════════════════════════════════════════════
const TW = 40, TH = 20, CH = 12; // tile width, height, cube height
const HW = TW/2, HH = TH/2;     // half width, half height
const VISION_BASE = 3.5;
const TICK_MS = 120;

// ═══════════════════════════════════════════════════════════════
//  SOUND ENGINE (Web Audio API procedural SFX)
// ═══════════════════════════════════════════════════════════════
let audioCtx = null;
function initAudio() {
  if (audioCtx) return;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
}

function sfx(type) {
  if (!audioCtx || !G || !G.settings.sound) return;
  try {
    var t = audioCtx.currentTime;
    if (type === 'step') {
      var o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.connect(g);g.connect(audioCtx.destination);
      o.frequency.value=60+Math.random()*30;o.type='triangle';
      g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.04);
      o.start(t);o.stop(t+0.04);
    } else if (type === 'hit') {
      var o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.connect(g);g.connect(audioCtx.destination);
      o.frequency.setValueAtTime(250,t);o.frequency.exponentialRampToValueAtTime(60,t+0.15);
      o.type='sawtooth';
      g.gain.setValueAtTime(0.18,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);
      var b=audioCtx.createBufferSource(),buf=audioCtx.createBuffer(1,audioCtx.sampleRate*0.06,audioCtx.sampleRate),
        d=buf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*0.4;
      b.buffer=buf;var bg=audioCtx.createGain();b.connect(bg);bg.connect(audioCtx.destination);
      bg.gain.setValueAtTime(0.12,t);bg.gain.exponentialRampToValueAtTime(0.001,t+0.06);
      b.start(t);b.stop(t+0.06);
    } else if (type === 'hurt') {
      var o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.connect(g);g.connect(audioCtx.destination);
      o.frequency.setValueAtTime(180,t);o.frequency.linearRampToValueAtTime(80,t+0.2);
      o.type='square';
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      o.start(t);o.stop(t+0.2);
    } else if (type === 'pickup') {
      [523,659,784].forEach(function(f,i){
        var o=audioCtx.createOscillator(),g=audioCtx.createGain();
        o.connect(g);g.connect(audioCtx.destination);
        o.frequency.value=f;o.type='sine';
        var s=t+i*0.06;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.1,s+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.1);
        o.start(s);o.stop(s+0.1);
      });
    } else if (type === 'equip') {
      [440,554,659].forEach(function(f,i){
        var o=audioCtx.createOscillator(),g=audioCtx.createGain();
        o.connect(g);g.connect(audioCtx.destination);
        o.frequency.value=f;o.type='triangle';
        var s=t+i*0.08;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.12,s+0.03);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.15);
        o.start(s);o.stop(s+0.15);
      });
    } else if (type === 'levelup') {
      [523,659,784,1047].forEach(function(f,i){
        var o=audioCtx.createOscillator(),g=audioCtx.createGain();
        o.connect(g);g.connect(audioCtx.destination);
        o.frequency.value=f;o.type='sine';
        var s=t+i*0.1;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.15,s+0.03);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.25);
        o.start(s);o.stop(s+0.25);
      });
    } else if (type === 'stairs') {
      var o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.connect(g);g.connect(audioCtx.destination);
      o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(120,t+0.4);
      o.type='sine';
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
      o.start(t);o.stop(t+0.4);
    } else if (type === 'craft') {
      [392,523,659,784].forEach(function(f,i){
        var o=audioCtx.createOscillator(),g=audioCtx.createGain();
        o.connect(g);g.connect(audioCtx.destination);
        o.frequency.value=f;o.type='triangle';
        var s=t+i*0.07;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.1,s+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.18);
        o.start(s);o.stop(s+0.18);
      });
    } else if (type === 'death') {
      var o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.connect(g);g.connect(audioCtx.destination);
      o.frequency.setValueAtTime(400,t);o.frequency.exponentialRampToValueAtTime(50,t+1.5);
      o.type='sawtooth';
      g.gain.setValueAtTime(0.2,t);g.gain.exponentialRampToValueAtTime(0.001,t+1.5);
      o.start(t);o.stop(t+1.5);
    } else if (type === 'boss') {
      [100,130,100,160,200].forEach(function(f,i){
        var o=audioCtx.createOscillator(),g=audioCtx.createGain();
        o.connect(g);g.connect(audioCtx.destination);
        o.frequency.value=f;o.type='square';
        var s=t+i*0.15;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.15,s+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.15);
        o.start(s);o.stop(s+0.15);
      });
    } else if (type === 'heal') {
      [440,554,659,880].forEach(function(f,i){
        var o=audioCtx.createOscillator(),g=audioCtx.createGain();
        o.connect(g);g.connect(audioCtx.destination);
        o.frequency.value=f;o.type='sine';
        var s=t+i*0.08;
        g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.08,s+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,s+0.2);
        o.start(s);o.stop(s+0.2);
      });
    } else if (type === 'btn') {
      var o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.connect(g);g.connect(audioCtx.destination);
      o.frequency.value=600;o.type='sine';
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.05);
      o.start(t);o.stop(t+0.05);
    } else if (type === 'bomb') {
      var b=audioCtx.createBufferSource(),buf=audioCtx.createBuffer(1,audioCtx.sampleRate*0.3,audioCtx.sampleRate),
        d=buf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(d.length*0.15));
      b.buffer=buf;var bg=audioCtx.createGain();b.connect(bg);bg.connect(audioCtx.destination);
      bg.gain.setValueAtTime(0.25,t);bg.gain.exponentialRampToValueAtTime(0.001,t+0.3);
      b.start(t);b.stop(t+0.3);
    } else if (type === 'flee') {
      var o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.connect(g);g.connect(audioCtx.destination);
      o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(800,t+0.15);
      o.type='sine';
      g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      o.start(t);o.stop(t+0.15);
    }
  } catch(e) {}
}

// ═══════════════════════════════════════════════════════════════
//  PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════
let particles = [];
let screenShake = 0;

function spawnParticles(sx, sy, color, count, opts) {
  opts = opts || {};
  for (var i = 0; i < count; i++) {
    particles.push({
      x: sx, y: sy,
      vx: (Math.random()-0.5) * (opts.spread || 3),
      vy: (Math.random()-0.5) * (opts.spread || 3) - (opts.rise || 0),
      color: color,
      life: opts.life || (20 + Math.random()*20),
      maxLife: opts.life || (20 + Math.random()*20),
      size: opts.size || (1 + Math.random()*2)
    });
  }
}

function updateParticles() {
  for (var i = particles.length-1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.05; // gravity
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
  if (screenShake > 0) screenShake *= 0.85;
  if (screenShake < 0.5) screenShake = 0;
}

function drawParticles() {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    var alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

// ═══════════════════════════════════════════════════════════════
//  ANIMATION STATE
// ═══════════════════════════════════════════════════════════════
let playerAnim = { frame: 0, walkCycle: 0, facing: 1 }; // facing: 1=right, -1=left

// Tile types
const TILE = { VOID:0, FLOOR:1, WALL:2, STAIRS:3, RESOURCE:4, SHOP:5, BOSS_TILE:6 };

// Quality colors
const QC = ['#999999','#44cc44','#4488dd','#aa44dd','#ffaa22'];
const QN = ['Common','Uncommon','Rare','Epic','Legendary'];

// ═══════════════════════════════════════════════════════════════
//  ITEM DATABASE
// ═══════════════════════════════════════════════════════════════
const ITEMS = {
  // Weapons
  old_dagger:{id:'old_dagger',name:'Old Dagger',name_ko:'旧匕首',type:'w',q:'c',icon:'🗡️',stk:false,st:{atk:1}},
  rusty_sword:{id:'rusty_sword',name:'Iron Sword',name_ko:'铁剑',type:'w',q:'c',icon:'⚔️',stk:false,st:{atk:3}},
  crimson_blade:{id:'crimson_blade',name:'Crimson Blade',name_ko:'猩红之刃',type:'w',q:'e',icon:'🗡️',stk:false,st:{atk:8}},
  void_scythe:{id:'void_scythe',name:'Void Scythe',name_ko:'虚空镰刀',type:'w',q:'l',icon:'⚔️',stk:false,st:{atk:15}},
  shadow_dagger:{id:'shadow_dagger',name:'Shadow Dagger',name_ko:'暗影匕首',type:'w',q:'u',icon:'🗡️',stk:false,st:{atk:5}},
  demon_slayer:{id:'demon_slayer',name:'Demon Slayer',name_ko:'灭魔剑',type:'w',q:'l',icon:'⚔️',stk:false,st:{atk:12,hp:15}},
  // Armor
  old_clothes:{id:'old_clothes',name:'Old Clothes',name_ko:'旧衣服',type:'a',q:'c',icon:'👕',stk:false,st:{def:1}},
  leather_vest:{id:'leather_vest',name:'Leather Vest',name_ko:'皮革背心',type:'a',q:'c',icon:'🧥',stk:false,st:{def:3}},
  chain_mail:{id:'chain_mail',name:'Chain Mail',name_ko:'链甲',type:'a',q:'u',icon:'🧥',stk:false,st:{def:5,hp:5}},
  bone_armor:{id:'bone_armor',name:'Bone Armor',name_ko:'骨甲',type:'a',q:'e',icon:'🛡️',stk:false,st:{def:6,hp:10}},
  dragon_scale:{id:'dragon_scale',name:'Dragon Scale',name_ko:'龙鳞甲',type:'a',q:'l',icon:'🛡️',stk:false,st:{def:15,hp:50}},
  // Helmets
  leather_cap:{id:'leather_cap',name:'Leather Cap',name_ko:'皮帽',type:'h',q:'c',icon:'🎩',stk:false,st:{def:1,hp:5}},
  iron_helm:{id:'iron_helm',name:'Iron Helm',name_ko:'铁盔',type:'h',q:'u',icon:'⛑️',stk:false,st:{def:3,hp:10}},
  dark_hood:{id:'dark_hood',name:'Dark Hood',name_ko:'暗影兜帽',type:'h',q:'e',icon:'🎩',stk:false,st:{def:4,hp:15,atk:2}},
  shadow_crown:{id:'shadow_crown',name:'Shadow Crown',name_ko:'暗影王冠',type:'h',q:'l',icon:'👑',stk:false,st:{def:5,hp:25,atk:3}},
  // Shields
  wooden_shield:{id:'wooden_shield',name:'Wood Shield',name_ko:'木盾',type:'s',q:'c',icon:'🪵',stk:false,st:{def:2}},
  iron_shield:{id:'iron_shield',name:'Iron Shield',name_ko:'铁盾',type:'s',q:'u',icon:'🛡️',stk:false,st:{def:4,hp:5}},
  tower_shield:{id:'tower_shield',name:'Tower Shield',name_ko:'塔盾',type:'s',q:'e',icon:'🛡️',stk:false,st:{def:7,hp:15}},
  // Boots
  straw_sandals:{id:'straw_sandals',name:'Sandals',name_ko:'草鞋',type:'b',q:'c',icon:'👡',stk:false,st:{def:1}},
  leather_boots:{id:'leather_boots',name:'Leather Boots',name_ko:'皮靴',type:'b',q:'u',icon:'👢',stk:false,st:{def:2,hp:5}},
  shadow_boots:{id:'shadow_boots',name:'Shadow Boots',name_ko:'暗影靴',type:'b',q:'e',icon:'👢',stk:false,st:{def:4,hp:10}},
  void_walkers:{id:'void_walkers',name:'Void Walkers',name_ko:'虚空行者',type:'b',q:'l',icon:'👢',stk:false,st:{def:8,hp:15}},
  // Rings
  copper_ring:{id:'copper_ring',name:'Copper Ring',name_ko:'铜戒',type:'r',q:'c',icon:'💍',stk:false,st:{atk:1}},
  silver_ring:{id:'silver_ring',name:'Silver Ring',name_ko:'银戒',type:'r',q:'u',icon:'💍',stk:false,st:{atk:2,def:1}},
  life_ring:{id:'life_ring',name:'Life Ring',name_ko:'生命之戒',type:'r',q:'e',icon:'💍',stk:false,st:{hp:20}},
  power_ring:{id:'power_ring',name:'Power Ring',name_ko:'力量之戒',type:'r',q:'e',icon:'💍',stk:false,st:{atk:5}},
  // Necklaces
  bone_necklace:{id:'bone_necklace',name:'Bone Necklace',name_ko:'骨链',type:'n',q:'c',icon:'📿',stk:false,st:{def:1,atk:1}},
  silver_pendant:{id:'silver_pendant',name:'Silver Pendant',name_ko:'银坠',type:'n',q:'u',icon:'📿',stk:false,st:{atk:2,def:1,hp:5}},
  crystal_pendant:{id:'crystal_pendant',name:'Crystal Pendant',name_ko:'水晶坠',type:'n',q:'e',icon:'📿',stk:false,st:{atk:3,def:2,hp:10}},
  // Belts
  rope_belt:{id:'rope_belt',name:'Rope Belt',name_ko:'绳腰带',type:'l',q:'c',icon:'🪢',stk:false,st:{def:1}},
  leather_belt:{id:'leather_belt',name:'Leather Belt',name_ko:'皮带',type:'l',q:'u',icon:'🪢',stk:false,st:{def:2,hp:5}},
  shadow_sash:{id:'shadow_sash',name:'Shadow Sash',name_ko:'暗影腰带',type:'l',q:'e',icon:'🪢',stk:false,st:{def:3,hp:10,atk:2}},
  // Consumables
  health_potion:{id:'health_potion',name:'Health Potion',name_ko:'治疗药水',type:'c',q:'c',icon:'🧪',stk:true,mx:5,ef:{heal:15}},
  bread:{id:'bread',name:'Bread',name_ko:'面包',type:'c',q:'c',icon:'🍞',stk:true,mx:10,ef:{hunger:20}},
  water_bottle:{id:'water_bottle',name:'Water',name_ko:'水壶',type:'c',q:'c',icon:'💧',stk:true,mx:5,ef:{thirst:25}},
  roasted_meat:{id:'roasted_meat',name:'Roasted Meat',name_ko:'烤肉',type:'c',q:'c',icon:'🍖',stk:true,mx:5,ef:{hunger:30}},
  herb_potion:{id:'herb_potion',name:'Herb Tea',name_ko:'草药汤',type:'c',q:'c',icon:'🍵',stk:true,mx:5,ef:{heal:10,hunger:15}},
  hot_soup:{id:'hot_soup',name:'Hot Soup',name_ko:'热汤',type:'c',q:'c',icon:'🥣',stk:true,mx:5,ef:{hunger:20,temp:10}},
  bomb:{id:'bomb',name:'Bomb',name_ko:'炸弹',type:'c',q:'e',icon:'💣',stk:true,mx:3,ef:{damage:20}},
  torch:{id:'torch',name:'Torch',name_ko:'火把',type:'c',q:'c',icon:'🔥',stk:true,mx:5,ef:{vision:2,dur:50}},
  lantern:{id:'lantern',name:'Lantern',name_ko:'灯笼',type:'c',q:'e',icon:'🏮',stk:true,mx:2,ef:{vision:4,dur:100}},
  antidote:{id:'antidote',name:'Antidote',name_ko:'解毒剂',type:'c',q:'c',icon:'💉',stk:true,mx:5,ef:{heal:5,temp:15}},
  elixir:{id:'elixir',name:'Elixir',name_ko:'万灵药',type:'c',q:'e',icon:'✨',stk:true,mx:2,ef:{heal:50,hunger:30,thirst:30}},
  // Materials
  wood:{id:'wood',name:'Wood',name_ko:'木材',type:'m',q:'c',icon:'🪵',stk:true,mx:20},
  herb:{id:'herb',name:'Herb',name_ko:'草药',type:'m',q:'c',icon:'🌿',stk:true,mx:20},
  ore:{id:'ore',name:'Ore',name_ko:'矿石',type:'m',q:'c',icon:'⛏️',stk:true,mx:20},
  beast_hide:{id:'beast_hide',name:'Beast Hide',name_ko:'兽皮',type:'m',q:'c',icon:'🧶',stk:true,mx:20},
  crystal_shard:{id:'crystal_shard',name:'Crystal',name_ko:'水晶碎片',type:'m',q:'c',icon:'💎',stk:true,mx:20},
  monster_bone:{id:'monster_bone',name:'Bone',name_ko:'怪物骨',type:'m',q:'c',icon:'🦴',stk:true,mx:20}
};

// ═══════════════════════════════════════════════════════════════
//  RECIPES
// ═══════════════════════════════════════════════════════════════
const RECIPES = [
  {id:'r_bread',res:'bread',n:1,mt:[{id:'wood',n:1}],ul:true},
  {id:'r_herbp',res:'herb_potion',n:1,mt:[{id:'herb',n:2}],ul:true},
  {id:'r_torch',res:'torch',n:2,mt:[{id:'wood',n:1},{id:'beast_hide',n:1}],ul:true},
  {id:'r_water',res:'water_bottle',n:1,mt:[{id:'crystal_shard',n:1}],ul:true},
  {id:'r_roast',res:'roasted_meat',n:1,mt:[{id:'beast_hide',n:1},{id:'wood',n:1}],ul:false},
  {id:'r_heal',res:'health_potion',n:1,mt:[{id:'herb',n:2},{id:'crystal_shard',n:1}],ul:false},
  {id:'r_soup',res:'hot_soup',n:1,mt:[{id:'herb',n:1},{id:'wood',n:2}],ul:false},
  {id:'r_bomb',res:'bomb',n:1,mt:[{id:'ore',n:2},{id:'crystal_shard',n:1}],ul:false},
  {id:'r_vest',res:'leather_vest',n:1,mt:[{id:'beast_hide',n:3},{id:'herb',n:1}],ul:false},
  {id:'r_sword',res:'rusty_sword',n:1,mt:[{id:'ore',n:2},{id:'wood',n:1}],ul:false},
  {id:'r_cap',res:'leather_cap',n:1,mt:[{id:'beast_hide',n:2}],ul:false},
  {id:'r_shield',res:'wooden_shield',n:1,mt:[{id:'wood',n:3}],ul:false},
  {id:'r_boots',res:'leather_boots',n:1,mt:[{id:'beast_hide',n:2},{id:'wood',n:1}],ul:false},
  {id:'r_ring',res:'copper_ring',n:1,mt:[{id:'ore',n:1},{id:'crystal_shard',n:1}],ul:false},
  {id:'r_chain',res:'chain_mail',n:1,mt:[{id:'ore',n:3},{id:'beast_hide',n:2}],ul:false},
  {id:'r_antidote',res:'antidote',n:2,mt:[{id:'herb',n:1},{id:'crystal_shard',n:1}],ul:false},
  {id:'r_elixir',res:'elixir',n:1,mt:[{id:'herb',n:3},{id:'crystal_shard',n:2}],ul:false},
  {id:'r_dagger',res:'shadow_dagger',n:1,mt:[{id:'ore',n:2},{id:'monster_bone',n:2}],ul:false}
];

// ═══════════════════════════════════════════════════════════════
//  MONSTER DATABASE
// ═══════════════════════════════════════════════════════════════
const MONSTERS = [
  {name:'Slime',name_ko:'史莱姆',color:'#4488cc',hp:15,atk:3,def:1,xp:8,f:1,tp:'n',spd:3},
  {name:'Bat',name_ko:'蝙蝠',color:'#8844aa',hp:10,atk:4,def:0,xp:6,f:1,tp:'n',spd:2},
  {name:'Zombie',name_ko:'僵尸',color:'#558855',hp:20,atk:4,def:2,xp:12,f:1,tp:'n',spd:3},
  {name:'Skeleton',name_ko:'骷髅兵',color:'#cccccc',hp:25,atk:5,def:2,xp:15,f:2,tp:'n',spd:3},
  {name:'Spider',name_ko:'毒蛛',color:'#994433',hp:18,atk:6,def:1,xp:12,f:2,tp:'n',spd:2},
  {name:'Rat King',name_ko:'巨型鼠',color:'#aa8855',hp:50,atk:7,def:3,xp:30,f:2,tp:'e',spd:2},
  {name:'Ghost',name_ko:'怨灵',color:'#88aacc',hp:30,atk:8,def:3,xp:22,f:3,tp:'n',spd:3},
  {name:'Armored Skeleton',name_ko:'重甲骷髅',color:'#aaaacc',hp:60,atk:8,def:6,xp:40,f:3,tp:'e',spd:4},
  {name:'Dark Mage',name_ko:'黑暗法师',color:'#aa44aa',hp:40,atk:10,def:2,xp:45,f:4,tp:'e',spd:3},
  {name:'Demon',name_ko:'恶魔',color:'#cc3322',hp:45,atk:11,def:4,xp:35,f:5,tp:'n',spd:3},
  {name:'Reaper',name_ko:'死神',color:'#443366',hp:50,atk:13,def:5,xp:50,f:6,tp:'e',spd:2},
  {name:'Goblin',name_ko:'哥布林',color:'#55aa33',hp:12,atk:3,def:1,xp:7,f:1,tp:'n',spd:2},
  {name:'Wraith',name_ko:'幽魂',color:'#6677aa',hp:35,atk:9,def:2,xp:28,f:4,tp:'n',spd:2},
  {name:'Mimic',name_ko:'宝箱怪',color:'#ccaa22',hp:40,atk:10,def:4,xp:35,f:3,tp:'e',spd:1},
  {name:'Lich',name_ko:'巫妖',color:'#7733aa',hp:80,atk:14,def:6,xp:60,f:5,tp:'e',spd:3},
  // Bosses
  {name:'Gate Giant',name_ko:'看门巨人',color:'#ff6644',hp:100,atk:10,def:5,xp:80,f:2,tp:'b',
    skills:[{name:'Heavy Strike',cd:3,type:'heavy',mul:2},{name:'Stomp',cd:2,type:'aoe'}]},
  {name:'Abyss Worm',name_ko:'深渊蠕虫',color:'#44aa44',hp:180,atk:15,def:8,xp:150,f:4,tp:'b',
    skills:[{name:'Venom Spray',cd:3,type:'heavy',mul:2.5},{name:'Burrow',cd:4,type:'heal',amt:25}]},
  {name:'Dark Lord',name_ko:'黑暗之主',color:'#882222',hp:300,atk:20,def:12,xp:300,f:6,tp:'b',
    skills:[{name:'Dark Impact',cd:2,type:'heavy',mul:2},{name:'Soul Drain',cd:3,type:'aoe'},{name:'Dark Heal',cd:4,type:'heal',amt:40},{name:'Curse',cd:5,type:'debuff'}]}
];

// ═══════════════════════════════════════════════════════════════
//  ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════
const ACH_DEFS = [
  {id:'explorer',name:'Explorer',desc:'Clear floor 1',ck:()=>G.floor>1},
  {id:'collector',name:'Collector',desc:'Pick up 50 items',ck:()=>G.itemsCollected>=50},
  {id:'slayer',name:'Centurion',desc:'Kill 100 enemies',ck:()=>G.kills>=100},
  {id:'crafter',name:'Master Crafter',desc:'Craft 20 times',ck:()=>G.crafts>=20},
  {id:'survivor',name:'Survivor',desc:'Reach floor 10',ck:()=>G.floor>=10},
  {id:'boss_killer',name:'Boss Slayer',desc:'Defeat a boss',ck:()=>G.bossKills>=1},
  {id:'lv5',name:'Level 5',desc:'Reach level 5',ck:()=>G.lv>=5},
  {id:'lv10',name:'Level 10',desc:'Reach level 10',ck:()=>G.lv>=10},
  {id:'rich',name:'Rich',desc:'Accumulate 500 gold',ck:()=>G.gold>=500},
  {id:'hoarder',name:'Hoarder',desc:'Fill 20 inventory slots',ck:()=>G.inv.length>=20},
  {id:'all_eq',name:'Fully Geared',desc:'Equip all 8 slots',ck:()=>{var c=0;Object.keys(G.eq).forEach(s=>{if(G.eq[s])c++});return c>=8;}},
  {id:'floor20',name:'Deep Diver',desc:'Reach floor 20',ck:()=>G.floor>=20},
  {id:'kills500',name:'Exterminator',desc:'Kill 500 enemies',ck:()=>G.kills>=500},
  {id:'lv20',name:'Veteran',desc:'Reach level 20',ck:()=>G.lv>=20},
  {id:'boss3',name:'Lord Slayer',desc:'Defeat 3 bosses',ck:()=>G.bossKills>=3}
];

// Diary narrative
const DIARY_EVT = [
  'You hear whispers in the darkness...',
  'Strange symbols are carved into the wall.',
  'A cold wind blows, your torch flickers.',
  'You find dried blood on the ground.',
  'The air reeks of decay.',
  'You hear stone grinding somewhere.',
  'A skeleton clutches a broken sword.',
  'Dripping water echoes in the distance.',
  'The walls are covered in green moss.',
  'A message on the wall: "Trust no shadow."',
  'Your heart pounds in the silence.',
  'The torch is running low on fuel.',
  'Scratches on the floor lead deeper.',
  'Something moves in the corner of your eye.',
  'The air grows colder.',
  'You smell sulfur.',
  'A faint glow emanates from a crack.',
  'You step on something brittle — bone.',
  'The ceiling drips with dark liquid.',
  'An old campfire, long extinguished.',
  'Footprints in the dust — not yours.',
  'A broken lantern lies on the ground.',
  'You feel watched.',
  'The walls seem to close in.',
  'A distant scream echoes through the halls.',
  'Chains rattle somewhere ahead.',
  'The floor is stained with something red.',
  'A rat scurries past your feet.',
  'You find scratch marks on the stone.',
  'The silence is deafening.'
];

// ═══════════════════════════════════════════════════════════════
//  GAME STATE
// ═══════════════════════════════════════════════════════════════
let G = null;

function newGame() {
  return {
    floor:1, run:0, px:1, py:1,
    hp:30, mhp:30, atk:5, def:4,
    lv:1, xp:0,
    hunger:100, thirst:100, temp:37,
    vis:VISION_BASE, visBonus:0, visTimer:0,
    gold:0, ap:0,
    stats:{str:5,dex:5,vit:5,int:5,luk:5},
    inv:[{id:'old_dagger',n:1},{id:'old_clothes',n:1},{id:'torch',n:3},{id:'bread',n:5}],
    eq:{w:null,a:null,h:null,s:null,b:null,r:null,n:null,l:null},
    maze:null, fog:null, mons:[], items:[],
    combat:null, state:'menu',
    diary:[], unlocked:new Set(RECIPES.filter(r=>r.ul).map(r=>r.id)),
    kills:0, crafts:0, itemsCollected:0, bossKills:0,
    achievements:new Set(), dayCount:0,
    settings:{music:true,sound:true,difficulty:'EASY',monHP:false,goldPop:true,lang:'EN'},
    invSel:-1, craftSel:-1,
    toastMsg:'', toastTimer:0,
    toExit:0, score:0
  };
}

// ═══════════════════════════════════════════════════════════════
//  DUNGEON GENERATION
// ═══════════════════════════════════════════════════════════════
function getFloorDef(f) {
  var diff = G ? (G.settings.difficulty==='HARD'?1.3:G.settings.difficulty==='EASY'?0.8:1) : 1;
  return {
    w: Math.min(15+f*2, 30),
    h: Math.min(15+f*2, 30),
    mc: Math.min(Math.floor(3+f*1.2), 12),
    mm: (1+(f-1)*0.25) * diff
  };
}

function genMaze(w, h) {
  w = w%2===0 ? w+1 : w;
  h = h%2===0 ? h+1 : h;
  var g = [];
  for (var y=0; y<h; y++) { g[y] = []; for (var x=0; x<w; x++) g[y][x] = TILE.WALL; }
  g[1][1] = TILE.FLOOR;
  var dirs = [[0,-2],[0,2],[-2,0],[2,0]];
  function carve(cx, cy) {
    var d = dirs.slice().sort(()=>Math.random()-0.5);
    for (var i=0; i<d.length; i++) {
      var nx=cx+d[i][0], ny=cy+d[i][1];
      if (nx<1||nx>=w-1||ny<1||ny>=h-1||g[ny][nx]!==TILE.WALL) continue;
      g[cy+d[i][1]/2][cx+d[i][0]/2] = TILE.FLOOR;
      g[ny][nx] = TILE.FLOOR;
      carve(nx, ny);
    }
  }
  carve(1, 1);

  // Ensure stairs reachable
  var sx=w-2, sy=h-2;
  if (g[sy][sx]===TILE.WALL) { g[sy][sx]=TILE.FLOOR; if(sy>1) g[sy-1][sx]=TILE.FLOOR; }
  g[sy][sx] = TILE.STAIRS;

  // Add resources (scale with floor)
  var floors = [];
  for (y=1; y<h-1; y++) for (x=1; x<w-1; x++)
    if (g[y][x]===TILE.FLOOR && !(x===1&&y===1) && !(x===sx&&y===sy)) floors.push({x,y});
  floors.sort(()=>Math.random()-0.5);
  var resCount = Math.min(5 + Math.floor(f/2), 10);
  for (var i=0; i<Math.min(resCount, floors.length); i++) g[floors[i].y][floors[i].x] = TILE.RESOURCE;

  // Shop every 3 floors
  if (G && G.floor%3===0 && floors.length>8) {
    g[floors[7].y][floors[7].x] = TILE.SHOP;
  }

  return { grid:g, w:w, h:h, sx:sx, sy:sy };
}

// ── Monster Spawning ────────────────────────────────────────
function spawnMons(f, maze) {
  var fd = getFloorDef(f);
  var pool = MONSTERS.filter(m => m.tp!=='b' && m.f<=f);
  var ms = [];
  var floors = [];
  for (var y=1; y<maze.h-1; y++) for (var x=1; x<maze.w-1; x++)
    if (maze.grid[y][x]===TILE.FLOOR && !(x===1&&y===1)) floors.push({x,y});
  floors.sort(()=>Math.random()-0.5);
  for (var i=0; i<fd.mc && i<floors.length; i++) {
    var t = pool[Math.floor(Math.random()*pool.length)];
    ms.push({...t, x:floors[i].x, y:floors[i].y, hp:Math.floor(t.hp*fd.mm), maxHp:Math.floor(t.hp*fd.mm),
      atk:Math.floor(t.atk*fd.mm), def:Math.floor(t.def*fd.mm), alive:true,
      skillCD: t.skills ? t.skills.map(()=>0) : [], moveTick:0});
  }
  // Boss every 2 floors
  if (f%2===0) {
    var bosses = MONSTERS.filter(m=>m.tp==='b' && m.f<=f);
    if (bosses.length>0) {
      var b = bosses[bosses.length-1];
      ms.push({...b, x:maze.sx, y:maze.sy, hp:Math.floor(b.hp*fd.mm*1.5), maxHp:Math.floor(b.hp*fd.mm*1.5),
        atk:Math.floor(b.atk*fd.mm*1.5), def:Math.floor(b.def*fd.mm*1.5), alive:true,
        skillCD: b.skills ? b.skills.map(()=>0) : [], moveTick:0});
    }
  }
  return ms;
}

// ── Item Spawning ───────────────────────────────────────────
function spawnItems(maze) {
  var pool = ['health_potion','bread','torch','herb','wood','ore','crystal_shard','beast_hide','monster_bone','water_bottle'];
  var its = [], floors = [];
  for (var y=1; y<maze.h-1; y++) for (var x=1; x<maze.w-1; x++)
    if (maze.grid[y][x]===TILE.FLOOR && !(x===1&&y===1)) floors.push({x,y});
  floors.sort(()=>Math.random()-0.5);
  for (var i=0; i<Math.min(3+G.floor, floors.length); i++) {
    its.push({id:pool[Math.floor(Math.random()*pool.length)], x:floors[i].x, y:floors[i].y});
  }
  return its;
}

// ── Floor Init ──────────────────────────────────────────────
function initFloor() {
  var fd = getFloorDef(G.floor);
  G.maze = genMaze(fd.w, fd.h);
  G.fog = [];
  for (var y=0; y<fd.h; y++) { G.fog[y] = []; for (var x=0; x<fd.w; x++) G.fog[y][x] = 0; }
  G.px = 1; G.py = 1;
  revFog(1, 1, Math.floor(G.vis + G.visBonus));
  G.mons = spawnMons(G.floor, G.maze);
  G.items = spawnItems(G.maze);
  G.dayCount++;
  G.diary = ['Day ' + G.dayCount + ' — Floor ' + G.floor];
  if (G.floor > 1) G.diary.push(DIARY_EVT[Math.floor(Math.random()*DIARY_EVT.length)]);
  G.toExit = G.mons.filter(m=>m.alive).length;
  checkAch();
}

// ═══════════════════════════════════════════════════════════════
//  FOG OF WAR
// ═══════════════════════════════════════════════════════════════
function revFog(cx, cy, r) {
  var f = G.fog;
  for (var y=0; y<f.length; y++) for (var x=0; x<f[0].length; x++)
    if (f[y][x]===2) f[y][x] = 1;
  for (y=Math.max(0,cy-r); y<=Math.min(f.length-1,cy+r); y++)
    for (x=Math.max(0,cx-r); x<=Math.min(f[0].length-1,cx+r); x++)
      if (Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy)) <= r) f[y][x] = 2;
}

// ═══════════════════════════════════════════════════════════════
//  EQUIPMENT HELPERS
// ═══════════════════════════════════════════════════════════════
const EQ_SLOTS = {w:'Weapon',a:'Armor',h:'Helmet',s:'Shield',b:'Boots',r:'Ring',n:'Necklace',l:'Belt'};
const EQ_SLOT_ICONS = {w:'⚔️',a:'👕',h:'🎩',s:'🛡️',b:'👢',r:'💍',n:'📿',l:'🪢'};
const EQ_TYPE_MAP = {w:'w',a:'a',h:'h',s:'s',b:'b',r:'r',n:'n',l:'l'};

function eqStats() {
  var a=0, d=0, hp=0;
  Object.keys(EQ_SLOTS).forEach(slot => {
    var id = G.eq[slot];
    if (!id || !ITEMS[id]) return;
    var s = ITEMS[id].st;
    a += (s.atk||0); d += (s.def||0); hp += (s.hp||0);
  });
  return {atk:a, def:d, hp:hp};
}
function totalAtk() { return G.atk + eqStats().atk + Math.floor(G.stats.str/3); }
function totalDef() { return G.def + eqStats().def + Math.floor(G.stats.vit/3); }
function totalMhp() { return G.mhp + eqStats().hp + G.stats.vit*2; }

function equipItem(id) {
  var d = ITEMS[id]; if (!d) return;
  var slot = null;
  Object.keys(EQ_TYPE_MAP).forEach(s => { if (EQ_TYPE_MAP[s]===d.type) slot=s; });
  if (!slot) return;
  if (G.eq[slot]) addItem(G.eq[slot]);
  G.eq[slot] = id; remItem(id, 1);
  sfx('equip');
  toast('Equipped ' + d.name);
}

function unequipItem(slot) {
  if (!G.eq[slot]) return;
  addItem(G.eq[slot]); G.eq[slot] = null;
  toast('Unequipped');
}

// ═══════════════════════════════════════════════════════════════
//  INVENTORY HELPERS
// ═══════════════════════════════════════════════════════════════
function addItem(id) {
  var s = G.inv.find(i => i.id===id);
  if (s) {
    if (ITEMS[id] && ITEMS[id].stk && s.n < (ITEMS[id].mx||99)) { s.n++; G.itemsCollected++; return true; }
    if (!ITEMS[id].stk) return false;
  }
  if (G.inv.length >= 24) return false;
  G.inv.push({id:id, n:1}); G.itemsCollected++; return true;
}
function remItem(id, n) {
  var r = n;
  for (var i=G.inv.length-1; i>=0 && r>0; i--) {
    if (G.inv[i].id !== id) continue;
    var a = Math.min(r, G.inv[i].n); G.inv[i].n -= a; r -= a;
    if (G.inv[i].n <= 0) G.inv.splice(i, 1);
  }
  return n - r;
}
function countItem(id) {
  return G.inv.reduce((s,i) => i.id===id ? s+i.n : s, 0);
}

// ═══════════════════════════════════════════════════════════════
//  COMBAT SYSTEM
// ═══════════════════════════════════════════════════════════════
function startCombat(mon) {
  G.combat = { e:mon, log:['Encountered '+mon.name+'!'], up:false, def:false };
  G.state = 'combat';
  document.getElementById('cm').classList.add('on');
  sfx(mon.tp==='b' ? 'boss' : 'hit');
  showCombat();
}

function showCombat() {
  if (!G.combat) return;
  var c = G.combat, e = c.e;
  var tierLabel = e.tp==='e' ? '<span style="color:#cc8822;font-size:10px">ELITE</span>'
    : e.tp==='b' ? '<span style="color:#cc3333;font-size:10px;font-weight:bold">BOSS</span>' : '';
  var bossHP = e.tp==='b' ? '<div style="margin-top:4px"><div class="boss-hp-bar"><div style="width:'+Math.max(0,e.hp/e.maxHp*100)+'%;background:#cc3333;height:100%;transition:width 0.3s"></div></div></div>' : '';

  document.getElementById('ce').innerHTML =
    '<div class="cmb-enemy"><div class="cmb-enemy-icon" style="color:'+e.color+'">'+getMonsterChar(e)+'</div>'
    +'<div class="cmb-enemy-name">'+e.name+'</div>'
    +'<div class="cmb-enemy-hp">HP: '+e.hp+'/'+e.maxHp+'</div>'
    +'<div class="cmb-enemy-stats">ATK: '+e.atk+' DEF: '+e.def+'</div>'
    +tierLabel + bossHP + '</div>';

  document.getElementById('cp').innerHTML =
    '<div style="text-align:center"><div style="font-size:14px">👧</div>'
    +'<div>HP: '+G.hp+'/'+totalMhp()+'</div>'
    +'<div class="hp-bar"><div style="width:'+Math.max(0,G.hp/totalMhp()*100)+'%;background:#cc2222;height:100%"></div></div>'
    +'<div style="font-size:11px;color:#888">ATK: '+totalAtk()+' DEF: '+totalDef()+'</div></div>';

  document.getElementById('cl').innerHTML = c.log.slice(-6).map(l =>
    '<div class="cmb-log">'+l+'</div>'
  ).join('');
}

function combatAtk() {
  var c = G.combat; if (!c) return;
  var a = totalAtk();
  if (c.up) { a = Math.floor(a*1.5); c.up = false; }
  // Critical hit chance based on LUK
  var critChance = G.stats.luk * 0.015;
  var isCrit = Math.random() < critChance;
  var dmg = Math.max(1, a - c.e.def) + Math.floor(Math.random()*3);
  if (isCrit) { dmg = Math.floor(dmg * 1.8); }
  c.e.hp -= dmg;
  sfx('hit');
  screenShake = isCrit ? 6 : 3;
  c.log.push('You deal '+dmg+' damage' + (isCrit ? ' CRITICAL!' : '!') + (isCrit ? '💥' : ''));
  if (c.e.hp <= 0) { enemyKilled(c.e); return; }
  enemyTurn();
  showCombat();
}

function combatPower() {
  var c = G.combat; if (!c) return;
  c.up = true; c.log.push('Powering up...');
  sfx('equip');
  enemyTurn(); showCombat();
}

function combatDefend() {
  var c = G.combat; if (!c) return;
  c.def = true; c.log.push('Defending...');
  sfx('btn');
  enemyTurn(); showCombat();
}

function combatFlee() {
  var c = G.combat; if (!c) return;
  if (Math.random() < 0.4) {
    c.log.push('Escaped!'); G.combat = null;
    document.getElementById('cm').classList.remove('on');
    G.state = 'play'; sfx('flee'); uHUD();
  } else {
    c.log.push('Escape failed!');
    sfx('hurt');
    enemyTurn(); showCombat();
  }
}

function useBomb() {
  var c = G.combat; if (!c) return;
  var bi = G.inv.findIndex(i => i.id==='bomb' && i.n>0);
  if (bi < 0) { toast('No bombs!'); return; }
  c.e.hp -= 20; remItem('bomb', 1);
  sfx('bomb'); screenShake = 8;
  c.log.push('Bomb deals 20 damage!');
  if (c.e.hp <= 0) { enemyKilled(c.e); return; }
  enemyTurn(); showCombat();
}

function enemyTurn() {
  var c = G.combat; if (!c) return;
  var e = c.e;
  // Boss skill system
  if (e.tp==='b' && e.skills && e.skills.length>0) {
    var used = false;
    for (var i=0; i<e.skills.length; i++) {
      if (e.skillCD[i] <= 0) {
        var sk = e.skills[i]; e.skillCD[i] = sk.cd;
        if (sk.type==='heavy') {
          var raw = Math.floor(e.atk*(sk.mul||2)) - totalDef();
          if (c.def) raw = Math.floor(raw*0.5);
          var dmg = Math.max(1, raw); G.hp -= dmg;
          c.log.push(e.name+' uses '+sk.name+'! '+dmg+' damage!');
        } else if (sk.type==='aoe') {
          var raw2 = e.atk - totalDef();
          if (c.def) raw2 = Math.floor(raw2*0.5);
          var dmg2 = Math.max(1, raw2); G.hp -= dmg2;
          c.log.push(e.name+' uses '+sk.name+'! '+dmg2+' damage!');
        } else if (sk.type==='heal') {
          var amt = sk.amt || Math.floor(e.maxHp*0.2);
          e.hp = Math.min(e.maxHp, e.hp+amt);
          c.log.push(e.name+' uses '+sk.name+'! Heals '+amt+' HP!');
        } else if (sk.type==='debuff') {
          G.atk = Math.max(1, G.atk-2);
          c.log.push(e.name+' uses '+sk.name+'! ATK reduced!');
        }
        used = true; break;
      }
    }
    if (!used) {
      // Dodge chance based on DEX
      var dodgeChance = G.stats.dex * 0.01;
      if (Math.random() < dodgeChance) {
        c.log.push('Dodged the attack!');
      } else {
        var md = Math.max(1, e.atk - totalDef());
        if (c.def) md = Math.floor(md*0.5);
        G.hp -= md; c.log.push('Took '+md+' damage');
      }
    }
    for (var j=0; j<e.skillCD.length; j++) if (e.skillCD[j]>0) e.skillCD[j]--;
  } else if (e.tp==='e' && Math.random()<0.3) {
    // Elite double attack
    var dodgeE = G.stats.dex * 0.01;
    if (Math.random() < dodgeE) {
      c.log.push('Dodged the attack!');
    } else {
      var md = Math.max(1, e.atk - totalDef());
      if (c.def) md = Math.floor(md*0.5);
      G.hp -= md; c.log.push('Took '+md+' damage');
      if (Math.random()<0.2) {
        var d2 = Math.max(1, Math.floor(e.atk*0.7) - totalDef());
        if (c.def) d2 = Math.floor(d2*0.5);
        G.hp -= d2; c.log.push('Critical! '+d2+' extra damage!');
      }
    }
  } else {
    var dodgeN = G.stats.dex * 0.01;
    if (Math.random() < dodgeN) {
      c.log.push('Dodged the attack!');
    } else {
      var md = Math.max(1, e.atk - totalDef());
      if (c.def) md = Math.floor(md*0.5);
      G.hp -= md; c.log.push('Took '+md+' damage');
    }
  }
  c.def = false;
  sfx('hurt'); screenShake = 4;
  if (G.hp <= 0) { G.hp = 0; G.combat = null; document.getElementById('cm').classList.remove('on'); die(); }
}

function enemyKilled(e) {
  e.alive = false;
  G.xp += e.xp; G.kills++;
  G.toExit = G.mons.filter(m=>m.alive).length;
  sfx('pickup');
  G.diary.push('Defeated '+e.name+'!');
  // Drop items (LUK increases drop rate)
  var dropRate = 0.4 + G.floor * 0.01 + G.stats.luk * 0.005;
  if (Math.random() < Math.min(dropRate, 0.7)) {
    var drops = ['health_potion','bread','herb','ore','crystal_shard','beast_hide','monster_bone','water_bottle'];
    if (G.floor >= 3) drops.push('antidote','hot_soup');
    if (G.floor >= 5) drops.push('lantern','roasted_meat');
    var dr = drops[Math.floor(Math.random()*drops.length)];
    addItem(dr); toast('+'+ITEMS[dr].icon+' '+ITEMS[dr].name);
  }
  // Boss drops epic gear
  if (e.tp==='b' && Math.random()<0.8) {
    var bDrops = ['crimson_blade','bone_armor','life_ring','void_walkers','crystal_pendant','shadow_sash','shadow_crown','shadow_dagger','dark_hood','tower_shield','shadow_boots','demon_slayer'];
    var bd = bDrops[Math.floor(Math.random()*bDrops.length)];
    addItem(bd); toast('BOSS DROP: '+ITEMS[bd].name+'!');
    G.bossKills++;
    // Unlock recipe
    var locked = RECIPES.filter(r => !G.unlocked.has(r.id));
    if (locked.length > 0) {
      var nr = locked[Math.floor(Math.random()*locked.length)];
      G.unlocked.add(nr.id); G.diary.push('Unlocked: '+ITEMS[nr.res].name+'!');
    }
  }
  // Gold (scale with enemy tier and floor)
  var goldBase = e.tp==='b' ? 30 : e.tp==='e' ? 15 : 5;
  G.gold += goldBase + Math.floor(Math.random() * (3 + G.floor * 2));
  checkLv();
  G.combat = null;
  document.getElementById('cm').classList.remove('on');
  G.state = 'play';
  checkAch(); draw(); uHUD();
}

// ── Level Up ────────────────────────────────────────────────
function checkLv() {
  var need = Math.floor(20 * Math.pow(1.5, G.lv-1));
  while (G.xp >= need) {
    G.xp -= need; G.lv++;
    G.mhp += 5; G.hp = Math.min(G.hp+5, totalMhp());
    G.atk += 2; G.def += 1; G.ap += 2;
    G.diary.push('Level Up! Lv.' + G.lv);
    toast('Level Up! Lv.' + G.lv);
    sfx('levelup');
    need = Math.floor(20 * Math.pow(1.5, G.lv-1));
  }
}

// ── Achievements ────────────────────────────────────────────
function checkAch() {
  ACH_DEFS.forEach(a => {
    if (G.achievements.has(a.id)) return;
    try { if (a.ck()) { G.achievements.add(a.id); G.diary.push('Achievement: '+a.name); toast('Achievement: '+a.name); } } catch(e){}
  });
}

// ── Death ───────────────────────────────────────────────────
function die() {
  G.state = 'dead'; G.score = G.kills*10 + G.floor*50 + G.lv*20 + G.gold;
  sfx('death');
  document.getElementById('gs').classList.remove('on');
  document.getElementById('death').classList.add('on');
  document.getElementById('dd').innerHTML =
    'Day 1 — Entered the dungeon<br>Day '+Math.max(1,Math.floor(G.dayCount/2))+' — Whispers in the dark<br>Day '+G.dayCount+' — You fell in the dungeon...';
  document.getElementById('ds').innerHTML =
    'RECORD<br>Reached: Floor '+G.floor+'<br>Level: '+G.lv+'<br>Kills: '+G.kills+'<br>Gold: '+G.gold+'<br>Score: '+G.score+'<br>Run #'+G.run;
}

// ═══════════════════════════════════════════════════════════════
//  MOVEMENT & INTERACTION
// ═══════════════════════════════════════════════════════════════
function mv(dx, dy) {
  if (!G || G.state!=='play' || G.combat) return;
  var nx = G.px+dx, ny = G.py+dy;
  if (nx<0||nx>=G.maze.w||ny<0||ny>=G.maze.h||G.maze.grid[ny][nx]===TILE.WALL) return;

  G.px = nx; G.py = ny;
  sfx('step');
  playerAnim.walkCycle++;
  if (dx !== 0) playerAnim.facing = dx > 0 ? 1 : -1;
  var r = Math.floor(G.vis + G.visBonus);
  revFog(nx, ny, r);

  // Vision timer
  if (G.visTimer > 0) { G.visTimer--; if (G.visTimer<=0) G.visBonus = 0; }

  var t = G.maze.grid[ny][nx];

  // Stairs
  if (t === TILE.STAIRS) { G.floor++; sfx('stairs'); save(); initFloor(); draw(); uHUD(); return; }

  // Resource
  if (t === TILE.RESOURCE) {
    var rPool = ['wood','ore','herb','beast_hide','crystal_shard'];
    var ri = rPool[Math.floor(Math.random()*rPool.length)];
    addItem(ri); G.maze.grid[ny][nx] = TILE.FLOOR;
    G.diary.push('Gathered '+ITEMS[ri].name);
    sfx('pickup');
    toast('+'+ITEMS[ri].icon+' '+ITEMS[ri].name);
  }

  // Shop
  if (t === TILE.SHOP) { G.state = 'shop'; openShop(); return; }

  // Pick up items on ground
  var ii = G.items.findIndex(i => i.x===nx && i.y===ny);
  if (ii >= 0) {
    addItem(G.items[ii].id);
    sfx('pickup');
    G.diary.push('Found '+ITEMS[G.items[ii].id].name);
    toast('+'+ITEMS[G.items[ii].id].icon+' '+ITEMS[G.items[ii].id].name);
    G.items.splice(ii, 1);
  }

  // Check monster collision
  var mon = G.mons.find(m => m.alive && m.x===nx && m.y===ny);
  if (mon) { startCombat(mon); return; }

  // Survival costs (scale with floor)
  var drain = Math.min(1 + G.floor * 0.05, 1.5);
  G.hunger = Math.max(0, G.hunger - 1.5 * drain);
  G.thirst = Math.max(0, G.thirst - 2 * drain);
  G.temp = Math.max(0, G.temp - 0.3 * drain);
  if (G.hunger <= 0) { G.hp -= 2; G.diary.push('Starving!'); }
  if (G.thirst <= 0) { G.hp -= 3; G.diary.push('Dehydrated!'); }
  if (G.temp <= 0) { G.hp -= 2; G.diary.push('Freezing!'); }
  if (G.hp <= 0) { G.hp = 0; die(); return; }

  // Monster AI
  for (var mi=0; mi<G.mons.length; mi++) {
    var m = G.mons[mi];
    if (!m.alive) continue;
    m.moveTick = (m.moveTick||0) + 1;
    if (m.moveTick < (m.spd||3)) continue;
    m.moveTick = 0;
    var d = Math.abs(m.x-G.px) + Math.abs(m.y-G.py);
    if (d<=5 && d>1 && Math.random()<0.5) {
      var mdx = Math.sign(G.px-m.x), mdy = Math.sign(G.py-m.y);
      var ny2 = m.y+mdy, nx2 = m.x+mdx;
      if (ny2>=0 && ny2<G.maze.h && nx2>=0 && nx2<G.maze.w && G.maze.grid[ny2][nx2]!==TILE.WALL) {
        m.x = nx2; m.y = ny2;
      }
    }
    if (m.x===G.px && m.y===G.py && m.alive) { startCombat(m); return; }
  }

  // Random diary
  if (Math.random() < 0.08) G.diary.push(DIARY_EVT[Math.floor(Math.random()*DIARY_EVT.length)]);

  uHUD(); checkAch();
}

// ═══════════════════════════════════════════════════════════════
//  CRAFTING
// ═══════════════════════════════════════════════════════════════
function canCraft(r) {
  if (!G.unlocked.has(r.id)) return false;
  return r.mt.every(m => countItem(m.id) >= m.n);
}
function doCraft(r) {
  if (!canCraft(r)) { toast('Not enough materials'); return; }
  r.mt.forEach(m => remItem(m.id, m.n));
  addItem(r.res); G.crafts++;
  sfx('craft');
  toast('Crafted '+ITEMS[r.res].name+'!');
  G.diary.push('Crafted '+ITEMS[r.res].name);
  checkAch();
}

// ═══════════════════════════════════════════════════════════════
//  SHOP
// ═══════════════════════════════════════════════════════════════
const SHOP_ITEMS = [
  {id:'health_potion',p:30},{id:'bread',p:15},{id:'water_bottle',p:12},
  {id:'torch',p:20},{id:'roasted_meat',p:25},{id:'antidote',p:18},
  {id:'rusty_sword',p:80},{id:'leather_vest',p:100},{id:'leather_cap',p:60},
  {id:'wooden_shield',p:70},{id:'leather_boots',p:50},{id:'copper_ring',p:90},
  {id:'rope_belt',p:40},{id:'bone_necklace',p:85},{id:'shadow_dagger',p:200},
  {id:'chain_mail',p:250},{id:'iron_helm',p:150},{id:'iron_shield',p:180},
  {id:'silver_ring',p:160},{id:'silver_pendant',p:170},{id:'elixir',p:120}
];

function shopBuy(idx) {
  var si = SHOP_ITEMS[idx]; if (!si) return;
  if (G.gold < si.p) { toast('Not enough gold!'); return; }
  if (!addItem(si.id)) { toast('Inventory full!'); return; }
  G.gold -= si.p; sfx('btn'); toast('Bought '+ITEMS[si.id].name);
}
function shopSell(idx) {
  var it = G.inv[idx]; if (!it) return;
  var d = ITEMS[it.id]; if (!d) return;
  var val = Math.max(5, Math.floor(((d.st&&d.st.atk)||(d.st&&d.st.def)||3) * 3));
  G.gold += val; remItem(it.id, 1);
  toast('Sold for '+val+'g');
}

// ═══════════════════════════════════════════════════════════════
//  STATS AP ALLOCATION
// ═══════════════════════════════════════════════════════════════
function allocAP(stat) {
  if (G.ap <= 0) return;
  G.ap--;
  G.stats[stat]++;
  if (stat==='str') G.atk += 1;
  if (stat==='vit') { G.def += 1; G.mhp += 3; }
  if (stat==='dex') G.atk += 1;
  if (stat==='int') G.mhp += 2;
}

// ═══════════════════════════════════════════════════════════════
//  USE ITEM
// ═══════════════════════════════════════════════════════════════
function useItem(idx) {
  var it = G.inv[idx]; if (!it) return;
  var d = ITEMS[it.id]; if (!d || d.type!=='c') return;
  if (!d.ef) return;
  if (d.ef.heal) G.hp = Math.min(totalMhp(), G.hp+d.ef.heal);
  if (d.ef.hunger) G.hunger = Math.min(100, G.hunger+d.ef.hunger);
  if (d.ef.thirst) G.thirst = Math.min(100, G.thirst+d.ef.thirst);
  if (d.ef.temp) G.temp = Math.min(50, G.temp+d.ef.temp);
  if (d.ef.damage && G.combat) {
    G.combat.e.hp -= d.ef.damage;
    G.combat.log.push(d.name+' deals '+d.ef.damage+' damage!');
    if (G.combat.e.hp <= 0) { enemyKilled(G.combat.e); return; }
  }
  if (d.ef.vision) { G.visBonus = d.ef.vision; G.visTimer = d.ef.dur||50; }
  remItem(it.id, 1);
  sfx(d.ef.heal ? 'heal' : 'btn');
  toast('Used '+d.name);
  if (typeof rI === 'function') rI();
  uHUD();
}

// ═══════════════════════════════════════════════════════════════
//  SAVE / LOAD
// ═══════════════════════════════════════════════════════════════
function save() {
  try {
    var d = {
      floor:G.floor, run:G.run, hp:G.hp, mhp:G.mhp, atk:G.atk, def:G.def,
      lv:G.lv, xp:G.xp, hunger:G.hunger, thirst:G.thirst, temp:G.temp,
      vis:G.vis, gold:G.gold, ap:G.ap, stats:G.stats,
      inv:G.inv, eq:G.eq, unlocked:[...G.unlocked],
      kills:G.kills, crafts:G.crafts, itemsCollected:G.itemsCollected,
      bossKills:G.bossKills, dayCount:G.dayCount, achievements:[...G.achievements],
      settings:G.settings
    };
    localStorage.setItem('ds_save2', JSON.stringify(d));
    return true;
  } catch(e) { return false; }
}
function load() {
  try {
    var r = localStorage.getItem('ds_save2');
    if (!r) return false;
    var d = JSON.parse(r);
    Object.assign(G, d);
    G.unlocked = new Set(d.unlocked||[]);
    G.achievements = new Set(d.achievements||[]);
    return true;
  } catch(e) { return false; }
}
function hasSave() { return localStorage.getItem('ds_save2')!==null; }

// ═══════════════════════════════════════════════════════════════
//  ISOMETRIC RENDERING ENGINE
// ═══════════════════════════════════════════════════════════════
let cv, ctx, mmCv, mmCtx, time = 0; // mm = minimap

function isoToScreen(gx, gy) {
  return {
    x: (gx - gy) * HW,
    y: (gx + gy) * HH
  };
}

function drawIsoCube(sx, sy, topColor, leftColor, rightColor, h) {
  h = h || CH;
  // Top face
  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.moveTo(sx, sy - h);
  ctx.lineTo(sx + HW, sy + HH - h);
  ctx.lineTo(sx, sy + TH - h);
  ctx.lineTo(sx - HW, sy + HH - h);
  ctx.closePath(); ctx.fill();
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
  // Edge lines
  ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(sx, sy - h); ctx.lineTo(sx + HW, sy + HH - h);
  ctx.moveTo(sx, sy - h); ctx.lineTo(sx - HW, sy + HH - h);
  ctx.moveTo(sx, sy - h); ctx.lineTo(sx, sy + TH - h);
  ctx.stroke();
}

function drawIsoFloor(sx, sy, color, altColor) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx + HW, sy + HH);
  ctx.lineTo(sx, sy + TH);
  ctx.lineTo(sx - HW, sy + HH);
  ctx.closePath(); ctx.fill();
  // Grid lines
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 0.5;
  ctx.stroke();
}

function drawIsoEntity(sx, sy, char, color, scale) {
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
}

function getMonsterChar(m) {
  if (m.tp==='b') return '☠';
  if (m.name.indexOf('Slime')>=0) return '●';
  if (m.name.indexOf('Bat')>=0) return '◆';
  if (m.name.indexOf('Skeleton')>=0 || m.name.indexOf('Zombie')>=0) return '☠';
  if (m.name.indexOf('Spider')>=0) return '✦';
  if (m.name.indexOf('Ghost')>=0 || m.name.indexOf('Mage')>=0) return '◇';
  if (m.name.indexOf('Demon')>=0 || m.name.indexOf('Reaper')>=0) return '▲';
  return '●';
}

function render() {
  if (!G || !G.maze) return;
  var cw = cv.width, ch = cv.height;
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, cw, ch);

  // Screen shake offset
  var shX = screenShake > 0 ? (Math.random()-0.5)*screenShake : 0;
  var shY = screenShake > 0 ? (Math.random()-0.5)*screenShake : 0;

  // Camera centered on player
  var ps = isoToScreen(G.px, G.py);
  var camX = cw/2 - ps.x + shX;
  var camY = ch/2 - ps.y - 10 + shY;

  var m = G.maze, f = G.fog;
  var flicker = Math.sin(time*0.05)*0.02;

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
        var ps2 = isoToScreen(gx, gy);
        ctx.fillStyle = '#050505';
        ctx.beginPath();
        ctx.moveTo(ps2.x+camX, ps2.y+camY);
        ctx.lineTo(ps2.x+camX+HW, ps2.y+camY+HH);
        ctx.lineTo(ps2.x+camX, ps2.y+camY+TH);
        ctx.lineTo(ps2.x+camX-HW, ps2.y+camY+HH);
        ctx.closePath(); ctx.fill();
        continue;
      }

      var t = m.grid[gy][gx];
      var p = isoToScreen(gx, gy);
      var sx = p.x + camX, sy = p.y + camY;
      var visible = rev === 2;

      // Distance-based light
      var dist = Math.sqrt((gx-G.px)*(gx-G.px)+(gy-G.py)*(gy-G.py));
      var vr = G.vis + G.visBonus;
      var light = visible ? Math.max(0.25, 1 - dist/vr + flicker) : 0.15;

      // Tile rendering
      if (t === TILE.WALL) {
        var tc = visible ? '#5a5a5a' : '#3a3a3a';
        var lc = visible ? '#484848' : '#2a2a2a';
        var rc = visible ? '#383838' : '#1a1a1a';
        drawIsoCube(sx, sy, tc, lc, rc, CH);
        // Brick pattern on top
        if (visible) {
          ctx.strokeStyle = 'rgba(80,80,80,0.4)'; ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(sx, sy-CH); ctx.lineTo(sx, sy+TH-CH);
          ctx.moveTo(sx-HW, sy+HH-CH); ctx.lineTo(sx+HW, sy+HH-CH);
          ctx.stroke();
        }
      } else if (t === TILE.FLOOR) {
        var fc = visible ? ((gx+gy)%2===0 ? '#3a3228' : '#332a20') : '#1a1610';
        var fc2 = visible ? '#2a2218' : '#121008';
        drawIsoFloor(sx, sy, fc, fc2);
      } else if (t === TILE.STAIRS) {
        drawIsoFloor(sx, sy, visible ? '#2a3a2a' : '#1a2a1a');
        if (visible) {
          // Green glow stairs
          var pulse = Math.sin(time*0.08)*0.3+0.7;
          ctx.fillStyle = 'rgba(60,180,60,'+pulse*0.3+')';
          ctx.beginPath();
          ctx.moveTo(sx, sy); ctx.lineTo(sx+HW, sy+HH); ctx.lineTo(sx, sy+TH); ctx.lineTo(sx-HW, sy+HH);
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#44cc44';
          ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('▼', sx, sy+2);
        }
      } else if (t === TILE.RESOURCE) {
        drawIsoFloor(sx, sy, visible ? '#3a2a1a' : '#1a1610');
        if (visible) {
          ctx.fillStyle = '#aa8844';
          ctx.font = '10px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('◆', sx, sy+2);
        }
      } else if (t === TILE.SHOP) {
        drawIsoFloor(sx, sy, visible ? '#3a2a4a' : '#1a1610');
        if (visible) {
          ctx.fillStyle = '#ccaaff';
          ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('$', sx, sy+2);
        }
      }

      // Light overlay for far tiles
      if (visible && dist > 2) {
        var alpha = Math.min(0.6, (dist-2)*0.1);
        ctx.fillStyle = 'rgba(0,0,0,'+alpha+')';
        ctx.beginPath();
        ctx.moveTo(sx, sy - (t===TILE.WALL?CH:0));
        ctx.lineTo(sx+HW, sy+HH - (t===TILE.WALL?CH:0));
        ctx.lineTo(sx, sy+TH - (t===TILE.WALL?CH:0));
        ctx.lineTo(sx-HW, sy+HH - (t===TILE.WALL?CH:0));
        ctx.closePath(); ctx.fill();
      }

      // Fog for revealed-but-not-visible
      if (!visible) {
        ctx.fillStyle = 'rgba(5,5,5,0.7)';
        ctx.beginPath();
        ctx.moveTo(sx, sy - (t===TILE.WALL?CH:0));
        ctx.lineTo(sx+HW, sy+HH - (t===TILE.WALL?CH:0));
        ctx.lineTo(sx, sy+TH - (t===TILE.WALL?CH:0));
        ctx.lineTo(sx-HW, sy+HH - (t===TILE.WALL?CH:0));
        ctx.closePath(); ctx.fill();
      }

      // ── Items on ground (only on visible floor tiles) ─────
      if (visible && t !== TILE.WALL) {
        var groundItem = G.items.find(i => i.x===gx && i.y===gy);
        if (groundItem) {
          var bounce = Math.sin(time*0.1+gx+gy)*1.5;
          ctx.fillStyle = '#4488ff';
          ctx.beginPath(); ctx.arc(sx, sy+2+bounce, 4, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#88ccff';
          ctx.beginPath(); ctx.arc(sx, sy+bounce, 2, 0, Math.PI*2); ctx.fill();
        }

        // ── Monsters ───────────────────────────────────────
        var mon = G.mons.find(mm => mm.alive && mm.x===gx && mm.y===gy);
        if (mon) {
          drawIsoEntity(sx, sy, getMonsterChar(mon), mon.color, mon.tp==='b'?20:14);
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

  // ── Player ────────────────────────────────────────────────
  var ppos = isoToScreen(G.px, G.py);
  var psx = ppos.x+camX, psy = ppos.y+camY;
  var walkBob = Math.sin(playerAnim.walkCycle * 0.8) * 1.5;
  var face = playerAnim.facing;

  // Player glow (torch-like warm light)
  var glowA = Math.sin(time*0.06)*0.08+0.18;
  var grd = ctx.createRadialGradient(psx, psy, 0, psx, psy, TW*2);
  grd.addColorStop(0, 'rgba(255,220,150,'+glowA+')');
  grd.addColorStop(0.5, 'rgba(255,180,100,'+(glowA*0.3)+')');
  grd.addColorStop(1, 'rgba(255,160,80,0)');
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.arc(psx, psy, TW*2, 0, Math.PI*2); ctx.fill();

  // Torch flame particles
  if (time % 3 === 0) {
    spawnParticles(psx + face*6, psy - 16, '#ffaa33', 1, {spread:1, rise:2, life:12, size:2});
    if (Math.random() < 0.4) spawnParticles(psx + face*6, psy - 18, '#ff6622', 1, {spread:1.5, rise:2.5, life:8, size:1.5});
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath(); ctx.ellipse(psx, psy+6, 9, 4, 0, 0, Math.PI*2); ctx.fill();

  // ── Enhanced player character - pixel girl with sword ──────
  var ox = psx, oy = psy + walkBob;

  // Hair (back layer - long brown hair)
  ctx.fillStyle = '#7a4422';
  ctx.fillRect(ox-5*face, oy-18, 3, 10);
  ctx.fillRect(ox+3*face, oy-18, 3, 10);

  // Legs with walk animation
  var legOff = Math.sin(playerAnim.walkCycle * 0.8) * 2;
  ctx.fillStyle = '#2a2a2a'; // dark pants
  ctx.fillRect(ox-3, oy-2+legOff, 2, 5);
  ctx.fillRect(ox+1, oy-2-legOff, 2, 5);
  // Boots
  ctx.fillStyle = '#553311';
  ctx.fillRect(ox-4, oy+2+legOff, 3, 2);
  ctx.fillRect(ox+1, oy+2-legOff, 3, 2);

  // Body - red/dark outfit
  ctx.fillStyle = '#cc3333'; // main outfit
  ctx.fillRect(ox-4, oy-11, 8, 9);
  // Belt
  ctx.fillStyle = '#664422';
  ctx.fillRect(ox-4, oy-3, 8, 1);
  // Outfit details
  ctx.fillStyle = '#aa2222';
  ctx.fillRect(ox-1, oy-11, 2, 9); // center line

  // Arms
  ctx.fillStyle = '#cc3333';
  ctx.fillRect(ox-6, oy-10, 2, 6); // left arm
  ctx.fillRect(ox+4, oy-10, 2, 6); // right arm

  // Hands (skin)
  ctx.fillStyle = '#ffd4a8';
  ctx.fillRect(ox-6, oy-4, 2, 2);
  ctx.fillRect(ox+4, oy-4, 2, 2);

  // Head
  ctx.fillStyle = '#ffd4a8'; // skin
  ctx.fillRect(ox-3, oy-17, 6, 6);
  // Face shading
  ctx.fillStyle = '#eec898';
  ctx.fillRect(ox-3, oy-14, 1, 3);
  ctx.fillRect(ox+2, oy-14, 1, 3);

  // Hair (front)
  ctx.fillStyle = '#885533';
  ctx.fillRect(ox-4, oy-18, 8, 3); // top
  ctx.fillRect(ox-4, oy-15, 1, 4); // left bang
  ctx.fillRect(ox+3, oy-15, 1, 4); // right bang
  // Hair highlight
  ctx.fillStyle = '#aa7744';
  ctx.fillRect(ox-2, oy-18, 3, 1);

  // Eyes
  ctx.fillStyle = '#222';
  ctx.fillRect(ox-2, oy-15, 1, 1);
  ctx.fillRect(ox+1, oy-15, 1, 1);
  // Eye shine
  ctx.fillStyle = '#fff';
  ctx.fillRect(ox-2, oy-15, 1, 1);
  ctx.fillRect(ox+1, oy-15, 1, 1);

  // Mouth
  ctx.fillStyle = '#cc8888';
  ctx.fillRect(ox-1, oy-12, 1, 1);

  // Sword (based on equipped weapon)
  var eqW = G.eq.w;
  var swordColor = '#aaaacc'; // default steel
  var swordLen = 10;
  if (eqW) {
    var wd = ITEMS[eqW];
    if (wd) {
      if (wd.q === 'l') { swordColor = '#ffaa44'; swordLen = 14; }
      else if (wd.q === 'e') { swordColor = '#aa66dd'; swordLen = 12; }
      else if (wd.q === 'u') { swordColor = '#66aaff'; swordLen = 11; }
    }
  }
  // Sword blade
  ctx.fillStyle = swordColor;
  ctx.fillRect(ox+5*face, oy-10-swordLen+2, 1, swordLen);
  // Sword tip
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(ox+5*face, oy-10-swordLen+1, 1, 1);
  // Sword guard
  ctx.fillStyle = '#885533';
  ctx.fillRect(ox+(3)*face, oy-4, 5, 1);
  // Sword grip
  ctx.fillStyle = '#553311';
  ctx.fillRect(ox+5*face, oy-4, 1, 3);

  // Shield (if equipped)
  if (G.eq.s) {
    ctx.fillStyle = '#667788';
    ctx.fillRect(ox-7*face, oy-9, 3, 5);
    ctx.fillStyle = '#8899aa';
    ctx.fillRect(ox-6*face, oy-8, 1, 3);
  }

  // Helmet (if equipped - show crown/helm on top)
  if (G.eq.h) {
    var hd = ITEMS[G.eq.h];
    if (hd && hd.q === 'l') {
      ctx.fillStyle = '#ffcc44'; // golden crown
      ctx.fillRect(ox-3, oy-19, 6, 2);
      ctx.fillRect(ox-2, oy-20, 1, 1);
      ctx.fillRect(ox, oy-20, 1, 1);
      ctx.fillRect(ox+2, oy-20, 1, 1);
    } else {
      ctx.fillStyle = '#667788'; // iron helm
      ctx.fillRect(ox-4, oy-19, 8, 2);
    }
  }

  // Draw particles
  drawParticles();

  // ── Radial vignette ───────────────────────────────────────
  var vr = (G.vis + G.visBonus) * TW * 0.7;
  var fog = ctx.createRadialGradient(psx, psy, vr*0.4, psx, psy, vr);
  fog.addColorStop(0, 'rgba(0,0,0,0)');
  fog.addColorStop(0.7, 'rgba(0,0,0,0)');
  fog.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = fog;
  ctx.fillRect(0, 0, cw, ch);

  // Outer vignette
  var vig = ctx.createRadialGradient(cw/2, ch/2, cw*0.3, cw/2, ch/2, cw*0.65);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, cw, ch);
}

// ═══════════════════════════════════════════════════════════════
//  MINIMAP
// ═══════════════════════════════════════════════════════════════
function renderMinimap() {
  if (!G || !G.maze) return;
  if (!mmCv) { mmCv = document.getElementById('mm'); if (!mmCv) return; mmCtx = mmCv.getContext('2d'); }
  var m = G.maze, f = G.fog;
  var scale = Math.min(100/m.w, 100/m.h);
  mmCv.width = Math.ceil(m.w * scale);
  mmCv.height = Math.ceil(m.h * scale);
  mmCtx.fillStyle = '#000';
  mmCtx.fillRect(0, 0, mmCv.width, mmCv.height);

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
      } else {
        mmCtx.fillStyle = rev===2 ? '#665544' : '#332211';
      }
      mmCtx.fillRect(x*scale, y*scale, Math.ceil(scale), Math.ceil(scale));
    }
  }

  // Monsters on minimap
  G.mons.forEach(function(mon) {
    if (!mon.alive) return;
    if (f[mon.y] && f[mon.y][mon.x] === 2) {
      mmCtx.fillStyle = mon.tp==='b' ? '#ff3333' : mon.tp==='e' ? '#ffaa33' : '#cc4444';
      mmCtx.fillRect(mon.x*scale-0.5, mon.y*scale-0.5, Math.ceil(scale)+1, Math.ceil(scale)+1);
    }
  });

  // Player
  mmCtx.fillStyle = '#44ff44';
  mmCtx.fillRect(G.px*scale-1, G.py*scale-1, Math.ceil(scale)+2, Math.ceil(scale)+2);
}

// ═══════════════════════════════════════════════════════════════
//  HUD
// ═══════════════════════════════════════════════════════════════
function uHUD() {
  if (!G) return;
  var hpPct = Math.max(0, G.hp/totalMhp()*100);
  var hunPct = Math.max(0, G.hunger);
  var thiPct = Math.max(0, G.thirst);
  var xpNeed = Math.floor(20*Math.pow(1.5,G.lv-1));
  var xpPct = Math.min(100, G.xp/xpNeed*100);

  document.getElementById('hud').innerHTML =
    '<div class="hud-left">'
    +'<div class="hud-title">DARKNESS SURVIVAL</div>'
    +'<div class="hud-floor">F'+G.floor+' <span class="hud-toexit">TO EXIT: '+G.toExit+'</span></div>'
    +'</div>'
    +'<div class="hud-center">'
    +'<div class="hud-hp-row">'
    +'<div class="hud-bar-wrap"><div class="hud-bar hp-bar" style="width:'+hpPct+'%"></div></div>'
    +'<span class="hud-hp-text">'+G.hp+'/'+totalMhp()+'</span>'
    +'</div>'
    +'<div class="hud-stat-row">'
    +'<span class="hud-stat hunger">🍖'+Math.round(hunPct)+'%</span>'
    +'<span class="hud-stat thirst">💧'+Math.round(thiPct)+'%</span>'
    +'<span class="hud-stat">🌡️'+G.temp.toFixed(0)+'°</span>'
    +'</div>'
    +'<div class="hud-xp-row">'
    +'<div class="hud-bar-wrap xp-wrap"><div class="hud-bar xp-bar" style="width:'+xpPct+'%"></div></div>'
    +'<span class="hud-xp-text">Lv.'+G.lv+'</span>'
    +'</div>'
    +'</div>'
    +'<div class="hud-right">'
    +'<div class="hud-gold">💰 '+G.gold+'</div>'
    +'<div class="hud-kills">⚔ '+G.kills+'</div>'
    +'</div>';

  // Diary
  document.getElementById('diary').innerHTML = G.diary.slice(-8).map(d =>
    '<div class="diary-entry">'+d+'</div>'
  ).join('');

  // Toast
  if (G.toastTimer > 0) {
    G.toastTimer--;
    document.getElementById('toast').style.display = 'block';
    document.getElementById('toast').textContent = G.toastMsg;
  } else {
    document.getElementById('toast').style.display = 'none';
  }
}

function toast(msg) {
  G.toastMsg = msg;
  G.toastTimer = 90;
}

// ═══════════════════════════════════════════════════════════════
//  UI PANELS
// ═══════════════════════════════════════════════════════════════

// ── Inventory ───────────────────────────────────────────────
function openInv() {
  G.state = 'inventory';
  document.getElementById('im').classList.add('on');
  refreshInv();
}
function closeInv() {
  G.state = 'play';
  document.getElementById('im').classList.remove('on');
}
function refreshInv() {
  var g = document.getElementById('ig'), h = '';
  for (var i=0; i<24; i++) {
    var it = G.inv[i];
    if (it) {
      var d = ITEMS[it.id];
      var qClass = d ? (d.q==='c'?'q-c':d.q==='u'?'q-u':d.q==='e'?'q-e':d.q==='l'?'q-l':'q-c') : 'q-c';
      h += '<div class="inv-slot '+qClass+'" onclick="selectInvItem('+i+')">'+(d?d.icon:'?')+(it.n>1?'<span class="inv-count">'+it.n+'</span>':'')+'</div>';
    } else {
      h += '<div class="inv-slot"></div>';
    }
  }
  g.innerHTML = h;

  // Equipment slots
  var eqH = '<div class="eq-row">';
  Object.keys(EQ_SLOTS).forEach(function(slot) {
    var id = G.eq[slot], d = id ? ITEMS[id] : null;
    eqH += '<div class="eq-slot-wrap"><div class="eq-slot" onclick="unequipItem(\''+slot+'\')" title="'+EQ_SLOTS[slot]+'">'+(d?'<span class="eq-icon">'+d.icon+'</span>':'<span class="eq-placeholder">'+EQ_SLOT_ICONS[slot]+'</span>')+'</div><div class="eq-label">'+EQ_SLOTS[slot]+'</div></div>';
  });
  eqH += '</div>';
  document.getElementById('eqRow').innerHTML = eqH;

  document.getElementById('id').style.display = 'none';
  document.getElementById('bE').style.display = 'none';
  document.getElementById('bU').style.display = 'none';
  document.getElementById('bD').style.display = 'none';
}

function selectInvItem(i) {
  G.invSel = i;
  var it = G.inv[i]; if (!it) return;
  var d = ITEMS[it.id]; if (!d) return;
  var qc = d.q==='c'?'#aaa':d.q==='u'?'#4c4':d.q==='e'?'#a4d':d.q==='l'?'#fa2':'#aaa';
  var typeName = EQ_SLOTS[Object.keys(EQ_TYPE_MAP).find(k=>EQ_TYPE_MAP[k]===d.type)] || 'Consumable';
  var h = '<div class="item-name" style="color:'+qc+'">'+d.icon+' '+d.name+'</div>';
  h += '<div class="item-type">'+typeName+' x'+it.n+'</div>';
  if (d.st) {
    var stats = [];
    Object.keys(d.st).forEach(k => stats.push(k.toUpperCase()+' +'+d.st[k]));
    h += '<div class="item-stats">'+stats.join('  ')+'</div>';
  }
  if (d.ef) {
    var effs = [];
    if (d.ef.heal) effs.push('HP+'+d.ef.heal);
    if (d.ef.hunger) effs.push('Hunger+'+d.ef.hunger);
    if (d.ef.thirst) effs.push('Thirst+'+d.ef.thirst);
    if (d.ef.temp) effs.push('Temp+'+d.ef.temp);
    if (d.ef.vision) effs.push('Vision+'+d.ef.vision);
    if (d.ef.damage) effs.push('Damage+'+d.ef.damage);
    if (effs.length) h += '<div class="item-eff">'+effs.join('  ')+'</div>';
  }
  document.getElementById('id').innerHTML = h;
  document.getElementById('id').style.display = 'block';
  document.getElementById('bE').style.display = (d.type==='w'||d.type==='a'||d.type==='h'||d.type==='s'||d.type==='b'||d.type==='r'||d.type==='n'||d.type==='l') ? 'inline-block' : 'none';
  document.getElementById('bU').style.display = d.type==='c' ? 'inline-block' : 'none';
  document.getElementById('bD').style.display = 'inline-block';
  refreshInv();
}
function doEquip() {
  if (G.invSel<0) return;
  var it = G.inv[G.invSel]; if (!it) return;
  equipItem(it.id); G.invSel = -1; refreshInv(); uHUD();
}
function doUse() {
  if (G.invSel<0) return;
  useItem(G.invSel); G.invSel = -1; refreshInv(); uHUD();
}
function doDrop() {
  if (G.invSel<0) return;
  var it = G.inv[G.invSel]; if (!it) return;
  remItem(it.id, 1); G.invSel = -1; refreshInv();
}

// ── Crafting ────────────────────────────────────────────────
function openCraft() {
  G.state = 'crafting';
  document.getElementById('crm').classList.add('on');
  refreshCraft();
}
function closeCraft() {
  G.state = 'play';
  document.getElementById('crm').classList.remove('on');
}
function refreshCraft() {
  var recipes = RECIPES.filter(r => G.unlocked.has(r.id));
  var h = '';
  recipes.forEach(function(r, i) {
    var d = ITEMS[r.res];
    var can = canCraft(r);
    h += '<div class="craft-item'+(G.craftSel===i?' craft-sel':'')+'" onclick="selectCraft('+i+')">'
      +'<span class="craft-icon">'+(d?d.icon:'?')+'</span>'
      +'<span class="craft-name">'+(d?d.name:r.res)+'</span>'
      +'<span class="craft-status">'+(can?'✅':'❌')+'</span></div>';
  });
  if (!recipes.length) h = '<div class="craft-empty">No recipes unlocked</div>';
  document.getElementById('rl').innerHTML = h;

  if (G.craftSel >= 0 && G.craftSel < recipes.length) {
    var r = recipes[G.craftSel], d = ITEMS[r.res];
    var dh = '<div class="craft-detail-name">'+(d?d.name:r.res)+'</div>';
    dh += '<div class="craft-mats">Materials:</div>';
    r.mt.forEach(function(m) {
      var md = ITEMS[m.id], have = countItem(m.id), ok = have >= m.n;
      dh += '<div class="craft-mat">'+(ok?'✅':'❌')+' '+(md?md.name:m.id)+' x'+m.n+' (have:'+have+')</div>';
    });
    dh += '<div class="craft-result">Result: '+(d?d.name:r.res)+'</div>';
    document.getElementById('rd').innerHTML = dh;
    document.getElementById('rd').style.display = 'block';
    document.getElementById('bC').style.display = canCraft(r) ? 'inline-block' : 'none';
  } else {
    document.getElementById('rd').style.display = 'none';
    document.getElementById('bC').style.display = 'none';
  }
}
function selectCraft(i) { G.craftSel = i; refreshCraft(); }
function doCraftAction() {
  var recipes = RECIPES.filter(r => G.unlocked.has(r.id));
  var r = recipes[G.craftSel]; if (!r) return;
  doCraft(r); refreshCraft(); uHUD();
}

// ── Shop ────────────────────────────────────────────────────
function openShop() {
  G.state = 'shop';
  document.getElementById('sm').classList.add('on');
  refreshShop();
}
function closeShop() {
  G.state = 'play';
  document.getElementById('sm').classList.remove('on');
}
function refreshShop() {
  document.getElementById('sGold').textContent = G.gold;
  var h = '';
  SHOP_ITEMS.forEach(function(si, i) {
    var d = ITEMS[si.id]; if (!d) return;
    var can = G.gold >= si.p;
    h += '<div class="shop-item">'
      +'<span class="shop-icon">'+d.icon+'</span>'
      +'<span class="shop-name">'+d.name+'</span>'
      +'<span class="shop-price">💰'+si.p+'</span>'
      +(can?'<button class="shop-buy-btn" onclick="shopBuy('+i+');refreshShop();uHUD()">Buy</button>'
        :'<span class="shop-no">-</span>')
      +'</div>';
  });
  document.getElementById('sl2').innerHTML = h;
}

// ── Stats ───────────────────────────────────────────────────
function openStats() {
  G.state = 'stats';
  document.getElementById('stm').classList.add('on');
  refreshStats();
}
function closeStats() {
  G.state = 'play';
  document.getElementById('stm').classList.remove('on');
}
function refreshStats() {
  var xpNeed = Math.floor(20*Math.pow(1.5,G.lv-1));
  var es = eqStats();
  var h = '<div class="stats-grid">'
    +'<div class="stat-row"><span class="stat-label">Level</span><span class="stat-val">Lv.'+G.lv+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">HP</span><span class="stat-val">'+G.hp+'/'+totalMhp()+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">ATK</span><span class="stat-val">'+G.atk+' (+'+es.atk+')</span></div>'
    +'<div class="stat-row"><span class="stat-label">DEF</span><span class="stat-val">'+G.def+' (+'+es.def+')</span></div>'
    +'<div class="stat-row"><span class="stat-label">EXP</span><span class="stat-val">'+G.xp+'/'+xpNeed+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">Hunger</span><span class="stat-val">'+Math.round(G.hunger)+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">Thirst</span><span class="stat-val">'+Math.round(G.thirst)+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">Temp</span><span class="stat-val">'+G.temp.toFixed(1)+'°C</span></div>'
    +'<div class="stat-row"><span class="stat-label">Floor</span><span class="stat-val">'+G.floor+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">Kills</span><span class="stat-val">'+G.kills+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">Days</span><span class="stat-val">'+G.dayCount+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">Gold</span><span class="stat-val">'+G.gold+'</span></div>'
    +'</div>';

  // AP allocation
  if (G.ap > 0) {
    h += '<div class="ap-section"><div class="ap-title">Bonus Points: '+G.ap+'</div>'
      +'<div class="ap-grid">'
      +'<div class="ap-stat"><span>STR: '+G.stats.str+'</span><button class="ap-btn" onclick="allocAP(\'str\');refreshStats()">+</button></div>'
      +'<div class="ap-stat"><span>DEX: '+G.stats.dex+'</span><button class="ap-btn" onclick="allocAP(\'dex\');refreshStats()">+</button></div>'
      +'<div class="ap-stat"><span>VIT: '+G.stats.vit+'</span><button class="ap-btn" onclick="allocAP(\'vit\');refreshStats()">+</button></div>'
      +'<div class="ap-stat"><span>INT: '+G.stats.int+'</span><button class="ap-btn" onclick="allocAP(\'int\');refreshStats()">+</button></div>'
      +'<div class="ap-stat"><span>LUK: '+G.stats.luk+'</span><button class="ap-btn" onclick="allocAP(\'luk\');refreshStats()">+</button></div>'
      +'</div></div>';
  } else {
    h += '<div class="ap-section"><div class="ap-title">Attributes</div>'
      +'<div class="ap-grid readonly">'
      +'<div class="ap-stat"><span>STR: '+G.stats.str+'</span></div>'
      +'<div class="ap-stat"><span>DEX: '+G.stats.dex+'</span></div>'
      +'<div class="ap-stat"><span>VIT: '+G.stats.vit+'</span></div>'
      +'<div class="ap-stat"><span>INT: '+G.stats.int+'</span></div>'
      +'<div class="ap-stat"><span>LUK: '+G.stats.luk+'</span></div>'
      +'</div></div>';
  }
  document.getElementById('sg2').innerHTML = h;
}

// ── Achievements ────────────────────────────────────────────
function openAch() {
  G.state = 'achievements';
  document.getElementById('am').classList.add('on');
  var h = '';
  ACH_DEFS.forEach(function(a) {
    var done = G.achievements.has(a.id);
    h += '<div class="ach-item'+(done?' ach-done':'')+'">'
      +'<span class="ach-icon">'+(done?'🏆':'🔒')+'</span>'
      +'<span class="ach-name">'+a.name+'</span>'
      +'<span class="ach-desc">'+a.desc+'</span>'
      +(done?'<span class="ach-check">✓</span>':'')
      +'</div>';
  });
  document.getElementById('al').innerHTML = h;
}
function closeAch() {
  G.state = 'play';
  document.getElementById('am').classList.remove('on');
}

// ── Settings ────────────────────────────────────────────────
function openSettings() {
  G.state = 'settings';
  document.getElementById('setm').classList.add('on');
  refreshSettings();
}
function closeSettings() {
  G.state = 'play';
  document.getElementById('setm').classList.remove('on');
}
function refreshSettings() {
  var h = '<div class="settings-grid">'
    +'<div class="setting-row"><span>Music</span><button class="toggle-btn'+(G.settings.music?' on':'')+'" onclick="G.settings.music=!G.settings.music;refreshSettings()">'+(G.settings.music?'ON':'OFF')+'</button></div>'
    +'<div class="setting-row"><span>Sound</span><button class="toggle-btn'+(G.settings.sound?' on':'')+'" onclick="G.settings.sound=!G.settings.sound;refreshSettings()">'+(G.settings.sound?'ON':'OFF')+'</button></div>'
    +'<div class="setting-row"><span>Difficulty</span><select class="setting-select" onchange="G.settings.difficulty=this.value"><option'+(G.settings.difficulty==='EASY'?' selected':'')+'>EASY</option><option'+(G.settings.difficulty==='NORMAL'?' selected':'')+'>NORMAL</option><option'+(G.settings.difficulty==='HARD'?' selected':'')+'>HARD</option></select></div>'
    +'<div class="setting-row"><span>Monster HP</span><button class="toggle-btn'+(G.settings.monHP?' on':'')+'" onclick="G.settings.monHP=!G.settings.monHP;refreshSettings()">'+(G.settings.monHP?'ON':'OFF')+'</button></div>'
    +'<div class="setting-row"><span>Gold Popup</span><button class="toggle-btn'+(G.settings.goldPop?' on':'')+'" onclick="G.settings.goldPop=!G.settings.goldPop;refreshSettings()">'+(G.settings.goldPop?'ON':'OFF')+'</button></div>'
    +'<div class="setting-row"><span>Language</span><select class="setting-select" onchange="G.settings.lang=this.value"><option'+(G.settings.lang==='EN'?' selected':'')+'>EN</option><option'+(G.settings.lang==='KO'?' selected':'')+'>KO</option><option'+(G.settings.lang==='ZH'?' selected':'')+'>ZH</option><option'+(G.settings.lang==='JA'?' selected':'')+'>JA</option></select></div>'
    +'</div>';
  document.getElementById('settingsContent').innerHTML = h;
}

// ── Help ────────────────────────────────────────────────────
function openHelp() {
  G.state = 'help';
  document.getElementById('helpm').classList.add('on');
}
function closeHelp() {
  G.state = 'play';
  document.getElementById('helpm').classList.remove('on');
}

// ── Minimap Toggle ──────────────────────────────────────────
var mapVisible = true;
function toggleMap() {
  mapVisible = !mapVisible;
  var mm = document.getElementById('mm');
  if (mm) mm.style.display = mapVisible ? 'block' : 'none';
  sfx('btn');
  toast(mapVisible ? 'Map ON' : 'Map OFF');
}

// ═══════════════════════════════════════════════════════════════
//  GAME FLOW
// ═══════════════════════════════════════════════════════════════
function startGame() {
  initAudio();
  G = newGame(); G.run++; G.state = 'play';
  document.getElementById('menu').classList.remove('on');
  document.getElementById('death').classList.remove('on');
  document.getElementById('gs').classList.add('on');
  initFloor(); draw(); uHUD();
}
function continueGame() {
  initAudio();
  if (!hasSave()) { toast('No save found'); return; }
  G = newGame(); load(); G.state = 'play';
  document.getElementById('menu').classList.remove('on');
  document.getElementById('gs').classList.add('on');
  initFloor(); draw(); uHUD();
}
function backToMenu() {
  document.getElementById('death').classList.remove('on');
  document.getElementById('gs').classList.remove('on');
  document.getElementById('menu').classList.add('on');
  checkSaveBtn();
}
function checkSaveBtn() {
  document.getElementById('cb').style.display = hasSave() ? 'block' : 'none';
}

// ═══════════════════════════════════════════════════════════════
//  INPUT HANDLING
// ═══════════════════════════════════════════════════════════════
function bindInput() {
  document.addEventListener('keydown', function(e) {
    if (!G) return;
    // Combat hotkeys
    if (G.combat) {
      if (e.key==='1') { e.preventDefault(); combatAtk(); }
      if (e.key==='2') { e.preventDefault(); combatPower(); }
      if (e.key==='3') { e.preventDefault(); combatDefend(); }
      if (e.key==='4') { e.preventDefault(); combatFlee(); }
      return;
    }
    if (G.state !== 'play') {
      if (e.key==='Escape') {
        closeInv(); closeCraft(); closeShop(); closeStats(); closeAch(); closeSettings(); closeHelp();
      }
      return;
    }
    if (e.key==='ArrowUp'||e.key==='w') mv(0,-1);
    if (e.key==='ArrowDown'||e.key==='s') mv(0,1);
    if (e.key==='ArrowLeft'||e.key==='a') mv(-1,0);
    if (e.key==='ArrowRight'||e.key==='d') mv(1,0);
    if (e.key==='i') openInv();
    if (e.key==='c') openCraft();
    if (e.key==='Escape') {
      closeInv(); closeCraft(); closeShop(); closeStats(); closeAch(); closeSettings(); closeHelp();
    }
  });

  // Touch/click on canvas to move
  var ts = null;
  cv.addEventListener('touchstart', function(e) {
    ts = {x:e.touches[0].clientX, y:e.touches[0].clientY};
  });
  cv.addEventListener('touchend', function(e) {
    if (!ts || (G && G.combat)) return;
    var dx = e.changedTouches[0].clientX - ts.x;
    var dy = e.changedTouches[0].clientY - ts.y;
    if (Math.abs(dx)<20 && Math.abs(dy)<20) return;
    if (Math.abs(dx) > Math.abs(dy)) mv(dx>0?1:-1, 0);
    else mv(0, dy>0?1:-1);
    ts = null;
  });

  // Virtual Joystick
  var joyBase = document.getElementById('joy-base');
  var joyKnob = document.getElementById('joy-knob');
  if (joyBase && joyKnob) {
    var joyActive = false, joyCX = 0, joyCY = 0, joyTmr = null, lastJoyDir = null;
    var joyRadius = 36; // max knob travel

    function joyStart(cx, cy) {
      joyActive = true;
      var rect = joyBase.getBoundingClientRect();
      joyCX = rect.left + rect.width/2;
      joyCY = rect.top + rect.height/2;
      joyKnob.classList.add('active');
    }
    function joyMove(cx, cy) {
      if (!joyActive) return;
      var dx = cx - joyCX, dy = cy - joyCY;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > joyRadius) { dx = dx/dist*joyRadius; dy = dy/dist*joyRadius; }
      joyKnob.style.left = 'calc(50% + '+dx+'px)';
      joyKnob.style.top = 'calc(50% + '+dy+'px)';

      // Determine direction (8-way deadzone)
      if (dist < 12) { lastJoyDir = null; return; }
      var angle = Math.atan2(dy, dx) * 180 / Math.PI;
      var mDX = 0, mDY = 0;
      if (angle >= -22.5 && angle < 22.5) { mDX=1; mDY=0; }
      else if (angle >= 22.5 && angle < 67.5) { mDX=1; mDY=1; }
      else if (angle >= 67.5 && angle < 112.5) { mDX=0; mDY=1; }
      else if (angle >= 112.5 && angle < 157.5) { mDX=-1; mDY=1; }
      else if (angle >= -67.5 && angle < -22.5) { mDX=1; mDY=-1; }
      else if (angle >= -112.5 && angle < -67.5) { mDX=0; mDY=-1; }
      else if (angle >= -157.5 && angle < -112.5) { mDX=-1; mDY=-1; }
      else { mDX=-1; mDY=0; }

      var key = mDX+','+mDY;
      if (key !== lastJoyDir) {
        lastJoyDir = key;
        clearInterval(joyTmr);
        if (G && !G.combat && G.state==='play') mv(mDX, mDY);
        joyTmr = setInterval(function() { if (G && !G.combat && G.state==='play') mv(mDX, mDY); }, 150);
      }
    }
    function joyEnd() {
      joyActive = false; lastJoyDir = null;
      clearInterval(joyTmr);
      joyKnob.classList.remove('active');
      joyKnob.style.left = '50%'; joyKnob.style.top = '50%';
    }

    joyBase.addEventListener('touchstart', function(e) { e.preventDefault(); joyStart(e.touches[0].clientX, e.touches[0].clientY); });
    document.addEventListener('touchmove', function(e) { if (joyActive) { e.preventDefault(); joyMove(e.touches[0].clientX, e.touches[0].clientY); } }, {passive:false});
    document.addEventListener('touchend', function() { if (joyActive) joyEnd(); });
    document.addEventListener('touchcancel', function() { if (joyActive) joyEnd(); });

    // Mouse fallback for testing
    joyBase.addEventListener('mousedown', function(e) { e.preventDefault(); joyStart(e.clientX, e.clientY); });
    document.addEventListener('mousemove', function(e) { if (joyActive) joyMove(e.clientX, e.clientY); });
    document.addEventListener('mouseup', function() { if (joyActive) joyEnd(); });
  }
}

// ═══════════════════════════════════════════════════════════════
//  GAME LOOP
// ═══════════════════════════════════════════════════════════════
function draw() {
  if (!cv) { cv = document.getElementById('cv'); ctx = cv.getContext('2d'); }
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  time++;
  render();
}

function gameLoop() {
  if (G && G.state === 'play') {
    updateParticles();
    draw();
    if (time % 10 === 0) renderMinimap(); // update minimap every 10 frames
    uHUD();
  } else if (G) {
    updateParticles();
  }
  requestAnimationFrame(gameLoop);
}

// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════
window.addEventListener('load', function() {
  cv = document.getElementById('cv');
  ctx = cv.getContext('2d');
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  window.addEventListener('resize', function() {
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
  });
  bindInput();
  checkSaveBtn();
  gameLoop();
});
