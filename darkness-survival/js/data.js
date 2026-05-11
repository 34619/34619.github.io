/* ============================================================
   Darkness Survival — Data Module
   Extracted from game.js
   ============================================================ */
window.DS = window.DS || {};

// ═══════════════════════════════════════════════════════════════
//  FLOOR THEMES
// ═══════════════════════════════════════════════════════════════
DS.FLOOR_THEMES = [
  { name:'Catacombs', wallTop:'#3a3a3a', wallLeft:'#2a2a2a', wallRight:'#1a1a1a',
    floor1:'#282218', floor2:'#201a12', accent:'#443322' },
  { name:'Cavern', wallTop:'#2a3528', wallLeft:'#1a2518', wallRight:'#101a10',
    floor1:'#1a2018', floor2:'#151a12', accent:'#2a3522' },
  { name:'Ruins', wallTop:'#3a3230', wallLeft:'#2a2220', wallRight:'#1a1210',
    floor1:'#282020', floor2:'#201818', accent:'#3a2828' },
  { name:'Abyss', wallTop:'#1a1a3a', wallLeft:'#10102a', wallRight:'#0a0a1a',
    floor1:'#181828', floor2:'#101020', accent:'#2a2a44' },
  { name:'Inferno', wallTop:'#3a2a1a', wallLeft:'#2a1a0a', wallRight:'#1a1008',
    floor1:'#281a0a', floor2:'#201408', accent:'#442a11' }
];

DS.getFloorTheme = function(floor) {
  return DS.FLOOR_THEMES[Math.min(Math.floor((floor-1)/3), DS.FLOOR_THEMES.length-1)];
};

// ═══════════════════════════════════════════════════════════════
//  TILE SYSTEM (from RE — 21 numeric types + 61 structures)
// ═══════════════════════════════════════════════════════════════

// Numeric tile types — current system (9 types, used by existing genMaze)
// Keep existing values unchanged for backward compat
DS.TILE = { VOID:0, FLOOR:1, WALL:2, STAIRS:3, RESOURCE:4, SHOP:5, BOSS_TILE:6, TRAP:7, CHEST:8 };

// Extended tile types — from RE getBaseTileType (for M2 dungeon rewrite)
DS.TILE_EX = {
  VOID: 0,               // ' ' — solid rock, blocking
  FLOOR: 1,              // '.' — room floor, walkable
  WALL_VARIANT_Y: 2,     // 'y' — floor variant A
  WALL_VARIANT_Z: 3,     // 'z' — floor variant B
  WALL_VARIANT_I: 4,     // 'i' — floor variant C (wall-like)
  DOOR_LOCKED: 5,        // '{' — locked door, blocking
  FLOOR_VARIANT_R: 6,    // 'r' — floor variant D
  FLOOR_VARIANT_J: 7,    // 'j' — floor variant E
  STAIR_FLOOR: 8,        // 'e' — stair-adjacent floor
  SPECIAL_H: 9,          // 'h' — same-column only
  FLOOR_BRACE: 10,       // '}' — floor variant F
  WATER: 11,             // ',' — water, swimmers only
  CORRIDOR_A: 12,        // 'o' (sub==0) — corridor
  CORRIDOR_B: 13,        // 'o' (sub!=0) — corridor variant
  STAIR_DOWN: 14,        // stair down (same X only)
  STAIR_B: 15,           // stair variant B
  SPECIAL_16: 16,        // special walkable
  STAIR_UP: 17,          // stair up (same X only)
  SPECIAL_18: 18,        // special walkable
  SPECIAL_19: 19,        // special walkable
  BOSS_STORE: 20         // boss/store tile
};

