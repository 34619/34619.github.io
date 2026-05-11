// ═══════════════════════════════════════════════════════════════
//  items.js — Item Database, Recipes, Inventory, Crafting, Shop, Use
// ═══════════════════════════════════════════════════════════════
window.DS = window.DS || {};

// ═══════════════════════════════════════════════════════════════
//  ITEM DATABASE
// ═══════════════════════════════════════════════════════════════
DS.ITEMS = {
  // Weapons
  old_dagger:{id:'old_dagger',name:'Old Dagger',name_ko:'旧匕首',type:'w',q:'c',icon:'🗡️',stk:false,st:{atk:1}},
  rusty_sword:{id:'rusty_sword',name:'Iron Sword',name_ko:'铁剑',type:'w',q:'c',icon:'⚔️',stk:false,st:{atk:3}},
  crimson_blade:{id:'crimson_blade',name:'Crimson Blade',name_ko:'猩红之刃',type:'w',q:'e',icon:'🗡️',stk:false,st:{atk:8}},
  void_scythe:{id:'void_scythe',name:'Void Scythe',name_ko:'虚空镰刀',type:'w',q:'l',icon:'⚔️',stk:false,st:{atk:15}},
  chaos_blade:{id:'chaos_blade',name:'Chaos Blade',name_ko:'混沌之刃',type:'w',q:'l',icon:'⚔️',stk:false,st:{atk:20,hp:10}},
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
  str_potion:{id:'str_potion',name:'STR Potion',name_ko:'力量药水',type:'c',q:'u',icon:'💪',stk:true,mx:3,ef:{buff:'atk',amt:5,dur:30}},
  def_potion:{id:'def_potion',name:'DEF Potion',name_ko:'防御药水',type:'c',q:'u',icon:'🛡️',stk:true,mx:3,ef:{buff:'def',amt:5,dur:30}},
  spd_potion:{id:'spd_potion',name:'SPD Potion',name_ko:'速度药水',type:'c',q:'u',icon:'💨',stk:true,mx:3,ef:{buff:'vis',amt:2,dur:50}},
  // Scrolls
  scroll_teleport:{id:'scroll_teleport',name:'TP Scroll',name_ko:'传送卷轴',type:'c',q:'u',icon:'📜',stk:true,mx:3,ef:{scroll:'tp'}},
  scroll_reveal:{id:'scroll_reveal',name:'Map Scroll',name_ko:'地图卷轴',type:'c',q:'u',icon:'🗺️',stk:true,mx:3,ef:{scroll:'reveal'}},
  scroll_enchant:{id:'scroll_enchant',name:'Enchant Scroll',name_ko:'附魔卷轴',type:'c',q:'e',icon:'✨',stk:true,mx:2,ef:{scroll:'enchant'}},
  scroll_fire:{id:'scroll_fire',name:'Fire Scroll',name_ko:'火焰卷轴',type:'c',q:'e',icon:'🔥',stk:true,mx:2,ef:{scroll:'fire'}},
  // Pet eggs
  slime_egg:{id:'slime_egg',name:'Slime Egg',name_ko:'史莱姆蛋',type:'c',q:'u',icon:'🟢',stk:true,mx:1,ef:{pet:'slime'}},
  bat_egg:{id:'bat_egg',name:'Bat Egg',name_ko:'蝙蝠蛋',type:'c',q:'e',icon:'🟤',stk:true,mx:1,ef:{pet:'bat'}},
  skull_egg:{id:'skull_egg',name:'Skull Charm',name_ko:'骷髅护符',type:'c',q:'l',icon:'💀',stk:true,mx:1,ef:{pet:'skull'}},
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
DS.RECIPES = [
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
  {id:'r_dagger',res:'shadow_dagger',n:1,mt:[{id:'ore',n:2},{id:'monster_bone',n:2}],ul:false},
  {id:'r_chaos',res:'chaos_blade',n:1,mt:[{id:'ore',n:5},{id:'crystal_shard',n:3},{id:'monster_bone',n:3}],ul:false},
  {id:'r_elixir2',res:'elixir',n:2,mt:[{id:'herb',n:4},{id:'crystal_shard',n:3},{id:'monster_bone',n:1}],ul:false},
  {id:'r_bomb2',res:'bomb',n:3,mt:[{id:'ore',n:4},{id:'crystal_shard',n:2}],ul:false},
  {id:'r_dscale',res:'dragon_scale',n:1,mt:[{id:'beast_hide',n:5},{id:'ore',n:4},{id:'crystal_shard',n:3}],ul:false},
  {id:'r_strpot',res:'str_potion',n:1,mt:[{id:'herb',n:2},{id:'monster_bone',n:1}],ul:false},
  {id:'r_defpot',res:'def_potion',n:1,mt:[{id:'herb',n:2},{id:'ore',n:1}],ul:false},
  {id:'r_spdpot',res:'spd_potion',n:1,mt:[{id:'herb',n:1},{id:'crystal_shard',n:2}],ul:false},
  {id:'r_scrolltp',res:'scroll_teleport',n:1,mt:[{id:'crystal_shard',n:2},{id:'monster_bone',n:1}],ul:false},
  {id:'r_scrollrev',res:'scroll_reveal',n:1,mt:[{id:'crystal_shard',n:1},{id:'ore',n:1}],ul:false},
  {id:'r_scrollfire',res:'scroll_fire',n:1,mt:[{id:'crystal_shard',n:2},{id:'ore',n:2}],ul:false},
  {id:'r_scrollench',res:'scroll_enchant',n:1,mt:[{id:'crystal_shard',n:3},{id:'ore',n:2},{id:'monster_bone',n:1}],ul:false},
  {id:'r_slime',res:'slime_egg',n:1,mt:[{id:'crystal_shard',n:2},{id:'herb',n:2}],ul:false},
  {id:'r_bategg',res:'bat_egg',n:1,mt:[{id:'beast_hide',n:2},{id:'crystal_shard',n:2}],ul:false}
];

// ═══════════════════════════════════════════════════════════════
//  INVENTORY HELPERS
// ═══════════════════════════════════════════════════════════════
DS.addItem = function addItem(id) {
  var s = G.inv.find(i => i.id===id);
  if (s) {
    if (DS.ITEMS[id] && DS.ITEMS[id].stk && s.n < (DS.ITEMS[id].mx||99)) { s.n++; G.itemsCollected++; return true; }
    if (!DS.ITEMS[id].stk) return false;
  }
  if (G.inv.length >= 24) return false;
  G.inv.push({id:id, n:1}); G.itemsCollected++; return true;
};
DS.remItem = function remItem(id, n) {
  var r = n;
  for (var i=G.inv.length-1; i>=0 && r>0; i--) {
    if (G.inv[i].id !== id) continue;
    var a = Math.min(r, G.inv[i].n); G.inv[i].n -= a; r -= a;
    if (G.inv[i].n <= 0) G.inv.splice(i, 1);
  }
  return n - r;
};
DS.countItem = function countItem(id) {
  return G.inv.reduce((s,i) => i.id===id ? s+i.n : s, 0);
};

// ═══════════════════════════════════════════════════════════════
//  CRAFTING
// ═══════════════════════════════════════════════════════════════
DS.canCraft = function canCraft(r) {
  if (!G.unlocked.has(r.id)) return false;
  return r.mt.every(m => DS.countItem(m.id) >= m.n);
};
DS.doCraft = function doCraft(r) {
  if (!DS.canCraft(r)) { toast(t('notEnough')); return; }
  r.mt.forEach(m => DS.remItem(m.id, m.n));
  DS.addItem(r.res); G.crafts++;
  // Track potion crafting
  var resItem = DS.ITEMS[r.res];
  if (resItem && resItem.type === 'c' && resItem.ef && (resItem.ef.heal || resItem.ef.hunger || resItem.ef.thirst)) {
    G.potionsCrafted = (G.potionsCrafted||0) + 1;
  }
  sfx('craft');
  toast(t('crafted')+' '+DS.ITEMS[r.res].name+'!');
  G.diary.push(t('crafted')+' '+DS.ITEMS[r.res].name);
  checkAch(); save();
};

// ═══════════════════════════════════════════════════════════════
//  SHOP
// ═══════════════════════════════════════════════════════════════
DS.SHOP_ITEMS = [
  {id:'health_potion',p:30},{id:'bread',p:15},{id:'water_bottle',p:12},
  {id:'torch',p:20},{id:'roasted_meat',p:25},{id:'antidote',p:18},
  {id:'rusty_sword',p:80},{id:'leather_vest',p:100},{id:'leather_cap',p:60},
  {id:'wooden_shield',p:70},{id:'leather_boots',p:50},{id:'copper_ring',p:90},
  {id:'rope_belt',p:40},{id:'bone_necklace',p:85},{id:'shadow_dagger',p:200},
  {id:'scroll_teleport',p:45},{id:'scroll_reveal',p:55},{id:'scroll_enchant',p:150},
  {id:'scroll_fire',p:120},{id:'str_potion',p:60},{id:'def_potion',p:60},{id:'spd_potion',p:50},
  {id:'slime_egg',p:80},{id:'bat_egg',p:150},{id:'skull_egg',p:300},
  {id:'chain_mail',p:250},{id:'iron_helm',p:150},{id:'iron_shield',p:180},
  {id:'silver_ring',p:160},{id:'silver_pendant',p:170},{id:'elixir',p:120}
];

DS.shopBuy = function shopBuy(idx) {
  var si = DS.currentShopItems[idx]; if (!si) return;
  if (G.gold < si.p) { toast(t('notEnoughGold')); return; }
  if (!DS.addItem(si.id)) { toast(t('invFull')); return; }
  G.gold -= si.p; sfx('shop'); toast(t('bought')+' '+DS.ITEMS[si.id].name); save();
};
DS.shopSell = function shopSell(idx) {
  var it = G.inv[idx]; if (!it) return;
  var d = DS.ITEMS[it.id]; if (!d) return;
  var val = Math.max(5, Math.floor(((d.st&&d.st.atk)||(d.st&&d.st.def)||3) * 3));
  G.gold += val; DS.remItem(it.id, 1);
  toast(t('sold')+' '+val+'g'); save();
};

// ═══════════════════════════════════════════════════════════════
//  USE ITEM
// ═══════════════════════════════════════════════════════════════
DS.useItem = function useItem(idx) {
  var it = G.inv[idx]; if (!it) return;
  var d = DS.ITEMS[it.id]; if (!d || d.type!=='c') return;
  if (!d.ef) return;
  if (d.ef.heal) G.hp = Math.min(totalMhp(), G.hp+d.ef.heal);
  if (d.ef.hunger) { G.hunger = Math.min(100, G.hunger+d.ef.hunger); G.foodUsed = (G.foodUsed||0)+1; }
  if (d.ef.thirst) G.thirst = Math.min(100, G.thirst+d.ef.thirst);
  if (d.ef.temp) G.temp = Math.min(50, G.temp+d.ef.temp);
  if (d.ef.damage && G.combat) {
    G.combat.e.hp -= d.ef.damage;
    G.combat.log.push(d.name+' '+t('youDeal')+' '+d.ef.damage+' '+t('damage')+'!');
    if (G.combat.e.hp <= 0) { enemyKilled(G.combat.e); return; }
  }
  if (d.ef.vision) { G.visBonus = d.ef.vision; G.visTimer = d.ef.dur||50; }
  // Buff potions
  if (d.ef.buff) {
    G.buffs = G.buffs || [];
    G.buffs.push({stat:d.ef.buff, amt:d.ef.amt, ticks:d.ef.dur||30});
    toast(d.name + ': +' + d.ef.amt + ' ' + d.ef.buff.toUpperCase() + ' for ' + (d.ef.dur||30) + ' steps');
  }
  // Antidote cures poison
  if (it.id === 'antidote') { G.poison = 0; }
  // Scroll effects
  if (d.ef.scroll) {
    G.scrollsUsed = (G.scrollsUsed||0) + 1;
    if (d.ef.scroll === 'tp') {
      // Teleport to stairs
      if (G.maze) {
        for (var ry=0; ry<G.maze.h; ry++) for (var rx=0; rx<G.maze.w; rx++) {
          if (G.maze.grid[ry][rx] === TILE.STAIRS) { G.px = rx; G.py = ry; break; }
        }
        toast(t('teleported') || 'Teleported to stairs!');
        sfx('teleport');
      }
    } else if (d.ef.scroll === 'reveal') {
      // Reveal entire map
      if (G.fog) {
        for (var ry=0; ry<G.fog.length; ry++) for (var rx=0; rx<G.fog[0].length; rx++) G.fog[ry][rx] = 2;
        toast(t('mapRevealed') || 'Map revealed!');
        sfx('btn');
      }
    } else if (d.ef.scroll === 'enchant') {
      // Enchant a random equipped item
      var eqSlots = Object.keys(G.eq).filter(function(s){ return G.eq[s]; });
      if (eqSlots.length > 0) {
        var slot = eqSlots[Math.floor(Math.random()*eqSlots.length)];
        var eid = G.eq[slot];
        var ed = DS.ITEMS[eid];
        if (ed && ed.st) {
          if (ed.st.atk) ed.st.atk += 2;
          if (ed.st.def) ed.st.def += 1;
          if (ed.st.hp) ed.st.hp += 5;
          G.itemsEnchanted = (G.itemsEnchanted||0) + 1;
          toast((t('enchanted') || 'Enchanted') + ': ' + ed.name + '!');
          sfx('craft');
          screenFlash('heal');
        }
      } else {
        toast(t('noEquip') || 'No equipment to enchant!');
        // Don't consume scroll
        if (d.ef.heal) screenFlash('heal');
        uHUD();
        return;
      }
    } else if (d.ef.scroll === 'fire') {
      // Fire damage to all visible monsters
      var fireDmg = Math.floor(15 + G.floor * 3 + G.stats.int * 2);
      var hitCount = 0;
      if (G.mons) {
        for (var mi=G.mons.length-1; mi>=0; mi--) {
          var m = G.mons[mi];
          var dist = Math.abs(m.x-G.px)+Math.abs(m.y-G.py);
          if (dist <= totalVis()) {
            m.hp -= fireDmg;
            hitCount++;
            if (m.hp <= 0) {
              G.kills++;
              spawnParticles(psx, psy, '#ff4400', 12, {spread:3, life:20, size:2});
              G.mons.splice(mi, 1);
            }
          }
        }
      }
      sfx('bomb'); screenShake = 6;
      spawnFloat(cv.width/2, cv.height/2, '🔥' + fireDmg, '#ff4400', 16);
      toast('🔥 ' + hitCount + ' ' + (t('targetsHit') || 'targets hit'));
    }
  }
  // Pet summoning
  if (d.ef.pet) {
    var petDefs = {
      slime: {name:'Slime', icon:'🟢', color:'#44cc44', hp:15, atk:3},
      bat:   {name:'Bat',   icon:'🦇', color:'#8844aa', hp:10, atk:5},
      skull: {name:'Skull', icon:'💀', color:'#aabbcc', hp:25, atk:8}
    };
    var pd = petDefs[d.ef.pet];
    if (pd) {
      var pLv = Math.max(1, G.floor);
      G.pet = {type:d.ef.pet, name:pd.name, icon:pd.icon, color:pd.color,
        hp:pd.hp + pLv*3, mhp:pd.hp + pLv*3, atk:pd.atk + Math.floor(pLv*1.5), atkCd:0};
      toast(pd.name + ' summoned! (' + G.pet.hp + ' HP)');
      sfx('craft'); screenFlash('heal');
    }
  }
  DS.remItem(it.id, 1);
  sfx(d.ef.heal ? 'heal' : 'btn');
  if (d.ef.heal) screenFlash('heal');
  toast(t('used')+' '+d.name);
  // Floating heal text
  if (d.ef.heal) spawnFloat(cv.width/2, cv.height/2 - 25, '+' + d.ef.heal + ' HP', '#44cc44', 14);
  if (d.ef.hunger) spawnFloat(cv.width/2 - 20, cv.height/2 - 15, '+' + d.ef.hunger, '#cc8822', 11);
  if (d.ef.thirst) spawnFloat(cv.width/2 + 20, cv.height/2 - 15, '+' + d.ef.thirst, '#4488cc', 11);
  uHUD();
};
