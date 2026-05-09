// ============================================================
// Darkness Survival — Game UI (Prototype)
// Immediate-mode OnGUI for rapid prototyping
// Ported from game.html + level.html UI
// ============================================================
using System.Collections.Generic;
using UnityEngine;

public class GameUI : MonoBehaviour
{
    GameManager gm;
    GUIStyle headerStyle, logStyle, statStyle, buttonStyle, redStyle, goldStyle;
    Vector2 scrollLog, scrollShop, scrollBag, scrollCraft;
    int selectedBagIndex = -1;
    int selectedCraftIndex = -1;
    bool stylesInit = false;

    void Start()
    {
        gm = GameManager.Instance;
        gm.OnStateChanged += () => { selectedBagIndex = -1; selectedCraftIndex = -1; };
    }

    void InitStyles()
    {
        if (stylesInit) return;
        stylesInit = true;

        headerStyle = new GUIStyle(GUI.skin.label) { fontSize = 22, fontStyle = FontStyle.Bold, alignment = TextAnchor.MiddleCenter };
        logStyle = new GUIStyle(GUI.skin.label) { fontSize = 12, richText = true, wordWrap = true };
        statStyle = new GUIStyle(GUI.skin.label) { fontSize = 14 };
        buttonStyle = new GUIStyle(GUI.skin.button) { fontSize = 14, fixedHeight = 32 };

        redStyle = new GUIStyle(GUI.skin.label) { fontSize = 14, normal = { textColor = new Color(0.8f, 0.2f, 0.2f) } };
        goldStyle = new GUIStyle(GUI.skin.label) { fontSize = 14, normal = { textColor = new Color(0.8f, 0.7f, 0.2f) } };
    }

    void OnGUI()
    {
        InitStyles();

        switch (gm.state)
        {
            case GameState.Menu: DrawMenu(); break;
            case GameState.Play: DrawPlay(); break;
            case GameState.Combat: DrawCombat(); break;
            case GameState.Dead: DrawDeath(); break;
            case GameState.Shop: DrawPlay(); DrawShop(); break;
            case GameState.Inventory: DrawPlay(); DrawInventory(); break;
            case GameState.Crafting: DrawPlay(); DrawCrafting(); break;
        }
    }

    // ── Menu ──────────────────────────────────────────────────

    void DrawMenu()
    {
        float w = 400, h = 300;
        float x = (Screen.width - w) / 2, y = (Screen.height - h) / 2;
        GUI.Box(new Rect(x, y, w, h), "");

        GUI.Label(new Rect(x, y + 20, w, 40), "黑暗生存", headerStyle);
        GUI.Label(new Rect(x, y + 60, w, 20), "Darkness Survival", new GUIStyle(GUI.skin.label) { fontSize = 14, alignment = TextAnchor.MiddleCenter, normal = { textColor = Color.gray } });

        if (GUI.Button(new Rect(x + 100, y + 120, 200, 40), "开始游戏", buttonStyle))
            gm.NewGame();

        GUI.Label(new Rect(x + 50, y + 200, 300, 20), "WASD/方向键 移动 | I 背包 | C 制作",
            new GUIStyle(GUI.skin.label) { fontSize = 12, alignment = TextAnchor.MiddleCenter, normal = { textColor = Color.gray } });
    }

    // ── Play ──────────────────────────────────────────────────

