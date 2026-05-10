# Darkness Survival — Game Studio Workflow

## 可用技能 (Skills)

### 核心开发技能
| 技能 | 命令 | 用途 |
|------|------|------|
| game-designer | `/game-designer` | 设计新功能、调优数值、撰写 GDD |
| gameplay-programmer | `/gameplay-programmer` | 实现核心玩法代码 |
| engine-programmer | `/engine-programmer` | 渲染优化、底层系统 |
| level-designer | `/level-designer` | 关卡设计、节奏曲线 |
| art-director | `/art-director` | 视觉风格、调色板 |
| audio-director | `/audio-director` | 音效、音乐方向 |
| qa-tester | `/qa-tester` | 测试用例、bug 报告 |

### 团队协作技能
| 技能 | 命令 | 用途 |
|------|------|------|
| team-combat | `/team-combat` | 战斗系统端到端开发 |
| team-level | `/team-level` | 关卡创建完整流程 |
| team-audio | `/team-audio` | 音频系统完整流程 |
| team-ui | `/team-ui` | UI 系统完整流程 |
| team-polish | `/team-polish` | 优化打磨流程 |

### 辅助技能
| 技能 | 命令 | 用途 |
|------|------|------|
| brainstorm | `/brainstorm` | 头脑风暴设计方向 |
| estimate | `/estimate` | 估算任务工作量 |
| playtest-report | `/playtest-report` | 试玩报告模板 |
| perf-profile | `/perf-profile` | 性能分析 |

## 典型工作流程

### 1. 新功能开发
```
/game-designer [功能名称]
→ 设计文档产出
/gameplay-programmer [实现该功能]
→ 代码实现
/qa-tester [验证该功能]
→ 测试报告
```

### 2. 战斗系统迭代
```
/team-combat [战斗系统优化]
→ 协调 game-designer + gameplay-programmer + qa-tester
```

### 3. 美术方向调整
```
/art-director [视觉风格调整]
→ 美术方向文档
/engine-programmer [渲染实现]
→ 技术实现
```

### 4. 关卡设计
```
/level-designer [新关卡设计]
→ 关卡设计文档
/gameplay-programmer [关卡生成逻辑]
→ 代码实现
```

## 快速开始

要使用这些技能，只需在对话中输入:
- `/skill-name [任务描述]` 或直接说 "用 game-designer 帮我设计..."
- 技能会自动读取项目上下文并执行对应角色的工作
