// ============================================================
//  Darkness Survival — Enhanced Game Engine
//  Version 2.0 — Better visuals, 8 equipment slots,
//  survival diary, achievements, boss skills
// ============================================================

// ── Item Database (expanded with 8 equipment slots) ──────────
var ITEMS={
  // Weapons
  old_dagger:{id:'old_dagger',name:'旧匕首',desc:'生锈匕首',type:'w',q:'c',icon:'🗡️',stk:false,stats:{atk:1}},
  rusty_sword:{id:'rusty_sword',name:'铁剑',desc:'锋利铁剑',type:'w',q:'c',icon:'⚔️',stk:false,stats:{atk:3}},
  crimson_blade:{id:'crimson_blade',name:'猩红之刃',desc:'散发血腥',type:'w',q:'e',icon:'🗡️',stk:false,stats:{atk:8}},
  void_scythe:{id:'void_scythe',name:'虚空镰刀',desc:'深渊武器',type:'w',q:'l',icon:'⚔️',stk:false,stats:{atk:15}},
  // Armor
  old_clothes:{id:'old_clothes',name:'旧衣服',desc:'破旧衣服',type:'a',q:'c',icon:'👕',stk:false,stats:{def:1}},
  leather_vest:{id:'leather_vest',name:'皮革背心',desc:'结实防具',type:'a',q:'c',icon:'🧥',stk:false,stats:{def:3}},
  bone_armor:{id:'bone_armor',name:'骨甲',desc:'骨头铠甲',type:'a',q:'e',icon:'🛡️',stk:false,stats:{def:6,hp:10}},
  dragon_scale:{id:'dragon_scale',name:'龙鳞甲',desc:'传说铠甲',type:'a',q:'l',icon:'🛡️',stk:false,stats:{def:15,hp:50}},
  // Helmets
  leather_cap:{id:'leather_cap',name:'皮帽',desc:'基础防护',type:'h',q:'c',icon:'🎩',stk:false,stats:{def:1,hp:5}},
  iron_helm:{id:'iron_helm',name:'铁盔',desc:'坚固头盔',type:'h',q:'u',icon:'⛑️',stk:false,stats:{def:3,hp:10}},
  shadow_crown:{id:'shadow_crown',name:'暗影王冠',desc:'传说头饰',type:'h',q:'l',icon:'👑',stk:false,stats:{def:5,hp:25,atk:3}},
  // Shields
  wooden_shield:{id:'wooden_shield',name:'木盾',desc:'简易盾牌',type:'s',q:'c',icon:'🪵',stk:false,stats:{def:2}},
  iron_shield:{id:'iron_shield',name:'铁盾',desc:'结实盾牌',type:'s',q:'u',icon:'🛡️',stk:false,stats:{def:4,hp:5}},
  // Boots
  straw_sandals:{id:'straw_sandals',name:'草鞋',desc:'聊胜于无',type:'b',q:'c',icon:'👡',stk:false,stats:{def:1}},
  leather_boots:{id:'leather_boots',name:'皮靴',desc:'结实耐用',type:'b',q:'u',icon:'👢',stk:false,stats:{def:2,hp:5}},
  void_walkers:{id:'void_walkers',name:'虚空行者',desc:'深渊靴子',type:'b',q:'l',icon:'👢',stk:false,stats:{def:8,hp:15}},
  // Rings
  copper_ring:{id:'copper_ring',name:'铜戒',desc:'普通戒指',type:'r',q:'c',icon:'💍',stk:false,stats:{atk:1}},
  life_ring:{id:'life_ring',name:'生命之戒',desc:'增加生命力',type:'r',q:'e',icon:'💍',stk:false,stats:{hp:20}},
  power_ring:{id:'power_ring',name:'力量之戒',desc:'增强攻击',type:'r',q:'e',icon:'💍',stk:false,stats:{atk:5}},
  // Necklaces
  bone_necklace:{id:'bone_necklace',name:'骨链',desc:'骨头项链',type:'n',q:'c',icon:'📿',stk:false,stats:{def:1,atk:1}},
  crystal_pendant:{id:'crystal_pendant',name:'水晶坠',desc:'水晶项链',type:'n',q:'e',icon:'📿',stk:false,stats:{atk:3,def:2,hp:10}},
  // Belts
  rope_belt:{id:'rope_belt',name:'绳腰带',desc:'简易腰带',type:'l',q:'c',icon:'🪢',stk:false,stats:{def:1}},
  shadow_sash:{id:'shadow_sash',name:'暗影腰带',desc:'暗影之力',type:'l',q:'e',icon:'🪢',stk:false,stats:{def:3,hp:10,atk:2}},
  // Consumables
  health_potion:{id:'health_potion',name:'治疗药水',desc:'恢复15HP',type:'c',q:'c',icon:'🧪',stk:true,mx:5,eff:{heal:15}},
  bread:{id:'bread',name:'面包',desc:'恢复饥饿',type:'c',q:'c',icon:'🍞',stk:true,mx:10,eff:{hunger:20}},
  water_bottle:{id:'water_bottle',name:'水壶',desc:'恢复口渴',type:'c',q:'c',icon:'🫗',stk:true,mx:5,eff:{thirst:25}},
  roasted_meat:{id:'roasted_meat',name:'烤肉',desc:'恢复30饥饿',type:'c',q:'c',icon:'🍖',stk:true,mx:5,eff:{hunger:30}},
  herb_potion:{id:'herb_potion',name:'草药汤',desc:'HP+饥饿',type:'c',q:'c',icon:'🍵',stk:true,mx:5,eff:{heal:10,hunger:15}},
  hot_soup:{id:'hot_soup',name:'热汤',desc:'体温+饥饿',type:'c',q:'c',icon:'🥣',stk:true,mx:5,eff:{hunger:20,temperature:10}},
  bomb:{id:'bomb',name:'炸弹',desc:'20伤害',type:'c',q:'e',icon:'💣',stk:true,mx:3,eff:{damage:20}},
  torch:{id:'torch',name:'火把',desc:'视野+2',type:'c',q:'c',icon:'🔥',stk:true,mx:5,eff:{vision:2,dur:50}},
  lantern:{id:'lantern',name:'灯笼',desc:'视野+4',type:'c',q:'e',icon:'🏮',stk:true,mx:2,eff:{vision:4,dur:100}},
  // Materials
  wood:{id:'wood',name:'木材',desc:'制作材料',type:'m',q:'c',icon:'🪵',stk:true,mx:20},
  herb:{id:'herb',name:'草药',desc:'制作材料',type:'m',q:'c',icon:'🌿',stk:true,mx:20},
  ore:{id:'ore',name:'矿石',desc:'制作材料',type:'m',q:'c',icon:'🪨',stk:true,mx:20},
  beast_hide:{id:'beast_hide',name:'兽皮',desc:'制作材料',type:'m',q:'c',icon:'🧶',stk:true,mx:20},
  crystal_shard:{id:'crystal_shard',name:'水晶碎片',desc:'制作材料',type:'m',q:'c',icon:'💎',stk:true,mx:20},
  monster_bone:{id:'monster_bone',name:'怪物骨',desc:'制作材料',type:'m',q:'c',icon:'🦴',stk:true,mx:20},
  red_crystal:{id:'red_crystal',name:'红色水晶',desc:'高级材料',type:'m',q:'e',icon:'🔴',stk:true,mx:10}
};

