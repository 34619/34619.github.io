// ============================================================
// Darkness Survival — Combat System
// Turn-based combat, ported from combat.js
// ============================================================
using System;
using System.Collections.Generic;
using UnityEngine;

public class CombatManager
{
    public MonsterInstance currentEnemy;
    public List<string> log = new List<string>();
    public bool playerTurn = true;
    public bool defending = false;
    public bool powered = false;
    public bool combatOver = false;
    public bool victory = false;

    // References to player
    PlayerState player;

    public event Action<string> OnLog;
    public event Action<bool> OnCombatEnd; // true = victory

    public void StartCombat(PlayerState p, MonsterInstance enemy)
    {
        player = p;
        currentEnemy = enemy;
        log.Clear();
        playerTurn = true;
        defending = false;
        powered = false;
        combatOver = false;
        victory = false;

        string prefix = enemy.tier == MonsterTier.Boss ? "[BOSS] " : enemy.tier == MonsterTier.Elite ? "[ELITE] " : "";
        AddLog($"遭遇 {prefix}{enemy.name}！");
        AddLog($"敌方 HP:{enemy.hp}/{enemy.maxHp} ATK:{enemy.atk} DEF:{enemy.def}");
    }

    public void PlayerAttack()
    {
        if (!playerTurn || combatOver || currentEnemy == null) return;

        int atk = player.GetTotalAtk();
        if (powered) { atk = Mathf.FloorToInt(atk * 1.5f); powered = false; }

        int dmg = Mathf.Max(1, atk - currentEnemy.def);
        int actual = currentEnemy.TakeDamage(dmg);
        AddLog($"你造成 {actual} 点伤害");

        if (!currentEnemy.alive)
        {
            AddLog($"击败了 {currentEnemy.name}！+{currentEnemy.xp} EXP");
            victory = true;
            EndCombat(true);
            return;
        }

        defending = false;
        EndPlayerTurn();
    }

    public void PlayerPowerUp()
    {
        if (!playerTurn || combatOver) return;
        powered = true;
        AddLog("蓄力！下次攻击 1.5x 伤害");
        defending = false;
        EndPlayerTurn();
    }

    public void PlayerDefend()
    {
        if (!playerTurn || combatOver) return;
        defending = true;
        AddLog("防御中...本回合受伤害减半");
        EndPlayerTurn();
    }

    public void PlayerFlee()
    {
        if (!playerTurn || combatOver) return;
        if (UnityEngine.Random.value < 0.4f)
        {
            AddLog("逃跑成功！");
            combatOver = true;
            OnCombatEnd?.Invoke(false); // flee = no victory
        }
        else
        {
            AddLog("逃跑失败！");
            defending = false;
            EndPlayerTurn();
        }
    }

    public void UseCombatItem(ItemDef item)
    {
        if (!playerTurn || combatOver) return;

        if (item.combatDamage > 0 && currentEnemy != null)
        {
            int actual = currentEnemy.TakeDamage(item.combatDamage);
            AddLog($"{item.name}造成 {actual} 点伤害！");
            if (!currentEnemy.alive)
            {
                AddLog($"击败了 {currentEnemy.name}！+{currentEnemy.xp} EXP");
                victory = true;
                EndCombat(true);
                return;
            }
        }
        else if (item.healAmount > 0)
        {
            player.hp = Mathf.Min(player.maxHp, player.hp + item.healAmount);
            AddLog($"使用{item.name}，恢复 {item.healAmount} HP");
        }
    }

    void EndPlayerTurn()
    {
        playerTurn = false;
        ProcessEnemyTurn();
        if (!combatOver)
        {
            playerTurn = true;
            AddLog("--- 你的回合 ---");
        }
    }

    void ProcessEnemyTurn()
    {
        if (currentEnemy == null || !currentEnemy.alive) return;

        if (currentEnemy.tier == MonsterTier.Boss && currentEnemy.skills.Count > 0)
            BossAttack();
        else if (currentEnemy.tier == MonsterTier.Elite)
            EliteAttack();
        else
            NormalAttack();

        if (player.hp <= 0)
        {
            player.hp = 0;
            AddLog("你被击败了...");
            combatOver = true;
            OnCombatEnd?.Invoke(false);
        }
    }

    void NormalAttack()
    {
        int raw = currentEnemy.atk - player.GetTotalDef();
        if (defending) raw = Mathf.FloorToInt(raw * 0.5f);
        int dmg = Mathf.Max(1, raw);
        player.hp -= dmg;
        AddLog($"{currentEnemy.name} 攻击你，造成 {dmg} 点伤害");
    }

    void EliteAttack()
    {
        NormalAttack();
        if (player.hp <= 0) return;

        // 20% double attack
        if (UnityEngine.Random.value < 0.2f)
        {
            int raw = Mathf.FloorToInt(currentEnemy.atk * 0.7f) - player.GetTotalDef();
            if (defending) raw = Mathf.FloorToInt(raw * 0.5f);
            int dmg = Mathf.Max(1, raw);
            player.hp -= dmg;
            AddLog($"  {currentEnemy.name} 追击！{dmg} 点伤害");
        }
    }

    void BossAttack()
    {
        // Try skills on cooldown
        bool usedSkill = false;
        for (int i = 0; i < currentEnemy.skills.Count; i++)
        {
            if (currentEnemy.skillTimers[i] <= 0)
            {
                var skill = currentEnemy.skills[i];
                currentEnemy.skillTimers[i] = skill.cooldown;
                ApplyBossSkill(skill);
                usedSkill = true;
                break;
            }
        }

        if (!usedSkill)
            NormalAttack();

        // Tick cooldowns
        for (int i = 0; i < currentEnemy.skillTimers.Length; i++)
            if (currentEnemy.skillTimers[i] > 0) currentEnemy.skillTimers[i]--;
    }