// Structure types — from RE (61 types, overlaid on tile grid)
DS.STRUCT = {
  STAIRS: 0,
  OPEN_DOOR: 1,
  ALCHEMIST_POT_W: 2,
  ALCHEMIST_POT_B: 3,
  ALTAR: 4,
  JAR: 5,
  CHEST: 6,
  COFFIN: 7,
  CLOSED_DOOR: 8,
  LOCKED_DOOR: 9,
  TRAP_VISIBLE_0: 10, TRAP_VISIBLE_1: 11, TRAP_VISIBLE_2: 12,
  TRAP_VISIBLE_3: 13, TRAP_VISIBLE_4: 14, TRAP_VISIBLE_5: 15,
  TRAP_VISIBLE_6: 16, TRAP_VISIBLE_7: 17, TRAP_VISIBLE_8: 18,
  TRAP_VISIBLE_9: 19,
  IRON_DOOR_F: 20,
  IRON_DOOR_R: 21,
  TRAP_HIDDEN_0: 22, TRAP_HIDDEN_1: 23, TRAP_HIDDEN_2: 24,
  TRAP_HIDDEN_3: 25, TRAP_HIDDEN_4: 26, TRAP_HIDDEN_5: 27,
  TRAP_HIDDEN_6: 28, TRAP_HIDDEN_7: 29, TRAP_HIDDEN_8: 30,
  TRAP_HIDDEN_9: 31, TRAP_HIDDEN_10: 32,
  COLLAPSED_WALL: 33,
  SEALED_DOOR_0: 34, SEALED_DOOR_1: 35, SEALED_DOOR_2: 36,
  BOOKSHELF: 37,
  CAMP: 38,
  PLANT_A: 39, PLANT_B: 40,
  GRASS: 41,
  TRIGGER: 42,
  TORCH: 43,
  GOLD_CHEST: 44,
  GLASS_CHEST: 45,
  SLATE: 46,
  FOUNTAIN: 47,
  POLLUTED_SPRING: 48,
  GRAVE: 49,
  BIG_TOMBSTONE: 50,
  WELL: 51,
  SKELETON: 52,
  MAGIC_DOOR: 53,
  MAGE_STATUE: 54,
  WARRIOR_STATUE: 55,
  DEVIL_STATUE: 56,
  GOD_STATUE: 57,
  ILLUSION_SLATE: 58,
  SIGN: 59,
  COLLAPSED_WALL_2: 60
};

// Generation characters — complete set from RE
DS.TILE_CHAR = {
  SPACE: ' ', WALL: '#', DOOR_NORMAL: '+', CORRIDOR_FLOOR: ',',
  ROOM_FLOOR: '.', STAIR_DOWN: '%', STAIR_UP: '*', DOOR_IRON: '=',
  DOOR_LOCKED: '@', DOOR_SECRET: '_', WATER: '~', CLIFF: '|',
  WALL_LAMP: 'X', MONSTER: 'M', TRAP: 'T', KEY_UNLOCK: 'U',
  KEY_DOOR: 'k', SHOP_ITEM: ')', ITEM: 'i', OBJECT: 'o',
  FLOOR_VAR1: 'y', FLOOR_VAR2: 'z', FLOOR_VAR3: 'r', FLOOR_VAR4: 'e',
  CORRIDOR_VAR: 'q', RUBBLE: 'x', SECRET_REVEALED: '`', SPECIAL_FLOOR: ';',
  ITEM_DEFAULT: '5', ITEM_WEAPON: '6', ITEM_ARMOR: '7',
  ITEM_SCROLL: '8', ITEM_POTION: '9', ITEM_RARE: '1',
  STORE_50G: '2', STORE_100G: 'd',
  FLOOR_H: 'h', FLOOR_J: 'j', FLOOR_P: 'p',
  DOOR_LOCKED_BRACE: '{', DOOR_UNLOCK_BRACE: '}',
  FLOOR_O: 'o'
};

// ASCII char → numeric tile type mapping
// Wall chars map to TILE.WALL (2) for renderer; floor variants map to TILE.FLOOR (1)
DS.CHAR_TO_TILE = {
  ' ': 0, '.': 1, 'y': 1, 'z': 1, 'i': 1, '{': 0, 'r': 1, 'j': 1,
  'e': 1, 'h': 1, '}': 1, ',': 11, 'o': 12,
  '#': 2, '+': 1, '~': 11, '%': 3, '*': 3, '=': 1, '@': 1, '_': 1,
  'M': 1, 'T': 1, 'U': 1, 'k': 1, ')': 1,
  '5': 1, '6': 1, '7': 1, '8': 1, '9': 1, '1': 1, '2': 1, 'd': 1,
  '`': 0, 'x': 0, ';': 1, 'X': 2, '|': 2, 'p': 1, 'q': 12
};