// ── Recipes (expanded) ───────────────────────────────────────
var RECIPES=[
  {id:'r_bread',res:'bread',n:1,mt:[{id:'wood',n:1}],desc:'烤面包',ul:true},
  {id:'r_roast',res:'roasted_meat',n:1,mt:[{id:'beast_hide',n:1},{id:'wood',n:1}],desc:'烤肉'},
  {id:'r_herbp',res:'herb_potion',n:1,mt:[{id:'herb',n:2}],desc:'草药汤',ul:true},
  {id:'r_heal',res:'health_potion',n:1,mt:[{id:'herb',n:2},{id:'crystal_shard',n:1}],desc:'治疗药水'},
  {id:'r_soup',res:'hot_soup',n:1,mt:[{id:'herb',n:1},{id:'wood',n:2}],desc:'热汤'},
  {id:'r_bomb',res:'bomb',n:1,mt:[{id:'ore',n:2},{id:'crystal_shard',n:1}],desc:'炸弹'},
  {id:'r_torch',res:'torch',n:2,mt:[{id:'wood',n:1},{id:'beast_hide',n:1}],desc:'火把',ul:true},
  {id:'r_vest',res:'leather_vest',n:1,mt:[{id:'beast_hide',n:3},{id:'herb',n:1}],desc:'皮革背心'},
  {id:'r_sword',res:'rusty_sword',n:1,mt:[{id:'ore',n:2},{id:'wood',n:1}],desc:'铁剑'},
  {id:'r_cap',res:'leather_cap',n:1,mt:[{id:'beast_hide',n:2}],desc:'皮帽'},
  {id:'r_shield',res:'wooden_shield',n:1,mt:[{id:'wood',n:3}],desc:'木盾'},
  {id:'r_boots',res:'leather_boots',n:1,mt:[{id:'beast_hide',n:2},{id:'wood',n:1}],desc:'皮靴'},
  {id:'r_ring',res:'copper_ring',n:1,mt:[{id:'ore',n:1},{id:'crystal_shard',n:1}],desc:'铜戒'},
  {id:'r_belt',res:'rope_belt',n:1,mt:[{id:'beast_hide',n:1},{id:'wood',n:1}],desc:'绳腰带'}
];

// ── Monster Database (with boss skills) ──────────────────────
var MDATA=[
  {name:'僵尸头',icon:'🧟',hp:15,atk:3,def:1,xp:8,f:1,tp:'n'},
  {name:'史莱姆',icon:'🟣',hp:20,atk:2,def:2,xp:10,f:1,tp:'n'},
  {name:'蝙蝠',icon:'🦇',hp:10,atk:4,def:0,xp:6,f:1,tp:'n'},
  {name:'骷髅兵',icon:'💀',hp:25,atk:5,def:2,xp:15,f:2,tp:'n'},
  {name:'毒蛛',icon:'🕷️',hp:18,atk:4,def:1,xp:12,f:2,tp:'n'},
  {name:'巨型鼠',icon:'🐀',hp:50,atk:7,def:3,xp:30,f:2,tp:'e'},
  {name:'怨灵',icon:'👻',hp:22,atk:6,def:1,xp:18,f:3,tp:'n'},
  {name:'重甲骷髅',icon:'🗡️',hp:60,atk:8,def:6,xp:40,f:3,tp:'e'},
  {name:'黑暗法师',icon:'🧙',hp:40,atk:10,def:2,xp:45,f:4,tp:'e'},
  {name:'看门巨人',icon:'🗿',hp:100,atk:10,def:5,xp:80,f:2,tp:'b',skills:[{name:'重击',cd:3,type:'heavy',mul:2},{name:'践踏',cd:2,type:'aoe'}]},
  {name:'深渊蠕虫',icon:'🐛',hp:180,atk:15,def:8,xp:150,f:4,tp:'b',skills:[{name:'毒液喷射',cd:3,type:'heavy',mul:2.5},{name:'钻地',cd:4,type:'heal',amt:25}]},
  {name:'黑暗之主',icon:'👹',hp:300,atk:20,def:12,xp:300,f:6,tp:'b',skills:[{name:'暗黑冲击',cd:2,type:'heavy',mul:2},{name:'灵魂吸取',cd:3,type:'aoe'},{name:'黑暗治愈',cd:4,type:'heal',amt:40},{name:'诅咒',cd:5,type:'debuff'}]}
];

// ── Achievement Definitions ──────────────────────────────────
var ACHIEVEMENTS=[
  {id:'explorer',name:'探索者',desc:'首次通关第1层',icon:'🗺️',check:function(){return G.floor>1;}},
  {id:'collector',name:'绝望收藏家',desc:'累计拾取50个物品',icon:'📦',check:function(){return G.itemsCollected>=50;}},
  {id:'slayer',name:'百杀',desc:'累计击杀100只怪物',icon:'⚔️',check:function(){return G.kills>=100;}},
  {id:'crafter',name:'工匠大师',desc:'累计制作20次',icon:'🔨',check:function(){return G.crafts>=20;}},
  {id:'survivor',name:'生存者',desc:'到达第10层',icon:'🏆',check:function(){return G.floor>=10;}},
  {id:'boss_killer',name:'屠龙者',desc:'击败第一个Boss',icon:'🐉',check:function(){return G.bossKills>=1;}},
  {id:'lv5',name:'初出茅庐',desc:'达到5级',icon:'⭐',check:function(){return G.lv>=5;}},
  {id:'lv10',name:'老练冒险者',desc:'达到10级',icon:'🌟',check:function(){return G.lv>=10;}}
];

// ── Diary Narrative Texts ────────────────────────────────────
var DIARY_EVENTS=[
  '你在黑暗中听到远处的低语...',
  '墙壁上刻着古老的文字，你看不懂。',
  '一阵冷风吹过，火把摇曳不定。',
  '你发现地上有一滩干涸的血迹。',
  '空气中弥漫着腐烂的气味。',
  '你听到石块摩擦的声音，似乎有什么东西在移动。',
  '角落里有一具冒险者的骸骨，手中握着一把断剑。',
  '你踩到了什么软软的东西，低头一看是一只死老鼠。',
  '远处传来水滴声，叮咚作响。',
  '墙壁上长满了青苔，滑腻腻的。',
  '你找到一个破损的宝箱，里面空空如也。',
  '有人在墙上刻了字："不要相信黑暗中的影子"。',
  '你感到一阵眩晕，仿佛有什么在窥视你。',
  '火把快燃尽了，你需要找到新的燃料。',
  '你听到自己的心跳声，在寂静中格外响亮。'
];

// ── Difficulty Scaling ───────────────────────────────────────
function getFD(f){return{w:Math.min(15+f*3,35),h:Math.min(15+f*3,35),mc:Math.min(3+f,10),mm:1+(f-1)*0.3};}

// ── Game State ───────────────────────────────────────────────
var G;
function initG(){
  G={
    floor:1,run:0,px:1,py:1,
    hp:30,mhp:30,atk:5,def:4,
    lv:1,xp:0,
    hunger:100,thirst:100,temp:37,
    vis:3,vt:0,
    cur:{crystal:0,starcoin:0,bone:0},
    inv:[{id:'old_dagger',n:1},{id:'old_clothes',n:1},{id:'torch',n:3},{id:'bread',n:5}],
    eq:{w:null,a:null,h:null,s:null,b:null,r:null,n:null,l:null},
    maze:null,fog:null,mons:[],items:[],
    combat:null,state:'menu',
    diary:[],
    unlocked:new Set(RECIPES.filter(function(r){return r.ul}).map(function(r){return r.id})),
    quests:[],kills:0,crafts:0,
    itemsCollected:0,bossKills:0,
    achievements:new Set(),
    dayCount:0
  };
}