    void ApplyBossSkill(BossSkill skill)
    {
        switch (skill.effectType)
        {
            case "heavy":
                int raw = Mathf.FloorToInt(currentEnemy.atk * skill.multiplier) - player.GetTotalDef();
                if (defending) raw = Mathf.FloorToInt(raw * 0.5f);
                int dmg = Mathf.Max(1, raw);
                player.hp -= dmg;
                AddLog($"{currentEnemy.name} 使用 {skill.name}！{dmg} 点伤害！");
                break;
            case "aoe":
                int rawAoe = currentEnemy.atk - player.GetTotalDef();
                if (defending) rawAoe = Mathf.FloorToInt(rawAoe * 0.5f);
                int dmgAoe = Mathf.Max(1, rawAoe);
                player.hp -= dmgAoe;
                AddLog($"{currentEnemy.name} 使用 {skill.name}！全体 {dmgAoe} 点伤害！");
                break;
            case "heal":
                int heal = skill.healAmount > 0 ? skill.healAmount : Mathf.FloorToInt(currentEnemy.maxHp * 0.2f);
                currentEnemy.hp = Mathf.Min(currentEnemy.maxHp, currentEnemy.hp + heal);
                AddLog($"{currentEnemy.name} 使用 {skill.name}！恢复 {heal} HP！");
                break;
            case "debuff":
                AddLog($"{currentEnemy.name} 使用 {skill.name}！你的防御降低了！");
                break;
        }
    }

    void AddLog(string msg)
    {
        log.Add(msg);
        if (log.Count > 30) log.RemoveAt(0);
        OnLog?.Invoke(msg);
    }

    void EndCombat(bool won)
    {
        combatOver = true;
        victory = won;
        OnCombatEnd?.Invoke(won);
    }
}

// ── Player State (extracted for combat) ───────────────────────

[System.Serializable]
public class PlayerState
{
    public int floor = 1;
    public int hp = 30, maxHp = 30;
    public int baseAtk = 5, baseDef = 4;
    public int level = 1, xp = 0;
    public float hunger = 100, thirst = 100, temp = 37f;
    public int vision = 3;
    public int currency = 0;
    public int kills = 0;
    public int runCount = 0;

    public string equippedWeapon;
    public string equippedArmor;

    public List<InventorySlot> inventory = new List<InventorySlot>();
    public HashSet<string> unlockedRecipes = new HashSet<string>();

    public int GetTotalAtk()
    {
        int bonus = 0;
        if (!string.IsNullOrEmpty(equippedWeapon) && GameDatabase.Items.TryGetValue(equippedWeapon, out var w))
            bonus = w.atkBonus;
        return baseAtk + bonus;
    }

    public int GetTotalDef()
    {
        int bonus = 0;
        if (!string.IsNullOrEmpty(equippedArmor) && GameDatabase.Items.TryGetValue(equippedArmor, out var a))
            bonus = a.defBonus;
        return baseDef + bonus;
    }

    public void CheckLevelUp()
    {
        int need = GameDatabase.GetXPForLevel(level);
        while (xp >= need)
        {
            xp -= need;
            level++;
            maxHp += 5;
            hp = Mathf.Min(hp + 5, maxHp);
            baseAtk += 2;
            baseDef += 1;
            need = GameDatabase.GetXPForLevel(level);
        }
    }

    public int CountItem(string id)
    {
        int total = 0;
        foreach (var s in inventory)
            if (s.itemId == id) total += s.count;
        return total;
    }

    public bool AddItem(string id, int amount = 1)
    {
        if (!GameDatabase.Items.TryGetValue(id, out var def)) return false;

        if (def.stackable)
        {
            foreach (var s in inventory)
            {
                if (s.itemId == id && s.count < def.maxStack)
                {
                    int add = Mathf.Min(amount, def.maxStack - s.count);
                    s.count += add;
                    amount -= add;
                    if (amount <= 0) return true;
                }
            }
        }

        while (amount > 0)
        {
            if (inventory.Count >= 24) return false;
            int add = def.stackable ? Mathf.Min(amount, def.maxStack) : 1;
            inventory.Add(new InventorySlot(id, add));
            amount -= add;
        }
        return true;
    }

    public bool RemoveItem(string id, int amount = 1)
    {
        for (int i = inventory.Count - 1; i >= 0 && amount > 0; i--)
        {
            if (inventory[i].itemId != id) continue;
            int take = Mathf.Min(amount, inventory[i].count);
            inventory[i].count -= take;
            amount -= take;
            if (inventory[i].count <= 0) inventory.RemoveAt(i);
        }
        return amount <= 0;
    }

    public bool CanCraft(RecipeDef recipe)
    {
        foreach (var m in recipe.materials)
            if (CountItem(m.itemId) < m.count) return false;
        return true;
    }

    public bool Craft(RecipeDef recipe)
    {
        if (!CanCraft(recipe)) return false;
        foreach (var m in recipe.materials)
            RemoveItem(m.itemId, m.count);
        return AddItem(recipe.resultId, recipe.resultCount);
    }

    public void InitStarterKit()
    {
        inventory.Clear();
        AddItem("old_dagger");
        AddItem("old_clothes");
        AddItem("torch", 3);
        AddItem("bread", 5);
        equippedWeapon = "old_dagger";
        equippedArmor = "old_clothes";

        unlockedRecipes.Clear();
        foreach (var r in GameDatabase.Recipes)
            if (r.unlockedByDefault)
                unlockedRecipes.Add(r.id);
    }
}
