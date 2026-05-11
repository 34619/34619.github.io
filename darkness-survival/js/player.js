// ═══════════════════════════════════════════════════════════════
//  player.js — Status Effects, Equipment, Level Up, AP, Achievements
// ═══════════════════════════════════════════════════════════════
window.DS = window.DS || {};

// ═══════════════════════════════════════════════════════════════
//  ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════
DS.ACH_DEFS = [
  {id:'explorer',name:'Explorer',desc:'Clear floor 1',reward:'+5 Max HP',ck:()=>G.floor>1,rw:()=>{G.mhp+=5;G.hp+=5;}},
  {id:'collector',name:'Collector',desc:'Pick up 50 items',reward:'+1 VIT',ck:()=>G.itemsCollected>=50,rw:()=>{G.stats.vit++;G.def++;}},
  {id:'slayer',name:'Centurion',desc:'Kill 100 enemies',reward:'+3 ATK',ck:()=>G.kills>=100,rw:()=>{G.atk+=3;}},
  {id:'crafter',name:'Master Crafter',desc:'Craft 20 times',reward:'+1 STR',ck:()=>G.crafts>=20,rw:()=>{G.stats.str++;G.atk+=1;}},
  {id:'survivor',name:'Survivor',desc:'Reach floor 10',reward:'+20 Max HP',ck:()=>G.floor>=10,rw:()=>{G.mhp+=20;G.hp+=20;}},
  {id:'boss_killer',name:'Boss Slayer',desc:'Defeat a boss',reward:'+5 ATK',ck:()=>G.bossKills>=1,rw:()=>{G.atk+=5;}},
  {id:'lv5',name:'Level 5',desc:'Reach level 5',reward:'+2 AP',ck:()=>G.lv>=5,rw:()=>{G.ap+=2;}},
  {id:'lv10',name:'Level 10',desc:'Reach level 10',reward:'+5 AP',ck:()=>G.lv>=10,rw:()=>{G.ap+=5;}},
  {id:'rich',name:'Rich',desc:'Accumulate 500 gold',reward:'+1 LUK',ck:()=>G.gold>=500,rw:()=>{G.stats.luk++;}},
  {id:'hoarder',name:'Hoarder',desc:'Fill 20 inventory slots',reward:'+10 gold/run',ck:()=>G.inv.length>=20,rw:()=>{G.gold+=10;}},
  {id:'all_eq',name:'Fully Geared',desc:'Equip all 8 slots',reward:'+2 DEF',ck:()=>{var c=0;Object.keys(G.eq).forEach(s=>{if(G.eq[s])c++});return c>=8;},rw:()=>{G.def+=2;}},
  {id:'floor20',name:'Deep Diver',desc:'Reach floor 20',reward:'+30 Max HP',ck:()=>G.floor>=20,rw:()=>{G.mhp+=30;G.hp+=30;}},
  {id:'kills500',name:'Exterminator',desc:'Kill 500 enemies',reward:'+8 ATK',ck:()=>G.kills>=500,rw:()=>{G.atk+=8;}},
  {id:'lv20',name:'Veteran',desc:'Reach level 20',reward:'+3 all stats',ck:()=>G.lv>=20,rw:()=>{['str','dex','vit','int','luk'].forEach(s=>G.stats[s]+=3);}},
  {id:'boss3',name:'Lord Slayer',desc:'Defeat 3 bosses',reward:'+10 ATK +10 DEF',ck:()=>G.bossKills>=3,rw:()=>{G.atk+=10;G.def+=10;}},
  {id:'speed',name:'Speed Runner',desc:'Reach floor 5 on day 3',reward:'+3 DEX',ck:()=>G.floor>=5&&G.dayCount<=6,rw:()=>{G.stats.dex+=3;}},
  {id:'gourmet',name:'Gourmet',desc:'Use 30 food items',reward:'+20 Max HP',ck:()=>G.foodUsed>=30,rw:()=>{G.mhp+=20;G.hp+=20;}},
  {id:'alchemist',name:'Alchemist',desc:'Craft 10 potions',reward:'+2 INT',ck:()=>G.potionsCrafted>=10,rw:()=>{G.stats.int+=2;}},
  {id:'diamond',name:'Diamond Hunter',desc:'Collect 10 diamonds',reward:'+5 all stats',ck:()=>(G.diamond||0)>=10,rw:()=>{['str','dex','vit','int','luk'].forEach(s=>G.stats[s]+=5);}},
  {id:'floor30',name:'Abyssal Diver',desc:'Reach floor 30',reward:'+50 Max HP',ck:()=>G.floor>=30,rw:()=>{G.mhp+=50;G.hp+=50;}},
  {id:'lv30',name:'Legendary',desc:'Reach level 30',reward:'+10 AP',ck:()=>G.lv>=30,rw:()=>{G.ap+=10;}},
  {id:'kills1000',name:'Reaper',desc:'Kill 1000 enemies',reward:'+15 ATK',ck:()=>G.kills>=1000,rw:()=>{G.atk+=15;}},
  {id:'rich2',name:'Tycoon',desc:'Accumulate 2000 gold',reward:'+3 LUK',ck:()=>G.gold>=2000,rw:()=>{G.stats.luk+=3;}},
  {id:'boss5',name:'Boss Conqueror',desc:'Defeat 5 bosses',reward:'+15 ATK +15 DEF',ck:()=>G.bossKills>=5,rw:()=>{G.atk+=15;G.def+=15;}},
  {id:'scroll_user',name:'Scroll Reader',desc:'Use 10 scrolls',reward:'+2 INT',ck:()=>(G.scrollsUsed||0)>=10,rw:()=>{G.stats.int+=2;}},
  {id:'pet_summon',name:'Beast Tamer',desc:'Summon a pet',reward:'+5 Max HP',ck:()=>G.pet!==null,rw:()=>{G.mhp+=5;G.hp+=5;}},
  {id:'trap_survive',name:'Trap Survivor',desc:'Survive 5 traps',reward:'+2 DEX +2 VIT',ck:()=>(G.trapsHit||0)>=5,rw:()=>{G.stats.dex+=2;G.stats.vit+=2;}},
  {id:'enchanter',name:'Enchanter',desc:'Enchant 3 items',reward:'+3 ATK +3 DEF',ck:()=>(G.itemsEnchanted||0)>=3,rw:()=>{G.atk+=3;G.def+=3;}}
];