    void DrawPlay()
    {
        var p = gm.player;

        // ─ Top bar ─
        GUI.Box(new Rect(0, 0, Screen.width, 36), "");
        GUI.Label(new Rect(10, 8, 60, 20), $"F{p.floor}", redStyle);
        GUI.Label(new Rect(70, 8, 50, 20), $"Lv.{p.level}");
        GUI.Label(new Rect(120, 8, 120, 20), $"HP {p.hp}/{p.maxHp}", redStyle);
        GUI.Label(new Rect(240, 8, 80, 20), $"ATK {p.GetTotalAtk()}");
        GUI.Label(new Rect(320, 8, 80, 20), $"DEF {p.GetTotalDef()}");
        GUI.Label(new Rect(410, 8, 80, 20), $"饱 {Mathf.RoundToInt(p.hunger)}", new GUIStyle(statStyle) { normal = { textColor = new Color(0.8f, 0.5f, 0.1f) } });
        GUI.Label(new Rect(490, 8, 80, 20), $"渴 {Mathf.RoundToInt(p.thirst)}", new GUIStyle(statStyle) { normal = { textColor = new Color(0.2f, 0.4f, 0.8f) } });
        GUI.Label(new Rect(570, 8, 80, 20), $"温 {p.temp:F0}°");
        GUI.Label(new Rect(660, 8, 80, 20), $"金 {p.currency}", goldStyle);

        // ─ Map ─
        float mapY = 40;
        float mapH = Screen.height - 200;
        GUI.Box(new Rect(0, mapY, Screen.width, mapH), "");

        if (gm.dungeon != null)
        {
            float tileSize = Mathf.Min(Screen.width / 19f, mapH / 13f);
            float ox = Screen.width / 2 - gm.playerX * tileSize - tileSize / 2;
            float oy = mapY + mapH / 2 - gm.playerY * tileSize - tileSize / 2;

            int viewR = 9;
            for (int dy = -viewR; dy <= viewR; dy++)
            {
                for (int dx = -viewR; dx <= viewR; dx++)
                {
                    int mx = gm.playerX + dx, my = gm.playerY + dy;
                    float sx = mx * tileSize + ox, sy = my * tileSize + oy;

                    if (sx < -tileSize || sx > Screen.width || sy < mapY - tileSize || sy > mapY + mapH) continue;
                    if (mx < 0 || mx >= gm.dungeon.width || my < 0 || my >= gm.dungeon.height) continue;

                    int vis = gm.fog[mx, my];
                    if (vis == 0)
                    {
                        GUI.color = Color.black;
                        GUI.DrawTexture(new Rect(sx, sy, tileSize, tileSize), Texture2D.whiteTexture);
                        GUI.color = Color.white;
                        continue;
                    }

                    bool isCurrent = vis == 2;
                    Color dimColor = isCurrent ? Color.white : new Color(0.3f, 0.3f, 0.3f);
                    int tile = gm.dungeon.grid[mx, my];

                    // Floor
                    GUI.color = isCurrent ? new Color(0.15f, 0.15f, 0.15f) : new Color(0.08f, 0.08f, 0.08f);
                    GUI.DrawTexture(new Rect(sx, sy, tileSize, tileSize), Texture2D.whiteTexture);

                    if (tile == 1) // Wall
                    {
                        GUI.color = isCurrent ? new Color(0.25f, 0.15f, 0.3f) : new Color(0.12f, 0.08f, 0.15f);
                        GUI.DrawTexture(new Rect(sx, sy, tileSize, tileSize), Texture2D.whiteTexture);
                    }
                    else if (tile == 2 && isCurrent) // Stairs
                    {
                        GUI.color = new Color(0.2f, 0.8f, 0.3f);
                        GUI.Label(new Rect(sx, sy, tileSize, tileSize), "▼", new GUIStyle(GUI.skin.label) { fontSize = (int)(tileSize * 0.6f), alignment = TextAnchor.MiddleCenter });
                    }
                    else if (tile == 3 && isCurrent) // Resource
                    {
                        GUI.color = new Color(0.8f, 0.5f, 0.2f);
                        GUI.DrawTexture(new Rect(sx + tileSize * 0.25f, sy + tileSize * 0.25f, tileSize * 0.5f, tileSize * 0.5f), Texture2D.whiteTexture);
                    }
                    else if (tile == 4 && isCurrent) // Shop
                    {
                        GUI.color = new Color(0.6f, 0.3f, 0.8f);
                        GUI.Label(new Rect(sx, sy, tileSize, tileSize), "S", new GUIStyle(GUI.skin.label) { fontSize = (int)(tileSize * 0.6f), fontStyle = FontStyle.Bold, alignment = TextAnchor.MiddleCenter });
                    }
                    else if (tile == 5 && isCurrent) // Boss
                    {
                        GUI.color = new Color(0.9f, 0.2f, 0.2f);
                        GUI.Label(new Rect(sx, sy, tileSize, tileSize), "B", new GUIStyle(GUI.skin.label) { fontSize = (int)(tileSize * 0.6f), fontStyle = FontStyle.Bold, alignment = TextAnchor.MiddleCenter });
                    }

                    // Ground items
                    for (int gi = 0; gi < gm.groundItems.Count; gi++)
                    {
                        if (gm.groundItems[gi].x == mx && gm.groundItems[gi].y == my && isCurrent)
                        {
                            GUI.color = new Color(0.3f, 0.5f, 1f);
                            GUI.DrawTexture(new Rect(sx + tileSize * 0.35f, sy + tileSize * 0.35f, tileSize * 0.3f, tileSize * 0.3f), Texture2D.whiteTexture);
                        }
                    }

                    // Monsters
                    if (isCurrent)
                    {
                        foreach (var mon in gm.monsters)
                        {
                            if (mon.alive && mon.x == mx && mon.y == my)
                            {
                                GUI.color = mon.tier == MonsterTier.Boss ? Color.red : mon.tier == MonsterTier.Elite ? new Color(1f, 0.6f, 0f) : new Color(0.9f, 0.2f, 0.2f);
                                GUI.Label(new Rect(sx, sy, tileSize, tileSize), mon.icon,
                                    new GUIStyle(GUI.skin.label) { fontSize = (int)(tileSize * 0.7f), alignment = TextAnchor.MiddleCenter, normal = { textColor = GUI.color } });
                            }
                        }
                    }

                    // Grid line
                    GUI.color = isCurrent ? new Color(0.2f, 0.2f, 0.2f) : new Color(0.1f, 0.1f, 0.1f);
                    GUI.DrawTexture(new Rect(sx, sy, tileSize, 1), Texture2D.whiteTexture);
                    GUI.DrawTexture(new Rect(sx, sy, 1, tileSize), Texture2D.whiteTexture);
                }
            }

            // Player
            float px = Screen.width / 2 - tileSize / 2;
            float py = mapY + mapH / 2 - tileSize / 2;
            GUI.color = Color.white;
            GUI.Label(new Rect(px, py, tileSize, tileSize), "@",
                new GUIStyle(GUI.skin.label) { fontSize = (int)(tileSize * 0.8f), fontStyle = FontStyle.Bold, alignment = TextAnchor.MiddleCenter, normal = { textColor = Color.white } });
        }
        GUI.color = Color.white;

        // ─ Diary ─
        float diaryY = Screen.height - 160;
        GUI.Box(new Rect(0, diaryY, Screen.width * 0.4f, 120), "");
        scrollLog = GUILayout.BeginScrollView(scrollLog, GUILayout.Width(Screen.width * 0.4f), GUILayout.Height(120));
        GUILayout.BeginArea(new Rect(4, diaryY + 4, Screen.width * 0.4f - 8, 116));
        int logStart = Mathf.Max(0, gm.diary.Count - 10);
        for (int i = logStart; i < gm.diary.Count; i++)
            GUILayout.Label(gm.diary[i], logStyle);
        GUILayout.EndArea();
        GUILayout.EndScrollView();

        // ─ Bottom buttons ─
        float btnY = Screen.height - 36;
        float btnW = Screen.width / 5f;

        if (GUI.Button(new Rect(0, btnY, btnW, 36), "背包 [I]", buttonStyle))
            gm.OpenInventory();
        if (GUI.Button(new Rect(btnW, btnY, btnW, 36), "制作 [C]", buttonStyle))
            gm.OpenCrafting();
        if (GUI.Button(new Rect(btnW * 2, btnY, btnW, 36), "属性 [T]", buttonStyle))
            ShowStats = !ShowStats;
        if (GUI.Button(new Rect(btnW * 3, btnY, btnW, 36), "商店", buttonStyle))
        {
            // Find adjacent shop
            if (gm.dungeon.grid[gm.playerX, gm.playerY] == 4)
                gm.state = GameState.Shop;
        }
        if (GUI.Button(new Rect(btnW * 4, btnY, btnW, 36), "保存", buttonStyle))
            gm.AddDiary("保存成功");

        // Stats popup
        if (ShowStats) DrawStats();
    }

