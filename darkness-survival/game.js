/* ============================================================
   Darkness Survival — Game Entry Point
   Bridges modules to globals, core game flow, loop & init
   ============================================================ */

// ═══════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════
var TW = 40, TH = 20, CH = 12;
var HW = TW/2, HH = TH/2;
var VISION_BASE = 3.5;
var TICK_MS = 120;

// ═══════════════════════════════════════════════════════════════
//  GLOBAL BRIDGE — Aliases for module data & functions
// ═══════════════════════════════════════════════════════════════

// Data constants (from data.js)
var FLOOR_THEMES = DS.FLOOR_THEMES;
var getFloorTheme = DS.getFloorTheme;
var TILE = DS.TILE;
var QC = DS.QC;
var QN = DS.QN;
var LANG = DS.LANG;
var t = DS.t;
var getItemName = DS.getItemName;
var getMonsterName = DS.getMonsterName;
var getDiaryEvt = DS.getDiaryEvt;
var DIARY_EVT = DS.DIARY_EVT;

// Items (from items.js)
var ITEMS = DS.ITEMS;
var RECIPES = DS.RECIPES;
var addItem = DS.addItem;
var remItem = DS.remItem;
var countItem = DS.countItem;
var canCraft = DS.canCraft;
var doCraft = DS.doCraft;
var SHOP_ITEMS = DS.SHOP_ITEMS;
var shopBuy = DS.shopBuy;
var shopSell = DS.shopSell;
var useItem = DS.useItem;

// Monsters (from monsters.js)
var MONSTERS = DS.MONSTERS;

// Player (from player.js)
var ACH_DEFS = DS.ACH_DEFS;
var STATUS_TYPES = DS.STATUS_TYPES;
var addStatusEffect = DS.addStatusEffect;
var hasStatusEffect = DS.hasStatusEffect;
var getStatusTicks = DS.getStatusTicks;
var removeStatusEffect = DS.removeStatusEffect;
var tickStatusEffects = DS.tickStatusEffects;
var isFrozen = DS.isFrozen;
var isStunned = DS.isStunned;
var getVisionModifier = DS.getVisionModifier;
var EQ_SLOTS = DS.EQ_SLOTS;
var EQ_SLOT_ICONS = DS.EQ_SLOT_ICONS;
var EQ_TYPE_MAP = DS.EQ_TYPE_MAP;
var eqStats = DS.eqStats;
var totalAtk = DS.totalAtk;
var totalDef = DS.totalDef;
var totalMhp = DS.totalMhp;
var buffBonus = DS.buffBonus;
var totalVis = DS.totalVis;
var setBonus = DS.setBonus;
var equipItem = DS.equipItem;
var unequipItem = DS.unequipItem;
var checkLv = DS.checkLv;
var allocAP = DS.allocAP;
var checkAch = DS.checkAch;
var achBonusHP = DS.achBonusHP;

// Combat (from combat.js)
var startCombat = DS.startCombat;
var showCombat = DS.showCombat;
var combatAtk = DS.combatAtk;
var combatPower = DS.combatPower;
var combatDefend = DS.combatDefend;
var combatFlee = DS.combatFlee;
var useBomb = DS.useBomb;
var combatUseItem = DS.combatUseItem;
var enemyTurn = DS.enemyTurn;
var enemyKilled = DS.enemyKilled;

// Dungeon (from dungeon.js)
var getFloorDef = DS.getFloorDef;
var genMaze = DS.genMaze;
var spawnMons = DS.spawnMons;
var spawnItems = DS.spawnItems;
var initFloor = DS.initFloor;
var revFog = DS.revFog;

// Save (from save.js)
var save = DS.save;
var load = DS.load;
var hasSave = DS.hasSave;

// Audio (from audio.js)
var initAudio = DS.initAudio;
var startBGM = DS.startBGM;
var updateBGM = DS.updateBGM;
var stopBGM = DS.stopBGM;
var sfx = DS.sfx;

