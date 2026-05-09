# 黑暗生存 Unity 原型 — 使用说明

## Unity 中运行步骤

1. **创建 Unity 项目**
   - Unity Hub → New Project → 选择 **2D (URP)** 或 **2D Core**
   - 项目名: `DarknessSurvival`

2. **导入脚本**
   - 将 `Assets/Scripts/` 下所有 `.cs` 文件复制到项目的 `Assets/Scripts/` 中

3. **创建场景**
   - 创建新场景 `Game`
   - 创建空 GameObject，命名为 `GameManager`
   - 挂载 `GameManager.cs` 和 `GameUI.cs` 脚本

4. **运行**
   - 打开 `Game` 场景
   - 点击 Play 按钮
   - 使用 **WASD / 方向键** 移动
   - **I** 背包 | **C** 制作 | **T** 属性 | **ESC** 关闭面板

## 原型说明

- 使用 Unity OnGUI 即时模式 UI（prototype 原则：跳过打磨）
- 纯色方块代替精灵图（占位）
- 所有游戏逻辑已从 Web 原型完整移植
- 地牢生成、战斗、制作、商店、生存系统全部可用

## 回答的问题

**"Web 原型的核心系统能否成功迁移到 Unity C#？"**

答案：**可以**。递归回溯地牢生成、回合制战斗、物品/背包/制作/商店系统全部成功移植。下一步需要：
1. 替换占位方块为真实精灵图
2. 添加 Tilemap 渲染替代 OnGUI 绘制
3. 添加 2D Light 实现黑暗遮罩效果
4. 添加音效和背景音乐