    bool ShowStats = false;

    void DrawStats()
    {
        var p = gm.player;
        float w = 260, h = 260;
        float x = (Screen.width - w) / 2, y = (Screen.height - h) / 2;
        GUI.Box(new Rect(x, y, w, h), "");

        float row = y + 10;
        void StatRow(string label, string val) { GUI.Label(new Rect(x + 10, row, 100, 20), label); GUI.Label(new Rect(x + 120, row, 120, 20), val); row += 22; }

        StatRow("等级", $"Lv.{p.level}");
        StatRow("生命", $"{p.hp}/{p.maxHp}");
        StatRow("攻击", $"{p.baseAtk} (+{p.GetTotalAtk() - p.baseAtk} 装备)");
        StatRow("防御", $"{p.baseDef} (+{p.GetTotalDef() - p.baseDef} 装备)");
        StatRow("经验", $"{p.xp}/{GameDatabase.GetXPForLevel(p.level)}");
        StatRow("楼层", $"{p.floor}");
        StatRow("金币", $"{p.currency}");
        StatRow("击杀", $"{p.kills}");
        StatRow("视野", $"{p.vision}");
        StatRow("怪物倍率", $"x{GameDatabase.GetStatMultiplier(p.floor):F1}");

        if (GUI.Button(new Rect(x + 60, y + h - 36, 140, 28), "关闭"))
            ShowStats = false;
    }

