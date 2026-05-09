// ============================================================
// Darkness Survival — Game Data Definitions
// Ported from game.js + level.js Web prototype
// ============================================================
using System;
using System.Collections.Generic;
using UnityEngine;

// ── Enums ─────────────────────────────────────────────────────

public enum ItemType  { Weapon, Armor, Consumable, Material }
public enum Quality   { Common, Uncommon, Rare, Epic, Legendary }
public enum MonsterTier { Normal, Elite, Boss }
public enum TileType  { Floor, Wall, Stairs, Resource, Shop, Boss }
public enum GameState { Menu, Play, Combat, Dead, Shop, Inventory, Crafting }

// ── Item Definition ───────────────────────────────────────────

[Serializable]
public class ItemDef
{
    public string id;
    public string name;
    public string desc;
    public ItemType type;
    public Quality quality;
    public bool stackable;
    public int maxStack = 99;
    public int atkBonus;
    public int defBonus;
    public int hpBonus;
    public int healAmount;
    public int hungerAmount;
    public int thirstAmount;
    public int tempAmount;
    public int visionBonus;
    public int combatDamage; // for bombs/scrolls
}

// ── Monster Definition ────────────────────────────────────────

[Serializable]
public class MonsterDef
{
    public string id;
    public string name;
    public string icon; // emoji or char
    public int baseHp;
    public int baseAtk;
    public int baseDef;
    public int xp;
    public int minFloor;
    public MonsterTier tier;
}

// ── Boss Skill ────────────────────────────────────────────────

[Serializable]
public class BossSkill
{
    public string name;
    public int cooldown;
    public string effectType; // "heavy", "aoe", "heal", "debuff"
    public float multiplier = 2f;
    public int healAmount;
}

// ── Recipe ────────────────────────────────────────────────────

[Serializable]
public class RecipeDef
{
    public string id;
    public string name;
    public string resultId;
    public int resultCount = 1;
    public List<MaterialEntry> materials = new List<MaterialEntry>();
    public bool unlockedByDefault;
}

[Serializable]
public class MaterialEntry
{
    public string itemId;
    public int count;
}

// ── Floor Config ──────────────────────────────────────────────

[Serializable]
public class FloorConfig
{
    public int width = 15;
    public int height = 15;
    public int minMons = 3;
    public int maxMons = 5;
    public bool hasBoss;
    public bool hasShop;
    public bool hasElite;
    public List<string> enemyPool = new List<string>();
    public string desc;
}

// ── Inventory Slot ────────────────────────────────────────────

[Serializable]
public class InventorySlot
{
    public string itemId;
    public int count;

    public InventorySlot(string id, int n = 1) { itemId = id; count = n; }
}

// ── Monster Instance (runtime) ────────────────────────────────

public class MonsterInstance
{
    public string name;
    public string icon;
    public int hp;
    public int maxHp;
    public int atk;
    public int def;
    public int xp;
    public MonsterTier tier;
    public int x, y;
    public bool alive = true;
    public List<BossSkill> skills = new List<BossSkill>();
    public int[] skillTimers;

    public MonsterInstance(MonsterDef def, float statMult)
    {
        name = def.name;
        icon = def.icon;
        hp = maxHp = Mathf.FloorToInt(def.baseHp * statMult);
        atk = Mathf.FloorToInt(def.baseAtk * statMult);
        def = Mathf.FloorToInt(def.baseDef * statMult);
        xp = Mathf.FloorToInt(def.xp * statMult);
        tier = def.tier;
    }

    public int TakeDamage(int amount)
    {
        if (!alive) return 0;
        int dmg = Mathf.Max(0, amount);
        hp -= dmg;
        if (hp <= 0) { hp = 0; alive = false; }
        return dmg;
    }
}

// ── Static Database ───────────────────────────────────────────

public static class GameDatabase
{
    public static Dictionary<string, ItemDef> Items = new Dictionary<string, ItemDef>();
    public static Dictionary<string, MonsterDef> Monsters = new Dictionary<string, MonsterDef>();
    public static List<RecipeDef> Recipes = new List<RecipeDef>();
    public static Dictionary<int, FloorConfig> Floors = new Dictionary<int, FloorConfig>();

    static bool _init = false;

    public static void Init()
    {
        if (_init) return;
        _init = true;
        InitItems();
        InitMonsters();
        InitRecipes();
        InitFloors();
    }

    static void AddItem(ItemDef d) => Items[d.id] = d;

