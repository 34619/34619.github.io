// ============================================================
// Darkness Survival — Dungeon Generator
// Recursive Backtracker algorithm, ported from game.js
// ============================================================
using System.Collections.Generic;
using UnityEngine;

public class DungeonData
{
    public int[,] grid; // 0=floor, 1=wall, 2=stairs, 3=resource, 4=shop, 5=boss
    public int width, height;
    public Vector2Int stairs;
    public Vector2Int shop;
    public Vector2Int bossTile;
}

public static class DungeonGenerator
{
    public static DungeonData Generate(int w, int h, FloorConfig config)
    {
        // Ensure odd dimensions
        int gw = w % 2 == 0 ? w + 1 : w;
        int gh = h % 2 == 0 ? h + 1 : h;

        var grid = new int[gw, gh];
        var visited = new bool[gw, gh];

        // Fill with walls
        for (int y = 0; y < gh; y++)
            for (int x = 0; x < gw; x++)
                grid[x, y] = 1;

        // Recursive backtracker
        grid[1, 1] = 0;
        visited[1, 1] = true;
        Carve(grid, visited, 1, 1, gw, gh);

        // Extra passages for wider maps
        int extras = (gw * gh) / 80;
        for (int i = 0; i < extras; i++)
        {
            int ex = 2 + Random.Range(0, gw - 4);
            int ey = 2 + Random.Range(0, gh - 4);
            if (grid[ex, ey] == 1)
            {
                int adj = 0;
                if (ey > 0 && grid[ex, ey - 1] == 0) adj++;
                if (ey < gh - 1 && grid[ex, ey + 1] == 0) adj++;
                if (ex > 0 && grid[ex - 1, ey] == 0) adj++;
                if (ex < gw - 1 && grid[ex + 1, ey] == 0) adj++;
                if (adj >= 2) grid[ex, ey] = 0;
            }
        }

        // Place stairs at bottom-right area
        int sx = gw - 2, sy = gh - 2;
        if (grid[sx, sy] == 1)
        {
            grid[sx, sy] = 0;
            if (sy - 1 > 0) grid[sx, sy - 1] = 0;
        }
        grid[sx, sy] = 2;

        var data = new DungeonData
        {
            grid = grid,
            width = gw,
            height = gh,
            stairs = new Vector2Int(sx, sy)
        };

        // Place resources
        var freeTiles = GetFreeTiles(grid, gw, gh, new Vector2Int(1, 1), data.stairs);
        int resIdx = 0;
        int resCount = Mathf.Max(1, 5 - (config.width > 20 ? 3 : 0));
        for (int i = 0; i < resCount && resIdx < freeTiles.Count; i++, resIdx++)
            grid[freeTiles[resIdx].x, freeTiles[resIdx].y] = 3;

        // Place shop
        if (config.hasShop && resIdx < freeTiles.Count)
        {
            for (int i = resIdx; i < freeTiles.Count; i++)
            {
                int dist = Mathf.Abs(freeTiles[i].x - sx) + Mathf.Abs(freeTiles[i].y - sy);
                if (dist > gw * 0.4f)
                {
                    grid[freeTiles[i].x, freeTiles[i].y] = 4;
                    data.shop = freeTiles[i];
                    resIdx = i + 1;
                    break;
                }
            }
        }

        // Place boss
        if (config.hasBoss && resIdx < freeTiles.Count)
        {
            for (int i = resIdx; i < freeTiles.Count; i++)
            {
                int dist = Mathf.Abs(freeTiles[i].x - sx) + Mathf.Abs(freeTiles[i].y - sy);
                if (dist > 1 && dist < gw * 0.3f)
                {
                    grid[freeTiles[i].x, freeTiles[i].y] = 5;
                    data.bossTile = freeTiles[i];
                    resIdx = i + 1;
                    break;
                }
            }
        }

        return data;
    }

    static void Carve(int[,] grid, bool[,] visited, int cx, int cy, int w, int h)
    {
        int[][] dirs = { new[]{0,-2}, new[]{0,2}, new[]{-2,0}, new[]{2,0} };
        Shuffle(dirs);

        foreach (var d in dirs)
        {
            int nx = cx + d[0], ny = cy + d[1];
            if (nx < 1 || nx >= w - 1 || ny < 1 || ny >= h - 1 || visited[nx, ny]) continue;

            grid[cx + d[0] / 2, cy + d[1] / 2] = 0;
            grid[nx, ny] = 0;
            visited[nx, ny] = true;
            Carve(grid, visited, nx, ny, w, h);
        }
    }

    static void Shuffle(int[][] arr)
    {
        for (int i = arr.Length - 1; i > 0; i--)
        {
            int j = Random.Range(0, i + 1);
            (arr[i], arr[j]) = (arr[j], arr[i]);
        }
    }

    static List<Vector2Int> GetFreeTiles(int[,] grid, int w, int h, Vector2Int exclude1, Vector2Int exclude2)
    {
        var list = new List<Vector2Int>();
        for (int y = 1; y < h - 1; y++)
            for (int x = 1; x < w - 1; x++)
                if (grid[x, y] == 0 && !(x == exclude1.x && y == exclude1.y) && !(x == exclude2.x && y == exclude2.y))
                    list.Add(new Vector2Int(x, y));

        // Shuffle
        for (int i = list.Count - 1; i > 0; i--)
        {
            int j = Random.Range(0, i + 1);
            (list[i], list[j]) = (list[j], list[i]);
        }
        return list;
    }

    public static List<MonsterInstance> SpawnMonsters(FloorConfig config, int floor)
    {
        float mult = GameDatabase.GetStatMultiplier(floor);
        int count = Random.Range(config.minMons, config.maxMons + 1);
        var list = new List<MonsterInstance>();

        for (int i = 0; i < count; i++)
        {
            string monId = config.enemyPool[Random.Range(0, config.enemyPool.Count)];
            if (GameDatabase.Monsters.TryGetValue(monId, out var def))
            {
                var inst = new MonsterInstance(def, mult);
                list.Add(inst);
            }
        }

        // Spawn boss
        if (config.hasBoss)
        {
            var bossDefs = new List<MonsterDef>();
            foreach (var m in GameDatabase.Monsters.Values)
                if (m.tier == MonsterTier.Boss && m.minFloor <= floor)
                    bossDefs.Add(m);

            if (bossDefs.Count > 0)
            {
                var bossDef = bossDefs[bossDefs.Count - 1];
                var boss = new MonsterInstance(bossDef, GameDatabase.GetBossMultiplier(floor));
                boss.skills = new List<BossSkill>
                {
                    new BossSkill { name = "重击", cooldown = 3, effectType = "heavy", multiplier = 2f },
                    new BossSkill { name = "横扫", cooldown = 2, effectType = "aoe" },
                    new BossSkill { name = "暗黑治愈", cooldown = 4, effectType = "heal", healAmount = 15 }
                };
                boss.skillTimers = new int[boss.skills.Count];
                list.Add(boss);
            }
        }

        return list;
    }
}