    // ── Combat ────────────────────────────────────────────────

    void DrawCombat()
    {
        float w = Screen.width * 0.6f;
        float h = Screen.height * 0.8f;
        float x = (Screen.width - w) / 2, y = (Screen.height - h) / 2;
        GUI.Box(new Rect(x, y, w, h), "");

        var c = gm.combat;
        var e = c.currentEnemy;
        var p = gm.player;

        // Title
        GUI.Label(new Rect(x, y + 10, w, 30), "⚔ 战斗", headerStyle);

        // Enemy info
        float ey = y + 50;
        Color eColor = e.tier == MonsterTier.Boss ? Color.red : e.tier == MonsterTier.Elite ? new Color(1f, 0.6f, 0f) : Color.white;
        GUI.Label(new Rect(x + 20, ey, w - 40, 30),
            $"{e.icon} {e.name} {(e.tier == MonsterTier.Boss ? "[BOSS]" : e.tier == MonsterTier.Elite ? "[ELITE]" : "")}",
            new GUIStyle(GUI.skin.label) { fontSize = 20, normal = { textColor = eColor } });

        // Enemy HP bar
        float barW = w - 80;
        float barH = 16;
        float barX = x + 40;
        float barY = ey + 35;
        float hpPct = (float)e.hp / e.maxHp;
        GUI.color = new Color(0.2f, 0f, 0f);
        GUI.DrawTexture(new Rect(barX, barY, barW, barH), Texture2D.whiteTexture);
        GUI.color = hpPct > 0.5f ? new Color(0.2f, 0.8f, 0.2f) : hpPct > 0.25f ? new Color(0.8f, 0.8f, 0.2f) : new Color(0.8f, 0.2f, 0.2f);
        GUI.DrawTexture(new Rect(barX, barY, barW * hpPct, barH), Texture2D.whiteTexture);
        GUI.color = Color.white;
        GUI.Label(new Rect(barX, barY, barW, barH), $"{e.hp}/{e.maxHp}",
            new GUIStyle(GUI.skin.label) { alignment = TextAnchor.MiddleCenter, fontSize = 12, normal = { textColor = Color.white } });

        GUI.Label(new Rect(barX, barY + barH + 2, barW, 20), $"ATK:{e.atk}  DEF:{e.def}",
            new GUIStyle(GUI.skin.label) { alignment = TextAnchor.MiddleCenter, fontSize = 12, normal = { textColor = Color.gray } });

        // Player info
        float py = barY + 60;
        GUI.Label(new Rect(x + 20, py, w - 40, 25), $"HP: {p.hp}/{p.maxHp}  ATK: {p.GetTotalAtk()}  DEF: {p.GetTotalDef()}",
            new GUIStyle(GUI.skin.label) { fontSize = 14 });

        if (c.powered)
            GUI.Label(new Rect(x + 20, py + 22, w - 40, 20), "蓄力中！下次攻击 1.5x",
                new GUIStyle(GUI.skin.label) { fontSize = 12, normal = { textColor = new Color(1f, 0.8f, 0.2f) } });

        if (c.defending)
            GUI.Label(new Rect(x + 20, py + 40, w - 40, 20), "防御中",
                new GUIStyle(GUI.skin.label) { fontSize = 12, normal = { textColor = new Color(0.2f, 0.6f, 1f) } });

        // Combat log
        float logY = py + 65;
        float logH = h * 0.3f;
        GUI.Box(new Rect(x + 20, logY, w - 40, logH), "");
        GUILayout.BeginArea(new Rect(x + 24, logY + 4, w - 48, logH - 8));
        scrollLog = GUILayout.BeginScrollView(scrollLog);
        int start = Mathf.Max(0, c.log.Count - 15);
        for (int i = start; i < c.log.Count; i++)
            GUILayout.Label(c.log[i], logStyle);
        GUILayout.EndScrollView();
        GUILayout.EndArea();

        // Action buttons
        float btnY = y + h - 50;
        float btnW = (w - 80) / 5f;
        bool canAct = c.playerTurn && !c.combatOver;

        GUI.enabled = canAct;
        if (GUI.Button(new Rect(x + 20, btnY, btnW, 36), "攻击")) c.PlayerAttack();
        if (GUI.Button(new Rect(x + 20 + btnW + 5, btnY, btnW, 36), "蓄力")) c.PlayerPowerUp();
        if (GUI.Button(new Rect(x + 20 + (btnW + 5) * 2, btnY, btnW, 36), "防御")) c.PlayerDefend();
        if (GUI.Button(new Rect(x + 20 + (btnW + 5) * 3, btnY, btnW, 36), "逃跑")) c.PlayerFlee();

        // Bomb button
        if (player.CountItem("bomb") > 0 && GUI.Button(new Rect(x + 20 + (btnW + 5) * 4, btnY, btnW, 36), "炸弹"))
        {
            c.UseCombatItem(GameDatabase.Items["bomb"]);
            gm.player.RemoveItem("bomb");
        }
        GUI.enabled = true;
    }