// Particles (from particles.js)
var particles = DS.particles;
var screenShake = DS.screenShake;
Object.defineProperty(window, 'screenShake', {
  get: function() { return DS.screenShake; },
  set: function(v) { DS.screenShake = v; }
});
var spawnParticles = DS.spawnParticles;
var updateParticles = DS.updateParticles;
var drawParticles = DS.drawParticles;
var playerAnim = DS.playerAnim;
var floatingTexts = DS.floatingTexts;
var spawnFloat = DS.spawnFloat;
var updateFloats = DS.updateFloats;
var drawFloats = DS.drawFloats;
var playerHitTimer = DS.playerHitTimer;
Object.defineProperty(window, 'playerHitTimer', {
  get: function() { return DS.playerHitTimer; },
  set: function(v) { DS.playerHitTimer = v; }
});

// Renderer (from renderer.js)
var cv = DS.cv;
var ctx = DS.ctx;
var time = DS.time;
Object.defineProperty(window, 'cv', {
  get: function() { return DS.cv; },
  set: function(v) { DS.cv = v; }
});
Object.defineProperty(window, 'ctx', {
  get: function() { return DS.ctx; },
  set: function(v) { DS.ctx = v; }
});
Object.defineProperty(window, 'time', {
  get: function() { return DS.time; },
  set: function(v) { DS.time = v; }
});
var isoToScreen = DS.isoToScreen;
var drawIsoCube = DS.drawIsoCube;
var drawIsoFloor = DS.drawIsoFloor;
var drawIsoEntity = DS.drawIsoEntity;
var drawMonster = DS.drawMonster;
var shadeColor = DS.shadeColor;
var hexToRgb = DS.hexToRgb;
var render = DS.render;
var renderMinimap = DS.renderMinimap;
var dyingMons = DS.dyingMons;
var mmCv = DS.mmCv;
var mmCtx = DS.mmCtx;

// UI (from ui.js) — functions are also assigned to window by ui.js itself
// but we alias them here too for safety
var uHUD = DS.uHUD;
var toast = DS.toast;
var renderHotbar = DS.renderHotbar;
var generateShopItems = DS.generateShopItems;
Object.defineProperty(window, 'shopTab', {
  get: function() { return DS.shopTab; },
  set: function(v) { DS.shopTab = v; }
});

// ═══════════════════════════════════════════════════════════════
//  CHARACTER CLASSES
// ═══════════════════════════════════════════════════════════════
var CLASSES = DS.CLASSES || {
  warrior: {
    id:'warrior', name:'Warrior', name_ko:'战士', icon:'⚔️',
    desc:'High STR & VIT. Strong melee fighter.',
    desc_ko:'高力量高体质。强力近战。',
    stats:{str:8,dex:4,vit:7,int:3,luk:3},
    hp:35, atk:6, def:5,
    items:['old_dagger','old_clothes','torch','torch','bread','bread','bread']
  },
  hunter: {
    id:'hunter', name:'Hunter', name_ko:'猎人', icon:'🏹',
    desc:'High DEX. Master of ranged attacks.',
    desc_ko:'高敏捷。远程攻击大师。',
    stats:{str:4,dex:8,vit:5,int:3,luk:5},
    hp:28, atk:7, def:3,
    items:['old_dagger','old_clothes','torch','torch','torch','bread','bread','water_bottle']
  },
  thief: {
    id:'thief', name:'Thief', name_ko:'盗贼', icon:'🗡️',
    desc:'High DEX & LUK. Fast and lucky.',
    desc_ko:'高敏捷高幸运。速度快运气好。',
    stats:{str:4,dex:7,vit:4,int:3,luk:7},
    hp:25, atk:5, def:4,
    items:['old_dagger','old_clothes','torch','bread','bread','bread','bread','water_bottle','antidote']
  },
  witch: {
    id:'witch', name:'Witch', name_ko:'女巫', icon:'🔮',
    desc:'High INT. Powerful magic and items.',
    desc_ko:'高智力。强大的魔法和物品。',
    stats:{str:3,dex:4,vit:4,int:8,luk:6},
    hp:22, atk:4, def:3,
    items:['old_dagger','old_clothes','torch','bread','bread','health_potion','health_potion','herb_potion']
  },
  adventurer: {
    id:'adventurer', name:'Adventurer', name_ko:'冒险者', icon:'🧭',
    desc:'Balanced stats. Jack of all trades.',
    desc_ko:'均衡属性。样样通。',
    stats:{str:5,dex:5,vit:5,int:5,luk:5},
    hp:30, atk:5, def:4,
    items:['old_dagger','old_clothes','torch','torch','torch','bread','bread','bread','bread','bread']
  }
};

