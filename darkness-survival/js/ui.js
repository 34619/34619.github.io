// ═══════════════════════════════════════════════════════════════
//  UI MODULE — HUD, Inventory, Crafting, Shop, Stats, Settings,
//  Help, Achievements, High Scores, Minimap, Hotbar
// ═══════════════════════════════════════════════════════════════
window.DS = window.DS || {};

// ── Module-level state ───────────────────────────────────────
DS.invFilter = 'all';
DS.shopTab = 'buy';
DS.currentShopItems = [];
DS.mapVisible = true;

// ── HUD ──────────────────────────────────────────────────────
DS.uHUD = function() {
  if (!G) return;
  var hpPct = Math.max(0, G.hp/totalMhp()*100);
  var hunPct = Math.max(0, G.hunger);
  var thiPct = Math.max(0, G.thirst);
  var tempPct = Math.max(0, Math.min(100, G.temp/50*100));

  // Day/night indicator
  var timeIcon = '';
  if (G.stepCount) {
    var cp = G.stepCount % 120;
    timeIcon = cp < 40 ? '☀️' : cp < 80 ? '🌅' : '🌙';
  }

  document.getElementById('hud').innerHTML =
    '<div class="hud-row1">'
    +'<span class="hud-floor">F'+G.floor+'</span>'
    +'<span class="hud-gold">💰'+G.gold+'</span>'
    +'<span class="hud-diamond">💎'+(G.diamond||0)+'</span>'
    +'<span class="hud-lv">'+t('lv')+'.'+G.lv+'</span>'
    +'<span class="hud-toexit">'+t('exit')+':'+G.toExit+'</span>'
    +'<span>'+timeIcon+'</span>'
    +(G.poison>0 ? '<span style="color:#44cc44">☠️'+G.poison+'</span>' : '')
    +'</div>'
    +'<div class="hud-row2">'
    +'<div class="hud-bar-group"><span class="hud-bar-lbl">'+t('hp').charAt(0)+'</span><div class="bar-wrap"><div class="hud-bar bar-hp" style="width:'+hpPct+'%"></div></div><span class="hud-hp-text">'+G.hp+'/'+totalMhp()+'</span></div>'
    +'<div class="hud-bar-group"><span class="hud-bar-lbl">🍖</span><div class="bar-wrap"><div class="hud-bar bar-hunger" style="width:'+hunPct+'%"></div></div></div>'
    +'<div class="hud-bar-group"><span class="hud-bar-lbl">💧</span><div class="bar-wrap"><div class="hud-bar bar-thirst" style="width:'+thiPct+'%"></div></div></div>'
    +'<div class="hud-bar-group"><span class="hud-bar-lbl">🌡</span><div class="bar-wrap"><div class="hud-bar bar-temp" style="width:'+tempPct+'%"></div></div></div>'
    +'</div>'
    // Status effect icons row
    +'<div class="hud-status-row">'
    +(G.poison>0 ? '<span class="status-icon poison-icon" title="Poison: '+G.poison+' ticks">☠️'+G.poison+'</span>' : '')
    +(G.buffs&&G.buffs.length>0 ? G.buffs.map(function(b){
        var ic = b.stat==='atk'?'⚔️':b.stat==='def'?'🛡️':'👁️';
        return '<span class="status-icon buff-icon" title="'+b.stat.toUpperCase()+' +'+b.amt+': '+b.ticks+' steps">'+ic+b.ticks+'</span>';
      }).join('') : '')
    +((G.visBonus||0)>0 ? '<span class="status-icon vis-icon" title="Vision +'+G.visBonus+': '+(G.visTimer||0)+' steps">🔥'+(G.visTimer||0)+'</span>' : '')
    +(G.pet&&G.pet.hp>0 ? '<span class="status-icon pet-icon" title="'+G.pet.name+' HP: '+G.pet.hp+'/'+G.pet.mhp+'">'+G.pet.icon+G.pet.hp+'</span>' : '')
    +'</div>';

  // Diary
  var diaryEl = document.getElementById('diary');
  diaryEl.innerHTML = G.diary.slice(-8).map(function(d) {
    return '<div class="diary-entry">'+d+'</div>';
  }).join('');
  diaryEl.scrollTop = diaryEl.scrollHeight;

  // Hotbar
  DS.renderHotbar();

  // Toast
  if (G.toastTimer > 0) {
    G.toastTimer--;
    document.getElementById('toast').style.display = 'block';
    document.getElementById('toast').textContent = G.toastMsg;
  } else {
    document.getElementById('toast').style.display = 'none';
  }
};