    static void InitItems()
    {
        // Weapons
        AddItem(new ItemDef { id = "old_dagger", name = "旧匕首", desc = "生锈匕首", type = ItemType.Weapon, quality = Quality.Common, atkBonus = 1 });
        AddItem(new ItemDef { id = "rusty_sword", name = "铁剑", desc = "锋利铁剑", type = ItemType.Weapon, quality = Quality.Common, atkBonus = 3 });
        AddItem(new ItemDef { id = "crimson_blade", name = "猩红之刃", desc = "散发血腥", type = ItemType.Weapon, quality = Quality.Rare, atkBonus = 6 });
        AddItem(new ItemDef { id = "void_scythe", name = "虚空镰刀", desc = "深渊武器", type = ItemType.Weapon, quality = Quality.Legendary, atkBonus = 12 });

        // Armor
        AddItem(new ItemDef { id = "old_clothes", name = "旧衣服", desc = "破旧衣服", type = ItemType.Armor, quality = Quality.Common, defBonus = 1 });
        AddItem(new ItemDef { id = "leather_vest", name = "皮革背心", desc = "结实防具", type = ItemType.Armor, quality = Quality.Common, defBonus = 3 });
        AddItem(new ItemDef { id = "bone_armor", name = "骨甲", desc = "骨头铠甲", type = ItemType.Armor, quality = Quality.Rare, defBonus = 6, hpBonus = 10 });

        // Consumables
        AddItem(new ItemDef { id = "health_potion", name = "治疗药水", desc = "恢复15HP", type = ItemType.Consumable, quality = Quality.Common, stackable = true, maxStack = 5, healAmount = 15 });
        AddItem(new ItemDef { id = "bread", name = "面包", desc = "恢复饥饿", type = ItemType.Consumable, quality = Quality.Common, stackable = true, maxStack = 10, hungerAmount = 20 });
        AddItem(new ItemDef { id = "water", name = "清水", desc = "恢复口渴", type = ItemType.Consumable, quality = Quality.Common, stackable = true, maxStack = 5, thirstAmount = 25 });
        AddItem(new ItemDef { id = "roasted_meat", name = "烤肉", desc = "恢复30饥饿", type = ItemType.Consumable, quality = Quality.Common, stackable = true, maxStack = 5, hungerAmount = 30 });
        AddItem(new ItemDef { id = "herb_potion", name = "草药汤", desc = "HP+饥饿", type = ItemType.Consumable, quality = Quality.Common, stackable = true, maxStack = 5, healAmount = 10, hungerAmount = 15 });
        AddItem(new ItemDef { id = "hot_soup", name = "热汤", desc = "体温+饥饿", type = ItemType.Consumable, quality = Quality.Common, stackable = true, maxStack = 5, hungerAmount = 20, tempAmount = 10 });
        AddItem(new ItemDef { id = "bomb", name = "炸弹", desc = "20伤害", type = ItemType.Consumable, quality = Quality.Rare, stackable = true, maxStack = 3, combatDamage = 20 });
        AddItem(new ItemDef { id = "torch", name = "火把", desc = "视野+2", type = ItemType.Consumable, quality = Quality.Common, stackable = true, maxStack = 5, visionBonus = 2 });
        AddItem(new ItemDef { id = "lantern", name = "灯笼", desc = "视野+4", type = ItemType.Consumable, quality = Quality.Rare, stackable = true, maxStack = 2, visionBonus = 4 });

        // Materials
        AddItem(new ItemDef { id = "wood", name = "木材", desc = "制作材料", type = ItemType.Material, quality = Quality.Common, stackable = true, maxStack = 20 });
        AddItem(new ItemDef { id = "herb", name = "草药", desc = "制作材料", type = ItemType.Material, quality = Quality.Common, stackable = true, maxStack = 20 });
        AddItem(new ItemDef { id = "ore", name = "矿石", desc = "制作材料", type = ItemType.Material, quality = Quality.Common, stackable = true, maxStack = 20 });
        AddItem(new ItemDef { id = "beast_hide", name = "兽皮", desc = "制作材料", type = ItemType.Material, quality = Quality.Common, stackable = true, maxStack = 20 });
        AddItem(new ItemDef { id = "crystal_shard", name = "水晶碎片", desc = "制作材料", type = ItemType.Material, quality = Quality.Common, stackable = true, maxStack = 20 });
        AddItem(new ItemDef { id = "monster_bone", name = "怪物骨", desc = "制作材料", type = ItemType.Material, quality = Quality.Common, stackable = true, maxStack = 20 });
    }

