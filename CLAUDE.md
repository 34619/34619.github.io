# CLAUDE.md

## Project: Darkness Survival (黑暗生存)

暗黑 Roguelike 地牢生存冒险游戏。详见 [CONTEXT.md](CONTEXT.md)

## Agent Skills — Game Studio

### 核心开发技能

| Skill | Command | Description |
|-------|---------|-------------|
| game-designer | `/game-designer` | 设计机制、数值调优、GDD 撰写 |
| gameplay-programmer | `/gameplay-programmer` | 实现核心玩法代码 |
| engine-programmer | `/engine-programmer` | 渲染、性能、底层系统 |
| level-designer | `/level-designer` | 关卡设计、节奏曲线 |
| art-director | `/art-director` | 视觉风格、调色板 |
| audio-director | `/audio-director` | 音效、音乐方向 |
| qa-tester | `/qa-tester` | 测试用例、bug 报告 |
| brainstorm | `/brainstorm` | 设计头脑风暴 |

### 团队协作技能

| Skill | Command | Description |
|-------|---------|-------------|
| team-combat | `/team-combat` | 战斗系统端到端开发 |
| team-level | `/team-level` | 关卡创建完整流程 |
| team-audio | `/team-audio` | 音频系统完整流程 |
| team-ui | `/team-ui` | UI 系统完整流程 |
| team-polish | `/team-polish` | 优化打磨流程 |

### 工作流程

详见 [docs/game-studio-workflow.md](docs/game-studio-workflow.md)

## Issue Tracker

Issues tracked on GitHub Issues. See `docs/agents/issue-tracker.md`.

## Triage Labels

Five default triage labels (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

## Domain Docs

Single-context layout with `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Project Structure

```
├── CONTEXT.md                    # 项目上下文
├── CLAUDE.md                     # 本文件
├── design/gdd/                   # 游戏设计文档
├── darkness-survival/            # Web 原型
│   ├── game.html                 # 主页面
│   ├── game.js                   # 核心引擎
│   └── Assets/Scripts/           # Unity 脚本
└── .claude/skills/               # 游戏开发技能
```
