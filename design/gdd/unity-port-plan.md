# 黑暗生存 — Unity 迁移计划

## 现有 Web 原型映射

| Web 文件 | Unity 迁移目标 | 优先级 |
|-----------|---------------|--------|
| `game.js` 地牢生成 | `DungeonGenerator.cs` + Tilemap | P0 |
| `game.js` 移动/交互 | `PlayerController.cs` | P0 |
| `game.js` 迷雾系统 | `FogOfWar.cs` + 2D Light | P0 |
| `game.js` 战斗(简化版) | `CombatManager.cs` | P0 |
| `combat.js` 完整战斗 | 合并到 `CombatManager.cs` | P1 |
| `game.js` 物品/背包 | `InventorySystem.cs` + ScriptableObject | P0 |
| `game.js` 制作系统 | `CraftingSystem.cs` | P1 |
| `game.js` 商店系统 | `ShopSystem.cs` | P1 |
| `game.js` 生存机制 | `SurvivalSystem.cs` | P0 |
| `game.js` 存档/读档 | `SaveManager.cs` (JSON) | P1 |
| `level.js` 关卡/难度 | `FloorManager.cs` | P0 |
| `level.js` 任务系统 | `QuestSystem.cs` | P2 |
| `level.js` 成就系统 | `AchievementSystem.cs` | P2 |
| `ui.js` UI 系统 | Unity uGUI | P0 |

## Unity 项目结构

```
Assets/
├── Scripts/
│   ├── Core/
│   │   ├── GameManager.cs          # 全局游戏状态管理
│   │   ├── GameState.cs            # 状态枚举
│   │   └── SaveManager.cs          # 存档/读档
│   ├── Dungeon/
│   │   ├── DungeonGenerator.cs     # 迷宫生成算法
│   │   ├── FloorManager.cs         # 楼层数据/难度缩放
│   │   ├── FogOfWar.cs             # 战争迷雾
│   │   └── TileDatabase.cs         # 图块类型定义
│   ├── Player/
│   │   ├── PlayerController.cs     # 移动/输入
│   │   ├── PlayerStats.cs          # 属性/等级
│   │   └── SurvivalSystem.cs       # 饥饿/口渴/体温
│   ├── Combat/
│   │   ├── CombatManager.cs        # 战斗流程控制
│   │   ├── Enemy.cs                # 敌人基类
│   │   ├── BossEnemy.cs            # Boss 特殊行为
│   │   └── CombatUI.cs             # 战斗界面
│   ├── Items/
│   │   ├── ItemDatabase.cs         # ScriptableObject 物品数据库
│   │   ├── InventorySystem.cs      # 背包管理
│   │   ├── EquipmentSystem.cs      # 装备槽位
│   │   └── CraftingSystem.cs       # 制作配方
│   ├── Systems/
│   │   ├── ShopSystem.cs           # 商店
│   │   ├── QuestSystem.cs          # 任务
│   │   ├── AchievementSystem.cs    # 成就
│   │   └── DiarySystem.cs          # 生存日记
│   └── UI/
│       ├── HUDManager.cs           # 顶部状态栏
│       ├── InventoryUI.cs          # 背包界面
│       ├── CraftingUI.cs           # 制作界面
│       ├── ShopUI.cs               # 商店界面
│       └── MenuUI.cs               # 主菜单/死亡界面
├── ScriptableObjects/
│   ├── Items/                      # 物品定义
│   ├── Monsters/                    # 怪物定义
│   ├── Recipes/                    # 制作配方
│   └── Floors/                     # 楼层配置
├── Tilemaps/
│   ├── DungeonTilemap              # 地牢图块
│   └── FogTilemap                  # 迷雾覆盖
├── Prefabs/
│   ├── Player
│   ├── Monsters/
│   └── Items/
├── Sprites/
│   ├── Characters/
│   ├── Monsters/
│   ├── Items/
│   ├── Tiles/
│   └── UI/
├── Audio/
│   ├── BGM/
│   ├── SFX/
│   └── Ambient/
└── Scenes/
    ├── MainMenu
    ├── Game
    └── Combat
```

## 开发阶段

### 阶段 1：核心循环验证（P0，约 5 天）

1. **Unity 项目搭建**
   - 创建 2D 项目
   - 导入 Tilemap 包
   - 配置 2D Light/Shadow
   - 设置虚拟输入系统