    // ── Inventory ─────────────────────────────────────────────

    void DrawInventory()
    {
        float w = Screen.width * 0.5f;
        float h = Screen.height * 0.7f;
        float x = (Screen.width - w) / 2, y = (Screen.height - h) / 2;
        GUI.Box(new Rect(x, y, w, h), "");

        GUI.Label(new Rect(x, y + 8, w, 28), "背包", headerStyle);

        // Equipment
        float eqY = y + 40;
        string weaponName = "无", armorName = "无";
        if (!string.IsNullOrEmpty(gm.player.equippedWeapon) && GameDatabase.Items.TryGetValue(gm.player.equippedWeapon, out var wDef))
            weaponName = wDef.name;
        if (!string.IsNullOrEmpty(gm.player.equippedArmor) && GameDatabase.Items.TryGetValue(gm.player.equippedArmor, out var aDef))
            armorName = aDef.name;

        GUI.Label(new Rect(x + 20, eqY, w - 40, 20), $"武器: {weaponName}  |  护甲: {armorName}");

        // Grid
        float gridY = eqY + 30;
        float cellSize = 44;
        float gridW = cellSize * 6 + 8;
        float gridX = x + 20;

        GUI.Box(new Rect(gridX, gridY, gridW, cellSize * 4 + 8), "");

        var inv = gm.player.inventory;
        for (int i = 0; i < 24; i++)
        {
            int col = i % 6, row = i / 6;
            float cx = gridX + 4 + col * cellSize;
            float cy = gridY + 4 + row * cellSize;

            if (i < inv.Count)
            {
                var slot = inv[i];
                bool sel = selectedBagIndex == i;

                // Quality border color
                Color borderColor = Color.gray;
                if (GameDatabase.Items.TryGetValue(slot.itemId, out var itemDef))
                {
                    borderColor = itemDef.quality switch
                    {
                        Quality.Common => new Color(0.4f, 0.6f, 0.8f),
                        Quality.Uncommon => new Color(0.4f, 0.8f, 0.4f),
                        Quality.Rare => new Color(0.4f, 0.4f, 0.9f),
                        Quality.Epic => new Color(0.6f, 0.2f, 0.8f),
                        Quality.Legendary => new Color(0.9f, 0.6f, 0.1f),
                        _ => Color.gray
                    };
                }

                GUI.color = sel ? new Color(0.3f, 0.2f, 0.1f) : new Color(0.12f, 0.12f, 0.12f);
                GUI.DrawTexture(new Rect(cx, cy, cellSize - 2, cellSize - 2), Texture2D.whiteTexture);
                GUI.color = borderColor;
                GUI.DrawTexture(new Rect(cx, cy, cellSize - 2, 2), Texture2D.whiteTexture);
                GUI.DrawTexture(new Rect(cx, cy + cellSize - 4, cellSize - 2, 2), Texture2D.whiteTexture);
                GUI.DrawTexture(new Rect(cx, cy, 2, cellSize - 2), Texture2D.whiteTexture);
                GUI.DrawTexture(new Rect(cx + cellSize - 4, cy, 2, cellSize - 2), Texture2D.whiteTexture);
                GUI.color = Color.white;

                string label = itemDef != null ? itemDef.name[0].ToString() : "?";
                GUI.Label(new Rect(cx, cy, cellSize - 2, cellSize - 2), label,
                    new GUIStyle(GUI.skin.label) { alignment = TextAnchor.MiddleCenter, fontSize = 16 });

                if (slot.count > 1)
                    GUI.Label(new Rect(cx + cellSize - 16, cy + cellSize - 16, 14, 14), slot.count.ToString(),
                        new GUIStyle(GUI.skin.label) { fontSize = 10, normal = { textColor = Color.white } });

                if (GUI.Button(new Rect(cx, cy, cellSize - 2, cellSize - 2), "", GUIStyle.none))
                    selectedBagIndex = i;
            }
        }

        // Detail panel
        float detailX = gridX + gridW + 10;
        float detailW = w - gridW - 50;
        float detailY = gridY;

        if (selectedBagIndex >= 0 && selectedBagIndex < inv.Count)
        {
            var slot = inv[selectedBagIndex];
            if (GameDatabase.Items.TryGetValue(slot.itemId, out var def))
            {
                GUI.Box(new Rect(detailX, detailY, detailW, 160), "");
                GUI.Label(new Rect(detailX + 8, detailY + 8, detailW - 16, 20), def.name, new GUIStyle(GUI.skin.label) { fontSize = 16, fontStyle = FontStyle.Bold });
                GUI.Label(new Rect(detailX + 8, detailY + 30, detailW - 16, 18), $"{def.type}  x{slot.count}");

                string stats = "";
                if (def.atkBonus > 0) stats += $"ATK+{def.atkBonus} ";
                if (def.defBonus > 0) stats += $"DEF+{def.defBonus} ";
                if (def.hpBonus > 0) stats += $"HP+{def.hpBonus} ";
                if (def.healAmount > 0) stats += $"恢复HP {def.healAmount} ";
                if (def.hungerAmount > 0) stats += $"饥饿+{def.hungerAmount} ";
                if (def.thirstAmount > 0) stats += $"口渴+{def.thirstAmount} ";
                if (def.tempAmount > 0) stats += $"体温+{def.tempAmount} ";
                if (def.combatDamage > 0) stats += $"战斗伤害{def.combatDamage} ";
                if (!string.IsNullOrEmpty(stats))
                    GUI.Label(new Rect(detailX + 8, detailY + 52, detailW - 16, 20), stats,
                        new GUIStyle(GUI.skin.label) { fontSize = 12, normal = { textColor = new Color(0.3f, 0.8f, 0.3f) } });

                GUI.Label(new Rect(detailX + 8, detailY + 74, detailW - 16, 40), def.desc,
                    new GUIStyle(GUI.skin.label) { fontSize = 12, normal = { textColor = Color.gray }, wordWrap = true });

                // Buttons
                float by = detailY + 120;
                if (def.type == ItemType.Consumable && GUI.Button(new Rect(detailX + 8, by, 70, 28), "使用"))
                {
                    gm.UseItem(slot.itemId);
                    if (selectedBagIndex >= gm.player.inventory.Count) selectedBagIndex = -1;
                }
                if ((def.type == ItemType.Weapon || def.type == ItemType.Armor) && GUI.Button(new Rect(detailX + 8, by, 70, 28), "装备"))
                {
                    gm.UseItem(slot.itemId);
                    if (selectedBagIndex >= gm.player.inventory.Count) selectedBagIndex = -1;
                }
                if (GUI.Button(new Rect(detailX + 88, by, 70, 28), "丢弃"))
                {
                    gm.player.RemoveItem(slot.itemId);
                    if (selectedBagIndex >= gm.player.inventory.Count) selectedBagIndex = -1;
                }
            }
        }

        if (GUI.Button(new Rect(x + w - 80, y + h - 36, 70, 28), "关闭"))
            gm.CloseInventory();
    }