// Structure walkability table (from RE isWalkable)
DS.STRUCT_WALKABLE = {};
(function() {
  var walkable = [0,1,2,3,4,5,6,7,20,39,40,41,43,44,47,53];
  for (var i = 10; i <= 19; i++) walkable.push(i);
  for (var j = 22; j <= 32; j++) walkable.push(j);
  walkable.forEach(function(id) { DS.STRUCT_WALKABLE[id] = true; });
})();

// Structure activate types (from RE activateType)
DS.STRUCT_ACTIVATE = {
  0: 0, 1: 0x0D, 2: 0x12, 3: 0x12, 4: 0x12, 5: 0x13, 6: 0x14, 7: 4,
  8: 5, 9: 6, 20: 0x0D, 21: 0x1C, 33: 0x0F, 37: 0x10, 38: 0x11,
  39: 0x0C, 40: 0x0C, 41: 2, 42: 0x22, 43: 0x1B, 44: 0x1B, 45: 0x15,
  46: 0x16, 47: 2, 48: 0x17, 49: 0x18, 50: 0x1A, 51: 0x19, 52: 0x0E,
  53: 0, 54: 0x1D, 55: 0x1E, 56: 0x1F, 57: -1, 58: 0x20, 59: 0x21, 60: 0x0F
};
for (var ti = 10; ti <= 19; ti++) DS.STRUCT_ACTIVATE[ti] = 7;
for (var tj = 22; tj <= 32; tj++) DS.STRUCT_ACTIVATE[tj] = (tj < 28) ? 8 : 9;
DS.STRUCT_ACTIVATE[34] = 0x0A;
DS.STRUCT_ACTIVATE[35] = 0x0B;
DS.STRUCT_ACTIVATE[36] = -1;

// Tile classification helpers (char-based, for M2 generation)
DS.isFloorTile = function(ch) {
  return '.yzrehjp;'.indexOf(ch) >= 0;
};
DS.isCorridorTile = function(ch) {
  return ',qo'.indexOf(ch) >= 0;
};
DS.isDoorTile = function(ch) {
  return '+=@~%*_{}'.indexOf(ch) >= 0;
};
DS.isPassable = function(ch) {
  return DS.isFloorTile(ch) || DS.isCorridorTile(ch) ||
    ch === '%' || ch === '*' || ch === 'T' || ch === 'M' ||
    DS.isItemTile(ch);
};
DS.isWallTile = function(ch) {
  return '#X|x`'.indexOf(ch) >= 0;
};
DS.isItemTile = function(ch) {
  return '5678912d)ijkU'.indexOf(ch) >= 0;
};
DS.isStairTile = function(ch) {
  return ch === '%' || ch === '*';
};
DS.isWaterTile = function(ch) {
  return ch === '~' || ch === ',';
};
DS.isTrapTile = function(ch) {
  return ch === 'T';
};
DS.isMonsterTile = function(ch) {
  return ch === 'M';
};
DS.isShopTile = function(ch) {
  return ch === '@' || ch === ')' || ch === '2' || ch === 'd';
};
DS.isRubbleTile = function(ch) {
  return ch === '`' || ch === 'x';
};
DS.isStructureTile = function(ch) {
  return 'oXijkU}{"'.indexOf(ch) >= 0;
};

// Numeric tile type helpers (for M2 tile type grid)
DS.isNumericFloor = function(t) {
  return t === 1 || (t >= 2 && t <= 4) || t === 6 || t === 7 ||
    t === 8 || (t >= 14 && t <= 19) || t === 20 || t === 9 || t === 10;
};
DS.isNumericCorridor = function(t) {
  return t === 12 || t === 13;
};
DS.isNumericPassable = function(t) {
  return DS.isNumericFloor(t) || DS.isNumericCorridor(t) || t === 11;
};
DS.isNumericBlocking = function(t) {
  return t === 0 || t === 5;
};