    static void InitMonsters()
    {
        void AddMon(MonsterDef d) => Monsters[d.id] = d;

        AddMon(new MonsterDef { id = "zombie", name = "僵尸", icon = "Z", baseHp = 15, baseAtk = 3, baseDef = 1, xp = 8, minFloor = 1, tier = MonsterTier.Normal });
        AddMon(new MonsterDef { id = "slime", name = "史莱姆", icon = "S", baseHp = 20, baseAtk = 2, baseDef = 2, xp = 10, minFloor = 1, tier = MonsterTier.Normal });
        AddMon(new MonsterDef { id = "bat", name = "蝙蝠", icon = "B", baseHp = 10, baseAtk = 4, baseDef = 0, xp = 6, minFloor = 1, tier = MonsterTier.Normal });
        AddMon(new MonsterDef { id = "skeleton", name = "骷髅", icon = "K", baseHp = 25, baseAtk = 5, baseDef = 2, xp = 15, minFloor = 2, tier = MonsterTier.Normal });
        AddMon(new MonsterDef { id = "spider", name = "蜘蛛", icon = "P", baseHp = 18, baseAtk = 6, baseDef = 1, xp = 12, minFloor = 2, tier = MonsterTier.Normal });
        AddMon(new MonsterDef { id = "giant_rat", name = "巨型鼠", icon = "R", baseHp = 50, baseAtk = 7, baseDef = 3, xp = 30, minFloor = 2, tier = MonsterTier.Elite });
        AddMon(new MonsterDef { id = "wraith", name = "怨灵", icon = "W", baseHp = 22, baseAtk = 8, baseDef = 3, xp = 22, minFloor = 4, tier = MonsterTier.Normal });
        AddMon(new MonsterDef { id = "golem", name = "石像鬼", icon = "G", baseHp = 50, baseAtk = 6, baseDef = 6, xp = 30, minFloor = 5, tier = MonsterTier.Normal });
        AddMon(new MonsterDef { id = "demon", name = "恶魔", icon = "D", baseHp = 40, baseAtk = 10, baseDef = 4, xp = 35, minFloor = 6, tier = MonsterTier.Normal });
        AddMon(new MonsterDef { id = "reaper", name = "死神", icon = "X", baseHp = 45, baseAtk = 12, baseDef = 5, xp = 45, minFloor = 7, tier = MonsterTier.Normal });
        AddMon(new MonsterDef { id = "gate_keeper", name = "看门巨人", icon = "T", baseHp = 100, baseAtk = 10, baseDef = 5, xp = 80, minFloor = 2, tier = MonsterTier.Boss });
        AddMon(new MonsterDef { id = "abyss_worm", name = "深渊蠕虫", icon = "U", baseHp = 180, baseAtk = 15, baseDef = 8, xp = 150, minFloor = 4, tier = MonsterTier.Boss });
        AddMon(new MonsterDef { id = "dark_lord", name = "黑暗之主", icon = "L", baseHp = 300, baseAtk = 20, baseDef = 12, xp = 300, minFloor = 6, tier = MonsterTier.Boss });
    }

    static void InitRecipes()
    {
        Recipes.Add(new RecipeDef { id = "r_bread", name = "面包", resultId = "bread", resultCount = 1, unlockedByDefault = true,
            materials = new List<MaterialEntry> { new MaterialEntry { itemId = "wood", count = 1 } } });
        Recipes.Add(new RecipeDef { id = "r_roast", name = "烤肉", resultId = "roasted_meat", resultCount = 1,
            materials = new List<MaterialEntry> { new MaterialEntry { itemId = "beast_hide", count = 1 }, new MaterialEntry { itemId = "wood", count = 1 } } });
        Recipes.Add(new RecipeDef { id = "r_herbp", name = "草药汤", resultId = "herb_potion", resultCount = 1, unlockedByDefault = true,
            materials = new List<MaterialEntry> { new MaterialEntry { itemId = "herb", count = 2 } } });
        Recipes.Add(new RecipeDef { id = "r_heal", name = "治疗药水", resultId = "health_potion", resultCount = 1,
            materials = new List<MaterialEntry> { new MaterialEntry { itemId = "herb", count = 2 }, new MaterialEntry { itemId = "crystal_shard", count = 1 } } });
        Recipes.Add(new RecipeDef { id = "r_soup", name = "热汤", resultId = "hot_soup", resultCount = 1,
            materials = new List<MaterialEntry> { new MaterialEntry { itemId = "herb", count = 1 }, new MaterialEntry { itemId = "wood", count = 2 } } });
        Recipes.Add(new RecipeDef { id = "r_bomb", name = "炸弹", resultId = "bomb", resultCount = 1,
            materials = new List<MaterialEntry> { new MaterialEntry { itemId = "ore", count = 2 }, new MaterialEntry { itemId = "crystal_shard", count = 1 } } });
        Recipes.Add(new RecipeDef { id = "r_torch", name = "火把", resultId = "torch", resultCount = 2, unlockedByDefault = true,
            materials = new List<MaterialEntry> { new MaterialEntry { itemId = "wood", count = 1 }, new MaterialEntry { itemId = "beast_hide", count = 1 } } });
        Recipes.Add(new RecipeDef { id = "r_vest", name = "皮革背心", resultId = "leather_vest", resultCount = 1,
            materials = new List<MaterialEntry> { new MaterialEntry { itemId = "beast_hide", count = 3 }, new MaterialEntry { itemId = "herb", count = 1 } } });
        Recipes.Add(new RecipeDef { id = "r_sword", name = "铁剑", resultId = "rusty_sword", resultCount = 1,
            materials = new List<MaterialEntry> { new MaterialEntry { itemId = "ore", count = 2 }, new MaterialEntry { itemId = "wood", count = 1 } } });
    }