// ═══════════════════════════════════════════════════════════════
//  STATUS EFFECT SYSTEM
// ═══════════════════════════════════════════════════════════════
DS.STATUS_TYPES = {
  burn:  {icon:'🔥', name:'Burn', name_ko:'灼烧', color:'#ff6622', dmgPerTick:3, maxTicks:5},
  freeze:{icon:'❄️', name:'Freeze', name_ko:'冰冻', color:'#44aaff', maxTicks:2, visionPenalty:2},
  stun:  {icon:'💫', name:'Stun', name_ko:'眩晕', color:'#ffcc00', maxTicks:1},
  bleed: {icon:'🩸', name:'Bleed', name_ko:'流血', color:'#cc2222', dmgPerTick:2, maxTicks:4},
  blind: {icon:'🌑', name:'Blind', name_ko:'失明', color:'#666666', maxTicks:5, visionReduction:1.5}
};

DS.addStatusEffect = function addStatusEffect(type, ticks, source) {
  if (!G || !G.statusEffects) return;
  var def = DS.STATUS_TYPES[type];
  if (!def) return;
  // Check if already affected - refresh ticks
  var existing = G.statusEffects.find(function(e){return e.type===type;});
  if (existing) {
    existing.ticks = Math.max(existing.ticks, ticks || def.maxTicks);
    existing.source = source || '';
  } else {
    G.statusEffects.push({type:type, ticks:ticks||def.maxTicks, source:source||''});
  }
  // Legacy poison compat
  if (type === 'poison') G.poison = Math.max(G.poison||0, ticks||3);
  // Log
  var lang = (G.settings && G.settings.lang) || 'EN';
  var name = (lang==='ZH'||lang==='KO') ? def.name_ko : def.name;
  G.diary.push(def.icon + ' ' + name + '!');
};