// Tile char for minimap rendering
DS.TILE_MINIMAP = {
  0: ' ', 1: '.', 2: '#', 3: '>', 11: '~', 12: ','
};

// Quality colors
DS.QC = ['#999999','#44cc44','#4488dd','#aa44dd','#ffaa22'];
DS.QN = ['Common','Uncommon','Rare','Epic','Legendary'];

// ═══════════════════════════════════════════════════════════════
//  LANGUAGE SYSTEM
// ═══════════════════════════════════════════════════════════════
DS.LANG = {
  EN: {
    start:'START', continue:'CONTINUE', option:'OPTION', help:'HELP',
    status:'Status', bag:'Bag', craft:'Craft', shop:'Shop', menu:'Menu',
    attack:'Attack', defend:'Defend', run:'Run', powerUp:'Power Up',
    bomb:'Bomb', useItem:'Use Item', equip:'Equip', use:'Use', drop:'Drop',
    buy:'Buy', sell:'Sell', craft2:'Craft', close:'✕',
    hp:'HP', hunger:'Hunger', thirst:'Thirst', temp:'Temp',
    floor:'Floor', gold:'Gold', diamond:'Diamond', kills:'Kills', days:'Days',
    level:'Level', exp:'EXP', atk:'ATK', def:'DEF',
    str:'STR', dex:'DEX', vit:'VIT', int:'INT', luk:'LUK',
    name:'NAME', class:'CLASS', lv:'LV', exit:'EXIT',
    bgm:'BGM', sound:'EFFECT SOUND', difficulty:'DIFFICULTY', language:'LANGUAGE',
    achievements:'ACHIEVEMENTS', view:'VIEW', bonusPoints:'Bonus Points',
    attributes:'Attributes', materials:'Materials', result:'Result',
    noRecipe:'No recipes unlocked', noItems:'No items!', noBombs:'No bombs!',
    notEnough:'Not enough materials', notEnoughGold:'Not enough gold!',
    invFull:'Inventory full!', noSave:'No save found',
    equipped:'Equipped', unequipped:'Unequipped', used:'Used', bought:'Bought',
    sold:'Sold for', crafted:'Crafted', gathered:'Gathered', found:'Found',
    defeated:'Defeated', levelUp:'Level Up!', escaping:'Escaped!',
    escapeFail:'Escape failed!', defending:'Defending...', powering:'Powering up...',
    encounter:'Encountered', damage:'damage', took:'Took', critical:'CRITICAL!',
    dodged:'Dodged the attack!', starving:'Starving!', dehydrated:'Dehydrated!',
    freezing:'Freezing!', youDied:'YOU DIED', returnMenu:'RETURN TO MENU',
    record:'RECORD', reached:'Reached', run:'Run', score:'Score', newHighScore:'NEW HIGH SCORE!',
    hotbar:'Hotbar', empty:'Empty', bombDmg:'Bomb deals 20 damage!',
    teleported:'Teleported to stairs!', mapRevealed:'Map revealed!',
    enchanted:'Enchanted!', noEquip:'No equipment to enchant!',
    poisoned:'Poisoned!', targetsHit:'targets hit',
    emptyHotbar:'Empty (click inventory to assign)',
    steps:'Steps', bosses:'Bosses', sellAll:'Sell All',
    day:'Day', entered:'Entered the dungeon', whispers:'Whispers in the dark',
    fell:'You fell in the dungeon...',
    elite:'ELITE', boss:'BOSS', youDeal:'You deal', dmgToEnemy:'damage',
    uses:'uses', heals:'Heals', reducedATK:'ATK reduced!',
    bossDrop:'BOSS DROP', unlocked:'Unlocked',
    have:'have', hpPct:'HP',
    easy:'EASY', normal:'NORMAL', hard:'HARD',
    classes:['Adventurer','Warrior','Dark Knight','Shadow Lord'],
    chooseClass:'CHOOSE YOUR CLASS', enterDungeon:'ENTER DUNGEON', back:'BACK',
    themes:['Catacombs','Cavern','Ruins','Abyss','Inferno'],
    howToPlay:'HOW TO PLAY', movement:'Movement', combat2:'Combat', survival:'Survival', goal:'Goal', equipment:'Equipment', tips:'Tips',
    moveHelp:'D-Pad / WASD / Arrow Keys', combatHelp:'Walk into enemies to fight', survivalHelp:'Hunger depletes per step\nThirst depletes per step\nTemperature drops, stay warm',
    goalHelp:'Find stairs to descend deeper\nKill enemies, collect loot, craft gear\nDefeat bosses every 2 floors',
    eqHelp:'8 slots: WPN ARM HEL SHD BOT RIG NEC BEL', tipsHelp:'Torches increase vision range\nShops appear every 3 floors\nRecipes unlock from boss kills',
    diaryEvts:['You hear whispers in the darkness...','Strange symbols are carved into the wall.','A cold wind blows, your torch flickers.','You find dried blood on the ground.','The air reeks of decay.','You hear stone grinding somewhere.','A skeleton clutches a broken sword.','Dripping water echoes in the distance.','The walls are covered in green moss.','A message on the wall: "Trust no shadow."','Your heart pounds in the silence.','The torch is running low on fuel.','Scratches on the floor lead deeper.','Something moves in the corner of your eye.','The air grows colder.','You smell sulfur.','A faint glow emanates from a crack.','You step on something brittle — bone.','The ceiling drips with dark liquid.','An old campfire, long extinguished.','Footprints in the dust — not yours.','A broken lantern lies on the ground.','You feel watched.','The walls seem to close in.','A distant scream echoes through the halls.','Chains rattle somewhere ahead.','The floor is stained with something red.','A rat scurries past your feet.','You find scratch marks on the stone.','The silence is deafening.']
  },
  ZH: {
    start:'开始', continue:'继续', option:'设置', help:'帮助',
    status:'状态', bag:'背包', craft:'合成', shop:'商店', menu:'菜单',
    attack:'攻击', defend:'防御', run:'逃跑', powerUp:'蓄力',
    bomb:'炸弹', useItem:'使用物品', equip:'装备', use:'使用', drop:'丢弃',
    buy:'购买', sell:'出售', craft2:'合成', close:'✕',
    hp:'生命', hunger:'饥饿', thirst:'口渴', temp:'温度',
    floor:'楼层', gold:'金币', diamond:'钻石', kills:'击杀', days:'天数',
    level:'等级', exp:'经验', atk:'攻击', def:'防御',
    str:'力量', dex:'敏捷', vit:'体质', int:'智力', luk:'幸运',
    name:'名称', class:'职业', lv:'等级', exit:'出口',
    bgm:'背景音乐', sound:'音效', difficulty:'难度', language:'语言',
    achievements:'成就', view:'查看', bonusPoints:'分配点数',
    attributes:'属性', materials:'材料', result:'结果',
    noRecipe:'未解锁配方', noItems:'没有物品！', noBombs:'没有炸弹！',
    notEnough:'材料不足', notEnoughGold:'金币不足！',
    invFull:'背包已满！', noSave:'未找到存档',
    equipped:'已装备', unequipped:'已卸下', used:'已使用', bought:'已购买',
    sold:'卖出', crafted:'合成了', gathered:'采集了', found:'发现了',
    defeated:'击败了', levelUp:'升级了！', escaping:'逃跑了！',
    escapeFail:'逃跑失败！', defending:'防御中...', powering:'蓄力中...',
    encounter:'遭遇', damage:'伤害', took:'受到', critical:'暴击！',
    dodged:'闪避成功！', starving:'饥饿中！', dehydrated:'脱水中！',
    freezing:'冻伤中！', youDied:'你死了', returnMenu:'返回菜单',
    record:'记录', reached:'到达', run:'第', score:'分数', newHighScore:'新纪录！',
    hotbar:'快捷栏', empty:'空', bombDmg:'炸弹造成20点伤害！',
    teleported:'已传送到楼梯！', mapRevealed:'地图已揭示！',
    enchanted:'附魔成功！', noEquip:'没有可附魔的装备！',
    poisoned:'中毒！', targetsHit:'个目标被击中',
    emptyHotbar:'空（点击背包物品分配）',
    steps:'步数', bosses:'Boss击杀', sellAll:'全部卖出',
    day:'第', entered:'天 进入地牢', whispers:'天 黑暗中的低语',
    fell:'天 你倒在了地牢中...',
    elite:'精英', boss:'BOSS', youDeal:'你造成', dmgToEnemy:'点伤害',
    uses:'使用了', heals:'恢复', reducedATK:'攻击降低！',
    bossDrop:'Boss掉落', unlocked:'解锁了',
    have:'拥有', hpPct:'生命',
    easy:'简单', normal:'普通', hard:'困难',
    classes:['冒险者','战士','暗影骑士','暗影领主'],
    chooseClass:'选择你的职业', enterDungeon:'进入地牢', back:'返回',
    themes:['墓穴','洞穴','遗迹','深渊','炼狱'],
    howToPlay:'操作说明', movement:'移动', combat2:'战斗', survival:'生存', goal:'目标', equipment:'装备', tips:'提示',
    moveHelp:'方向键 / WASD', combatHelp:'走向敌人进行战斗', survivalHelp:'饥饿值随步数减少\n口渴值随步数减少\n温度下降，保持温暖',
    goalHelp:'寻找楼梯深入更深层\n击杀敌人，收集战利品，合成装备\n每2层击败Boss',
    eqHelp:'8个槽位：武器 盔甲 头盔 盾牌 靴子 戒指 项链 腰带', tipsHelp:'火把增加视野范围\n每3层出现商店\n击败Boss解锁配方',
    diaryEvts:['黑暗中传来低语...','墙壁上刻着奇怪的符号。','冷风吹过，火把摇曳。','地上有干涸的血迹。','空气中弥漫着腐烂的气味。','某处传来石头摩擦的声音。','一具骷髅紧握着断剑。','远处回荡着水滴声。','墙壁上长满了绿色苔藓。','墙上的留言："不要相信影子。"','寂静中你的心跳加速。','火把快没油了。','地板上的划痕通向更深处。','眼角余光瞥见了什么。','空气越来越冷。','你闻到了硫磺的味道。','裂缝中透出微弱的光芒。','你踩到了什么东西——骨头。','天花板上滴下黑色液体。','一处早已熄灭的篝火。','灰尘上的脚印——不是你的。','地上有一盏破灯笼。','你感觉有人在看着你。','墙壁似乎在向你逼近。','远处传来一声尖叫在走廊回荡。','前方传来铁链碰撞声。','地板上沾着红色的东西。','一只老鼠从你脚边跑过。','石头上有抓痕。','寂静让人窒息。']
  }
};