2. **地牢生成**
   - 移植 `game.js genMaze()` → `DungeonGenerator.cs`
   - 使用 Tilemap 渲染
   - 占位图块（纯色方块即可）

3. **角色移动**
   - `PlayerController.cs`：网格移动、碰撞检测
   - 触屏虚拟摇杆 + 键盘 WASD
   - 简单精灵动画

4. **黑暗遮罩**
   - `FogOfWar.cs`：移植 `revealFog()` 逻辑
   - Unity 2D Light 跟随角色
   - 已探索区域暗灰显示

5. **生存机制**
   - `SurvivalSystem.cs`：HP/饥饿/口渴/体温
   - 每步消耗逻辑
   - 死亡判定

### 阶段 2：战斗与物品（P0-P1，约 4 天）

6. **战斗系统**
   - 移植 `combat.js CombatManager` → `CombatManager.cs`
   - 攻击/蓄力/防御/逃跑
   - 伤害浮动数字
   - 战斗 UI

7. **怪物系统**
   - `Enemy.cs` + `BossEnemy.cs`
   - 移植怪物数据 → ScriptableObject
   - 怪物 AI（简单追踪）
   - 精英/Boss 特殊行为

8. **物品与背包**
   - 物品 ScriptableObject 数据库
   - `InventorySystem.cs`：拾取、装备、使用、丢弃
   - 装备槽位（武器+盔甲 MVP，后续扩展 8 槽）

9. **制作系统**
   - 移植配方数据
   - `CraftingSystem.cs`：材料检查、消耗、产出

### 阶段 3：系统完善（P1，约 3 天）

10. **商店系统**
    - 移植 `level.js` 商店逻辑
    - 商店 UI

11. **楼层系统**
    - 移植楼层定义和难度缩放
    - 楼层过渡动画

12. **存档系统**
    - JSON 序列化
    - 自动存档（楼层过渡时）

13. **主菜单 / 死亡界面**
    - 开始/继续/删除存档
    - 死亡统计

### 阶段 4：打磨（P2，约 3 天）

14. **任务系统**
15. **成就系统**
16. **生存日记**
17. **音效/背景音乐**
18. **UI 打磨和适配**

## 关键数据迁移

### 物品数据（game.js → ScriptableObject）

```csharp
// ItemData.cs
[CreateAssetMenu(fileName = "Item", menuName = "Darkness/Item")]
public class ItemData : ScriptableObject {
    public string itemId;
    public string itemName;
    public string description;
    public ItemType type;        // Weapon, Armor, Consumable, Material
    public Quality quality;      // Common, Uncommon, Rare, Epic, Legendary
    public Sprite icon;
    public bool stackable;
    public int maxStack;
    public int atkBonus;
    public int defBonus;
    public int hpBonus;
    public ItemEffect[] effects;
}
```

### 怪物数据

```csharp
// MonsterData.cs
[CreateAssetMenu(fileName = "Monster", menuName = "Darkness/Monster")]
public class MonsterData : ScriptableObject {
    public string monsterId;
    public string monsterName;
    public Sprite icon;
    public int baseHp;
    public int baseAtk;
    public int baseDef;
    public int xpReward;
    public int minFloor;
    public MonsterTier tier;
    public DropEntry[] drops;
    public BossSkill[] skills;   // Boss only
}
```

### 配方数据

```csharp
// RecipeData.cs
[CreateAssetMenu(fileName = "Recipe", menuName = "Darkness/Recipe")]
public class RecipeData : ScriptableObject {
    public string recipeId;
    public string recipeName;
    public ItemData result;
    public int resultCount;
    public MaterialEntry[] materials;  // {itemData, count}
    public bool unlockedByDefault;
}
```

## 技术要点

### 迷宫生成
- 移植递归回溯算法，用 `int[,]` 二维数组代替 JS 数组
- Tilemap.SetTile() 渲染
- 预制图块资产（RuleTile 自动连接）

### 迷雾系统
- 方案 A：Shader-based（性能好，推荐）
- 方案 B：Overlay Tilemap 半透明黑色图块
- 已探索 vs 当前视野 用不同透明度

### 战斗
- 独立场景或 UI Overlay
- 回合制状态机（PlayerTurn → EnemyTurn → CheckResult）
- 协程实现延迟效果

### 存档
- `JsonUtility` 或 `Newtonsoft.Json`
- 存储结构：`SaveData` 类 → JSON string → PlayerPrefs