    static void InitFloors()
    {
        Floors[1] = new FloorConfig { width = 15, height = 15, minMons = 3, maxMons = 5,
            enemyPool = new List<string> { "zombie", "slime", "bat" }, desc = "阴暗的地牢入口" };
        Floors[2] = new FloorConfig { width = 18, height = 18, minMons = 5, maxMons = 8, hasBoss = true,
            enemyPool = new List<string> { "zombie", "slime", "bat", "skeleton" }, desc = "更深的黑暗" };
        Floors[3] = new FloorConfig { width = 20, height = 20, minMons = 6, maxMons = 10, hasShop = true,
            enemyPool = new List<string> { "skeleton", "spider", "bat" }, desc = "地下集市" };
        Floors[4] = new FloorConfig { width = 22, height = 22, minMons = 8, maxMons = 12, hasBoss = true, hasElite = true,
            enemyPool = new List<string> { "skeleton", "spider", "wraith" }, desc = "精英要道" };
        Floors[5] = new FloorConfig { width = 25, height = 25, minMons = 10, maxMons = 15, hasElite = true,
            enemyPool = new List<string> { "wraith", "golem", "spider" }, desc = "珍稀矿脉" };
        Floors[6] = new FloorConfig { width = 28, height = 28, minMons = 12, maxMons = 15, hasBoss = true, hasShop = true, hasElite = true,
            enemyPool = new List<string> { "wraith", "golem", "demon" }, desc = "恶魔领地" };
    }

    public static FloorConfig GetFloorConfig(int floor)
    {
        if (Floors.TryGetValue(floor, out var fc)) return fc;
        return new FloorConfig
        {
            width = Mathf.Min(28 + (floor - 6) * 2, 40),
            height = Mathf.Min(28 + (floor - 6) * 2, 40),
            minMons = Mathf.Min(12 + floor, 18),
            maxMons = Mathf.Min(15 + floor, 22),
            hasBoss = floor % 2 == 0,
            hasShop = floor % 3 == 0,
            hasElite = true,
            enemyPool = new List<string> { "wraith", "golem", "demon", "reaper" },
            desc = $"深渊第{floor}层"
        };
    }

    public static float GetStatMultiplier(int floor) => 1f + (floor - 1) * 0.3f;
    public static float GetBossMultiplier(int floor) => 1f + (floor - 1) * 0.5f;
    public static int GetXPForLevel(int level) => Mathf.FloorToInt(20f * Mathf.Pow(1.5f, level - 1));

    public static List<string> GetShopInventory(int floor)
    {
        var list = new List<string> { "health_potion", "bread", "water", "torch", "herb" };
        if (floor >= 3) { list.Add("rusty_sword"); list.Add("leather_vest"); list.Add("bomb"); }
        if (floor >= 5) { list.Add("crimson_blade"); list.Add("lantern"); list.Add("bone_armor"); }
        return list;
    }

    public static int GetShopPrice(string itemId, int floor)
    {
        int tier = floor <= 2 ? 1 : floor <= 4 ? 2 : 3;
        return itemId switch
        {
            "health_potion" => 10 * tier,
            "bread" => 8 * tier,
            "water" => 8 * tier,
            "torch" => 5 * tier,
            "herb" => 5 * tier,
            "rusty_sword" => 40,
            "leather_vest" => 40,
            "bomb" => 25,
            "crimson_blade" => 100,
            "lantern" => 80,
            "bone_armor" => 60,
            _ => 10
        };
    }
}
