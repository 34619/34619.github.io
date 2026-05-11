// ═══════════════════════════════════════════════════════════════
//  COMBAT MODULE — startCombat, showCombat, combatAtk, combatPower,
//  combatDefend, combatFlee, useBomb, combatUseItem, enemyTurn, enemyKilled
// ═══════════════════════════════════════════════════════════════
window.DS = window.DS || {};
var ITEMS = DS.ITEMS;

DS.startCombat = function(mon) {
  G.combat = { e:mon, log:['Encountered '+mon.name+'!'], up:false, def:false };
  G.state = 'combat';
  document.getElementById('cm').classList.add('on');
  sfx(mon.tp==='b' ? 'boss' : 'hit');
  showCombat();
}

DS.showCombat = function() {
  if (!G.combat) return;
  var c = G.combat, e = c.e;
  var tierLabel = e.tp==='e' ? '<span style="color:#cc8822;font-size:10px">'+t('elite')+'</span>'
    : e.tp==='b' ? '<span style="color:#cc3333;font-size:10px;font-weight:bold">'+t('boss')+'</span>' : '';
  var hpBarColor = e.tp==='b' ? '#cc3333' : e.tp==='e' ? '#cc8822' : '#884444';
  var enemyHP = '<div style="margin-top:4px"><div class="boss-hp-bar"><div style="width:'+Math.max(0,e.hp/e.maxHp*100)+'%;background:'+hpBarColor+';height:100%;transition:width 0.3s"></div></div></div>';

  // Monster icon based on type
  var monIcon = '💀';
  if (e.name.indexOf('Slime')>=0) monIcon='🫧';
  else if (e.name.indexOf('Bat')>=0) monIcon='🦇';
  else if (e.name.indexOf('Zombie')>=0) monIcon='🧟';
  else if (e.name.indexOf('Skeleton')>=0) monIcon='💀';
  else if (e.name.indexOf('Spider')>=0) monIcon='🕷️';
  else if (e.name.indexOf('Rat')>=0) monIcon='🐀';
  else if (e.name.indexOf('Ghost')>=0||e.name.indexOf('Wraith')>=0) monIcon='👻';
  else if (e.name.indexOf('Mage')>=0||e.name.indexOf('Lich')>=0) monIcon='🧙';
  else if (e.name.indexOf('Demon')>=0) monIcon='😈';
  else if (e.name.indexOf('Reaper')>=0) monIcon='☠️';
  else if (e.name.indexOf('Goblin')>=0) monIcon='👺';
  else if (e.name.indexOf('Mimic')>=0) monIcon='📦';
  else if (e.name.indexOf('Wolf')>=0) monIcon='🐺';
  else if (e.name.indexOf('Fire')>=0) monIcon='🔥';
  else if (e.name.indexOf('Ice')>=0||e.name.indexOf('Golem')>=0) monIcon='🧊';
  else if (e.name.indexOf('Plague')>=0) monIcon='☠️';
  else if (e.name.indexOf('Gargoyle')>=0) monIcon='🗿';
  else if (e.name.indexOf('Imp')>=0) monIcon='😈';
  else if (e.name.indexOf('Bone')>=0) monIcon='🐲';
  else if (e.name.indexOf('Chaos')>=0) monIcon='🌀';
  else if (e.name.indexOf('Dread')>=0||e.name.indexOf('Knight')>=0) monIcon='⚔️';
  else if (e.name.indexOf('Serpent')>=0) monIcon='🐍';
  else if (e.name.indexOf('Drake')>=0) monIcon='🐉';
  else if (e.name.indexOf('Emperor')>=0) monIcon='👑';
  else if (e.tp==='b') monIcon='👹';

  document.getElementById('ce').innerHTML =
    '<div class="cmb-enemy"><div class="cmb-enemy-icon" style="color:'+e.color+'">'+monIcon+'</div>'
    +'<div class="cmb-enemy-name">'+e.name+'</div>'
    +'<div class="cmb-enemy-hp">'+t('hp')+': '+e.hp+'/'+e.maxHp+'</div>'
    +'<div class="cmb-enemy-stats">'+t('atk')+': '+e.atk+' '+t('def')+': '+e.def+'</div>'
    +tierLabel + enemyHP + '</div>';

  var hpPct = Math.max(0, G.hp/totalMhp()*100);
  document.getElementById('cp').innerHTML =
    '<div style="text-align:center"><div style="font-size:14px">👧</div>'
    +'<div style="font-size:11px">'+t('hp')+': '+G.hp+'/'+totalMhp()+'</div>'
    +'<div style="width:100%;height:5px;background:#1a1a1a;border-radius:1px;overflow:hidden;margin:2px 0"><div style="width:'+hpPct+'%;background:#cc2222;height:100%;transition:width 0.3s"></div></div>'
    +'<div style="font-size:11px;color:#888">'+t('atk')+': '+totalAtk()+' '+t('def')+': '+totalDef()+'</div></div>';

  document.getElementById('cl').innerHTML = c.log.slice(-6).map(l =>
    '<div class="cmb-log">'+l+'</div>'
  ).join('');
}