    // ── Crafting ──────────────────────────────────────────────

    void DrawCrafting()
    {
        float w = 400, h = 380;
        float x = (Screen.width - w) / 2, y = (Screen.height - h) / 2;
        GUI.Box(new Rect(x, y, w, h), "");

        GUI.Label(new Rect(x, y + 8, w, 28), "制作", headerStyle);

        var recipes = GameDatabase.Recipes.FindAll(r => gm.player.unlockedRecipes.Contains(r.id));

        float listY = y + 44;
        float listH = 160;
        GUI.Box(new Rect(x + 10, listY, w - 20, listH), "");
        GUILayout.BeginArea(new Rect(x + 14, listY + 4, w - 28, listH - 8));
        scrollCraft = GUILayout.BeginScrollView(scrollCraft);
        for (int i = 0; i < recipes.Count; i++)
        {
            var r = recipes[i];
            bool can = gm.player.CanCraft(r);
            Color c = can ? Color.white : Color.gray;
            string status = can ? "✅" : "❌";
            if (GUILayout.Button($"{status} {r.name}", new GUIStyle(GUI.skin.button) { normal = { textColor = c } }))
                selectedCraftIndex = i;
        }
        GUILayout.EndScrollView();
        GUILayout.EndArea();

        // Recipe detail
        if (selectedCraftIndex >= 0 && selectedCraftIndex < recipes.Count)
        {
            var r = recipes[selectedCraftIndex];
            float dy = listY + listH + 10;
            GUI.Label(new Rect(x + 20, dy, w - 40, 22), r.name, new GUIStyle(GUI.skin.label) { fontSize = 16, fontStyle = FontStyle.Bold });

            string mats = "";
            foreach (var m in r.materials)
            {
                int have = gm.player.CountItem(m.itemId);
                string matName = GameDatabase.Items.TryGetValue(m.itemId, out var md) ? md.name : m.itemId;
                string mark = have >= m.count ? "✅" : "❌";
                mats += $"{mark} {matName} x{m.count} (有:{have})\n";
            }
            GUI.Label(new Rect(x + 20, dy + 26, w - 40, 60), mats, logStyle);

            bool canCraft = gm.player.CanCraft(r);
            GUI.enabled = canCraft;
            if (GUI.Button(new Rect(x + 130, dy + 90, 140, 32), "制作", buttonStyle))
                gm.CraftItem(r);
            GUI.enabled = true;
        }

        if (GUI.Button(new Rect(x + w - 80, y + h - 36, 70, 28), "关闭"))
            gm.CloseCrafting();
    }