DS.t = function(key) {
  var lang = (G && G.settings && G.settings.lang) || 'EN';
  var table = DS.LANG[lang] || DS.LANG.EN;
  return table[key] || DS.LANG.EN[key] || key;
};

DS.getItemName = function(id) {
  var d = DS.ITEMS[id]; if (!d) return id;
  var lang = (G && G.settings && G.settings.lang) || 'EN';
  if ((lang === 'ZH' || lang === 'KO') && d.name_ko) return d.name_ko;
  return d.name;
};

DS.getMonsterName = function(mon) {
  var lang = (G && G.settings && G.settings.lang) || 'EN';
  if ((lang === 'ZH' || lang === 'KO') && mon.name_ko) return mon.name_ko;
  return mon.name;
};

DS.getDiaryEvt = function() {
  var evts = DS.t('diaryEvts');
  if (Array.isArray(evts)) return evts[Math.floor(Math.random()*evts.length)];
  return DS.DIARY_EVT[Math.floor(Math.random()*DS.DIARY_EVT.length)];
};

// ═══════════════════════════════════════════════════════════════
//  CHARACTER CLASSES
// ═══════════════════════════════════════════════════════════════
DS.CLASSES = {
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

DS.achBonusHP = function() {
  var bonus = 0;
  if (G.achievements.has('explorer')) bonus += 5;
  if (G.achievements.has('survivor')) bonus += 20;
  if (G.achievements.has('floor20')) bonus += 30;
  return bonus;
};

// Diary narrative
DS.DIARY_EVT = [
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