DS.combatAtk = function() {
  var c = G.combat; if (!c) return;
  var a = totalAtk();
  if (c.up) { a = Math.floor(a*1.5); c.up = false; }
  // Critical hit chance based on LUK
  var critChance = G.stats.luk * 0.015;
  var isCrit = Math.random() < critChance;
  var dmg = Math.max(1, a - c.e.def) + Math.floor(Math.random()*3);
  if (isCrit) { dmg = Math.floor(dmg * 1.8); }
  // Legendary weapon effects
  var wId = G.eq.w;
  if (wId === 'chaos_blade') { var extra = Math.floor(Math.random()*10); if (extra>0) { dmg += extra; c.log.push('Chaos energy: +'+extra+' dmg!'); } }
  if (wId === 'demon_slayer' && c.e.tp === 'b') { dmg = Math.floor(dmg * 1.5); c.log.push('Demon Slayer: +50% vs boss!'); }
  c.e.hp -= dmg;
  sfx('hit');
  screenShake = isCrit ? 6 : 3;
  spawnFloat(cv.width/2, cv.height/3, '-'+dmg+(isCrit?'!':''), isCrit?'#ffcc22':'#ff4444', isCrit?16:13);
  if (isCrit) { screenFlash('hit'); sfx('crit'); }
  // Lifesteal from Void Scythe
  if (wId === 'void_scythe') { var steal = Math.max(1, Math.floor(dmg*0.15)); G.hp = Math.min(totalMhp(), G.hp+steal); c.log.push('Void Scythe +'+steal+' HP!'); }
  c.log.push(t('youDeal')+' '+dmg+' '+t('dmgToEnemy') + (isCrit ? ' '+t('critical') : '!') + (isCrit ? '💥' : ''));
  if (c.e.hp <= 0) { enemyKilled(c.e); return; }
  enemyTurn();
  showCombat();
}

DS.combatPower = function() {
  var c = G.combat; if (!c) return;
  c.up = true; c.log.push(t('powering'));
  sfx('equip');
  enemyTurn(); showCombat();
}

DS.combatDefend = function() {
  var c = G.combat; if (!c) return;
  c.def = true; c.log.push(t('defending'));
  sfx('btn');
  enemyTurn(); showCombat();
}

DS.combatFlee = function() {
  var c = G.combat; if (!c) return;
  var fleeChance = 0.35 + G.stats.dex * 0.02 + G.stats.luk * 0.01;
  if (c.e.tp === 'b') fleeChance = Math.min(fleeChance, 0.3); // harder to flee from bosses
  if (Math.random() < fleeChance) {
    c.log.push(t('escaping')); G.combat = null;
    document.getElementById('cm').classList.remove('on');
    G.state = 'play'; sfx('flee'); uHUD();
  } else {
    c.log.push(t('escapeFail'));
    sfx('hurt');
    enemyTurn(); showCombat();
  }
}

DS.useBomb = function() {
  var c = G.combat; if (!c) return;
  var bi = G.inv.findIndex(i => i.id==='bomb' && i.n>0);
  if (bi < 0) { toast(t('noBombs')); return; }
  c.e.hp -= Math.floor(20 + G.floor * 2 + G.stats.int); remItem('bomb', 1);
  sfx('bomb'); screenShake = 8;
  c.log.push(t('bombDmg'));
  if (c.e.hp <= 0) { enemyKilled(c.e); return; }
  enemyTurn(); showCombat();
}