    // ── Shop ──────────────────────────────────────────────────

    void DrawShop()
    {
        float w = 400, h = 350;
        float x = (Screen.width - w) / 2, y = (Screen.height - h) / 2;
        GUI.Box(new Rect(x, y, w, h), "");

        GUI.Label(new Rect(x, y + 8, w, 28), "商店", headerStyle);
        GUI.Label(new Rect(x + 20, y + 40, w - 40, 22), $"金币: {gm.player.currency}", goldStyle);

        var shopItems = GameDatabase.GetShopInventory(gm.player.floor);
        float itemY = y + 66;
        for (int i = 0; i < shopItems.Count; i++)
        {
            string id = shopItems[i];
            if (!GameDatabase.Items.TryGetValue(id, out var def)) continue;
            int price = GameDatabase.GetShopPrice(id, gm.player.floor);
            bool canBuy = gm.player.currency >= price;

            GUI.Label(new Rect(x + 20, itemY + i * 30, 150, 26), $"{def.name} - {def.desc}");
            GUI.Label(new Rect(x + 180, itemY + i * 30, 80, 26), $"金{price}", goldStyle);

            GUI.enabled = canBuy;
            if (GUI.Button(new Rect(x + 280, itemY + i * 30, 50, 26), "购买"))
                gm.BuyItem(id);
            GUI.enabled = true;
        }

        if (GUI.Button(new Rect(x + w - 80, y + h - 36, 70, 28), "离开"))
            gm.CloseShop();
    }