// ── Toast ────────────────────────────────────────────────────
DS.toast = function(msg) {
  G.toastMsg = msg;
  G.toastTimer = 90;
};

// ═══════════════════════════════════════════════════════════════
//  UI PANELS
// ═══════════════════════════════════════════════════════════════

// ── Inventory ────────────────────────────────────────────────
DS.openInv = function() {
  G.state = 'inventory';
  document.getElementById('im').classList.add('on');
  DS.refreshInv(); sfx('btn');
};
DS.closeInv = function() {
  G.state = 'play';
  document.getElementById('im').classList.remove('on');
  sfx('btn');
};
DS.sortInv = function(filter) {
  DS.invFilter = filter;
  sfx('btn');
  DS.refreshInv();
};
DS.refreshInv = function() {
  // Update filter button styles
  var btns = document.querySelectorAll('#im .item-btn');
  var filterBtns = [];
  for (var bi=0; bi<btns.length; bi++) {
    var bt = btns[bi].textContent;
    if (bt==='All'||bt==='Equip'||bt==='Use'||bt==='Mat') filterBtns.push(btns[bi]);
  }
  filterBtns.forEach(function(b) {
    var f = b.textContent.toLowerCase();
    if (f==='use') f='consumable';
    if (f==='mat') f='material';
    if (f===DS.invFilter) { b.style.borderColor='#ccaa22'; b.style.color='#ccaa22'; }
    else { b.style.borderColor='#444'; b.style.color='#999'; }
  });

  var g = document.getElementById('ig'), h = '';
  for (var i=0; i<24; i++) {
    var it = G.inv[i];
    if (it) {
      var d = ITEMS[it.id];
      // Apply filter
      if (DS.invFilter !== 'all' && d) {
        if (DS.invFilter==='equip' && (d.type==='c'||d.type==='m')) { h += '<div class="inv-slot"></div>'; continue; }
        if (DS.invFilter==='consumable' && d.type!=='c') { h += '<div class="inv-slot"></div>'; continue; }
        if (DS.invFilter==='material' && d.type!=='m') { h += '<div class="inv-slot"></div>'; continue; }
      }
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
};

DS.selectInvItem = function(i) {
  G.invSel = i;
  var it = G.inv[i]; if (!it) return;
  var d = ITEMS[it.id]; if (!d) return;
  var qc = d.q==='c'?'#aaa':d.q==='u'?'#4c4':d.q==='e'?'#a4d':d.q==='l'?'#fa2':'#aaa';
  var qn = d.q==='c'?'Common':d.q==='u'?'Uncommon':d.q==='e'?'Epic':d.q==='l'?'Legendary':'Common';
  var typeName = EQ_SLOTS[Object.keys(EQ_TYPE_MAP).find(function(k) { return EQ_TYPE_MAP[k]===d.type; })] || 'Consumable';
  var sellVal = Math.max(5, Math.floor(((d.st&&d.st.atk)||(d.st&&d.st.def)||3) * 3));
  var h = '<div class="item-name" style="color:'+qc+'">'+d.icon+' '+d.name+'</div>';
  h += '<div class="item-type">'+qn+' '+typeName+' x'+it.n+' | Sell: 💰'+sellVal+'</div>';
  if (d.st) {
    var stats = [];
    Object.keys(d.st).forEach(function(k) { stats.push(k.toUpperCase()+' +'+d.st[k]); });
    h += '<div class="item-stats">'+stats.join('  ')+'</div>';
    // Equipment comparison
    if (d.type !== 'c' && d.type !== 'm') {
      var slot = Object.keys(EQ_TYPE_MAP).find(function(k) { return EQ_TYPE_MAP[k] === d.type; });
      var curId = slot ? G.eq[slot] : null;
      if (curId && ITEMS[curId] && ITEMS[curId].st) {
        var curSt = ITEMS[curId].st;
        var diffs = [];
        Object.keys(d.st).forEach(function(k) {
          var diff = d.st[k] - (curSt[k] || 0);
          if (diff !== 0) diffs.push('<span style="color:'+(diff>0?'#44cc44':'#cc4444')+'">'+k.toUpperCase()+' '+(diff>0?'+':'')+diff+'</span>');
        });
        if (diffs.length) h += '<div class="item-eff" style="font-size:10px">vs '+ITEMS[curId].name+': '+diffs.join(' ')+'</div>';
      }
    }
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
  // Hotbar assignment for consumables
  var hbDiv = document.getElementById('bHB');
  if (hbDiv) {
    if (d.type === 'c') {
      var hbH = '<span style="color:#666;font-size:10px">Hotbar: </span>';
      for (var s = 0; s < 4; s++) {
        hbH += '<button class="item-btn" style="font-size:10px;padding:2px 6px" onclick="setHotbar('+s+',\''+it.id+'\');selectInvItem('+i+')">'+(s+1)+'</button> ';
      }
      hbDiv.innerHTML = hbH;
      hbDiv.style.display = 'block';
    } else {
      hbDiv.style.display = 'none';
    }
  }
  DS.refreshInv();
};

DS.doEquip = function() {
  if (G.invSel<0) return;
  var it = G.inv[G.invSel]; if (!it) return;
  equipItem(it.id); G.invSel = -1; DS.refreshInv(); DS.uHUD();
};
DS.doUse = function() {
  if (G.invSel<0) return;
  useItem(G.invSel); G.invSel = -1; DS.refreshInv(); DS.uHUD();
};
DS.doDrop = function() {
  if (G.invSel<0) return;
  var it = G.inv[G.invSel]; if (!it) return;
  remItem(it.id, 1); G.invSel = -1; DS.refreshInv();
};

// ── Crafting ─────────────────────────────────────────────────
DS.openCraft = function() {
  G.state = 'crafting';
  document.getElementById('crm').classList.add('on');
  DS.refreshCraft(); sfx('btn');
};
DS.closeCraft = function() {
  G.state = 'play';
  document.getElementById('crm').classList.remove('on');
  sfx('btn');
};
DS.refreshCraft = function() {
  var recipes = RECIPES.filter(function(r) { return G.unlocked.has(r.id); });
  var h = '';
  recipes.forEach(function(r, i) {
    var d = ITEMS[r.res];
    var can = canCraft(r);
    h += '<div class="craft-item'+(G.craftSel===i?' craft-sel':'')+'" onclick="selectCraft('+i+')">'
      +'<span class="craft-icon">'+(d?d.icon:'?')+'</span>'
      +'<span class="craft-name">'+(d?d.name:r.res)+'</span>'
      +'<span class="craft-status">'+(can?'✅':'❌')+'</span></div>';
  });
  if (!recipes.length) h = '<div class="craft-empty">'+t('noRecipe')+'</div>';
  document.getElementById('rl').innerHTML = h;

  if (G.craftSel >= 0 && G.craftSel < recipes.length) {
    var r = recipes[G.craftSel], d = ITEMS[r.res];
    var dh = '<div class="craft-detail-name">'+(d?d.name:r.res)+'</div>';
    dh += '<div class="craft-mats">'+t('materials')+':</div>';
    r.mt.forEach(function(m) {
      var md = ITEMS[m.id], have = countItem(m.id), ok = have >= m.n;
      dh += '<div class="craft-mat">'+(ok?'✅':'❌')+' '+(md?md.name:m.id)+' x'+m.n+' ('+t('have')+':'+have+')</div>';
    });
    dh += '<div class="craft-result">'+t('result')+': '+(d?d.name:r.res)+'</div>';
    document.getElementById('rd').innerHTML = dh;
    document.getElementById('rd').style.display = 'block';
    document.getElementById('bC').style.display = canCraft(r) ? 'inline-block' : 'none';
  } else {
    document.getElementById('rd').style.display = 'none';
    document.getElementById('bC').style.display = 'none';
  }
};
DS.selectCraft = function(i) { G.craftSel = i; DS.refreshCraft(); };
DS.doCraftAction = function() {
  var recipes = RECIPES.filter(function(r) { return G.unlocked.has(r.id); });
  var r = recipes[G.craftSel]; if (!r) return;
  doCraft(r); DS.refreshCraft(); DS.uHUD();
};

// ── Shop ─────────────────────────────────────────────────────
DS.openShop = function() {
  G.state = 'shop';
  document.getElementById('sm').classList.add('on');
  DS.refreshShop(); sfx('btn');
};
DS.closeShop = function() {
  G.state = 'play';
  document.getElementById('sm').classList.remove('on');
  sfx('btn');
};

DS.generateShopItems = function() {
  // Pick a random subset of SHOP_ITEMS for this floor visit
  var pool = SHOP_ITEMS.slice();
  pool.sort(function(){ return Math.random()-0.5; });
  DS.currentShopItems = pool.slice(0, Math.min(8 + Math.floor((G ? G.floor : 1) / 2), pool.length));
  // Sort by price
  DS.currentShopItems.sort(function(a, b){ return a.p - b.p; });
};

DS.refreshShop = function() {
  document.getElementById('sGold').textContent = G.gold;
  // Update tab buttons
  var buyBtn = document.getElementById('shopTabBuy');
  var sellBtn = document.getElementById('shopTabSell');
  if (buyBtn) { buyBtn.style.borderColor = DS.shopTab==='buy'?'#ccaa22':'#444'; buyBtn.style.color = DS.shopTab==='buy'?'#ccaa22':'#999'; buyBtn.textContent = t('buy'); }
  if (sellBtn) { sellBtn.style.borderColor = DS.shopTab==='sell'?'#ccaa22':'#444'; sellBtn.style.color = DS.shopTab==='sell'?'#ccaa22':'#999'; sellBtn.textContent = t('sell'); }

  // Generate shop items if not set
  if (DS.currentShopItems.length === 0) DS.generateShopItems();

  var h = '';
  if (DS.shopTab === 'buy') {
    DS.currentShopItems.forEach(function(si, i) {
      var d = ITEMS[si.id]; if (!d) return;
      var can = G.gold >= si.p;
      h += '<div class="shop-item">'
        +'<span class="shop-icon">'+d.icon+'</span>'
        +'<span class="shop-name">'+d.name+'</span>'
        +'<span class="shop-price">💰'+si.p+'</span>'
        +(can?'<button class="shop-buy-btn" onclick="shopBuy('+i+');refreshShop();uHUD()">'+t('buy')+'</button>'
          :'<span class="shop-no">-</span>')
        +'</div>';
    });
  } else {
    // Sell tab
    var hasItems = G.inv.some(function(it){ var d = ITEMS[it.id]; return d && d.type !== 'm'; });
    if (hasItems) {
      h += '<div style="text-align:right;margin-bottom:4px"><button class="shop-buy-btn" style="border-color:#cc8822;color:#ccaa44;font-size:9px" onclick="sellAllItems()">'+(t('sellAll')||'Sell All')+'</button></div>';
    }
    G.inv.forEach(function(it, i) {
      var d = ITEMS[it.id]; if (!d) return;
      if (d.type === 'm') return; // don't sell materials
      var val = Math.max(5, Math.floor(((d.st&&d.st.atk)||(d.st&&d.st.def)||3) * 3));
      h += '<div class="shop-item">'
        +'<span class="shop-icon">'+d.icon+'</span>'
        +'<span class="shop-name">'+d.name+(it.n>1?' x'+it.n:'')+'</span>'
        +'<span class="shop-price" style="color:#3aaa3a">💰'+val+'</span>'
        +'<button class="shop-buy-btn" style="border-color:#cc4444;color:#cc6666" onclick="shopSell('+i+');refreshShop();uHUD()">'+t('sell')+'</button>'
        +'</div>';
    });
    if (!h) h = '<div class="craft-empty">'+t('noItems')+'</div>';
  }
  document.getElementById('sl2').innerHTML = h;
};

// ── Sell All ─────────────────────────────────────────────────
DS.sellAllItems = function() {
  var total = 0;
  for (var i = G.inv.length - 1; i >= 0; i--) {
    var d = ITEMS[G.inv[i].id]; if (!d || d.type === 'm') continue;
    var val = Math.max(5, Math.floor(((d.st&&d.st.atk)||(d.st&&d.st.def)||3) * 3)) * G.inv[i].n;
    total += val;
    G.inv.splice(i, 1);
  }
  if (total > 0) {
    G.gold += total;
    DS.toast(t('sold') + ' 💰' + total);
    sfx('shop');
  }
  DS.refreshShop(); DS.uHUD();
};

// ── Stats ────────────────────────────────────────────────────
DS.openStats = function() {
  G.state = 'stats';
  document.getElementById('stm').classList.add('on');
  DS.refreshStats(); sfx('btn');
};
DS.closeStats = function() {
  G.state = 'play';
  document.getElementById('stm').classList.remove('on');
  sfx('btn');
};
DS.refreshStats = function() {
  var xpNeed = Math.floor(20*Math.pow(1.5,G.lv-1));
  var es = eqStats();
  var classes = t('classes');
  var classDef = CLASSES[G.classId] || CLASSES.adventurer;
  var lang = (G && G.settings && G.settings.lang) || 'EN';
  var className = (lang === 'ZH' || lang === 'KO') ? classDef.name_ko : classDef.name;
  // Show rank title based on level
  var rankTitle = G.lv >= 15 ? classes[3] : G.lv >= 10 ? classes[2] : G.lv >= 5 ? classes[1] : classes[0];
  var h = '<div class="stats-grid">'
    +'<div class="stat-row"><span class="stat-label">'+t('name')+'</span><span class="stat-val">F'+G.floor+' Explorer</span></div>'
    +'<div class="stat-row"><span class="stat-label">'+t('class')+'</span><span class="stat-val">'+className+' ('+rankTitle+')</span></div>'
    +'<div class="stat-row"><span class="stat-label">'+t('lv')+'</span><span class="stat-val">'+G.lv+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">'+t('hp')+'</span><span class="stat-val">'+G.hp+'/'+totalMhp()+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">'+t('atk')+'</span><span class="stat-val">'+G.atk+' (+'+es.atk+')</span></div>'
    +'<div class="stat-row"><span class="stat-label">'+t('def')+'</span><span class="stat-val">'+G.def+' (+'+es.def+')</span></div>'
    +'<div class="stat-row"><span class="stat-label">'+t('str')+'</span><span class="stat-val">'+G.stats.str+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">'+t('dex')+'</span><span class="stat-val">'+G.stats.dex+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">'+t('int')+'</span><span class="stat-val">'+G.stats.int+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">'+t('luk')+'</span><span class="stat-val">'+G.stats.luk+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">'+t('gold')+'</span><span class="stat-val" style="color:#ccaa22">'+G.gold+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">'+t('diamond')+'</span><span class="stat-val" style="color:#44aaff">'+(G.diamond||0)+'</span></div>'
    +'</div>';

  // AP allocation
  if (G.ap > 0) {
    h += '<div class="ap-section"><div class="ap-title">'+t('bonusPoints')+': '+G.ap+'</div>'
      +'<div class="ap-grid">'
      +'<div class="ap-stat"><span>'+t('str')+': '+G.stats.str+'</span><button class="ap-btn" onclick="allocAP(\'str\');refreshStats()">+</button></div>'
      +'<div class="ap-stat"><span>'+t('dex')+': '+G.stats.dex+'</span><button class="ap-btn" onclick="allocAP(\'dex\');refreshStats()">+</button></div>'
      +'<div class="ap-stat"><span>'+t('vit')+': '+G.stats.vit+'</span><button class="ap-btn" onclick="allocAP(\'vit\');refreshStats()">+</button></div>'
      +'<div class="ap-stat"><span>'+t('int')+': '+G.stats.int+'</span><button class="ap-btn" onclick="allocAP(\'int\');refreshStats()">+</button></div>'
      +'<div class="ap-stat"><span>'+t('luk')+': '+G.stats.luk+'</span><button class="ap-btn" onclick="allocAP(\'luk\');refreshStats()">+</button></div>'
      +'</div></div>';
  } else {
    h += '<div class="ap-section"><div class="ap-title">'+t('attributes')+'</div>'
      +'<div class="ap-grid readonly">'
      +'<div class="ap-stat"><span>'+t('str')+': '+G.stats.str+'</span></div>'
      +'<div class="ap-stat"><span>'+t('dex')+': '+G.stats.dex+'</span></div>'
      +'<div class="ap-stat"><span>'+t('vit')+': '+G.stats.vit+'</span></div>'
      +'<div class="ap-stat"><span>'+t('int')+': '+G.stats.int+'</span></div>'
      +'<div class="ap-stat"><span>'+t('luk')+': '+G.stats.luk+'</span></div>'
      +'</div></div>';
  }
  document.getElementById('sg2').innerHTML = h;
};

// ── Achievements ─────────────────────────────────────────────
DS.openAch = function() {
  G.state = 'achievements';
  document.getElementById('am').classList.add('on');
  sfx('btn');
  var h = '';
  ACH_DEFS.forEach(function(a) {
    var done = G.achievements.has(a.id);
    h += '<div class="ach-item'+(done?' ach-done':'')+'">'
      +'<span class="ach-icon">'+(done?'🏆':'🔒')+'</span>'
      +'<span class="ach-name">'+a.name+'</span>'
      +'<span class="ach-desc">'+a.desc+' <span style="color:#ccaa22">['+a.reward+']</span></span>'
      +(done?'<span class="ach-check">✓</span>':'')
      +'</div>';
  });
  document.getElementById('al').innerHTML = h;
};
DS.closeAch = function() {
  G.state = 'play';
  document.getElementById('am').classList.remove('on');
  if (!document.getElementById('gs').classList.contains('on')) document.getElementById('menu').classList.add('on');
  sfx('btn');
};

// ── Settings ─────────────────────────────────────────────────
DS.openSettings = function() {
  G.state = 'settings';
  document.getElementById('setm').classList.add('on');
  DS.refreshSettings();
};
DS.closeSettings = function() {
  G.state = 'play';
  document.getElementById('setm').classList.remove('on');
  if (G.state === 'play' && !document.getElementById('gs').classList.contains('on')) document.getElementById('menu').classList.add('on');
};
DS.refreshSettings = function() {
  var h = '<div class="settings-grid">'
    +'<div class="setting-row"><span>'+t('bgm')+'</span><button class="toggle-btn'+(G.settings.music?' on':'')+'" onclick="G.settings.music=!G.settings.music;refreshSettings()">'+(G.settings.music?'ON':'OFF')+'</button></div>'
    +'<div class="setting-row"><span>'+t('sound')+'</span><button class="toggle-btn'+(G.settings.sound?' on':'')+'" onclick="G.settings.sound=!G.settings.sound;refreshSettings()">'+(G.settings.sound?'ON':'OFF')+'</button></div>'
    +'<div class="setting-row"><span>'+t('difficulty')+'</span><select class="setting-select" onchange="G.settings.difficulty=this.value"><option'+(G.settings.difficulty==='EASY'?' selected':'')+'>EASY</option><option'+(G.settings.difficulty==='NORMAL'?' selected':'')+'>NORMAL</option><option'+(G.settings.difficulty==='HARD'?' selected':'')+'>HARD</option></select></div>'
    +'<div class="setting-row"><span>'+t('language')+'</span><select class="setting-select" onchange="G.settings.lang=this.value;refreshSettings()"><option'+(G.settings.lang==='EN'?' selected':'')+'>EN</option><option'+(G.settings.lang==='KO'?' selected':'')+'>KO</option><option'+(G.settings.lang==='ZH'?' selected':'')+'>ZH</option><option'+(G.settings.lang==='JA'?' selected':'')+'>JA</option></select></div>'
    +'<div class="setting-row"><span>'+t('achievements')+'</span><button class="toggle-btn" onclick="closeSettings();openAch()">'+t('view')+'</button></div>'
    +'</div>';
  document.getElementById('settingsContent').innerHTML = h;
};

// ── Help ─────────────────────────────────────────────────────
DS.openHelp = function() {
  G.state = 'help';
  var h = '<h3>'+t('movement')+'</h3><p>'+t('moveHelp')+'</p>'
    +'<h3>'+t('combat2')+'</h3><p>'+t('combatHelp')+'</p><p>'+t('attack')+' / '+t('defend')+' / '+t('run')+' / '+t('powerUp')+'</p>'
    +'<h3>'+t('survival')+'</h3><p>'+t('survivalHelp').replace(/\n/g,'</p><p>')+'</p>'
    +'<h3>'+t('goal')+'</h3><p>'+t('goalHelp').replace(/\n/g,'</p><p>')+'</p>'
    +'<h3>'+t('equipment')+'</h3><p>'+t('eqHelp')+'</p>'
    +'<h3>'+t('tips')+'</h3><p>'+t('tipsHelp').replace(/\n/g,'</p><p>')+'</p>';
  document.querySelector('#helpm .help-content').innerHTML = h;
  document.getElementById('helpm').classList.add('on');
};
DS.closeHelp = function() {
  G.state = 'play';
  document.getElementById('helpm').classList.remove('on');
  if (!document.getElementById('gs').classList.contains('on')) document.getElementById('menu').classList.add('on');
};

// ── High Scores ──────────────────────────────────────────────
DS.openHighScores = function() {
  var hs = [];
  try { hs = JSON.parse(localStorage.getItem('ds_highscores') || '[]'); } catch(e) {}
  var h = '';
  if (hs.length === 0) {
    h = '<div style="text-align:center;color:#555;padding:40px 0">No records yet</div>';
  } else {
    for (var i=0; i<hs.length; i++) {
      var s = hs[i];
      var medal = i===0?'<span style="color:#ffcc22">★</span>':i===1?'<span style="color:#cccccc">★</span>':i===2?'<span style="color:#cc8844">★</span>':'#'+(i+1);
      h += '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a1a1a;font-size:11px">'
        +'<span>'+medal+' F'+s.floor+' Lv'+s.lv+'</span>'
        +'<span style="color:#ccaa22">'+s.score+'</span>'
        +'<span style="color:#555">K:'+s.kills+' Run#'+s.run+'</span>'
        +'</div>';
    }
  }
  document.getElementById('hsList').innerHTML = h;
  document.getElementById('hsm').classList.add('on');
};
DS.closeHighScores = function() {
  document.getElementById('hsm').classList.remove('on');
  document.getElementById('menu').classList.add('on');
};

// ── Minimap Toggle ───────────────────────────────────────────
DS.toggleMap = function() {
  DS.mapVisible = !DS.mapVisible;
  var mm = document.getElementById('mm');
  if (mm) mm.style.display = DS.mapVisible ? 'block' : 'none';
  sfx('btn');
  DS.toast(DS.mapVisible ? 'Map ON' : 'Map OFF');
};

// ── Hotbar ───────────────────────────────────────────────────
DS.useHotbar = function(slot) {
  if (!G || (G.state !== 'play' && !G.combat)) return;
  var itemId = G.hotbar[slot];
  if (!itemId) return;
  var idx = -1;
  for (var ii = 0; ii < G.inv.length; ii++) {
    if (G.inv[ii].id === itemId && G.inv[ii].n > 0) { idx = ii; break; }
  }
  if (idx < 0) { G.hotbar[slot] = null; DS.renderHotbar(); return; }
  useItem(idx);
  // In combat, using item triggers enemy turn (if combat still active)
  if (G.combat) {
    var d = ITEMS[itemId];
    G.combat.log.push(t('used')+' ' + (d ? d.name : itemId) + '!');
    enemyTurn();
    if (G.combat) showCombat();
  }
  DS.renderHotbar(); DS.uHUD();
};

DS.setHotbar = function(slot, itemId) {
  if (!G) return;
  G.hotbar[slot] = itemId;
  DS.renderHotbar();
  sfx('btn');
  DS.toast(t('hotbar')+' ' + (slot+1) + ': ' + (itemId ? ITEMS[itemId].name : t('empty')));
};

DS.renderHotbar = function() {
  if (!G) return;
  var h = '';
  for (var i = 0; i < 4; i++) {
    var id = G.hotbar[i];
    var d = id ? ITEMS[id] : null;
    var cnt = id ? countItem(id) : 0;
    h += '<div class="hotbar-slot" onclick="useHotbar('+i+')" title="'+(d ? d.name : t('emptyHotbar'))+'">'
      + (d ? '<span class="hb-icon">'+d.icon+'</span>' + (cnt > 1 ? '<span class="hb-count">'+cnt+'</span>' : '') : '<span class="hb-empty">'+(i+1)+'</span>')
      + '</div>';
  }
  document.getElementById('hotbar').innerHTML = h;
};

// ═══════════════════════════════════════════════════════════════
//  GLOBAL WINDOW ALIASES (for HTML onclick compatibility)
// ═══════════════════════════════════════════════════════════════
window.uHUD = DS.uHUD;
window.toast = DS.toast;

window.openInv = DS.openInv;
window.closeInv = DS.closeInv;
window.sortInv = DS.sortInv;
window.refreshInv = DS.refreshInv;
window.selectInvItem = DS.selectInvItem;
window.doEquip = DS.doEquip;
window.doUse = DS.doUse;
window.doDrop = DS.doDrop;

window.openCraft = DS.openCraft;
window.closeCraft = DS.closeCraft;
window.refreshCraft = DS.refreshCraft;
window.selectCraft = DS.selectCraft;
window.doCraftAction = DS.doCraftAction;

window.openShop = DS.openShop;
window.closeShop = DS.closeShop;
window.generateShopItems = DS.generateShopItems;
window.refreshShop = DS.refreshShop;
window.sellAllItems = DS.sellAllItems;

window.openStats = DS.openStats;
window.closeStats = DS.closeStats;
window.refreshStats = DS.refreshStats;

window.openAch = DS.openAch;
window.closeAch = DS.closeAch;

window.openSettings = DS.openSettings;
window.closeSettings = DS.closeSettings;
window.refreshSettings = DS.refreshSettings;

window.openHelp = DS.openHelp;
window.closeHelp = DS.closeHelp;

window.openHighScores = DS.openHighScores;
window.closeHighScores = DS.closeHighScores;

window.toggleMap = DS.toggleMap;

window.useHotbar = DS.useHotbar;
window.setHotbar = DS.setHotbar;
window.renderHotbar = DS.renderHotbar;
