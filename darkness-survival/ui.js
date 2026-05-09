// ============================================================
// Darkness Survival — Complete UI System
// HTML5 Canvas + Pure JavaScript
// ============================================================

(function () {
  "use strict";

  // ── Constants ──────────────────────────────────────────────
  const TILE = 32;
  const CANVAS_W = 960;
  const CANVAS_H = 640;
  const FPS = 60;

  // ── Theme ──────────────────────────────────────────────────
  const T = {
    bg: "#111111",
    panel: "#1a1a1a",
    border: "#333333",
    borderLight: "#555555",
    text: "#cccccc",
    textDim: "#888888",
    textBright: "#ffffff",
    // quality colours
    common: "#6699cc",
    uncommon: "#66cc66",
    rare: "#cc66cc",
    epic: "#cc4444",
    legendary: "#daa520",
    // bar colours
    hp: "#cc3333",
    hunger: "#cc8833",
    thirst: "#3366cc",
    temp: "#33cccc",
    xp: "#cccc33",
    craftable: "#33aa33",
    uncraftable: "#aa3333",
    // accent
    accent: "#4488cc",
    accentDark: "#336699",
    highlight: "rgba(68,136,204,0.25)",
    overlay: "rgba(0,0,0,0.75)",
  };

  // ── Item quality helpers ───────────────────────────────────
  const QUALITY_COLORS = {
    common: T.common,
    uncommon: T.uncommon,
    rare: T.rare,
    epic: T.epic,
    legendary: T.legendary,
  };

  function qualityColor(q) {
    return QUALITY_COLORS[q] || T.common;
  }

  // ── Canvas setup ───────────────────────────────────────────
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  canvas.style.display = "block";
  canvas.style.margin = "20px auto";
  canvas.style.background = T.bg;
  canvas.style.border = "2px solid " + T.border;
  canvas.style.cursor = "default";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // ── Input state ────────────────────────────────────────────
  const mouse = { x: 0, y: 0, down: false, clicked: false };
  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener("mousedown", (e) => {
    mouse.down = true;
    mouse.clicked = true;
  });
  canvas.addEventListener("mouseup", () => {
    mouse.down = false;
  });

  // ── Drawing helpers ────────────────────────────────────────
  function fillRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }
  function strokeRect(x, y, w, h, color, lw) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lw || 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
  function drawPanel(x, y, w, h) {
    fillRect(x, y, w, h, T.panel);
    strokeRect(x, y, w, h, T.border);
  }
  function text(str, x, y, color, align, size, font) {
    ctx.fillStyle = color || T.text;
    ctx.font = (size || 12) + "px " + (font || "monospace");
    ctx.textAlign = align || "left";
    ctx.textBaseline = "top";
    ctx.fillText(str, x, y);
  }
  function centered(str, x, y, color, size) {
    text(str, x, y, color, "center", size);
  }
  function rightText(str, x, y, color, size) {
    text(str, x, y, color, "right", size);
  }
  function inBounds(mx, my, x, y, w, h) {
    return mx >= x && mx < x + w && my >= y && my < y + h;
  }
  function drawBar(x, y, w, h, frac, fg, bg, label) {
    frac = Math.max(0, Math.min(1, frac));
    fillRect(x, y, w, h, bg || "#222");
    if (frac > 0) fillRect(x, y, w * frac, h, fg);
    strokeRect(x, y, w, h, T.border);
    if (label) {
      ctx.fillStyle = T.textBright;
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x + w / 2, y + h / 2);
    }
  }
  function wrapText(str, x, y, maxW, color, size) {
    ctx.fillStyle = color || T.text;
    ctx.font = (size || 12) + "px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const words = str.split(" ");
    let line = "";
    let lineY = y;
    const lh = (size || 12) + 4;
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line.trim(), x, lineY);
        line = word + " ";
        lineY += lh;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), x, lineY);
    return lineY + lh;
  }
  function iconPlaceholder(x, y, s, letter, col) {
    fillRect(x, y, s, s, "#222");
    strokeRect(x, y, s, s, col || T.border);
    centered(letter || "?", x + s / 2, y + s / 2 - 6, col || T.textDim, 14);
  }

  // ── Tooltip / hover helper ─────────────────────────────────
  function hovered(x, y, w, h) {
    return inBounds(mouse.x, mouse.y, x, y, w, h);
  }
  function clicked(x, y, w, h) {
    return mouse.clicked && inBounds(mouse.x, mouse.y, x, y, w, h);
  }

  // ============================================================
  //  GAME STATE  (mock data — replace with real game state)
  // ============================================================
  const GameState = {
    // player stats
    hp: 72,
    maxHp: 100,
    hunger: 55,
    maxHunger: 100,
    thirst: 30,
    maxThirst: 100,
    temp: 60,
    maxTemp: 100,
    xp: 340,
    xpToNext: 500,
    level: 5,
    floor: 3,
    // currencies
    gold: 128,
    gems: 12,
    tokens: 3,
    // inventory — 24 slots, each {name,quality,icon,desc,type,stats,equipable}
    inventory: [],
    equipped: { weapon: null, armor: null },
    // crafting
    recipes: [],
    // shop
    shopItems: [],
    // diary / log
    log: [],
    // death
    alive: true,
    runCount: 7,
    deathDiary: "",
  };

  // ── Mock data generation ───────────────────────────────────
  const ITEM_POOL = [
    {
      name: "Iron Sword",
      quality: "common",
      icon: "S",
      desc: "A sturdy iron blade.",
      type: "weapon",
      stats: { atk: 8 },
      equipable: true,
    },
    {
      name: "Leather Armor",
      quality: "common",
      icon: "A",
      desc: "Basic leather protection.",
      type: "armor",
      stats: { def: 5 },
      equipable: true,
    },
    {
      name: "Health Potion",
      quality: "common",
      icon: "!",
      desc: "Restores 30 HP.",
      type: "consumable",
      stats: { heal: 30 },
      equipable: false,
    },
    {
      name: "Dragon Blade",
      quality: "legendary",
      icon: "D",
      desc: "Forged in dragonfire. Cuts through darkness itself.",
      type: "weapon",
      stats: { atk: 45, crit: 15 },
      equipable: true,
    },
    {
      name: "Shadow Cloak",
      quality: "epic",
      icon: "C",
      desc: "Woven from living shadow. Grants evasion.",
      type: "armor",
      stats: { def: 22, eva: 10 },
      equipable: true,
    },
    {
      name: "Bandage",
      quality: "common",
      icon: "+",
      desc: "Stops bleeding, restores 10 HP.",
      type: "consumable",
      stats: { heal: 10 },
      equipable: false,
    },
    {
      name: "Mystic Staff",
      quality: "rare",
      icon: "M",
      desc: "Channels arcane energy.",
      type: "weapon",
      stats: { atk: 20, mp: 15 },
      equipable: true,
    },
    {
      name: "Chain Mail",
      quality: "uncommon",
      icon: "H",
      desc: "Interlocking metal rings.",
      type: "armor",
      stats: { def: 12 },
      equipable: true,
    },
    {
      name: "Ancient Relic",
      quality: "epic",
      icon: "R",
      desc: "A fragment of a forgotten age. Tremendous power.",
      type: "accessory",
      stats: { all: 8 },
      equipable: false,
    },
    {
      name: "Bread",
      quality: "common",
      icon: "b",
      desc: "Fills your belly. +20 hunger.",
      type: "consumable",
      stats: { hunger: 20 },
      equipable: false,
    },
    {
      name: "Water Flask",
      quality: "common",
      icon: "w",
      desc: "Clean water. +25 thirst.",
      type: "consumable",
      stats: { thirst: 25 },
      equipable: false,
    },
    {
      name: "Moon Crystal",
      quality: "rare",
      icon: "O",
      desc: "Glows with lunar energy. Trade for goods.",
      type: "material",
      stats: {},
      equipable: false,
    },
  ];

  function populateMockData() {
    // fill inventory with some items
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    GameState.inventory = indices.map((i) => ({ ...ITEM_POOL[i] }));
    // equip first weapon and armor
    GameState.equipped.weapon = { ...ITEM_POOL[3] };
    GameState.equipped.armor = { ...ITEM_POOL[4] };
    // recipes
    GameState.recipes = [
      {
        name: "Iron Sword",
        output: { ...ITEM_POOL[0] },
        materials: [
          { name: "Iron Ore", count: 3, have: 5 },
          { name: "Wood", count: 1, have: 2 },
        ],
      },
      {
        name: "Health Potion",
        output: { ...ITEM_POOL[2] },
        materials: [
          { name: "Herb", count: 2, have: 2 },
          { name: "Water Flask", count: 1, have: 1 },
        ],
      },
      {
        name: "Dragon Blade",
        output: { ...ITEM_POOL[3] },
        materials: [
          { name: "Dragon Scale", count: 5, have: 1 },
          { name: "Moon Crystal", count: 2, have: 0 },
        ],
      },
      {
        name: "Chain Mail",
        output: { ...ITEM_POOL[7] },
        materials: [
          { name: "Iron Ore", count: 6, have: 5 },
          { name: "Leather Strip", count: 3, have: 3 },
        ],
      },
      {
        name: "Bandage",
        output: { ...ITEM_POOL[5] },
        materials: [
          { name: "Cloth", count: 2, have: 4 },
        ],
      },
    ];
    // shop
    GameState.shopItems = [
      { item: { ...ITEM_POOL[2] }, price: 20, currency: "gold", stock: 10 },
      { item: { ...ITEM_POOL[5] }, price: 8, currency: "gold", stock: 25 },
      { item: { ...ITEM_POOL[9] }, price: 5, currency: "gold", stock: 99 },
      { item: { ...ITEM_POOL[10] }, price: 5, currency: "gold", stock: 99 },
      { item: { ...ITEM_POOL[7] }, price: 80, currency: "gold", stock: 3 },
      { item: { ...ITEM_POOL[6] }, price: 3, currency: "gems", stock: 5 },
      { item: { ...ITEM_POOL[4] }, price: 1, currency: "tokens", stock: 1 },
      { item: { ...ITEM_POOL[11] }, price: 15, currency: "gold", stock: 12 },
    ];
    // log
    GameState.log = [
      { text: "You descend to floor 3.", color: T.accent },
      { text: "Found a Health Potion in a chest.", color: T.craftable },
      { text: "A skeleton attacks! -12 HP", color: T.hp },
      { text: "You feel hungry...", color: T.hunger },
      { text: "Discovered a hidden passage.", color: T.legendary },
      { text: "Picked up Iron Ore x2.", color: T.text },
      { text: "The darkness grows thicker.", color: T.rare },
      { text: "Trap triggered! -8 HP", color: T.hp },
    ];
  }

  // ============================================================
  //  TOAST SYSTEM
  // ============================================================
  const ToastSystem = {
    items: [], // {text, color, time, y}

    show(text, color) {
      this.items.push({
        text,
        color: color || T.text,
        time: performance.now(),
        y: 0,
      });
    },

    update() {
      const now = performance.now();
      this.items = this.items.filter((t) => now - t.time < 2200);
      // compute y positions (stack from bottom)
      let yy = CANVAS_H - 50;
      for (let i = this.items.length - 1; i >= 0; i--) {
        const t = this.items[i];
        const age = now - t.time;
        // slide in
        if (age < 200) {
          t._x = CANVAS_W + 200 - (age / 200) * (CANVAS_W + 200);
        } else if (age > 2000) {
          t._x = -((age - 2000) / 200) * 300;
        } else {
          t._x = CANVAS_W - 310;
        }
        t.y = yy;
        yy -= 30;
      }
    },

    draw() {
      for (const t of this.items) {
        const w = 290;
        const h = 24;
        const x = t._x !== undefined ? t._x : CANVAS_W - 310;
        const y = t.y;
        fillRect(x, y, w, h, T.panel);
        strokeRect(x, y, w, h, t.color || T.border);
        text(t.text, x + 8, y + 5, t.color || T.text, "left", 12);
      }
    },
  };

  // helper
  function toast(msg, color) {
    ToastSystem.show(msg, color);
  }

  // ============================================================
  //  HUD SYSTEM
  // ============================================================
  const HUD = {
    draw() {
      const x = 8,
        y = 8;
      const bw = 160,
        bh = 14;

      // ── Player stat bars ──
      drawBar(
        x,
        y,
        bw,
        bh,
        GameState.hp / GameState.maxHp,
        T.hp,
        "#221111",
        "HP  " + GameState.hp + "/" + GameState.maxHp
      );
      drawBar(
        x,
        y + 20,
        bw,
        bh,
        GameState.hunger / GameState.maxHunger,
        T.hunger,
        "#221a11",
        "HUN " + GameState.hunger + "/" + GameState.maxHunger
      );
      drawBar(
        x,
        y + 40,
        bw,
        bh,
        GameState.thirst / GameState.maxThirst,
        T.thirst,
        "#111a22",
        "THR " + GameState.thirst + "/" + GameState.maxThirst
      );
      drawBar(
        x,
        y + 60,
        bw,
        bh,
        GameState.temp / GameState.maxTemp,
        T.temp,
        "#112222",
        "TMP " + GameState.temp + "/" + GameState.maxTemp
      );
      // XP bar (wider)
      drawBar(
        x,
        y + 84,
        bw + 60,
        bh,
        GameState.xp / GameState.xpToNext,
        T.xp,
        "#222211",
        "XP  " + GameState.xp + "/" + GameState.xpToNext
      );

      // Level badge
      fillRect(x + bw + 66, y + 84, 30, 14, T.accentDark);
      strokeRect(x + bw + 66, y + 84, 30, 14, T.accent);
      centered("Lv" + GameState.level, x + bw + 81, y + 87, T.textBright, 10);

      // ── Floor indicator ──
      const fx = CANVAS_W - 130;
      drawPanel(fx, y, 122, 28);
      centered("Floor " + GameState.floor, fx + 61, y + 7, T.textBright, 14);

      // ── Currencies ──
      const cy = y + 34;
      drawPanel(fx, cy, 122, 20);
      text("♦ Gold: " + GameState.gold, fx + 6, cy + 4, "#daa520", "left", 11);
      drawPanel(fx, cy + 24, 122, 20);
      text("♣ Gems: " + GameState.gems, fx + 6, cy + 28, "#cc66cc", "left", 11);
      drawPanel(fx, cy + 48, 122, 20);
      text("★ Tokens: " + GameState.tokens, fx + 6, cy + 52, "#33cccc", "left", 11);
    },
  };

  // ============================================================
  //  DIARY / LOG PANEL  (left side, vertical)
  // ============================================================
  const DiaryPanel = {
    visible: true,
    x: 8,
    y: 130,
    w: 200,
    h: 260,

    toggle() {
      this.visible = !this.visible;
    },

    draw() {
      if (!this.visible) {
        // draw collapsed tab
        fillRect(this.x, this.y, 16, 40, T.panel);
        strokeRect(this.x, this.y, 16, 40, T.border);
        ctx.save();
        ctx.translate(this.x + 8, this.y + 20);
        ctx.rotate(-Math.PI / 2);
        centered("LOG", 0, -5, T.textDim, 10);
        ctx.restore();
        if (clicked(this.x, this.y, 16, 40)) this.toggle();
        return;
      }

      drawPanel(this.x, this.y, this.w, this.h);
      // header
      fillRect(this.x, this.y, this.w, 20, T.accentDark);
      centered("Event Log", this.x + this.w / 2, this.y + 4, T.textBright, 11);

      // close button
      const cx = this.x + this.w - 18;
      if (hovered(cx, this.y + 2, 16, 16)) {
        fillRect(cx, this.y + 2, 16, 16, T.border);
      }
      centered("×", cx + 8, this.y + 4, T.text, 12);
      if (clicked(cx, this.y + 2, 16, 16)) this.toggle();

      // entries (last 8)
      const entries = GameState.log.slice(-8);
      let ey = this.y + 26;
      for (const e of entries) {
        text("› " + e.text, this.x + 6, ey, e.color || T.text, "left", 11);
        ey += 26;
      }
    },
  };

  // ============================================================
  //  INVENTORY UI
  // ============================================================
  const InventoryUI = {
    visible: false,
    x: 220,
    y: 60,
    slotSize: 44,
    cols: 6,
    rows: 4,
    selectedSlot: -1,
    detailOpen: false,

    get w() {
      return this.cols * (this.slotSize + 4) + 24;
    },
    get h() {
      return (
        28 +
        this.rows * (this.slotSize + 4) +
        70 +
        (this.detailOpen ? 180 : 0)
      );
    },

    toggle() {
      this.visible = !this.visible;
      if (!this.visible) {
        this.selectedSlot = -1;
        this.detailOpen = false;
      }
    },

    draw() {
      if (!this.visible) return;

      const x = this.x,
        y = this.y;
      const ss = this.slotSize;
      const gap = 4;

      drawPanel(x, y, this.w, this.h);
      // header
      fillRect(x, y, this.w, 24, T.accentDark);
      centered("Inventory", x + this.w / 2, y + 5, T.textBright, 13);

      // close
      if (hovered(x + this.w - 20, y + 3, 18, 18)) {
        fillRect(x + this.w - 20, y + 3, 18, 18, T.border);
      }
      centered("×", x + this.w - 11, y + 5, T.text, 14);
      if (clicked(x + this.w - 20, y + 3, 18, 18)) this.toggle();

      // ── Equipment slots ──
      const eqY = y + 30;
      text("Equipment:", x + 10, eqY, T.textDim, "left", 11);
      // weapon
      const wx = x + 10,
        wy = eqY + 16;
      this._drawEquipSlot(wx, wy, ss, "WPN", GameState.equipped.weapon);
      // armor
      const ax = x + 10 + ss + 8,
        ay = wy;
      this._drawEquipSlot(ax, ay, ss, "ARM", GameState.equipped.armor);

      // ── Grid ──
      const gx = x + 10;
      const gy = wy + ss + 18;
      text("Items:", x + 10, gy - 14, T.textDim, "left", 11);

      for (let i = 0; i < 24; i++) {
        const col = i % this.cols;
        const row = Math.floor(i / this.cols);
        const sx = gx + col * (ss + gap);
        const sy = gy + row * (ss + gap);
        const item = GameState.inventory[i];

        // background
        let bg = "#1e1e1e";
        if (i === this.selectedSlot) bg = T.highlight;
        else if (hovered(sx, sy, ss, ss)) bg = "#2a2a2a";
        fillRect(sx, sy, ss, ss, bg);

        if (item) {
          const qc = qualityColor(item.quality);
          strokeRect(sx, sy, ss, ss, qc);
          iconPlaceholder(sx + 2, sy + 2, ss - 4, item.icon, qc);
        } else {
          strokeRect(sx, sy, ss, ss, "#282828");
        }

        // click
        if (clicked(sx, sy, ss, ss)) {
          if (item) {
            this.selectedSlot = i;
            this.detailOpen = true;
          } else {
            this.selectedSlot = -1;
            this.detailOpen = false;
          }
        }
      }

      // ── Detail popup ──
      if (this.detailOpen && this.selectedSlot >= 0) {
        const item = GameState.inventory[this.selectedSlot];
        if (item) {
          this._drawDetail(item, x, gy + this.rows * (ss + gap) + 10);
        } else {
          this.detailOpen = false;
        }
      }
    },

    _drawEquipSlot(x, y, s, label, item) {
      fillRect(x, y, s, s, "#1e1e1e");
      if (item) {
        const qc = qualityColor(item.quality);
        strokeRect(x, y, s, s, qc);
        iconPlaceholder(x + 2, y + 2, s - 4, item.icon, qc);
        text(item.name, x + s + 6, y + 4, qc, "left", 10);
        const statStr = Object.entries(item.stats)
          .map(([k, v]) => k + "+" + v)
          .join(" ");
        text(statStr, x + s + 6, y + 18, T.textDim, "left", 10);
      } else {
        strokeRect(x, y, s, s, "#333");
        centered(label, x + s / 2, y + s / 2 - 5, T.textDim, 10);
      }
      // click to unequip
      if (item && clicked(x, y, s + 120, s)) {
        GameState.inventory.push(item);
        if (label === "WPN") GameState.equipped.weapon = null;
        else GameState.equipped.armor = null;
        toast("Unequipped " + item.name, T.text);
      }
    },

    _drawDetail(item, x, y) {
      const w = this.w - 20;
      const h = 170;
      fillRect(x + 5, y, w, h, "#151515");
      strokeRect(x + 5, y, w, h, qualityColor(item.quality));

      const dx = x + 15,
        dy = y + 10;
      // name
      text(item.name, dx, dy, qualityColor(item.quality), "left", 14);
      // quality tag
      text(
        "[" + item.quality + "]",
        dx + ctx.measureText(item.name).width + 160,
        dy,
        qualityColor(item.quality),
        "left",
        10
      );
      // type
      text("Type: " + item.type, dx, dy + 20, T.textDim, "left", 11);
      // stats
      let sy = dy + 38;
      for (const [k, v] of Object.entries(item.stats)) {
        text(k.toUpperCase() + ": +" + v, dx + 10, sy, T.text, "left", 11);
        sy += 16;
      }
      // description
      wrapText(item.desc, dx, sy + 4, w - 30, T.textDim, 11);

      // buttons
      const by = y + h - 34;
      const bw = 72,
        bh = 24;

      if (item.equipable) {
        this._drawButton(dx, by, bw, bh, "Equip", T.accent, () => {
          GameState.inventory.splice(GameState.inventory.indexOf(item), 1);
          if (item.type === "weapon") {
            if (GameState.equipped.weapon)
              GameState.inventory.push(GameState.equipped.weapon);
            GameState.equipped.weapon = item;
          } else if (item.type === "armor") {
            if (GameState.equipped.armor)
              GameState.inventory.push(GameState.equipped.armor);
            GameState.equipped.armor = item;
          }
          toast("Equipped " + item.name, T.craftable);
          this.detailOpen = false;
        });
      }

      if (item.type === "consumable") {
        this._drawButton(dx + 80, by, bw, bh, "Use", T.craftable, () => {
          GameState.inventory.splice(GameState.inventory.indexOf(item), 1);
          if (item.stats.heal)
            GameState.hp = Math.min(
              GameState.maxHp,
              GameState.hp + item.stats.heal
            );
          if (item.stats.hunger)
            GameState.hunger = Math.min(
              GameState.maxHunger,
              GameState.hunger + item.stats.hunger
            );
          if (item.stats.thirst)
            GameState.thirst = Math.min(
              GameState.maxThirst,
              GameState.thirst + item.stats.thirst
            );
          toast("Used " + item.name, T.craftable);
          this.detailOpen = false;
          this.selectedSlot = -1;
        });
      }

      this._drawButton(dx + 160, by, bw, bh, "Drop", T.uncraftable, () => {
        GameState.inventory.splice(GameState.inventory.indexOf(item), 1);
        toast("Dropped " + item.name, T.uncraftable);
        this.detailOpen = false;
        this.selectedSlot = -1;
      });
    },

    _drawButton(x, y, w, h, label, color, onClick) {
      const hov = hovered(x, y, w, h);
      fillRect(x, y, w, h, hov ? color : T.panel);
      strokeRect(x, y, w, h, color);
      centered(label, x + w / 2, y + 5, hov ? T.textBright : color, 12);
      if (clicked(x, y, w, h)) onClick();
    },
  };

  // ============================================================
  //  CRAFTING UI
  // ============================================================
  const CraftingUI = {
    visible: false,
    x: 220,
    y: 60,
    selectedRecipe: -1,

    get w() {
      return 380;
    },
    get h() {
      return 360;
    },

    toggle() {
      this.visible = !this.visible;
      if (!this.visible) this.selectedRecipe = -1;
    },

    canCraft(recipe) {
      return recipe.materials.every((m) => m.have >= m.count);
    },

    draw() {
      if (!this.visible) return;

      const x = this.x,
        y = this.y;
      drawPanel(x, y, this.w, this.h);
      // header
      fillRect(x, y, this.w, 24, T.accentDark);
      centered("Crafting", x + this.w / 2, y + 5, T.textBright, 13);

      // close
      if (hovered(x + this.w - 20, y + 3, 18, 18))
        fillRect(x + this.w - 20, y + 3, 18, 18, T.border);
      centered("×", x + this.w - 11, y + 5, T.text, 14);
      if (clicked(x + this.w - 20, y + 3, 18, 18)) this.toggle();

      // ── Recipe list ──
      const ly = y + 30;
      const lw = 160;
      for (let i = 0; i < GameState.recipes.length; i++) {
        const r = GameState.recipes[i];
        const ry = ly + i * 32;
        const can = this.canCraft(r);
        const sel = i === this.selectedRecipe;
        const hov = hovered(x + 6, ry, lw - 6, 28);

        fillRect(
          x + 6,
          ry,
          lw - 6,
          28,
          sel ? T.highlight : hov ? "#2a2a2a" : "#1a1a1a"
        );
        strokeRect(
          x + 6,
          ry,
          lw - 6,
          28,
          can ? T.craftable : T.uncraftable
        );
        // icon
        iconPlaceholder(x + 10, ry + 3, 22, r.output.icon, qualityColor(r.output.quality));
        text(
          r.name,
          x + 38,
          ry + 7,
          can ? T.textBright : T.textDim,
          "left",
          11
        );
        // craftable indicator
        centered(can ? "✓" : "×", x + lw - 14, ry + 7, can ? T.craftable : T.uncraftable, 12);

        if (clicked(x + 6, ry, lw - 6, 28)) {
          this.selectedRecipe = i;
        }
      }

      // ── Recipe detail ──
      if (this.selectedRecipe >= 0) {
        const r = GameState.recipes[this.selectedRecipe];
        const dx = x + lw + 16;
        const dy = ly;
        const dw = this.w - lw - 28;

        fillRect(dx, dy, dw, this.h - 40, "#151515");
        strokeRect(dx, dy, dw, this.h - 40, T.border);

        // output item
        text("Output:", dx + 10, dy + 10, T.textDim, "left", 11);
        iconPlaceholder(dx + 10, dy + 26, 32, r.output.icon, qualityColor(r.output.quality));
        text(r.output.name, dx + 50, dy + 28, qualityColor(r.output.quality), "left", 13);
        text(
          r.output.type,
          dx + 50,
          dy + 46,
          T.textDim,
          "left",
          10
        );

        // materials
        text("Materials:", dx + 10, dy + 72, T.textDim, "left", 11);
        let my = dy + 90;
        for (const m of r.materials) {
          const has = m.have >= m.count;
          fillRect(dx + 10, my, dw - 20, 22, "#1e1e1e");
          text(
            m.name,
            dx + 16,
            my + 5,
            has ? T.craftable : T.uncraftable,
            "left",
            11
          );
          rightText(
            m.have + "/" + m.count,
            dx + dw - 16,
            my + 5,
            has ? T.craftable : T.uncraftable,
            11
          );
          my += 26;
        }

        // craft button
        const can = this.canCraft(r);
        const bx = dx + 10,
          by = dy + this.h - 80,
          bw = dw - 20,
          bh = 30;
        const bhov = hovered(bx, by, bw, bh);
        fillRect(bx, by, bw, bh, can ? (bhov ? T.craftable : T.accentDark) : "#222");
        strokeRect(bx, by, bw, bh, can ? T.craftable : "#444");
        centered(
          "CRAFT",
          bx + bw / 2,
          by + 8,
          can ? T.textBright : T.textDim,
          14
        );

        if (can && clicked(bx, by, bw, bh)) {
          // auto-craft: consume materials, add item to inventory
          for (const m of r.materials) {
            m.have -= m.count;
          }
          GameState.inventory.push({ ...r.output });
          toast("Crafted " + r.output.name + "!", T.craftable);
        }
      }
    },
  };

  // ============================================================
  //  SHOP UI
  // ============================================================
  const ShopUI = {
    visible: false,
    x: 220,
    y: 60,
    selectedShop: -1,

    get w() {
      return 420;
    },
    get h() {
      return 380;
    },

    toggle() {
      this.visible = !this.visible;
      if (!this.visible) this.selectedShop = -1;
    },

    currencySymbol(c) {
      if (c === "gold") return "♦";
      if (c === "gems") return "♣";
      if (c === "tokens") return "★";
      return "?";
    },
    currencyColor(c) {
      if (c === "gold") return "#daa520";
      if (c === "gems") return "#cc66cc";
      if (c === "tokens") return "#33cccc";
      return T.text;
    },
    playerCurrency(c) {
      if (c === "gold") return GameState.gold;
      if (c === "gems") return GameState.gems;
      if (c === "tokens") return GameState.tokens;
      return 0;
    },

    draw() {
      if (!this.visible) return;

      const x = this.x,
        y = this.y;
      drawPanel(x, y, this.w, this.h);
      // header
      fillRect(x, y, this.w, 24, T.accentDark);
      centered("Shop", x + this.w / 2, y + 5, T.textBright, 13);

      // close
      if (hovered(x + this.w - 20, y + 3, 18, 18))
        fillRect(x + this.w - 20, y + 3, 18, 18, T.border);
      centered("×", x + this.w - 11, y + 5, T.text, 14);
      if (clicked(x + this.w - 20, y + 3, 18, 18)) this.toggle();

      // currency balance header
      const by = y + 30;
      fillRect(x + 10, by, this.w - 20, 22, "#151515");
      text(
        "♦ " + GameState.gold + "   ♣ " + GameState.gems + "   ★ " + GameState.tokens,
        x + 16,
        by + 5,
        T.textDim,
        "left",
        11
      );

      // ── Item list ──
      const ly = by + 30;
      const rowH = 38;
      for (let i = 0; i < GameState.shopItems.length; i++) {
        const s = GameState.shopItems[i];
        const ry = ly + i * (rowH + 4);
        const sel = i === this.selectedShop;
        const hov = hovered(x + 10, ry, this.w - 20, rowH);
        const canBuy =
          s.stock > 0 && this.playerCurrency(s.currency) >= s.price;

        fillRect(
          x + 10,
          ry,
          this.w - 20,
          rowH,
          sel ? T.highlight : hov ? "#2a2a2a" : "#1a1a1a"
        );
        strokeRect(x + 10, ry, this.w - 20, rowH, T.border);

        // icon
        iconPlaceholder(
          x + 14,
          ry + 4,
          30,
          s.item.icon,
          qualityColor(s.item.quality)
        );

        // name + stock
        text(
          s.item.name,
          x + 52,
          ry + 5,
          canBuy ? qualityColor(s.item.quality) : T.textDim,
          "left",
          12
        );
        text("Stock: " + s.stock, x + 52, ry + 22, T.textDim, "left", 10);

        // price
        const cc = this.currencyColor(s.currency);
        const sym = this.currencySymbol(s.currency);
        rightText(
          sym + " " + s.price,
          x + this.w - 90,
          ry + 11,
          canBuy ? cc : T.textDim,
          13
        );

        // buy button
        const bx = x + this.w - 80,
          bby = ry + 6,
          bw = 60,
          bh = 26;
        const bhov = hovered(bx, bby, bw, bh);
        fillRect(bx, bby, bw, bh, canBuy ? (bhov ? T.craftable : T.accentDark) : "#222");
        strokeRect(bx, bby, bw, bh, canBuy ? T.craftable : "#444");
        centered("BUY", bx + bw / 2, bby + 6, canBuy ? T.textBright : T.textDim, 11);

        if (canBuy && clicked(bx, bby, bw, bh)) {
          // deduct currency
          if (s.currency === "gold") GameState.gold -= s.price;
          else if (s.currency === "gems") GameState.gems -= s.price;
          else if (s.currency === "tokens") GameState.tokens -= s.price;
          s.stock--;
          GameState.inventory.push({ ...s.item });
          toast("Bought " + s.item.name + "!", this.currencyColor(s.currency));
        }
      }
    },
  };

  // ============================================================
  //  DEATH SCREEN
  // ============================================================
  const DeathScreen = {
    visible: false,

    show() {
      this.visible = true;
      GameState.alive = false;
      GameState.deathDiary =
        "You ventured deeper than ever before. Floor " +
        GameState.floor +
        " proved too much. The darkness consumed you, but you will return stronger.";
    },

    draw() {
      if (!this.visible) return;

      // full overlay
      fillRect(0, 0, CANVAS_W, CANVAS_H, T.overlay);

      const pw = 420,
        ph = 440;
      const px = (CANVAS_W - pw) / 2,
        py = (CANVAS_H - ph) / 2;
      drawPanel(px, py, pw, ph);

      // skull icon
      centered("☠", CANVAS_W / 2, py + 20, T.hp, 48);

      // title
      centered("YOU DIED", CANVAS_W / 2, py + 78, T.hp, 28);

      // stats
      const sy = py + 120;
      const stats = [
        ["Floor Reached", GameState.floor],
        ["Level", GameState.level],
        ["Run #", GameState.runCount],
        ["Gold Collected", GameState.gold],
        ["Items Found", GameState.inventory.length],
      ];
      let stY = sy;
      for (const [label, val] of stats) {
        text(label + ":", px + 40, stY, T.textDim, "left", 12);
        rightText(String(val), px + pw - 40, stY, T.textBright, 12);
        stY += 22;
      }

      // death diary
      stY += 12;
      text("Your Story:", px + 40, stY, T.accent, "left", 12);
      stY += 18;
      wrapText(GameState.deathDiary, px + 40, stY, pw - 80, T.textDim, 11);

      // buttons
      const bw = 120,
        bh = 34;
      const b1x = px + 60,
        b1y = py + ph - 54;
      const b2x = px + pw - 60 - bw,
        b2y = b1y;

      // Retry
      const rh = hovered(b1x, b1y, bw, bh);
      fillRect(b1x, b1y, bw, bh, rh ? T.craftable : T.accentDark);
      strokeRect(b1x, b1y, bw, bh, T.craftable);
      centered("RETRY", b1x + bw / 2, b1y + 9, T.textBright, 14);
      if (clicked(b1x, b1y, bw, bh)) {
        this.visible = false;
        GameState.alive = true;
        GameState.hp = GameState.maxHp;
        GameState.hunger = GameState.maxHunger;
        GameState.thirst = GameState.maxThirst;
        GameState.floor = 1;
        GameState.runCount++;
        populateMockData();
        toast("A new run begins...", T.accent);
      }

      // Menu
      const mh = hovered(b2x, b2y, bw, bh);
      fillRect(b2x, b2y, bw, bh, mh ? "#555" : T.panel);
      strokeRect(b2x, b2y, bw, bh, T.borderLight);
      centered("MENU", b2x + bw / 2, b2y + 9, T.text, 14);
      if (clicked(b2x, b2y, bw, bh)) {
        toast("Returning to menu...", T.text);
      }
    },
  };

  // ============================================================
  //  NAVIGATION BAR  (bottom bar to toggle panels)
  // ============================================================
  const NavBar = {
    buttons: [
      { label: "Inventory [I]", key: "I", panel: InventoryUI },
      { label: "Crafting [C]", key: "C", panel: CraftingUI },
      { label: "Shop [S]", key: "S", panel: ShopUI },
      { label: "Log [L]", key: "L", panel: DiaryPanel },
      { label: "Die [K]", key: "K", panel: null },
    ],

    draw() {
      const bw = 130,
        bh = 28;
      const totalW = this.buttons.length * (bw + 8);
      const startX = (CANVAS_W - totalW) / 2;
      const y = CANVAS_H - 40;

      for (let i = 0; i < this.buttons.length; i++) {
        const b = this.buttons[i];
        const bx = startX + i * (bw + 8);
        const active = b.panel ? b.panel.visible : false;
        const hov = hovered(bx, y, bw, bh);

        fillRect(bx, y, bw, bh, active ? T.accentDark : hov ? "#2a2a2a" : T.panel);
        strokeRect(bx, y, bw, bh, active ? T.accent : T.border);
        centered(b.label, bx + bw / 2, y + 7, active ? T.textBright : T.text, 11);

        if (clicked(bx, y, bw, bh)) {
          if (b.key === "K") {
            DeathScreen.show();
          } else if (b.panel) {
            b.panel.toggle();
          }
        }
      }
    },
  };

  // ── Keyboard shortcuts ─────────────────────────────────────
  document.addEventListener("keydown", (e) => {
    const k = e.key.toUpperCase();
    if (k === "I") InventoryUI.toggle();
    if (k === "C") CraftingUI.toggle();
    if (k === "S") ShopUI.toggle();
    if (k === "L") DiaryPanel.toggle();
    if (k === "K") DeathScreen.show();
    if (k === "ESCAPE") {
      InventoryUI.visible = false;
      InventoryUI.detailOpen = false;
      CraftingUI.visible = false;
      ShopUI.visible = false;
    }
  });

  // ============================================================
  //  MINIMAP PLACEHOLDER
  // ============================================================
  function drawMinimap() {
    const mx = CANVAS_W - 130,
      my = 170;
    const mw = 122,
      mh = 100;
    drawPanel(mx, my, mw, mh);
    centered("Minimap", mx + mw / 2, my + mh / 2 - 6, T.textDim, 11);
    // draw some fake rooms
    const rooms = [
      [20, 20, 30, 20],
      [60, 15, 25, 25],
      [30, 50, 35, 22],
      [75, 50, 20, 20],
      [15, 55, 15, 15],
    ];
    for (const [rx, ry, rw, rh] of rooms) {
      fillRect(mx + rx, my + ry, rw, rh, "#222");
      strokeRect(mx + rx, my + ry, rw, rh, "#444");
    }
    // player dot
    fillRect(mx + 42, my + 57, 5, 5, T.craftable);
  }

  // ============================================================
  //  GAME INFO / TIPS
  // ============================================================
  function drawTips() {
    const tx = 8,
      ty = CANVAS_H - 40;
    text("Controls: [I] Inventory  [C] Craft  [S] Shop  [L] Log  [K] Kill  [ESC] Close", tx, ty, T.textDim, "left", 10);
  }

  // ============================================================
  //  MAIN LOOP
  // ============================================================
  function frame() {
    // clear
    ctx.fillStyle = T.bg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // fake game area (tile grid background)
    const gameX = 220,
      gameY = 120;
    const gameW = CANVAS_W - 360,
      gameH = CANVAS_H - 170;
    fillRect(gameX, gameY, gameW, gameH, "#0a0a0a");
    strokeRect(gameX, gameY, gameW, gameH, "#222");
    // grid lines
    ctx.strokeStyle = "#151515";
    ctx.lineWidth = 0.5;
    for (let gx = gameX; gx < gameX + gameW; gx += TILE) {
      ctx.beginPath();
      ctx.moveTo(gx, gameY);
      ctx.lineTo(gx, gameY + gameH);
      ctx.stroke();
    }
    for (let gy = gameY; gy < gameY + gameH; gy += TILE) {
      ctx.beginPath();
      ctx.moveTo(gameX, gy);
      ctx.lineTo(gameX + gameW, gy);
      ctx.stroke();
    }
    // player icon
    const ppx = gameX + Math.floor(gameW / 2 / TILE) * TILE;
    const ppy = gameY + Math.floor(gameH / 2 / TILE) * TILE;
    fillRect(ppx, ppy, TILE, TILE, "#2a4a2a");
    strokeRect(ppx, ppy, TILE, TILE, T.craftable);
    centered("@", ppx + TILE / 2, ppy + TILE / 2 - 8, T.craftable, 18);

    // draw systems
    HUD.draw();
    DiaryPanel.draw();
    drawMinimap();
    drawTips();

    // panels on top
    InventoryUI.draw();
    CraftingUI.draw();
    ShopUI.draw();
    DeathScreen.draw();

    // nav bar
    NavBar.draw();

    // toasts last (topmost)
    ToastSystem.update();
    ToastSystem.draw();

    // reset click
    mouse.clicked = false;

    requestAnimationFrame(frame);
  }

  // ── Bootstrap ──────────────────────────────────────────────
  populateMockData();
  toast("Welcome to Darkness Survival!", T.legendary);
  toast("Use buttons below or keyboard shortcuts.", T.textDim);
  requestAnimationFrame(frame);
})();