DS.combatUseItem = function() {
  var c = G.combat; if (!c) return;
  // Find first usable consumable (healing priority)
  var idx = G.inv.findIndex(i => { var d = ITEMS[i.id]; return d && d.type==='c' && d.ef && d.ef.heal; });
  if (idx < 0) idx = G.inv.findIndex(i => { var d = ITEMS[i.id]; return d && d.type==='c' && d.ef; });
  if (idx < 0) { toast(t('noItems')); return; }
  var name = ITEMS[G.inv[idx].id].name;
  useItem(idx);
  c.log.push(t('used')+' ' + name + '!');
  enemyTurn(); showCombat();
}

DS.enemyTurn = function() {
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
          c.log.push(e.name+' '+t('uses')+' '+sk.name+'! '+dmg+' '+t('damage')+'!');
        } else if (sk.type==='aoe') {
          var raw2 = e.atk - totalDef();
          if (c.def) raw2 = Math.floor(raw2*0.5);
          var dmg2 = Math.max(1, raw2); G.hp -= dmg2;
          c.log.push(e.name+' '+t('uses')+' '+sk.name+'! '+dmg2+' '+t('damage')+'!');
        } else if (sk.type==='heal') {
          var amt = sk.amt || Math.floor(e.maxHp*0.2);
          e.hp = Math.min(e.maxHp, e.hp+amt);
          c.log.push(e.name+' '+t('uses')+' '+sk.name+'! '+t('heals')+' '+amt+' '+t('hp')+'!');
        } else if (sk.type==='debuff') {
          G.atk = Math.max(1, G.atk-2);
          c.log.push(e.name+' '+t('uses')+' '+sk.name+'! '+t('reducedATK'));
        }
        used = true; break;
      }
    }
    if (!used) {
      // Dodge chance based on DEX
      var dodgeChance = G.stats.dex * 0.01 + (G.eq.b==='void_walkers'?0.05:0);
      if (Math.random() < dodgeChance) {
        c.log.push(t('dodged')); sfx('dodge');
      } else {
        var md = Math.max(1, e.atk - totalDef());
        if (c.def) md = Math.floor(md*0.5);
        G.hp -= md; c.log.push(t('took')+' '+md+' '+t('damage'));
      }
    }
    for (var j=0; j<e.skillCD.length; j++) if (e.skillCD[j]>0) e.skillCD[j]--;
  } else if (e.tp==='e' && Math.random()<0.3) {
    // Elite double attack
    var dodgeE = G.stats.dex * 0.01 + (G.eq.b==='void_walkers'?0.05:0);
    if (Math.random() < dodgeE) {
      c.log.push(t('dodged'));
    } else {
      var md = Math.max(1, e.atk - totalDef());
      if (c.def) md = Math.floor(md*0.5);
      G.hp -= md; c.log.push(t('took')+' '+md+' '+t('damage'));
      if (Math.random()<0.2) {
        var d2 = Math.max(1, Math.floor(e.atk*0.7) - totalDef());
        if (c.def) d2 = Math.floor(d2*0.5);
        G.hp -= d2; c.log.push(t('critical')+' '+d2+' '+t('damage')+'!');
      }
    }
  } else {
    var dodgeN = G.stats.dex * 0.01 + (G.eq.b==='void_walkers'?0.05:0);
    if (Math.random() < dodgeN) {
      c.log.push(t('dodged'));
    } else {
      var md = Math.max(1, e.atk - totalDef());
      if (c.def) md = Math.floor(md*0.5);
      G.hp -= md; c.log.push(t('took')+' '+md+' '+t('damage'));
      // Poison from Spider / Plague Bearer
      if ((e.name.indexOf('Spider') >= 0 || e.name.indexOf('Plague') >= 0) && Math.random() < 0.3) {
        G.poison = 3;
        c.log.push('☠️ '+(t('poisoned')||'Poisoned!')+' (3)');
      }
    }
  }
  c.def = false;
  sfx('hurt'); screenShake = 4; screenFlash('hit'); playerHitTimer = 15;
  // Pet absorbs damage
  if (G.pet && G.pet.hp > 0 && Math.random() < 0.4) {
    var absorbed = Math.floor(2 + G.pet.mhp * 0.1);
    G.pet.hp -= absorbed;
    if (G.pet.hp <= 0) {
      G.pet.hp = 0;
      c.log.push(G.pet.icon + ' ' + G.pet.name + ' was knocked out!');
    } else {
      c.log.push(G.pet.icon + ' ' + G.pet.name + ' blocked ' + absorbed + ' dmg!');
    }
  }
  if (G.hp <= 0) { G.hp = 0; G.combat = null; document.getElementById('cm').classList.remove('on'); die(); }
}