// ── Maze Generation ──────────────────────────────────────────
function genMaze(w,h){
  w=w%2===0?w+1:w;h=h%2===0?h+1:h;
  var g=[],v=[],y,x;
  for(y=0;y<h;y++){g[y]=[];v[y]=[];for(x=0;x<w;x++){g[y][x]=1;v[y][x]=false;}}
  g[1][1]=0;v[1][1]=true;
  var dirs=[[0,-1],[0,1],[-1,0],[1,0]];
  function carve(cx,cy){
    var d=dirs.slice().sort(function(){return Math.random()-0.5});
    for(var i=0;i<d.length;i++){
      var dx=d[i][0],dy=d[i][1],nx=cx+dx*2,ny=cy+dy*2;
      if(nx<1||nx>=w-1||ny<1||ny>=h-1||v[ny][nx])continue;
      g[cy+dy][cx+dx]=0;g[ny][nx]=0;v[ny][nx]=true;carve(nx,ny);
    }
  }
  carve(1,1);
  var sx=w-2,sy=h-2;
  if(g[sy][sx]===1){g[sy][sx]=0;g[sy-1][sx]=0;}
  g[sy][sx]=2;
  var fl=[];
  for(y=1;y<h-1;y++)for(x=1;x<w-1;x++)
    if(g[y][x]===0&&!(x===1&&y===1)&&!(x===sx&&y===sy))fl.push({x:x,y:y});
  fl.sort(function(){return Math.random()-0.5});
  for(var i=0;i<6&&i<fl.length;i++)g[fl[i].y][fl[i].x]=3;
  return{grid:g,w:w,h:h,sx:sx,sy:sy};
}

// ── Fog of War ───────────────────────────────────────────────
function revFog(cx,cy,r){
  var f=G.fog,h=f.length,w=f[0].length,y,x;
  for(y=0;y<h;y++)for(x=0;x<w;x++)if(f[y][x]===2)f[y][x]=1;
  for(y=Math.max(0,cy-r);y<=Math.min(h-1,cy+r);y++)
    for(x=Math.max(0,cx-r);x<=Math.min(w-1,cx+r);x++)
      if(Math.abs(x-cx)+Math.abs(y-cy)<=r)f[y][x]=2;
}

// ── Monster Spawning ─────────────────────────────────────────
function spawnM(f,maze){
  var fd=getFD(f),pool=MDATA.filter(function(m){return m.f<=f}),ms=[],fl=[],y,x,i;
  for(y=1;y<maze.h-1;y++)for(x=1;x<maze.w-1;x++)
    if(maze.grid[y][x]===0&&!(x===1&&y===1))fl.push({x:x,y:y});
  fl.sort(function(){return Math.random()-0.5});
  for(i=0;i<fd.mc&&i<fl.length;i++){
    var t=pool[Math.floor(Math.random()*pool.length)];
    ms.push({name:t.name,icon:t.icon,hp:Math.floor(t.hp*fd.mm),maxHp:Math.floor(t.hp*fd.mm),
      atk:Math.floor(t.atk*fd.mm),def:Math.floor(t.def*fd.mm),xp:t.xp,tp:t.tp,
      x:fl[i].x,y:fl[i].y,alive:true,skills:t.skills||[],skillCD:[]});
  }
  if(f%2===0){
    var boss=MDATA.filter(function(m){return m.tp==='b'&&m.f<=f});
    if(boss.length>0){
      var b=boss[boss.length-1];
      ms.push({name:b.name,icon:b.icon,hp:Math.floor(b.hp*fd.mm*1.5),maxHp:Math.floor(b.hp*fd.mm*1.5),
        atk:Math.floor(b.atk*fd.mm*1.5),def:Math.floor(b.def*fd.mm*1.5),xp:b.xp,tp:'b',
        x:maze.sx,y:maze.sy,alive:true,skills:b.skills||[],skillCD:(b.skills||[]).map(function(){return 0})});
    }
  }
  return ms;
}

// ── Item Spawning ────────────────────────────────────────────
function spawnI(maze){
  var pool=['health_potion','bread','torch','herb','wood','ore','crystal_shard'],its=[],fl=[],y,x;
  for(y=1;y<maze.h-1;y++)for(x=1;x<maze.w-1;x++)
    if(maze.grid[y][x]===0&&!(x===1&&y===1)&&!(x===maze.sx&&y===maze.sy))fl.push({x:x,y:y});
  fl.sort(function(){return Math.random()-0.5});
  for(var i=0;i<3&&i<fl.length;i++)
    its.push({id:pool[Math.floor(Math.random()*pool.length)],x:fl[i].x,y:fl[i].y});
  return its;
}

// ── Floor Init ───────────────────────────────────────────────
function initFloor(){
  var fd=getFD(G.floor);G.maze=genMaze(fd.w,fd.h);
  G.fog=[];for(var y=0;y<fd.h;y++){G.fog[y]=[];for(var x=0;x<fd.w;x++)G.fog[y][x]=0;}
  G.px=1;G.py=1;revFog(1,1,G.vis);
  G.mons=spawnM(G.floor,G.maze);G.items=spawnI(G.maze);
  G.dayCount++;
  G.diary=['第'+G.dayCount+'天 — 第'+G.floor+'层冒险开始'];
  // Random diary event
  if(G.floor>1) G.diary.push(DIARY_EVENTS[Math.floor(Math.random()*DIARY_EVENTS.length)]);
  G.quests=[
    {desc:'击杀'+(2+G.floor)+'怪物',tgt:2+G.floor,prog:0,tp:'kill',rew:{crystal:10+G.floor*5}},
    {desc:'采集3资源',tgt:3,prog:0,tp:'gather',rew:{crystal:5}}
  ];
  checkAch();
}

// ── Inventory Helpers ────────────────────────────────────────
function addI(id){
  var s=G.inv.find(function(i){return i.id===id});
  if(s){
    if(ITEMS[id]&&ITEMS[id].stk&&s.n<(ITEMS[id].mx||99)){s.n++;G.itemsCollected++;return true;}
    if(!ITEMS[id].stk)return false;
  }
  if(G.inv.length>=24)return false;
  G.inv.push({id:id,n:1});G.itemsCollected++;return true;
}
function remI(id,n){
  var r=n;for(var i=G.inv.length-1;i>=0&&r>0;i--){
    if(G.inv[i].id!==id)continue;var a=Math.min(r,G.inv[i].n);G.inv[i].n-=a;r-=a;
    if(G.inv[i].n<=0)G.inv.splice(i,1);
  }return n-r;
}
function cntI(id){return G.inv.reduce(function(s,i){return i.id===id?s+i.n:s},0);}

// ── Equipment (8 slots) ─────────────────────────────────────
var EQ_SLOTS={w:'武器',a:'盔甲',h:'头盔',s:'盾牌',b:'鞋子',r:'戒指',n:'项链',l:'腰带'};
var EQ_TYPE_MAP={w:'w',a:'a',h:'h',s:'s',b:'b',r:'r',n:'n',l:'l'};

function eqSt(){
  var a=0,d=0,hp=0;
  Object.keys(EQ_SLOTS).forEach(function(slot){
    var id=G.eq[slot];if(!id||!ITEMS[id])return;
    var s=ITEMS[id].stats;a+=(s.atk||0);d+=(s.def||0);hp+=(s.hp||0);
  });
  return{atk:a,def:d,hp:hp};
}
function tAtk(){return G.atk+eqSt().atk;}
function tDef(){return G.def+eqSt().def;}
function tMhp(){return G.mhp+eqSt().hp;}

function equipItem(id){
  var d=ITEMS[id];if(!d)return false;
  var slot=null;
  Object.keys(EQ_TYPE_MAP).forEach(function(s){if(EQ_TYPE_MAP[s]===d.type)slot=s;});
  if(!slot)return false;
  if(G.eq[slot])addI(G.eq[slot]);
  G.eq[slot]=id;remI(id,1);
  toast('装备了'+d.name);return true;
}
function unequipItem(slot){
  if(!G.eq[slot])return;
  addI(G.eq[slot]);G.eq[slot]=null;
  toast('卸下了装备');
  rI();
}

// ── Combat (enhanced with boss skills) ───────────────────────
function startCmb(mon){
  G.combat={e:mon,log:['遭遇'+mon.name+'!'],up:false,def:false};
  showCmb();
}

