// ═══════════════════════════════════════════════════════════════
//  SAVE MODULE — save, load, hasSave
// ═══════════════════════════════════════════════════════════════
window.DS = window.DS || {};

DS.save = function() {
  try {
    var d = {
      floor:G.floor, run:G.run, hp:G.hp, mhp:G.mhp, atk:G.atk, def:G.def,
      lv:G.lv, xp:G.xp, hunger:G.hunger, thirst:G.thirst, temp:G.temp,
      vis:G.vis, visBonus:G.visBonus||0, visTimer:G.visTimer||0,
      gold:G.gold, diamond:G.diamond||0, ap:G.ap, stats:G.stats,
      inv:G.inv, eq:G.eq, hotbar:G.hotbar, unlocked:[...G.unlocked],
      kills:G.kills, crafts:G.crafts, itemsCollected:G.itemsCollected,
      bossKills:G.bossKills, foodUsed:G.foodUsed||0, potionsCrafted:G.potionsCrafted||0,
      dayCount:G.dayCount, achievements:[...G.achievements],
      poison:G.poison||0, stepCount:G.stepCount||0, buffs:G.buffs||[],
      pet:G.pet||null,
      scrollsUsed:G.scrollsUsed||0, trapsHit:G.trapsHit||0, itemsEnchanted:G.itemsEnchanted||0,
      settings:G.settings,
      // Floor state persistence
      maze:G.maze, fog:G.fog, mons:G.mons, items:G.items,
      px:G.px, py:G.py, diary:G.diary, toExit:G.toExit
    };
    localStorage.setItem('ds_save2', JSON.stringify(d));
    return true;
  } catch(e) { return false; }
}
DS.load = function() {
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
DS.hasSave = function() { return localStorage.getItem('ds_save2')!==null; }