    // ── Death ─────────────────────────────────────────────────

    void DrawDeath()
    {
        float w = 400, h = 300;
        float x = (Screen.width - w) / 2, y = (Screen.height - h) / 2;
        GUI.Box(new Rect(x, y, w, h), "");

        GUI.Label(new Rect(x, y + 20, w, 40), "你已死亡", new GUIStyle(headerStyle) { normal = { textColor = new Color(0.8f, 0.2f, 0.2f) } });
        GUI.Label(new Rect(x, y + 60, w, 20), "黑暗吞噬了你的灵魂...", new GUIStyle(GUI.skin.label) { alignment = TextAnchor.MiddleCenter, normal = { textColor = Color.gray } });

        var p = gm.player;
        string stats = $"到达层数: {p.floor}\n等级: Lv.{p.level}\n击杀: {p.kills}\n第 {p.runCount} 次运行";
        GUI.Label(new Rect(x + 60, y + 100, w - 120, 80), stats, new GUIStyle(GUI.skin.label) { fontSize = 14, alignment = TextAnchor.UpperCenter });

        if (GUI.Button(new Rect(x + 100, y + 200, 200, 36), "再次挑战", buttonStyle))
            gm.NewGame();
    }

    // ── Keyboard Input ────────────────────────────────────────

    void Update()
    {
        if (gm.state == GameState.Play)
        {
            if (Input.GetKeyDown(KeyCode.W) || Input.GetKeyDown(KeyCode.UpArrow)) gm.MovePlayer(0, -1);
            if (Input.GetKeyDown(KeyCode.S) || Input.GetKeyDown(KeyCode.DownArrow)) gm.MovePlayer(0, 1);
            if (Input.GetKeyDown(KeyCode.A) || Input.GetKeyDown(KeyCode.LeftArrow)) gm.MovePlayer(-1, 0);
            if (Input.GetKeyDown(KeyCode.D) || Input.GetKeyDown(KeyCode.RightArrow)) gm.MovePlayer(1, 0);
            if (Input.GetKeyDown(KeyCode.I)) gm.OpenInventory();
            if (Input.GetKeyDown(KeyCode.C)) gm.OpenCrafting();
            if (Input.GetKeyDown(KeyCode.T)) ShowStats = !ShowStats;
        }
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            if (gm.state == GameState.Inventory) gm.CloseInventory();
            else if (gm.state == GameState.Crafting) gm.CloseCrafting();
            else if (gm.state == GameState.Shop) gm.CloseShop();
            else ShowStats = false;
        }
    }
}