DS.hasStatusEffect = function hasStatusEffect(type) {
  if (!G || !G.statusEffects) return false;
  return G.statusEffects.some(function(e){return e.type===type;});
};

DS.getStatusTicks = function getStatusTicks(type) {
  if (!G || !G.statusEffects) return 0;
  var e = G.statusEffects.find(function(e){return e.type===type;});
  return e ? e.ticks : 0;
};

DS.removeStatusEffect = function removeStatusEffect(type) {
  if (!G || !G.statusEffects) return;
  G.statusEffects = G.statusEffects.filter(function(e){return e.type!==type;});
  if (type === 'poison') G.poison = 0;
};

DS.tickStatusEffects = function tickStatusEffects() {
  if (!G || !G.statusEffects) return;
  var toRemove = [];
  G.statusEffects.forEach(function(e){
    var def = DS.STATUS_TYPES[e.type];
    if (!def) { e.ticks--; return; }
    // Apply damage
    if (def.dmgPerTick) {
      G.hp -= def.dmgPerTick;
      G.diary.push(def.icon + ' -' + def.dmgPerTick + ' HP (' + def.name + ')');
    }
    e.ticks--;
    if (e.ticks <= 0) toRemove.push(e.type);
  });
  // Remove expired
  if (toRemove.length > 0) {
    G.statusEffects = G.statusEffects.filter(function(e){
      return toRemove.indexOf(e.type) < 0;
    });
    toRemove.forEach(function(type){
      var def = DS.STATUS_TYPES[type];
      if (def) G.diary.push(def.icon + ' ' + def.name + ' faded.');
    });
  }
  // Legacy poison compat
  var pe = G.statusEffects.find(function(e){return e.type==='poison';});
  if (pe) G.poison = pe.ticks;
  else if (G.poison > 0) {
    // Convert legacy poison to status effect
    G.statusEffects.push({type:'poison', ticks:G.poison, source:''});
  }
};

DS.isFrozen = function isFrozen() { return DS.hasStatusEffect('freeze'); };
DS.isStunned = function isStunned() { return DS.hasStatusEffect('stun'); };

DS.getVisionModifier = function getVisionModifier() {
  var mod = 0;
  if (DS.hasStatusEffect('blind')) mod -= (DS.STATUS_TYPES.blind.visionReduction || 1.5);
  if (DS.hasStatusEffect('freeze')) mod -= (DS.STATUS_TYPES.freeze.visionPenalty || 2);
  return mod;
};

// ═══════════════════════════════════════════════════════════════
//  EQUIPMENT HELPERS
// ═══════════════════════════════════════════════════════════════
DS.EQ_SLOTS = {w:'Weapon',a:'Armor',h:'Helmet',s:'Shield',b:'Boots',r:'Ring',n:'Necklace',l:'Belt'};
DS.EQ_SLOT_ICONS = {w:'⚔️',a:'👕',h:'🎩',s:'🛡️',b:'👢',r:'💍',n:'📿',l:'🪢'};
DS.EQ_TYPE_MAP = {w:'w',a:'a',h:'h',s:'s',b:'b',r:'r',n:'n',l:'l'};