DS.enemyKilled = function(e) {
  e.alive = false;
  // Add death animation
  dyingMons.push({x:e.x, y:e.y, color:e.color, name:e.name, timer:30, tp:e.tp});
  G.xp += e.xp; G.kills++;
  G.toExit = G.mons.filter(m=>m.alive).length;
  sfx('pickup');
  // Floating XP text at enemy position
  var eIso = isoToScreen(e.x, e.y);
  var eCamX = cv.width/2 - isoToScreen(G.px, G.py).x;
  var eCamY = cv.height/2 - isoToScreen(G.px, G.py).y - 10;
  spawnFloat(eIso.x + eCamX, eIso.y + eCamY - 15, '+' + e.xp + ' XP', '#eecc44', 13);
  // Death particles
  spawnParticles(eIso.x + eCamX, eIso.y + eCamY, e.color, 8, {spread:3, life:20, size:2});
  G.diary.push(t('defeated')+' '+e.name+'!');
  // Drop items (LUK increases drop rate, difficulty adjusts)
  var dropDiff = G.settings.difficulty==='HARD' ? -0.1 : G.settings.difficulty==='EASY' ? 0.1 : 0;
  var dropRate = 0.4 + G.floor * 0.01 + G.stats.luk * 0.005 + dropDiff;
  if (Math.random() < Math.min(dropRate, 0.7)) {
    var drops = ['health_potion','bread','herb','ore','crystal_shard','beast_hide','monster_bone','water_bottle'];
    if (G.floor >= 3) drops.push('antidote','hot_soup','scroll_teleport');
    if (G.floor >= 5) drops.push('lantern','roasted_meat','scroll_reveal');
    if (G.floor >= 7) drops.push('scroll_fire','scroll_enchant');
    var dr = drops[Math.floor(Math.random()*drops.length)];
    addItem(dr); toast('+'+ITEMS[dr].icon+' '+ITEMS[dr].name);
  }
  // Boss drops epic gear
  if (e.tp==='b' && Math.random()<0.8) {
    var bDrops = ['crimson_blade','bone_armor','life_ring','void_walkers','crystal_pendant','shadow_sash','shadow_crown','shadow_dagger','dark_hood','tower_shield','shadow_boots','demon_slayer','chaos_blade','dragon_scale','slime_egg','bat_egg','skull_egg'];
    var bd = bDrops[Math.floor(Math.random()*bDrops.length)];
    addItem(bd); toast(t('bossDrop')+': '+ITEMS[bd].name+'!');
    G.bossKills++;
    // Diamond reward for boss
    var dmnd = 1 + Math.floor(Math.random()*2);
    G.diamond = (G.diamond||0) + dmnd;
    G.diary.push('+'+dmnd+' Diamond(s)');
    // Unlock recipe
    var locked = RECIPES.filter(r => !G.unlocked.has(r.id));
    if (locked.length > 0) {
      var nr = locked[Math.floor(Math.random()*locked.length)];
      G.unlocked.add(nr.id); G.diary.push(t('unlocked')+': '+ITEMS[nr.res].name+'!');
    }
  }
  // Gold (scale with enemy tier and floor)
  var goldBase = e.tp==='b' ? 30 : e.tp==='e' ? 15 : 5;
  G.gold += goldBase + Math.floor(Math.random() * (3 + G.floor * 2));
  checkLv();
  G.combat = null;
  document.getElementById('cm').classList.remove('on');
  G.state = 'play';
  checkAch();
  save(); // auto-save after combat
  draw(); uHUD();
}