// ═══════════════════════════════════════════════════════════════
//  GAME STATE
// ═══════════════════════════════════════════════════════════════
var G = null;

function newGame(classId) {
  var cls = CLASSES[classId || 'adventurer'] || CLASSES.adventurer;
  var startInv = cls.items.map(function(id){
    return {id:id, n:1};
  });
  var stacked = {};
  startInv.forEach(function(it){
    if (!stacked[it.id]) stacked[it.id] = {id:it.id, n:0};
    stacked[it.id].n += it.n;
  });
  var inv = Object.values(stacked);
  return {
    floor:1, run:0, px:1, py:1,
    hp:cls.hp, mhp:cls.hp, atk:cls.atk, def:cls.def,
    lv:1, xp:0,
    hunger:100, thirst:100, temp:37,
    vis:VISION_BASE, visBonus:0, visTimer:0,
    gold:0, diamond:0, ap:0,
    classId:cls.id,
    stats:{str:cls.stats.str,dex:cls.stats.dex,vit:cls.stats.vit,int:cls.stats.int,luk:cls.stats.luk},
    inv:inv,
    eq:{w:null,a:null,h:null,s:null,b:null,r:null,n:null,l:null},
    maze:null, fog:null, mons:[], items:[],
    combat:null, state:'menu',
    diary:[], unlocked:new Set(RECIPES.filter(function(r){return r.ul;}).map(function(r){return r.id;})),
    kills:0, crafts:0, itemsCollected:0, bossKills:0, foodUsed:0, potionsCrafted:0,
    achievements:new Set(), dayCount:0,
    settings:{music:true,sound:true,difficulty:'EASY',monHP:false,goldPop:true,lang:'EN'},
    hotbar:[null,null,null,null],
    poison:0,
    statusEffects:[],
    stepCount:0,
    buffs:[],
    pet:null,
    scrollsUsed:0, trapsHit:0, itemsEnchanted:0,
    invSel:-1, craftSel:-1,
    toastMsg:'', toastTimer:0,
    toExit:0, score:0
  };
}