DS.eqStats = function eqStats() {
  var a=0, d=0, hp=0;
  Object.keys(DS.EQ_SLOTS).forEach(slot => {
    var id = G.eq[slot];
    if (!id || !DS.ITEMS[id]) return;
    var s = DS.ITEMS[id].st;
    a += (s.atk||0); d += (s.def||0); hp += (s.hp||0);
  });
  return {atk:a, def:d, hp:hp};
};
DS.totalAtk = function totalAtk() { return G.atk + DS.eqStats().atk + Math.floor(G.stats.str/3) + DS.setBonus().atk + DS.buffBonus('atk'); };
DS.totalDef = function totalDef() { return G.def + DS.eqStats().def + Math.floor(G.stats.vit/3) + DS.setBonus().def + DS.buffBonus('def'); };
DS.totalMhp = function totalMhp() { return G.mhp + DS.eqStats().hp + G.stats.vit*2 + DS.setBonus().hp; };
DS.buffBonus = function buffBonus(stat) {
  if (!G.buffs) return 0;
  var total = 0;
  G.buffs.forEach(function(b) { if (b.stat === stat) total += b.amt; });
  return total;
};
DS.totalVis = function totalVis() { var v = G.vis + (G.visBonus||0); if (G.eq.h==='shadow_crown') v += 1; return v; };
DS.setBonus = function setBonus() {
  var b = {atk:0, def:0, hp:0};
  var eq = G.eq;
  // Shadow Set: Crown + Sash + Shadow Boots
  if ((eq.h==='shadow_crown') + (eq.l==='shadow_sash') + (eq.b==='shadow_boots') >= 2) {
    b.atk += 3; b.hp += 15;
  }
  // Bone Set: Bone Armor + Bone Necklace
  if (eq.a==='bone_armor' && eq.n==='bone_necklace') { b.def += 3; b.hp += 10; }
  // Crimson Set: Crimson Blade + Dark Hood
  if (eq.w==='crimson_blade' && eq.h==='dark_hood') { b.atk += 4; }
  // Full legendary set
  var legCount = 0;
  Object.keys(eq).forEach(function(s) { if (eq[s] && DS.ITEMS[eq[s]] && DS.ITEMS[eq[s]].q==='l') legCount++; });
  if (legCount >= 5) { b.atk += 5; b.def += 5; b.hp += 30; }
  return b;
};

DS.equipItem = function equipItem(id) {
  var d = DS.ITEMS[id]; if (!d) return;
  var slot = null;
  Object.keys(DS.EQ_TYPE_MAP).forEach(s => { if (DS.EQ_TYPE_MAP[s]===d.type) slot=s; });
  if (!slot) return;
  if (G.eq[slot]) DS.addItem(G.eq[slot]);
  G.eq[slot] = id; DS.remItem(id, 1);
  sfx('equip');
  toast(t('equipped')+' ' + d.name);
  save();
};

DS.unequipItem = function unequipItem(slot) {
  if (!G.eq[slot]) return;
  DS.addItem(G.eq[slot]); G.eq[slot] = null;
  toast(t('unequipped'));
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL UP
// ═══════════════════════════════════════════════════════════════
DS.checkLv = function checkLv() {
  var need = Math.floor(20 * Math.pow(1.5, G.lv-1));
  while (G.xp >= need) {
    G.xp -= need; G.lv++;
    G.mhp += 5; G.hp = Math.min(G.hp+5, DS.totalMhp());
    G.atk += 2; G.def += 1; G.ap += 2;
    G.diary.push(t('levelUp')+' Lv.' + G.lv);
    toast(t('levelUp')+' Lv.' + G.lv);
    sfx('levelup');
    // Floating level-up text
    var pIso = isoToScreen(G.px, G.py);
    spawnFloat(cv.width/2, cv.height/2 - 30, 'LEVEL UP!', '#ffcc44', 16);
    spawnParticles(cv.width/2, cv.height/2 - 20, '#ffcc44', 12, {spread:5, rise:2, life:30, size:2});
    save();
    need = Math.floor(20 * Math.pow(1.5, G.lv-1));
  }
};

// ═══════════════════════════════════════════════════════════════
//  STATS AP ALLOCATION
// ═══════════════════════════════════════════════════════════════
DS.allocAP = function allocAP(stat) {
  if (G.ap <= 0) return;
  G.ap--;
  G.stats[stat]++;
  if (stat==='str') G.atk += 1;
  if (stat==='vit') { G.def += 1; G.mhp += 3; }
  if (stat==='dex') G.atk += 1;
  if (stat==='int') { G.mhp += 2; G.vis += 0.2; }
};

// ═══════════════════════════════════════════════════════════════
//  ACHIEVEMENTS CHECK
// ═══════════════════════════════════════════════════════════════
DS.checkAch = function checkAch() {
  DS.ACH_DEFS.forEach(a => {
    if (G.achievements.has(a.id)) return;
    try {
      if (a.ck()) {
        G.achievements.add(a.id);
        if (a.rw) a.rw();
        G.diary.push(t('achievements')+': '+a.name+' ('+a.reward+')');
        toast('🏆 '+a.name+': '+a.reward);
        sfx('levelup'); save();
      }
    } catch(e){}
  });
};
