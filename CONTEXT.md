# Darkness Survival — Project Context

## 项目概述

**游戏名称**: Darkness Survival (黑暗生存)
**类型**: 暗黑 Roguelike 地牢生存冒险
**平台**: Web (Canvas 2D) / Unity (计划中)
**参考原作**: Zero++ Software《黑暗生存》(已下架)

## 核心体验

在无尽的黑暗地牢中探索、战斗、收集资源、制作装备，寻找出口深入更深层。每次死亡从头来过，但收集的符文配方永久保留。

## 设计支柱

1. **黑暗压迫感**: 大面积黑暗遮罩，有限视野制造紧张氛围
2. **生存紧迫感**: HP/饥饿/口渴/体温四维系统驱动持续探索
3. **发现惊喜感**: 随机地图、随机掉落、配方解锁
4. **死亡循环**: 永久死亡 + 配方保留 = 每次都更进一步

## 技术架构

### Web 原型 (当前)
- **渲染**: Canvas 2D + 等距投影
- **地图**: 递归回溯算法生成迷宫
- **战斗**: 回合制实时化（攻击/蓄力/防御/逃跑）
- **存储**: localStorage JSON 序列化

### Unity 版本 (计划中)
- **引擎**: Unity 2D (URP)
- **地图**: Tilemap 系统
- **光照**: 2D Light + Shadow Caster
- **数据**: ScriptableObject 驱动

## 文件结构

```
d:\34619.github.io\
├── CONTEXT.md                    # 项目上下文 (本文件)
├── CLAUDE.md                     # Agent 配置
├── design/
│   └── gdd/
│       ├── game-concept.md       # 游戏设计文档
│       ├── art-direction.md      # 美术方向
│       └── unity-port-plan.md    # Unity 迁移计划
├── darkness-survival/
│   ├── game.html                 # 主游戏页面
│   ├── game.js                   # 核心游戏引擎
│   ├── index.html                # 入口页面
│   └── Assets/Scripts/           # Unity C# 脚本
└── .claude/
    ├── skills/                   # 游戏开发技能
    └── settings.json             # 权限配置
```

## 当前进度

- [x] Web 原型核心循环
- [x] 等距 3D 渲染引擎
- [x] 战斗系统 (含 Boss 技能)
- [x] 8 槽位装备系统
- [x] 制作系统 (14 配方)
- [x] 成就系统 (8 成就)
- [x] 生存日记随机事件
- [ ] 触屏虚拟方向键优化
- [ ] 音效系统
- [ ] Unity 迁移

## 参考截图

原作截图位于: `C:\Users\xiaoc\Pictures\Screenshots\屏幕截图(15-57).png`