function showCmb(){
  var c=G.combat,e=c.e;
  document.getElementById('cm').classList.add('on');
  var tierLabel=e.tp==='e'?'<div style="color:#cc8822;font-size:10px">精英</div>':e.tp==='b'?'<div style="color:#cc3333;font-size:10px">BOSS</div>':'';
  document.getElementById('ce').innerHTML='<div class="ec"><div class="ei">'+e.icon+'</div><div class="en">'+e.name+'</div><div class="eh">HP:'+e.hp+'/'+e.maxHp+'</div><div class="eh">ATK:'+e.atk+' DEF:'+e.def+'</div>'+tierLabel+'</div>';
  document.getElementById('cp').innerHTML='👧 HP:'+G.hp+'/'+tMhp()+' ATK:'+tAtk()+' DEF:'+tDef();
  document.getElementById('cl').innerHTML=c.log.slice(-8).map(function(l){return'<div class="lg">'+l+'</div>'}).join('');
}

function cA(){
  var c=G.combat;if(!c)return;
  var a=tAtk();if(c.up){a=Math.floor(a*1.5);c.up=false;}
  var d=Math.max(1,a-c.e.def);c.e.hp-=d;c.log.push('造成'+d+'伤害');
  if(c.e.hp<=0){
    c.e.alive=false;G.xp+=c.e.xp;c.log.push('击败'+c.e.name+'!+'+c.e.xp+'EXP');
    checkLv();G.kills++;G.quests.forEach(function(q){if(q.tp==='kill'&&q.prog<q.tgt)q.prog++;});
    if(c.e.tp==='b'){G.bossKills++;addDiary('你击败了'+c.e.name+'！');}
    G.mons=G.mons.filter(function(m2){return m2.alive});
    G.diary.push('击败'+c.e.name+'!');
    if(Math.random()<0.4){
      var drops=['health_potion','bread','herb','ore','crystal_shard','beast_hide','monster_bone'];
      var dr=drops[Math.floor(Math.random()*drops.length)];addI(dr);
      c.log.push('掉落'+ITEMS[dr].name);toast('获得'+ITEMS[dr].icon+' '+ITEMS[dr].name);
    }
    // Boss drops
    if(c.e.tp==='b'&&Math.random()<0.8){
      var bDrops=['crimson_blade','bone_armor','life_ring','void_walkers','crystal_pendant','shadow_sash'];
      var bd=bDrops[Math.floor(Math.random()*bDrops.length)];addI(bd);
      c.log.push('BOSS掉落: '+ITEMS[bd].name+'！');
      toast('BOSS掉落: '+ITEMS[bd].icon+' '+ITEMS[bd].name);
      // Unlock recipe
      var locked=RECIPES.filter(function(r){return !G.unlocked.has(r.id)});
      if(locked.length>0){var nr=locked[Math.floor(Math.random()*locked.length)];G.unlocked.add(nr.id);addDiary('解锁配方: '+nr.desc+'！');}
    }
    // Currency drop
    if(Math.random()<0.3){var cr=Math.floor(Math.random()*3);G.cur[['crystal','starcoin','bone'][cr]]+=Math.ceil(G.floor*2);c.log.push('获得货币');}
    G.combat=null;document.getElementById('cm').classList.remove('on');checkAch();draw();uHUD();return;
  }
  // Enemy counterattack
  enemyCounter();
  showCmb();
}

function enemyCounter(){
  var c=G.combat,e=c.e;
  if(e.tp==='b'&&e.skills&&e.skills.length>0){
    bossTurn(e);
  } else if(e.tp==='e'&&Math.random()<0.3){
    var md=Math.max(1,e.atk-tDef());if(c.def)md=Math.floor(md*0.5);G.hp-=md;
    c.log.push(e.name+'攻击!'+md+'伤害');
    if(Math.random()<0.2){var d2=Math.max(1,Math.floor(e.atk*0.7)-tDef());if(c.def)d2=Math.floor(d2*0.5);G.hp-=d2;c.log.push(e.name+'追击!'+d2+'伤害');}
  } else {
    var md=Math.max(1,e.atk-tDef());if(c.def)md=Math.floor(md*0.5);G.hp-=md;
    c.log.push('受到'+md+'伤害');
  }
  c.def=false;
  if(G.hp<=0){G.hp=0;G.combat=null;document.getElementById('cm').classList.remove('on');die();}
}

function bossTurn(e){
  var c=G.combat,used=false;
  for(var i=0;i<e.skills.length;i++){
    if(e.skillCD[i]===undefined)e.skillCD[i]=0;
    if(e.skillCD[i]<=0){
      var sk=e.skills[i];e.skillCD[i]=sk.cd;
      if(sk.type==='heavy'){
        var raw=Math.floor(e.atk*(sk.mul||2))-tDef();if(c.def)raw=Math.floor(raw*0.5);
        var dmg=Math.max(1,raw);G.hp-=dmg;c.log.push(e.name+'使用'+sk.name+'! '+dmg+'伤害!');
      } else if(sk.type==='aoe'){
        var raw2=e.atk-tDef();if(c.def)raw2=Math.floor(raw2*0.5);var dmg2=Math.max(1,raw2);
        G.hp-=dmg2;c.log.push(e.name+'使用'+sk.name+'! 全体'+dmg2+'伤害!');
      } else if(sk.type==='heal'){
        var amt=sk.amt||Math.floor(e.maxHp*0.2);e.hp=Math.min(e.maxHp,e.hp+amt);
        c.log.push(e.name+'使用'+sk.name+'! 恢复'+amt+'HP!');
      } else if(sk.type==='debuff'){
        G.atk=Math.max(1,G.atk-2);c.log.push(e.name+'使用'+sk.name+'! 你的攻击降低了!');
      }
      used=true;break;
    }
  }
  if(!used){var md=Math.max(1,e.atk-tDef());if(c.def)md=Math.floor(md*0.5);G.hp-=md;c.log.push('受到'+md+'伤害');}
  for(var j=0;j<e.skillCD.length;j++)if(e.skillCD[j]>0)e.skillCD[j]--;
  c.def=false;
  if(G.hp<=0){G.hp=0;G.combat=null;document.getElementById('cm').classList.remove('on');die();}
}

function cP(){var c=G.combat;if(!c)return;c.up=true;c.log.push('攻击力提升!');enemyCounter();showCmb();}
function cD(){var c=G.combat;if(!c)return;c.def=true;c.log.push('防御中...');enemyCounter();showCmb();}
function cF(){
  var c=G.combat;if(!c)return;
  if(Math.random()<0.4){G.combat=null;document.getElementById('cm').classList.remove('on');G.diary.push('逃跑成功');draw();uHUD();}
  else{c.log.push('逃跑失败!');enemyCounter();showCmb();}
}

// ── Level Up ─────────────────────────────────────────────────
function checkLv(){
  var need=Math.floor(20*Math.pow(1.5,G.lv-1));
  while(G.xp>=need){
    G.xp-=need;G.lv++;G.mhp+=5;G.hp=Math.min(G.hp+5,tMhp());G.atk+=2;G.def+=1;
    G.diary.push('🎉升级Lv.'+G.lv+'!');toast('升级!Lv.'+G.lv);
    need=Math.floor(20*Math.pow(1.5,G.lv-1));
  }
  checkAch();
}

// ── Achievements ─────────────────────────────────────────────
function checkAch(){
  var newAch=false;
  ACHIEVEMENTS.forEach(function(a){
    if(G.achievements.has(a.id))return;
    try{if(a.check()){G.achievements.add(a.id);addDiary('🏆成就: '+a.name+' — '+a.desc);toast('成就解锁: '+a.name);newAch=true;}}catch(e){}
  });
  return newAch;
}

// ── Diary System ─────────────────────────────────────────────
function addDiary(text){G.diary.push(text);}