// ═══════════════════════════════════════════════════════════════
//  MOVEMENT & INTERACTION
// ═══════════════════════════════════════════════════════════════
function mv(dx, dy) {
  if (!G || G.state!=='play' || G.combat) return;
  var nx = G.px+dx, ny = G.py+dy;
  if (nx<0||nx>=G.maze.w||ny<0||ny>=G.maze.h||G.maze.grid[ny][nx]===TILE.WALL||G.maze.grid[ny][nx]===TILE.VOID) return;

  G.px = nx; G.py = ny;
  sfx('step');
  playerAnim.walkCycle++;
  if (dx !== 0) playerAnim.facing = dx > 0 ? 1 : -1;
  var r = Math.floor(totalVis());
  if (G.stepCount && (G.stepCount % 120) >= 80) r = Math.max(2, r - 1);
  revFog(nx, ny, r);

  if (G.visTimer > 0) { G.visTimer--; if (G.visTimer<=0) G.visBonus = 0; }

  var tile = G.maze.grid[ny][nx];

  // Stairs
  if (tile === TILE.STAIRS) { G.floor++; sfx('stairs'); save(); fadeIn(function(){ initFloor(); draw(); uHUD(); updateBGM(); showFloorBanner(); }); return; }

  // Resource
  if (tile === TILE.RESOURCE) {
    var rPool = ['wood','ore','herb','beast_hide','crystal_shard'];
    var ri = rPool[Math.floor(Math.random()*rPool.length)];
    addItem(ri); G.maze.grid[ny][nx] = TILE.FLOOR;
    G.diary.push(t('gathered')+' '+ITEMS[ri].name);
    sfx('pickup');
    toast('+'+ITEMS[ri].icon+' '+ITEMS[ri].name);
  }

  // Shop (skip if monster on tile)
  var monOnShop = G.mons.find(function(m){return m.alive && m.x===nx && m.y===ny;});
  if (tile === TILE.SHOP && !monOnShop) { G.state = 'shop'; openShop(); return; }

  // Trap
  if (tile === TILE.TRAP) {
    var trapDmg = Math.max(3, 3 + Math.floor(G.floor * 0.5));
    if (G.stats.dex > 8) trapDmg = Math.max(1, trapDmg - Math.floor((G.stats.dex - 8) * 0.5));
    G.hp -= trapDmg;
    G.trapsHit = (G.trapsHit||0) + 1;
    G.diary.push('💥 Stepped on a trap! -' + trapDmg + ' HP');
    sfx('hurt'); screenShake = 5; screenFlash('hit'); playerHitTimer = 15;
    spawnFloat(cv.width/2, cv.height/2, '-' + trapDmg, '#ff8844', 14);
    G.maze.grid[ny][nx] = TILE.FLOOR;
    if (G.hp <= 0) { G.hp = 0; die(); return; }
  }

  // Chest
  if (tile === TILE.CHEST) {
    var chestLoot = ['health_potion','elixir','bomb','str_potion','def_potion','lantern','scroll_teleport','scroll_reveal'];
    if (G.floor >= 5) chestLoot.push('spd_potion','shadow_dagger','power_ring','scroll_fire','scroll_enchant');
    var loot = chestLoot[Math.floor(Math.random() * chestLoot.length)];
    addItem(loot);
    var goldBonus = 10 + Math.floor(Math.random() * (10 + G.floor * 3));
    G.gold += goldBonus;
    G.diary.push('🎁 Opened a chest! Found ' + ITEMS[loot].name + ' + ' + goldBonus + 'g');
    sfx('pickup'); toast('🎁 +' + ITEMS[loot].icon + ' ' + ITEMS[loot].name + ' +💰' + goldBonus);
    spawnFloat(cv.width/2, cv.height/2 - 15, '🎁 ' + ITEMS[loot].name, '#ffcc44', 12);
    G.maze.grid[ny][nx] = TILE.FLOOR;
  }

  // Pick up items on ground
  var ii = G.items.findIndex(function(i){return i.x===nx && i.y===ny;});
  if (ii >= 0) {
    addItem(G.items[ii].id);
    sfx('pickup');
    G.diary.push(t('found')+' '+ITEMS[G.items[ii].id].name);
    toast('+'+ITEMS[G.items[ii].id].icon+' '+ITEMS[G.items[ii].id].name);
    G.items.splice(ii, 1);
  }

  // Monster collision
  var mon = G.mons.find(function(m){return m.alive && m.x===nx && m.y===ny;});
  if (mon) { startCombat(mon); return; }

  // Survival costs
  var drain = Math.min(1 + G.floor * 0.05, 1.5);
  var diffMul = G.settings.difficulty==='HARD' ? 1.4 : G.settings.difficulty==='EASY' ? 0.7 : 1;
  G.hunger = Math.max(0, G.hunger - 1.5 * drain * diffMul);
  G.thirst = Math.max(0, G.thirst - 2 * drain * diffMul);
  G.temp = Math.max(0, G.temp - 0.3 * drain * diffMul);
  if (G.hunger <= 0) { G.hp -= 2; G.diary.push(t('starving')); }
  if (G.thirst <= 0) { G.hp -= 3; G.diary.push(t('dehydrated')); }
  if (G.temp <= 0) { G.hp -= 2; G.diary.push(t('freezing')); }
  // Poison tick
  if (G.poison > 0) {
    G.hp -= 2; G.poison--;
    if (G.poison <= 0) G.diary.push('Poison faded.');
    else G.diary.push('☠️ Poison damage! (-2 HP)');
  }
  // Life Ring passive regen
  if (G.eq.r === 'life_ring' && G.hp < totalMhp()) { G.hp = Math.min(totalMhp(), G.hp + 1); }
  // Buff ticking
  if (G.buffs && G.buffs.length > 0) {
    for (var bi = G.buffs.length - 1; bi >= 0; bi--) {
      G.buffs[bi].ticks--;
      if (G.buffs[bi].ticks <= 0) {
        G.diary.push(G.buffs[bi].stat.toUpperCase() + ' buff expired.');
        G.buffs.splice(bi, 1);
      }
    }
  }
  if (G.hp <= 0) { G.hp = 0; die(); return; }

  // Monster AI
  for (var mi=0; mi<G.mons.length; mi++) {
    var m = G.mons[mi];
    if (!m.alive) continue;
    m.moveTick = (m.moveTick||0) + 1;
    if (m.moveTick < (m.spd||3)) continue;
    m.moveTick = 0;
    var dist = Math.abs(m.x-G.px) + Math.abs(m.y-G.py);

    // Ranged attack
    if (m.ranged && dist <= (m.rng||3) && dist > 1) {
      var rdmg = Math.max(1, Math.floor(m.atk * 0.7) - totalDef());
      if (G.eq.b === 'void_walkers' && Math.random() < 0.05) {
        G.diary.push(m.name + ' fires! Dodged!');
      } else {
        G.hp -= rdmg;
        G.diary.push('🔥 ' + m.name + ' attacks from range! -' + rdmg + ' HP');
        screenShake = 3; sfx('hurt'); screenFlash('hit'); playerHitTimer = 15;
        spawnFloat(cv.width/2, cv.height/2, '-' + rdmg, '#ff8844', 14);
        if (G.hp <= 0) { G.hp = 0; die(); return; }
      }
      continue;
    }

    var moved = false;
    if (dist<=5 && dist>1 && Math.random()<0.5) {
      var mdx = Math.sign(G.px-m.x), mdy = Math.sign(G.py-m.y);
      var tryMoves = [];
      if (mdx !== 0 && mdy !== 0) {
        tryMoves.push({dx:mdx,dy:0},{dx:0,dy:mdy},{dx:mdx,dy:mdy});
      } else if (mdx !== 0) {
        tryMoves.push({dx:mdx,dy:0},{dx:0,dy:1},{dx:0,dy:-1});
      } else {
        tryMoves.push({dx:0,dy:mdy},{dx:1,dy:0},{dx:-1,dy:0});
      }
      for (var ti=0; ti<tryMoves.length; ti++) {
        var nx2 = m.x+tryMoves[ti].dx, ny2 = m.y+tryMoves[ti].dy;
        if (ny2>=0 && ny2<G.maze.h && nx2>=0 && nx2<G.maze.w && G.maze.grid[ny2][nx2]!==TILE.WALL && G.maze.grid[ny2][nx2]!==TILE.VOID) {
          m.x = nx2; m.y = ny2; moved = true; break;
        }
      }
    } else if (dist > 5 && Math.random() < 0.15) {
      var wDirs = [{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];
      wDirs.sort(function(){return Math.random()-0.5;});
      for (var wi=0; wi<wDirs.length; wi++) {
        var wx = m.x+wDirs[wi].dx, wy = m.y+wDirs[wi].dy;
        if (wy>=0 && wy<G.maze.h && wx>=0 && wx<G.maze.w && G.maze.grid[wy][wx]!==TILE.WALL && G.maze.grid[wy][wx]!==TILE.VOID) {
          m.x = wx; m.y = wy; break;
        }
      }
    }
    if (m.x===G.px && m.y===G.py && m.alive) { startCombat(m); return; }
  }

  // Pet AI
  if (G.pet && G.pet.hp > 0) {
    G.pet.atkCd = Math.max(0, (G.pet.atkCd||0) - 1);
    if (G.pet.atkCd <= 0) {
      var nearMon = null, nearDist = 999;
      for (var pi=0; pi<G.mons.length; pi++) {
        var pm = G.mons[pi];
        if (!pm.alive) continue;
        var pd = Math.abs(pm.x-G.px) + Math.abs(pm.y-G.py);
        if (pd <= totalVis() + 1 && pd < nearDist) { nearMon = pm; nearDist = pd; }
      }
      if (nearMon) {
        var pDmg = G.pet.atk;
        nearMon.hp -= pDmg;
        G.pet.atkCd = 2;
        G.diary.push(G.pet.icon + ' ' + G.pet.name + ' attacks ' + nearMon.name + ' (-' + pDmg + ')');
        if (nearMon.hp <= 0) {
          nearMon.alive = false;
          dyingMons.push({x:nearMon.x, y:nearMon.y, color:nearMon.color, name:nearMon.name, timer:30, tp:nearMon.tp});
          G.xp += nearMon.xp; G.kills++;
          G.toExit = G.mons.filter(function(mm){return mm.alive;}).length;
          G.diary.push(G.pet.name + ' defeated ' + nearMon.name + '!');
          checkLv();
        }
      }
    }
    if (G.stepCount % 10 === 0 && G.pet.hp < G.pet.mhp) G.pet.hp++;
  }

  // Random diary
  if (Math.random() < 0.08) G.diary.push(getDiaryEvt());

  // Step counter & auto-save
  G.stepCount = (G.stepCount||0) + 1;
  if (G.stepCount % 50 === 0) save();

  uHUD(); checkAch();
}

// ═══════════════════════════════════════════════════════════════
//  DEATH
// ═══════════════════════════════════════════════════════════════
function die() {
  G.state = 'dead'; G.score = G.kills*10 + G.floor*50 + G.lv*20 + G.gold + (G.diamond||0)*100;
  sfx('death');
  var isNewHigh = false;
  try {
    var hs = JSON.parse(localStorage.getItem('ds_highscores') || '[]');
    hs.push({score:G.score, floor:G.floor, lv:G.lv, kills:G.kills, run:G.run, date:Date.now()});
    hs.sort(function(a,b){return b.score-a.score;});
    if (hs.length > 10) hs = hs.slice(0, 10);
    isNewHigh = hs[0].score === G.score;
    localStorage.setItem('ds_highscores', JSON.stringify(hs));
  } catch(e) {}
  fadeIn(function(){
    document.getElementById('gs').classList.remove('on');
    document.getElementById('death').classList.add('on');
    document.getElementById('dd').innerHTML =
      t('day')+' 1 — '+t('entered')+'<br>'+t('day')+' '+Math.max(1,Math.floor(G.dayCount/2))+' — '+t('whispers')+'<br>'+t('day')+' '+G.dayCount+' — '+t('fell');
    document.getElementById('ds').innerHTML =
      (isNewHigh ? '<span style="color:#ffcc22;font-size:14px">★ '+(t('newHighScore')||'NEW HIGH SCORE!')+' ★</span><br>' : '')
      +t('record')+'<br>'
      +t('reached')+': '+t('floor')+' '+G.floor+'<br>'
      +t('lv')+': '+G.lv+'<br>'
      +t('kills')+': '+G.kills+'<br>'
      +t('gold')+': '+G.gold+'<br>'
      +t('diamond')+': '+(G.diamond||0)+'<br>'
      +t('steps')+': '+(G.stepCount||0)+'<br>'
      +t('bosses')+': '+(G.bossKills||0)+'<br>'
      +(G.pet ? G.pet.icon+' '+G.pet.name+' ('+G.pet.hp+'/'+G.pet.mhp+')<br>' : '')
      +t('score')+': '+G.score+'<br>Run #'+G.run;
  });
}

// ═══════════════════════════════════════════════════════════════
//  SCREEN EFFECTS
// ═══════════════════════════════════════════════════════════════
function fadeIn(cb) {
  var fd = document.getElementById('fade');
  fd.classList.add('on');
  setTimeout(function(){ if(cb) cb(); setTimeout(function(){ fd.classList.remove('on'); }, 50); }, 400);
}
function screenFlash(type) {
  var fl = document.getElementById('flash');
  fl.className = type || 'hit';
  setTimeout(function(){ fl.className = ''; }, 120);
}
function showFloorBanner() {
  var banner = document.getElementById('floorBanner');
  var theme = getFloorTheme(G.floor);
  var themeNames = t('themes');
  var themeName = Array.isArray(themeNames) ? themeNames[Math.min(Math.floor((G.floor-1)/3), themeNames.length-1)] : '';
  banner.querySelector('.fb-floor').textContent = t('floor') + ' ' + G.floor;
  banner.querySelector('.fb-theme').textContent = themeName;
  banner.classList.add('on');
  setTimeout(function(){ banner.classList.remove('on'); }, 2000);
}

// ═══════════════════════════════════════════════════════════════
//  GAME FLOW
// ═══════════════════════════════════════════════════════════════
function startGame() {
  initAudio();
  showClassSelect();
}
function showClassSelect() {
  var modal = document.getElementById('clsModal');
  modal.classList.add('on');
  var container = document.getElementById('clsCards');
  container.innerHTML = '';
  Object.keys(CLASSES).forEach(function(key){
    var c = CLASSES[key];
    var lang = (G && G.settings && G.settings.lang) || 'EN';
    var card = document.createElement('div');
    card.className = 'cls-card';
    card.dataset.classId = key;
    var desc = (lang === 'ZH' || lang === 'KO') ? c.desc_ko : c.desc;
    var name = (lang === 'ZH' || lang === 'KO') ? c.name_ko : c.name;
    card.innerHTML = '<div class="cls-icon">'+c.icon+'</div>'
      + '<div class="cls-name">'+name+'</div>'
      + '<div class="cls-desc">'+desc+'</div>'
      + '<div class="cls-stats">'
      + '<span class="cs-str">STR:'+c.stats.str+'</span>'
      + '<span class="cs-dex">DEX:'+c.stats.dex+'</span>'
      + '<span class="cs-vit">VIT:'+c.stats.vit+'</span>'
      + '<span class="cs-int">INT:'+c.stats.int+'</span>'
      + '<span class="cs-luk">LUK:'+c.stats.luk+'</span>'
      + '</div>';
    card.onclick = function(){
      document.querySelectorAll('.cls-card').forEach(function(el){el.classList.remove('sel');});
      card.classList.add('sel');
    };
    container.appendChild(card);
  });
}
function startGameWithClass(classId) {
  document.getElementById('clsModal').classList.remove('on');
  fadeIn(function(){
    G = newGame(classId); G.run++; G.state = 'play';
    document.getElementById('menu').classList.remove('on');
    document.getElementById('death').classList.remove('on');
    document.getElementById('gs').classList.add('on');
    initFloor(); draw(); uHUD();
    startBGM();
    setTimeout(showFloorBanner, 500);
  });
}
function confirmClass() {
  var sel = document.querySelector('.cls-card.sel');
  var classId = sel ? sel.dataset.classId : 'adventurer';
  startGameWithClass(classId);
}
function continueGame() {
  initAudio();
  if (!hasSave()) { toast(t('noSave')); return; }
  fadeIn(function(){
    G = newGame(); load(); G.state = 'play';
    document.getElementById('menu').classList.remove('on');
    document.getElementById('gs').classList.add('on');
    if (G.maze && G.fog && G.mons && G.items) {
      revFog(G.px, G.py, Math.floor(totalVis()));
      G.toExit = G.mons.filter(function(m){return m.alive;}).length;
      generateShopItems();
    } else {
      initFloor();
    }
    draw(); uHUD();
    startBGM();
    setTimeout(showFloorBanner, 500);
  });
}
function backToMenu() {
  fadeIn(function(){
    document.getElementById('death').classList.remove('on');
    document.getElementById('gs').classList.remove('on');
    document.getElementById('menu').classList.add('on');
    checkSaveBtn();
  });
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
    if (G.combat) {
      if (e.key==='1') { e.preventDefault(); combatAtk(); }
      if (e.key==='2') { e.preventDefault(); combatDefend(); }
      if (e.key==='3') { e.preventDefault(); combatFlee(); }
      if (e.key==='4') { e.preventDefault(); combatPower(); }
      if (e.key==='5') { e.preventDefault(); useHotbar(0); }
      if (e.key==='6') { e.preventDefault(); useHotbar(1); }
      if (e.key==='7') { e.preventDefault(); useHotbar(2); }
      if (e.key==='8') { e.preventDefault(); useHotbar(3); }
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
    if (e.key==='5') useHotbar(0);
    if (e.key==='6') useHotbar(1);
    if (e.key==='7') useHotbar(2);
    if (e.key==='8') useHotbar(3);
    if (e.key==='Escape') {
      closeInv(); closeCraft(); closeShop(); closeStats(); closeAch(); closeSettings(); closeHelp();
    }
  });

  // D-pad buttons
  var dpadBtns = document.querySelectorAll('.dpad-btn');
  var dpadTmr = null, lastDpadKey = null;
  dpadBtns.forEach(function(btn) {
    var dx = parseInt(btn.dataset.dx) || 0;
    var dy = parseInt(btn.dataset.dy) || 0;
    function dpadStart(e) {
      e.preventDefault();
      if (G && !G.combat && G.state==='play') mv(dx, dy);
      var key = dx+','+dy;
      if (key !== lastDpadKey) {
        lastDpadKey = key;
        clearInterval(dpadTmr);
        dpadTmr = setInterval(function() { if (G && !G.combat && G.state==='play') mv(dx, dy); }, 150);
      }
    }
    function dpadEnd(e) {
      e.preventDefault();
      var key = dx+','+dy;
      if (lastDpadKey === key) { lastDpadKey = null; clearInterval(dpadTmr); }
    }
    btn.addEventListener('touchstart', dpadStart, {passive:false});
    btn.addEventListener('touchend', dpadEnd, {passive:false});
    btn.addEventListener('touchcancel', dpadEnd, {passive:false});
    btn.addEventListener('mousedown', dpadStart);
    btn.addEventListener('mouseup', dpadEnd);
    btn.addEventListener('mouseleave', dpadEnd);
  });
}

