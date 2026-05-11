// ═══════════════════════════════════════════════════════════════
//  monsters.js — Monster Database
// ═══════════════════════════════════════════════════════════════
window.DS = window.DS || {};

// ═══════════════════════════════════════════════════════════════
//  MONSTER DATABASE
// ═══════════════════════════════════════════════════════════════
DS.MONSTERS = [
  {name:'Slime',name_ko:'史莱姆',color:'#4488cc',hp:15,atk:3,def:1,xp:8,f:1,tp:'n',spd:3},
  {name:'Bat',name_ko:'蝙蝠',color:'#8844aa',hp:10,atk:4,def:0,xp:6,f:1,tp:'n',spd:2},
  {name:'Zombie',name_ko:'僵尸',color:'#558855',hp:20,atk:4,def:2,xp:12,f:1,tp:'n',spd:3},
  {name:'Skeleton',name_ko:'骷髅兵',color:'#cccccc',hp:25,atk:5,def:2,xp:15,f:2,tp:'n',spd:3},
  {name:'Spider',name_ko:'毒蛛',color:'#994433',hp:18,atk:6,def:1,xp:12,f:2,tp:'n',spd:2},
  {name:'Rat King',name_ko:'巨型鼠',color:'#aa8855',hp:50,atk:7,def:3,xp:30,f:2,tp:'e',spd:2},
  {name:'Ghost',name_ko:'怨灵',color:'#88aacc',hp:30,atk:8,def:3,xp:22,f:3,tp:'n',spd:3,ranged:true,rng:3},
  {name:'Armored Skeleton',name_ko:'重甲骷髅',color:'#aaaacc',hp:60,atk:8,def:6,xp:40,f:3,tp:'e',spd:4},
  {name:'Dark Mage',name_ko:'黑暗法师',color:'#aa44aa',hp:40,atk:10,def:2,xp:45,f:4,tp:'e',spd:3,ranged:true,rng:4},
  {name:'Demon',name_ko:'恶魔',color:'#cc3322',hp:45,atk:11,def:4,xp:35,f:5,tp:'n',spd:3},
  {name:'Reaper',name_ko:'死神',color:'#443366',hp:50,atk:13,def:5,xp:50,f:6,tp:'e',spd:2},
  {name:'Goblin',name_ko:'哥布林',color:'#55aa33',hp:12,atk:3,def:1,xp:7,f:1,tp:'n',spd:2},
  {name:'Wraith',name_ko:'幽魂',color:'#6677aa',hp:35,atk:9,def:2,xp:28,f:4,tp:'n',spd:2,ranged:true,rng:3},
  {name:'Mimic',name_ko:'宝箱怪',color:'#ccaa22',hp:40,atk:10,def:4,xp:35,f:3,tp:'e',spd:1},
  {name:'Lich',name_ko:'巫妖',color:'#7733aa',hp:80,atk:14,def:6,xp:60,f:5,tp:'e',spd:3,ranged:true,rng:4},
  {name:'Shadow Wolf',name_ko:'暗影狼',color:'#556677',hp:55,atk:15,def:5,xp:45,f:6,tp:'n',spd:2},
  {name:'Fire Elemental',name_ko:'火元素',color:'#ff4411',hp:60,atk:16,def:4,xp:50,f:7,tp:'n',spd:3,ranged:true,rng:3},
  {name:'Ice Golem',name_ko:'冰巨人',color:'#88ccff',hp:100,atk:12,def:10,xp:65,f:7,tp:'e',spd:4},
  {name:'Plague Bearer',name_ko:'瘟疫使者',color:'#88aa22',hp:70,atk:18,def:6,xp:55,f:8,tp:'n',spd:3},
  {name:'Stone Gargoyle',name_ko:'石像鬼',color:'#998877',hp:90,atk:14,def:12,xp:70,f:9,tp:'e',spd:3},
  {name:'Void Imp',name_ko:'虚空小鬼',color:'#7744aa',hp:45,atk:20,def:4,xp:60,f:9,tp:'n',spd:2,ranged:true,rng:3},
  {name:'Bone Dragon',name_ko:'骨龙',color:'#ccccaa',hp:120,atk:22,def:10,xp:90,f:10,tp:'e',spd:3},
  {name:'Chaos Spawn',name_ko:'混沌之子',color:'#cc44cc',hp:80,atk:24,def:8,xp:75,f:11,tp:'n',spd:2,ranged:true,rng:3},
  {name:'Dread Knight',name_ko:'恐惧骑士',color:'#443344',hp:150,atk:20,def:15,xp:100,f:12,tp:'e',spd:3},
  // Bosses
  {name:'Gate Giant',name_ko:'看门巨人',color:'#ff6644',hp:100,atk:10,def:5,xp:80,f:2,tp:'b',
    skills:[{name:'Heavy Strike',cd:3,type:'heavy',mul:2},{name:'Stomp',cd:2,type:'aoe'}]},
  {name:'Abyss Worm',name_ko:'深渊蠕虫',color:'#44aa44',hp:180,atk:15,def:8,xp:150,f:4,tp:'b',
    skills:[{name:'Venom Spray',cd:3,type:'heavy',mul:2.5},{name:'Burrow',cd:4,type:'heal',amt:25}]},
  {name:'Dark Lord',name_ko:'黑暗之主',color:'#882222',hp:300,atk:20,def:12,xp:300,f:6,tp:'b',
    skills:[{name:'Dark Impact',cd:2,type:'heavy',mul:2},{name:'Soul Drain',cd:3,type:'aoe'},{name:'Dark Heal',cd:4,type:'heal',amt:40},{name:'Curse',cd:5,type:'debuff'}]},
  {name:'Shadow Serpent',name_ko:'暗影蛇王',color:'#44aa88',hp:400,atk:25,def:15,xp:400,f:8,tp:'b',
    skills:[{name:'Venom Fang',cd:2,type:'heavy',mul:2.5},{name:'Coil',cd:4,type:'heal',amt:50},{name:'Poison Breath',cd:3,type:'aoe'}]},
  {name:'Inferno Drake',name_ko:'炎龙',color:'#ff6622',hp:550,atk:30,def:18,xp:500,f:10,tp:'b',
    skills:[{name:'Fire Breath',cd:2,type:'heavy',mul:3},{name:'Inferno',cd:3,type:'aoe'},{name:'Molten Armor',cd:5,type:'debuff'},{name:'Regenerate',cd:4,type:'heal',amt:60}]},
  {name:'Void Wraith',name_ko:'虚空幽魂',color:'#6644cc',hp:700,atk:35,def:20,xp:650,f:12,tp:'b',
    skills:[{name:'Void Slash',cd:2,type:'heavy',mul:2},{name:'Dimension Rift',cd:3,type:'aoe'},{name:'Phase Shift',cd:4,type:'heal',amt:80},{name:'Darkness',cd:5,type:'debuff'}]},
  {name:'Chaos Emperor',name_ko:'混沌帝王',color:'#cc22cc',hp:1000,atk:42,def:25,xp:1000,f:14,tp:'b',
    skills:[{name:'Chaos Blade',cd:2,type:'heavy',mul:3.5},{name:'Apocalypse',cd:3,type:'aoe'},{name:'Dark Rebirth',cd:3,type:'heal',amt:100},{name:'Absolute Curse',cd:4,type:'debuff'}]}
];