// ── Death ────────────────────────────────────────────────────
function die(){
  G.state='dead';
  document.getElementById('gs').classList.remove('on');
  document.getElementById('death').classList.add('on');
  document.getElementById('dd').innerHTML=[
    '第1天 — 你进入迷宫',
    '第'+Math.max(1,Math.floor(G.dayCount/2))+'天 — 黑暗低语',
    '第'+G.dayCount+'天 — 你倒在迷宫中...'
  ].join('<br>');
  document.getElementById('ds').innerHTML='到达层数: 第'+G.floor+'层<br>等级: Lv.'+G.lv+'<br>击杀: '+G.kills+'<br>成就: '+G.achievements.size+'/'+ACHIEVEMENTS.length+'<br>第'+G.run+'次运行';
}

// ── Save/Load ────────────────────────────────────────────────
function save(){
  try{
    var d={floor:G.floor,run:G.run,hp:G.hp,mhp:G.mhp,atk:G.atk,def:G.def,lv:G.lv,xp:G.xp,
      hunger:G.hunger,thirst:G.thirst,temp:G.temp,vis:G.vis,vt:G.vt,cur:G.cur,inv:G.inv,eq:G.eq,
      unlocked:[...G.unlocked],kills:G.kills,crafts:G.crafts,
      itemsCollected:G.itemsCollected,bossKills:G.bossKills,dayCount:G.dayCount,
      achievements:[...G.achievements]};
    localStorage.setItem('ds_save',JSON.stringify(d));return true;
  }catch(e){return false;}
}
function load(){
  try{var r=localStorage.getItem('ds_save');if(!r)return false;var d=JSON.parse(r);
    Object.assign(G,d);G.unlocked=new Set(d.unlocked||[]);G.achievements=new Set(d.achievements||[]);return true;
  }catch(e){return false;}
}
function hasSave(){return localStorage.getItem('ds_save')!==null;}

// ============================================================
//  ENHANCED RENDERING — Stone tiles, smooth lighting, fog
// ============================================================
var cv=document.getElementById('cv'),ctx=cv.getContext('2d'),TS=32;
var time=0;

function rsz(){cv.width=window.innerWidth;cv.height=window.innerHeight;}
window.addEventListener('resize',rsz);

// ── Tile Color Palette ───────────────────────────────────────
var TC={
  floor:'#2a2520',floorAlt:'#252018',floorLine:'#332e28',
  wall:'#3a2a4a',wallTop:'#2a1a3a',wallLine:'#4a3a5a',
  wallHi:'#4a3a5a',wallLo:'#1a0a2a',
  stairs:'#5a8a3a',stairsGlow:'#3a6a2a',
  resource:'#5a3a1a',resourceHi:'#8a6a4a',
  fogSeen:'#12100e',fogHide:'#000',
  shop:'#3a2a5a',shopHi:'#6a4aaa',
  boss:'#5a1a1a',bossHi:'#aa3a3a'
};

function draw(){
  if(!G.maze)return;
  rsz();time++;
  ctx.fillStyle='#000';ctx.fillRect(0,0,cv.width,cv.height);

  var ox=Math.floor(cv.width/2-G.px*TS-TS/2),oy=Math.floor(cv.height/2-G.py*TS-TS/2);
  var m=G.maze,f=G.fog;
  var flicker=Math.sin(time*0.05)*0.03; // subtle light flicker

  // ── Draw Tiles ─────────────────────────────────────────────
  for(var y=0;y<m.h;y++){
    for(var x=0;x<m.w;x++){
      var sx=x*TS+ox,sy=y*TS+oy;
      if(sx<-TS||sx>cv.width||sy<-TS||sy>cv.height)continue;

      var v=f[y]&&f[y][x]!==undefined?f[y][x]:0;
      if(v===0){ctx.fillStyle=TC.fogHide;ctx.fillRect(sx,sy,TS,TS);continue;}

      var t=m.grid[y][x];
      var dist=Math.abs(x-G.px)+Math.abs(y-G.py);
      var light=v===2?Math.max(0.3,1-dist*0.08+flicker):0.25;
      var isVis=v===2;

      // Floor
      if(t!==1){
        ctx.fillStyle=isVis?TC.floor:TC.fogSeen;
        ctx.fillRect(sx,sy,TS,TS);
        // Subtle floor pattern
        if((x+y)%2===0){ctx.fillStyle=isVis?TC.floorAlt:'#0e0c0a';ctx.fillRect(sx,sy,TS,TS);}
        ctx.strokeStyle=TC.floorLine;ctx.lineWidth=0.5;ctx.strokeRect(sx+0.5,sy+0.5,TS-1,TS-1);
      }

      // Wall
      if(t===1){
        ctx.fillStyle=isVis?TC.wall:TC.wallTop;
        ctx.fillRect(sx,sy,TS,TS);
        // Brick pattern
        ctx.strokeStyle=TC.wallLine;ctx.lineWidth=1;
        ctx.strokeRect(sx+1,sy+1,TS-2,TS-2);
        if(isVis){
          ctx.fillStyle=TC.wallHi;ctx.fillRect(sx+1,sy+1,TS-2,2);
          ctx.fillStyle=TC.wallLo;ctx.fillRect(sx+1,sy+TS-3,TS-2,2);
          // Brick lines
          ctx.fillStyle=TC.wallLine;
          ctx.fillRect(sx+1,sy+TS/2,TS-2,1);
          if(y%2===0){ctx.fillRect(sx+TS/2,sy+1,1,TS/2-1);}
          else{ctx.fillRect(sx+TS/4,sy+TS/2+1,1,TS/2-2);ctx.fillRect(sx+TS*3/4,sy+TS/2+1,1,TS/2-2);}
        }
      }

      // Stairs
      if(t===2&&isVis){
        ctx.fillStyle=TC.stairsGlow;ctx.fillRect(sx+4,sy+4,TS-8,TS-8);
        ctx.fillStyle=TC.stairs;
        ctx.font='bold 18px serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('▼',sx+TS/2,sy+TS/2);
        // Glow effect
        var pulse=Math.sin(time*0.08)*0.3+0.7;
        ctx.strokeStyle='rgba(90,138,58,'+pulse+')';ctx.lineWidth=2;
        ctx.strokeRect(sx+2,sy+2,TS-4,TS-4);
      }

      // Resource
      if(t===3&&isVis){
        ctx.fillStyle=TC.resource;ctx.fillRect(sx+8,sy+8,TS-16,TS-16);
        ctx.strokeStyle=TC.resourceHi;ctx.lineWidth=1;
        ctx.strokeRect(sx+8,sy+8,TS-16,TS-16);
        ctx.fillStyle='#aa8a4a';ctx.font='12px serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('◆',sx+TS/2,sy+TS/2);
      }

      // Shop
      if(t===4&&isVis){
        ctx.fillStyle=TC.shop;ctx.fillRect(sx+2,sy+2,TS-4,TS-4);
        ctx.strokeStyle=TC.shopHi;ctx.lineWidth=1.5;
        ctx.strokeRect(sx+2,sy+2,TS-4,TS-4);
        ctx.fillStyle='#ccaaff';ctx.font='bold 16px serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('S',sx+TS/2,sy+TS/2);
      }

      // Boss tile
      if(t===5&&isVis){
        ctx.fillStyle=TC.boss;ctx.fillRect(sx+2,sy+2,TS-4,TS-4);
        ctx.strokeStyle=TC.bossHi;ctx.lineWidth=2;
        var bp=Math.sin(time*0.1)*0.4+0.6;
        ctx.globalAlpha=bp;ctx.strokeRect(sx+2,sy+2,TS-4,TS-4);ctx.globalAlpha=1;
        ctx.fillStyle='#ff4444';ctx.font='bold 16px serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('☠',sx+TS/2,sy+TS/2);
      }

      // ── Items on ground ────────────────────────────────────
      if(isVis){
        var it=G.items.find(function(i){return i.x===x&&i.y===y});
        if(it){
          var bounce=Math.sin(time*0.1+x+y)*2;
          ctx.fillStyle='#4488ff';
          ctx.beginPath();ctx.arc(sx+TS/2,sy+TS/2+bounce,5,0,Math.PI*2);ctx.fill();
          ctx.fillStyle='#88bbff';
          ctx.beginPath();ctx.arc(sx+TS/2,sy+TS/2+bounce-2,2,0,Math.PI*2);ctx.fill();
        }

        // ── Monsters ─────────────────────────────────────────
        var mon=G.mons.find(function(m2){return m2.alive&&m2.x===x&&m2.y===y});
        if(mon){
          var mColor=mon.tp==='b'?'#ff4444':mon.tp==='e'?'#ffaa44':'#cc6666';
          // Shadow
          ctx.fillStyle='rgba(0,0,0,0.4)';
          ctx.beginPath();ctx.ellipse(sx+TS/2,sy+TS-4,10,4,0,0,Math.PI*2);ctx.fill();
          // Monster
          ctx.font=mon.tp==='b'?'26px serif':'20px serif';
          ctx.textAlign='center';ctx.textBaseline='middle';
          ctx.fillStyle=mColor;ctx.fillText(mon.icon,sx+TS/2,sy+TS/2-2);
          // HP bar
          var pct=Math.max(0,mon.hp/mon.maxHp);
          ctx.fillStyle='#222';ctx.fillRect(sx+4,sy-2,TS-8,4);
          ctx.fillStyle=pct>0.5?'#44cc44':pct>0.25?'#cccc44':'#cc4444';
          ctx.fillRect(sx+4,sy-2,(TS-8)*pct,4);
        }
      }

      // ── Lighting Overlay ───────────────────────────────────
      if(v===2&&dist>2){
        var alpha=Math.min(0.7,(dist-2)*0.1);
        ctx.fillStyle='rgba(0,0,0,'+alpha+')';
        ctx.fillRect(sx,sy,TS,TS);
      }
    }
  }

  // ── Player ─────────────────────────────────────────────────
  var ppx=G.px*TS+ox,ppy=G.py*TS+oy;
  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.5)';ctx.beginPath();
  ctx.ellipse(ppx+TS/2,ppy+TS-3,10,4,0,0,Math.PI*2);ctx.fill();
  // Player glow
  var glowAlpha=Math.sin(time*0.06)*0.1+0.2;
  ctx.fillStyle='rgba(255,255,200,'+glowAlpha+')';
  ctx.beginPath();ctx.arc(ppx+TS/2,ppy+TS/2,TS*0.8,0,Math.PI*2);ctx.fill();
  // Character
  ctx.font='22px serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle='#fff';ctx.fillText('👧',ppx+TS/2,ppy+TS/2);

  // ── Vignette Effect ────────────────────────────────────────
  var grd=ctx.createRadialGradient(cv.width/2,cv.height/2,cv.width*0.3,cv.width/2,cv.height/2,cv.width*0.7);
  grd.addColorStop(0,'rgba(0,0,0,0)');grd.addColorStop(1,'rgba(0,0,0,0.5)');
  ctx.fillStyle=grd;ctx.fillRect(0,0,cv.width,cv.height);
}

