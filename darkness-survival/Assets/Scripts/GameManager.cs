// ============================================================
// Darkness Survival — Game Manager
// Central orchestrator, ported from game.js main loop
// ============================================================
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    [Header("Tile Sprites (assign in Inspector)")]
    public Sprite floorSprite;
    public Sprite wallSprite;
    public Sprite stairsSprite;
    public Sprite resourceSprite;
    public Sprite shopSprite;
    public Sprite bossSprite;
    public Sprite playerSprite;

    [Header("Config")]
    public int tileSize = 1;

    // ── State ─────────────────────────────────────────────────
    public GameState state = GameState.Menu;
    public PlayerState player = new PlayerState();
    public DungeonData dungeon;
    public List<MonsterInstance> monsters = new List<MonsterInstance>();
    public List<Vector2Int> groundItems = new List<Vector2Int>();
    public List<string> groundItemIds = new List<string>();
    public int[,] fog; // 0=hidden, 1=seen, 2=visible
    public List<string> diary = new List<string>();

    public CombatManager combat = new CombatManager();
    public string pendingAction; // "shop", "inventory", "crafting"

    // ── Events (UI subscribes) ────────────────────────────────
    public System.Action OnStateChanged;
    public System.Action<string> OnDiaryEntry;

    void Awake()
    {
        if (Instance != null) { Destroy(gameObject); return; }
        Instance = this;
        DontDestroyOnLoad(gameObject);
        GameDatabase.Init();
    }

    void Start()
    {
        state = GameState.Menu;
        OnStateChanged?.Invoke();
    }

    // ── Game Flow ─────────────────────────────────────────────

    public void NewGame()
    {
        player = new PlayerState();
        player.runCount++;
        player.InitStarterKit();
        state = GameState.Play;
        InitFloor();
        OnStateChanged?.Invoke();
    }

    public void InitFloor()
    {
        var config = GameDatabase.GetFloorConfig(player.floor);
        dungeon = DungeonGenerator.Generate(config.width, config.height, config);

        // Init fog
        fog = new int[dungeon.width, dungeon.height];
        player.vision = 3 + GetVisionBonus();
        RevealFog(1, 1, player.vision);

        // Spawn monsters
        monsters = DungeonGenerator.SpawnMonsters(config, player.floor);

        // Place monsters on map
        var freeTiles = GetPlaceableTiles();
        int mi = 0;
        for (int i = 0; i < monsters.Count && mi < freeTiles.Count; i++, mi++)
        {
            monsters[i].x = freeTiles[mi].x;
            monsters[i].y = freeTiles[mi].y;
        }

        // Place ground items
        groundItems.Clear();
        groundItemIds.Clear();
        string[] itemPool = { "health_potion", "bread", "torch", "herb", "wood", "ore", "crystal_shard" };
        int itemCount = 2 + Random.Range(0, 3);
        for (int i = 0; i < itemCount && mi < freeTiles.Count; i++, mi++)
        {
            groundItems.Add(freeTiles[mi]);
            groundItemIds.Add(itemPool[Random.Range(0, itemPool.Length)]);
        }

        diary.Clear();
        AddDiary($"第 {player.floor} 层 — {config.desc}");
    }

    List<Vector2Int> GetPlaceableTiles()
    {
        var list = new List<Vector2Int>();
        for (int y = 1; y < dungeon.height - 1; y++)
            for (int x = 1; x < dungeon.width - 1; x++)
                if (dungeon.grid[x, y] == 0 && !(x == 1 && y == 1))
                    list.Add(new Vector2Int(x, y));

        for (int i = list.Count - 1; i > 0; i--)
        {
            int j = Random.Range(0, i + 1);
            (list[i], list[j]) = (list[j], list[i]);
        }
        return list;
    }

    // ── Movement ──────────────────────────────────────────────

    public bool TryMove(int dx, int dy)
    {
        if (state != GameState.Play) return false;

        int nx = player.floor > 0 ? player.floor : 1; // not used, just safety
        int px = 0, py = 0;
        // Find player pos — stored implicitly as we track it
        // Actually let's store it properly
        return MovePlayer(dx, dy);
    }

    // Track player position
    [HideInInspector] public int playerX = 1, playerY = 1;

    public bool MovePlayer(int dx, int dy)
    {
        if (state != GameState.Play) return false;

        int nx = playerX + dx, ny = playerY + dy;
        if (nx < 0 || nx >= dungeon.width || ny < 0 || ny >= dungeon.height) return false;
        if (dungeon.grid[nx, ny] == 1) return false;

        playerX = nx;
        playerY = ny;
        RevealFog(nx, ny, player.vision);

        int tile = dungeon.grid[nx, ny];

        // Stairs
        if (tile == 2)
        {
            player.floor++;
            playerX = 1; playerY = 1;
            InitFloor();
            AddDiary($"进入第 {player.floor} 层");
            OnStateChanged?.Invoke();
            return true;
        }

        // Resource
        if (tile == 3)
        {
            string[] res = { "wood", "ore", "herb" };
            string r = res[Random.Range(0, res.Length)];
            player.AddItem(r);
            dungeon.grid[nx, ny] = 0;
            AddDiary($"采集了 {GameDatabase.Items[r].name}");
        }

        // Shop
        if (tile == 4)
        {
            state = GameState.Shop;
            OnStateChanged?.Invoke();
            return true;
        }

        // Pick up ground items
        for (int i = groundItems.Count - 1; i >= 0; i--)
        {
            if (groundItems[i].x == nx && groundItems[i].y == ny)
            {
                string id = groundItemIds[i];
                player.AddItem(id);
                AddDiary($"拾取了 {GameDatabase.Items[id].name}");
                groundItems.RemoveAt(i);
                groundItemIds.RemoveAt(i);
                break;
            }
        }

        // Monster collision
        foreach (var m in monsters)
        {
            if (m.alive && m.x == nx && m.y == ny)
            {
                StartCombat(m);
                return true;
            }
        }

        // Survival costs
        player.hunger = Mathf.Max(0, player.hunger - 2);
        player.thirst = Mathf.Max(0, player.thirst - 3);
        player.temp = Mathf.Max(0, player.temp - 0.5f);

        if (player.hunger <= 0) { player.hp -= 3; AddDiary("饥饿！HP-3"); }
        if (player.thirst <= 0) { player.hp -= 5; AddDiary("口渴！HP-5"); }
        if (player.temp <= 0) { player.hp -= 4; AddDiary("失温！HP-4"); }

        if (player.hp <= 0) { player.hp = 0; Die(); return true; }

        OnStateChanged?.Invoke();
        return true;
    }

    // ── Combat ────────────────────────────────────────────────

    void StartCombat(MonsterInstance mon)
    {
        state = GameState.Combat;
        combat.StartCombat(player, mon);
        combat.OnCombatEnd += OnCombatResult;
        OnStateChanged?.Invoke();
    }

    void OnCombatResult(bool won)
    {
        combat.OnCombatEnd -= OnCombatResult;

        if (won)
        {
            player.xp += combat.currentEnemy.xp;
            player.kills++;
            player.CheckLevelUp();

            // Gold drop
            int gold = Mathf.FloorToInt(3 + player.floor * 2 + Random.Range(0, 5));
            player.currency += gold;
            AddDiary($"获得 {gold} 金币");

            // Item drop (40%)
            if (Random.value < 0.4f)
            {
                string[] drops = { "health_potion", "bread", "herb", "wood", "ore", "crystal_shard", "beast_hide", "monster_bone" };
                string dr = drops[Random.Range(0, drops.Length)];
                player.AddItem(dr);
                AddDiary($"掉落: {GameDatabase.Items[dr].name}");
            }

            // Boss drops legendary
            if (combat.currentEnemy.tier == MonsterTier.Boss)
            {
                string[] bossDrops = { "crimson_blade", "bone_armor", "void_scythe" };
                string bd = bossDrops[Random.Range(0, bossDrops.Length)];
                player.AddItem(bd);
                AddDiary($"Boss掉落: {GameDatabase.Items[bd].name}！");

                // Unlock recipe
                var locked = GameDatabase.Recipes.FindAll(r => !player.unlockedRecipes.Contains(r.id));
                if (locked.Count > 0)
                {
                    var r = locked[Random.Range(0, locked.Count)];
                    player.unlockedRecipes.Add(r.id);
                    AddDiary($"解锁配方: {r.name}！");
                }
            }

            monsters.RemoveAll(m => !m.alive);
        }
        else if (combat.combatOver && !combat.victory && player.hp <= 0)
        {
            Die();
            return;
        }
        // Flee: return to play

        state = GameState.Play;
        OnStateChanged?.Invoke();
    }

    // ── Item Usage ────────────────────────────────────────────

    public void UseItem(string itemId)
    {
        if (!GameDatabase.Items.TryGetValue(itemId, out var def)) return;

        if (def.type == ItemType.Consumable)
        {
            if (def.healAmount > 0) player.hp = Mathf.Min(player.maxHp, player.hp + def.healAmount);
            if (def.hungerAmount > 0) player.hunger = Mathf.Min(100, player.hunger + def.hungerAmount);
            if (def.thirstAmount > 0) player.thirst = Mathf.Min(100, player.thirst + def.thirstAmount);
            if (def.tempAmount > 0) player.temp = Mathf.Min(50, player.temp + def.tempAmount);
            if (def.visionBonus > 0) player.vision += def.visionBonus;
            player.RemoveItem(itemId);
            AddDiary($"使用了 {def.name}");
        }
        else if (def.type == ItemType.Weapon)
        {
            if (!string.IsNullOrEmpty(player.equippedWeapon))
                player.AddItem(player.equippedWeapon);
            player.equippedWeapon = itemId;
            player.RemoveItem(itemId);
            AddDiary($"装备了 {def.name}");
        }
        else if (def.type == ItemType.Armor)
        {
            if (!string.IsNullOrEmpty(player.equippedArmor))
                player.AddItem(player.equippedArmor);
            player.equippedArmor = itemId;
            player.RemoveItem(itemId);
            AddDiary($"装备了 {def.name}");
        }

        OnStateChanged?.Invoke();
    }

    public void BuyItem(string itemId)
    {
        int price = GameDatabase.GetShopPrice(itemId, player.floor);
        if (player.currency < price) return;
        if (!player.AddItem(itemId)) return;
        player.currency -= price;
        AddDiary($"购买了 {GameDatabase.Items[itemId].name}");
        OnStateChanged?.Invoke();
    }

    public void CraftItem(RecipeDef recipe)
    {
        if (!player.Craft(recipe)) return;
        AddDiary($"制作了 {recipe.name}");
        OnStateChanged?.Invoke();
    }

    // ── Fog of War ────────────────────────────────────────────

    void RevealFog(int cx, int cy, int radius)
    {
        if (fog == null) return;
        // Demote visible to seen
        for (int y = 0; y < fog.GetLength(1); y++)
            for (int x = 0; x < fog.GetLength(0); x++)
                if (fog[x, y] == 2) fog[x, y] = 1;

        // Reveal new area
        for (int y = Mathf.Max(0, cy - radius); y <= Mathf.Min(fog.GetLength(1) - 1, cy + radius); y++)
            for (int x = Mathf.Max(0, cx - radius); x <= Mathf.Min(fog.GetLength(0) - 1, cx + radius); x++)
                if (Mathf.Abs(x - cx) + Mathf.Abs(y - cy) <= radius)
                    fog[x, y] = 2;
    }

    int GetVisionBonus()
    {
        int bonus = 0;
        // Check equipped items and torches in inventory
        foreach (var s in player.inventory)
            if (s.itemId == "torch" || s.itemId == "lantern")
                if (GameDatabase.Items.TryGetValue(s.itemId, out var d))
                    bonus += d.visionBonus * Mathf.Min(s.count, 3); // cap bonus from stack
        return bonus;
    }

    // ── Death ─────────────────────────────────────────────────

    void Die()
    {
        state = GameState.Dead;
        AddDiary("你倒在了黑暗中...");
        OnStateChanged?.Invoke();
    }

    // ── Diary ─────────────────────────────────────────────────

    void AddDiary(string entry)
    {
        diary.Add(entry);
        if (diary.Count > 50) diary.RemoveAt(0);
        OnDiaryEntry?.Invoke(entry);
    }

    // ── State Helpers ─────────────────────────────────────────

    public void CloseShop() { state = GameState.Play; OnStateChanged?.Invoke(); }
    public void OpenInventory() { state = GameState.Inventory; OnStateChanged?.Invoke(); }
    public void CloseInventory() { state = GameState.Play; OnStateChanged?.Invoke(); }
    public void OpenCrafting() { state = GameState.Crafting; OnStateChanged?.Invoke(); }
    public void CloseCrafting() { state = GameState.Play; OnStateChanged?.Invoke(); }
}