// ═══════════════════════════════════════════════════════════════
//  GAME LOOP
// ═══════════════════════════════════════════════════════════════
function draw() {
  if (!DS.cv) { DS.cv = document.getElementById('cv'); DS.ctx = DS.cv.getContext('2d'); }
  DS.cv.width = window.innerWidth;
  DS.cv.height = window.innerHeight;
  DS.time++;
  render();
}

function gameLoop() {
  if (G && G.state === 'play') {
    updateParticles();
    updateFloats();
    draw();
    if (DS.time % 10 === 0) renderMinimap();
    if (DS.time % 30 === 0) updateBGM();
    uHUD();
  } else if (G) {
    updateParticles();
    updateFloats();
  }
  requestAnimationFrame(gameLoop);
}

// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════
window.addEventListener('load', function() {
  DS.cv = document.getElementById('cv');
  DS.ctx = DS.cv.getContext('2d');
  DS.cv.width = window.innerWidth;
  DS.cv.height = window.innerHeight;
  window.addEventListener('resize', function() {
    DS.cv.width = window.innerWidth;
    DS.cv.height = window.innerHeight;
  });
  bindInput();
  checkSaveBtn();
  gameLoop();
});

// Auto-save on page close
window.addEventListener('beforeunload', function() {
  if (G && G.state === 'play') save();
});