// ── HUD Update ───────────────────────────────────────────────
function uHUD(){
  var es=eqSt();
  var h='<span style="color:#cc3333">F'+G.floor+'</span>'
    +'<span>Lv.'+G.lv+'</span>'
    +'<span>❤️<span class="br"><div class="hp" style="width:'+Math.max(0,G.hp/tMhp()*100)+'%"></div></span>'+G.hp+'/'+tMhp()+'</span>'
    +'<span>⚔'+tAtk()+' 🛡'+tDef()+'</span>'
    +'<span>🍖<span class="br"><div class="hu" style="width:'+G.hunger+'%"></div></span></span>'
    +'<span>💧<span class="br"><div class="th" style="width:'+G.thirst+'%"></div></span></span>'
    +'<span>🌡️'+G.temp.toFixed(0)+'°</span>'
    +'<span style="margin-left:auto;color:#ccaa22">🏆'+G.achievements.size+'</span>';
  document.getElementById('hud').innerHTML=h;
  document.getElementById('diary').innerHTML=G.diary.slice(-8).map(function(d){return'<div>'+d+'</div>'}).join('');
}

// ── Toast ────────────────────────────────────────────────────
var tTmr;
function toast(m){
  var e=document.getElementById('toast');e.textContent=m;e.style.display='block';
  clearTimeout(tTmr);tTmr=setTimeout(function(){e.style.display='none'},2000);
}

// ── Movement ─────────────────────────────────────────────────
function mv(dx,dy){
  if(!G||G.state!=='play'||G.combat)return;
  var nx=G.px+dx,ny=G.py+dy;
  if(nx<0||nx>=G.maze.w||ny<0||ny>=G.maze.h||G.maze.grid[ny][nx]===1)return;
  G.px=nx;G.py=ny;revFog(nx,ny,G.vis);
  var t=G.maze.grid[ny][nx];

  if(t===2){G.floor++;save();initFloor();draw();uHUD();return;}

  if(t===3){
    var r=['wood','ore','herb','beast_hide','crystal_shard'];
    var ri=r[Math.floor(Math.random()*r.length)];addI(ri);
    G.maze.grid[ny][nx]=0;G.diary.push('采集了'+ITEMS[ri].name);
    toast('获得'+ITEMS[ri].icon+' '+ITEMS[ri].name);
    G.quests.forEach(function(q){if(q.tp==='gather'&&q.prog<q.tgt)q.prog++;});
  }

  var ii=G.items.findIndex(function(i){return i.x===nx&&i.y===ny});
  if(ii>=0){addI(G.items[ii].id);G.diary.push('拾取'+ITEMS[G.items[ii].id].name);toast('获得'+ITEMS[G.items[ii].id].icon+' '+ITEMS[G.items[ii].id].name);G.items.splice(ii,1);}

  var mon=G.mons.find(function(m2){return m2.alive&&m2.x===nx&&m2.y===ny});
  if(mon){startCmb(mon);return;}

  // Survival costs
  G.hunger=Math.max(0,G.hunger-2);G.thirst=Math.max(0,G.thirst-3);G.temp=Math.max(0,G.temp-0.5);
  if(G.hunger<=0){G.hp-=3;G.diary.push('挨饿!');}
  if(G.thirst<=0){G.hp-=5;G.diary.push('脱水!');}
  if(G.temp<=0){G.hp-=4;G.diary.push('失温!');}
  if(G.hp<=0){G.hp=0;die();return;}

  // Monster AI
  for(var mi=0;mi<G.mons.length;mi++){
    var m2=G.mons[mi];if(!m2.alive)continue;
    var d=Math.abs(m2.x-G.px)+Math.abs(m2.y-G.py);
    if(d<=5&&d>1&&Math.random()<0.5){
      var mdx=Math.sign(G.px-m2.x),mdy=Math.sign(G.py-m2.y);
      var ny2=m2.y+mdy,nx2=m2.x+mdx;
      if(ny2>=0&&ny2<G.maze.h&&nx2>=0&&nx2<G.maze.w&&G.maze.grid[ny2][nx2]===0){m2.x=nx2;m2.y=ny2;}
    }
    if(m2.x===G.px&&m2.y===G.py&&m2.alive){startCmb(m2);return;}
  }

  // Random diary events
  if(Math.random()<0.08){
    G.diary.push(DIARY_EVENTS[Math.floor(Math.random()*DIARY_EVENTS.length)]);
  }

  draw();uHUD();checkAch();
}

// ── UI Panels ────────────────────────────────────────────────
function xC(id){document.getElementById(id).classList.remove('on');}

// Inventory (8 equipment slots)
var invSel=-1;
function oI(){document.getElementById('im').classList.add('on');rI();}

function rI(){
  var g=document.getElementById('ig'),h='';
  for(var i=0;i<24;i++){
    var it=G.inv[i];
    if(it){
      var d=ITEMS[it.id],q=d?(d.q==='c'?'c':d.q==='e'?'e':d.q==='l'?'l':d.q==='u'?'u':'c'):'c';
      h+='<div class="sl '+q+'" onclick="sI('+i+')">'+(d?d.icon:'?')+(it.n>1?'<span class="n">'+it.n+'</span>':'')+'</div>';
    }else h+='<div class="sl"></div>';
  }
  g.innerHTML=h;

  // 8 equipment slots
  var eqH='<div class="eq">';
  Object.keys(EQ_SLOTS).forEach(function(slot){
    var id=G.eq[slot],d=id?ITEMS[id]:null;
    eqH+='<div><div class="es" onclick="unequipItem(\''+slot+'\')" title="'+EQ_SLOTS[slot]+'">'+(d?d.icon:slotIcon(slot))+'</div><div style="font-size:8px;color:#666">'+EQ_SLOTS[slot]+'</div></div>';
  });
  eqH+='</div>';
  document.getElementById('eqRow').innerHTML=eqH;

  document.getElementById('id').style.display='none';
  document.getElementById('bE').style.display='none';
  document.getElementById('bU').style.display='none';
  document.getElementById('bD').style.display='none';
}

function slotIcon(s){
  return{w:'🗡️',a:'👕',h:'🎩',s:'🛡️',b:'👢',r:'💍',n:'📿',l:'🪢'}[s]||'?';
}

function sI(i){
  invSel=i;var it=G.inv[i];if(!it)return;var d=ITEMS[it.id];if(!d)return;
  var qc=d.q==='c'?'c1':d.q==='u'?'c1':d.q==='e'?'c2':'c3';
  var h='<div class="nm '+qc+'">'+d.name+'</div><div>'+(EQ_SLOTS[Object.keys(EQ_TYPE_MAP).find(function(k){return EQ_TYPE_MAP[k]===d.type})]||'消耗品')+' x'+it.n+'</div>';
  if(d.stats){var s=[];Object.keys(d.stats).forEach(function(k){s.push(k.toUpperCase()+'+'+d.stats[k]);});if(s.length)h+='<div style="color:#44cc44">'+s.join(' ')+'</div>';}
  if(d.eff){var e=[];if(d.eff.heal)e.push('HP+'+d.eff.heal);if(d.eff.hunger)e.push('饥饿+'+d.eff.hunger);if(d.eff.thirst)e.push('口渴+'+d.eff.thirst);if(d.eff.temperature)e.push('体温+'+d.eff.temperature);if(d.eff.vision)e.push('视野+'+d.eff.vision);if(e.length)h+='<div style="color:#44cc44">'+e.join(' ')+'</div>';}
  h+='<div style="color:#888;margin-top:4px">'+d.desc+'</div>';
  document.getElementById('id').innerHTML=h;document.getElementById('id').style.display='block';
  document.getElementById('bE').style.display=(d.type==='w'||d.type==='a'||d.type==='h'||d.type==='s'||d.type==='b'||d.type==='r'||d.type==='n'||d.type==='l')?'inline-block':'none';
  document.getElementById('bU').style.display=d.type==='c'?'inline-block':'none';
  document.getElementById('bD').style.display='inline-block';
  rI();
}

function eS(){if(invSel<0)return;var it=G.inv[invSel];if(!it)return;equipItem(it.id);invSel=-1;rI();}
function uS(){
  if(invSel<0)return;var it=G.inv[invSel];if(!it)return;var d=ITEMS[it.id];if(d.type!=='c')return;
  var e=d.eff;
  if(e.heal)G.hp=Math.min(tMhp(),G.hp+e.heal);
  if(e.hunger)G.hunger=Math.min(100,G.hunger+e.hunger);
  if(e.thirst)G.thirst=Math.min(100,G.thirst+e.thirst);
  if(e.temperature)G.temp=Math.min(50,G.temp+e.temperature);
  if(e.damage&&G.combat){G.combat.e.hp-=e.damage;G.combat.log.push(d.name+'造成'+e.damage+'伤害!');if(G.combat.e.hp<=0){G.combat.e.alive=false;G.xp+=G.combat.e.xp;G.kills++;G.mons=G.mons.filter(function(m2){return m2.alive});G.combat=null;document.getElementById('cm').classList.remove('on');}}
  if(e.vision){G.vis+=e.vision;G.vt+=(e.dur||50);}
  remI(it.id,1);toast('使用了'+d.name);invSel=-1;rI();uHUD();
}
function dS(){if(invSel<0)return;var it=G.inv[invSel];if(!it)return;remI(it.id,1);invSel=-1;rI();}

// Crafting
var craftSel=-1;
function oC(){document.getElementById('crm').classList.add('on');rC();}
function rC(){
  var recipes=RECIPES.filter(function(r){return G.unlocked.has(r.id)});
  var h='';
  recipes.forEach(function(r,i){
    var d=ITEMS[r.res],can=r.mt.every(function(m){return cntI(m.id)>=m.n});
    h+='<div class="ri'+(craftSel===i?' sel':'')+'" onclick="sC('+i+')">'+(d?d.icon:'?')+' '+(d?d.name:r.res)+' '+(can?'✅':'❌')+'</div>';
  });
  if(!recipes.length)h='<div style="color:#888;padding:8px">暂无配方</div>';
  document.getElementById('rl').innerHTML=h;
  document.getElementById('rd').style.display='none';document.getElementById('bC').style.display='none';
}
function sC(i){
  craftSel=i;var recipes=RECIPES.filter(function(r){return G.unlocked.has(r.id)});
  var r=recipes[i];if(!r)return;var d=ITEMS[r.res];
  var h='<div class="nm">'+(d?d.name:r.res)+'</div><div style="color:#888">'+r.desc+'</div><div style="margin-top:6px">材料:</div>';
  r.mt.forEach(function(m){var md=ITEMS[m.id],have=cntI(m.id),ok=have>=m.n;h+='<div>'+(ok?'✅':'❌')+' '+(md?md.name:m.id)+' x'+m.n+' (有:'+have+')</div>';});
  h+='<div style="margin-top:6px;color:#44cc44">产出:'+(d?d.name:r.res)+' x'+r.n+'</div>';
  document.getElementById('rd').innerHTML=h;document.getElementById('rd').style.display='block';
  document.getElementById('bC').style.display=r.mt.every(function(m){return cntI(m.id)>=m.n})?'inline-block':'none';
  rC();
}
function dC(){
  var recipes=RECIPES.filter(function(r){return G.unlocked.has(r.id)});var r=recipes[craftSel];if(!r)return;
  if(!r.mt.every(function(m){return cntI(m.id)>=m.n})){toast('材料不足');return;}
  r.mt.forEach(function(m){remI(m.id,m.n)});addI(r.res);G.crafts++;
  var d=ITEMS[r.res];toast('制作了'+(d?d.name:r.res)+'!');G.diary.push('制作了'+(d?d.name:r.res));checkAch();sC(craftSel);
}

// Shop
function oS(){document.getElementById('sm').classList.add('on');rS();}
function rS(){
  document.getElementById('sC').textContent=G.cur.crystal;
  document.getElementById('sS').textContent=G.cur.starcoin;
  document.getElementById('sB').textContent=G.cur.bone;
  var tier=G.floor>=5?3:G.floor>=3?2:1;
  var items=[{id:'health_potion',p:5,c:'crystal'},{id:'bread',p:3,c:'crystal'},{id:'torch',p:4,c:'crystal'},{id:'herb',p:2,c:'crystal'}];
  if(tier>=2)items.push({id:'rusty_sword',p:15,c:'starcoin'},{id:'leather_vest',p:20,c:'starcoin'},{id:'leather_cap',p:12,c:'starcoin'},{id:'wooden_shield',p:15,c:'starcoin'},{id:'leather_boots',p:10,c:'starcoin'});
  if(tier>=3)items.push({id:'crimson_blade',p:50,c:'bone'},{id:'lantern',p:30,c:'bone'},{id:'bone_armor',p:45,c:'bone'},{id:'iron_helm',p:35,c:'bone'},{id:'power_ring',p:40,c:'bone'});
  var h='';
  items.forEach(function(si){
    var d=ITEMS[si.id];if(!d)return;
    var ci=si.c==='crystal'?'💎':si.c==='starcoin'?'⭐':'🦴';
    var can=G.cur[si.c]>=si.p;
    h+='<div class="si"><span>'+d.icon+' '+d.name+'</span> <span class="pr">'+ci+si.p+'</span> '+(can?'<button class="b m" onclick="buyI(\''+si.id+'\','+si.p+',\''+si.c+'\')">购买</button>':'<span style="color:#666;font-size:11px">不足</span>')+'</div>';
  });
  document.getElementById('sl2').innerHTML=h;
}
function buyI(id,p,c){if(G.cur[c]<p){toast('货币不足');return;}if(!addI(id)){toast('背包满');return;}G.cur[c]-=p;var d=ITEMS[id];toast('购买了'+(d?d.name:id)+'!');rS();}

// Stats
function oT(){document.getElementById('stm').classList.add('on');var need=Math.floor(20*Math.pow(1.5,G.lv-1));var es=eqSt();
  var h='<span class="sl">等级</span><span class="sv">Lv.'+G.lv+'</span>'
    +'<span class="sl">生命</span><span class="sv">'+G.hp+'/'+tMhp()+'</span>'
    +'<span class="sl">攻击</span><span class="sv">'+G.atk+'(+'+es.atk+')</span>'
    +'<span class="sl">防御</span><span class="sv">'+G.def+'(+'+es.def+')</span>'
    +'<span class="sl">经验</span><span class="sv">'+G.xp+'/'+need+'</span>'
    +'<span class="sl">饥饿</span><span class="sv">'+Math.round(G.hunger)+'</span>'
    +'<span class="sl">口渴</span><span class="sv">'+Math.round(G.thirst)+'</span>'
    +'<span class="sl">体温</span><span class="sv">'+G.temp.toFixed(1)+'°C</span>'
    +'<span class="sl">楼层</span><span class="sv">第'+G.floor+'层</span>'
    +'<span class="sl">击杀</span><span class="sv">'+G.kills+'</span>'
    +'<span class="sl">天数</span><span class="sv">'+G.dayCount+'</span>'
    +'<span class="sl">💎</span><span class="sv">'+G.cur.crystal+'</span>'
    +'<span class="sl">⭐</span><span class="sv">'+G.cur.starcoin+'</span>'
    +'<span class="sl">🦴</span><span class="sv">'+G.cur.bone+'</span>';
  document.getElementById('sg2').innerHTML=h;
}

// ── Achievements Panel ───────────────────────────────────────
function oA(){
  document.getElementById('am').classList.add('on');
  var h='';
  ACHIEVEMENTS.forEach(function(a){
    var done=G.achievements.has(a.id);
    h+='<div style="padding:4px 0;border-bottom:1px solid #1a1a1a;opacity:'+(done?'1':'0.4')+'">'
      +'<span>'+a.icon+'</span> <strong>'+a.name+'</strong> — '+a.desc
      +(done?' <span style="color:#44cc44">✓</span>':'')+'</div>';
  });
  document.getElementById('al').innerHTML=h;
}

// ── Game Flow ────────────────────────────────────────────────
function go(){
  initG();G.run++;G.state='play';
  document.getElementById('menu').classList.remove('on');
  document.getElementById('death').classList.remove('on');
  document.getElementById('gs').classList.add('on');
  initFloor();draw();uHUD();
}
function cont(){
  if(!hasSave()){toast('没有存档');return;}
  initG();load();G.state='play';G.diary=[];
  document.getElementById('menu').classList.remove('on');
  document.getElementById('gs').classList.add('on');
  initFloor();draw();uHUD();
}
function bm(){
  document.getElementById('death').classList.remove('on');
  document.getElementById('gs').classList.remove('on');
  document.getElementById('menu').classList.add('on');ckSv();
}
function ckSv(){document.getElementById('cb').style.display=hasSave()?'block':'none';}

// ── Input ────────────────────────────────────────────────────
document.addEventListener('keydown',function(e){
  if(G.state!=='play')return;
  // Combat hotkeys
  if(G.combat){
    if(e.key==='1'){e.preventDefault();cA();}
    if(e.key==='2'){e.preventDefault();cP();}
    if(e.key==='3'){e.preventDefault();cD();}
    if(e.key==='4'){e.preventDefault();cF();}
    return;
  }
  if(e.key==='ArrowUp'||e.key==='w')mv(0,-1);
  if(e.key==='ArrowDown'||e.key==='s')mv(0,1);
  if(e.key==='ArrowLeft'||e.key==='a')mv(-1,0);
  if(e.key==='ArrowRight'||e.key==='d')mv(1,0);
  if(e.key==='i')oI();if(e.key==='c')oC();
  if(e.key==='Escape'){xC('im');xC('crm');xC('sm');xC('stm');xC('am');}
});
var ts=null;
cv.addEventListener('touchstart',function(e){ts={x:e.touches[0].clientX,y:e.touches[0].clientY};});
cv.addEventListener('touchend',function(e){
  if(!ts||G.combat)return;var dx=e.changedTouches[0].clientX-ts.x,dy=e.changedTouches[0].clientY-ts.y;
  if(Math.abs(dx)<20&&Math.abs(dy)<20)return;
  if(Math.abs(dx)>Math.abs(dy))mv(dx>0?1:-1,0);else mv(0,dy>0?1:-1);ts=null;
});
cv.addEventListener('click',function(e){
  if(G.combat)return;var r=cv.getBoundingClientRect(),cx=r.width/2,cy=r.height/2,dx=e.clientX-cx,dy=e.clientY-cy;
  if(Math.abs(dx)<30&&Math.abs(dy)<30)return;
  if(Math.abs(dx)>Math.abs(dy))mv(dx>0?1:-1,0);else mv(0,dy>0?1:-1);
});

// ── Combat Button Bindings (addEventListener instead of inline) ──
function bindCombatButtons(){
  var btnAtk=document.getElementById('btnAtk');
  var btnPow=document.getElementById('btnPow');
  var btnDef=document.getElementById('btnDef');
  var btnFlee=document.getElementById('btnFlee');
  if(btnAtk) btnAtk.addEventListener('click',function(e){e.stopPropagation();console.log('ATK clicked, combat:',!!G.combat);cA();});
  if(btnPow) btnPow.addEventListener('click',function(e){e.stopPropagation();console.log('POW clicked');cP();});
  if(btnDef) btnDef.addEventListener('click',function(e){e.stopPropagation();console.log('DEF clicked');cD();});
  if(btnFlee) btnFlee.addEventListener('click',function(e){e.stopPropagation();console.log('FLEE clicked');cF();});
}

// ── D-Pad Binding ────────────────────────────────────────────
document.querySelectorAll('.dpad-btn').forEach(function(btn){
  var dx=parseInt(btn.dataset.dx),dy=parseInt(btn.dataset.dy);
  btn.addEventListener('touchstart',function(e){e.preventDefault();if(G&&!G.combat&&G.state==='play')mv(dx,dy);});
  btn.addEventListener('mousedown',function(e){e.preventDefault();if(G&&!G.combat&&G.state==='play')mv(dx,dy);});
  // Repeat on hold
  var holdTmr=null;
  btn.addEventListener('touchstart',function(e){holdTmr=setInterval(function(){if(G&&!G.combat&&G.state==='play')mv(dx,dy);},180);});
  btn.addEventListener('touchend',function(){clearInterval(holdTmr);});
  btn.addEventListener('touchcancel',function(){clearInterval(holdTmr);});
});

// ── Init ─────────────────────────────────────────────────────
initG();ckSv();rsz();
bindCombatButtons();
