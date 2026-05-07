# 小陈的个人网站

一个基于单文件 HTML + Supabase 构建的多功能社区平台，集成了论坛、即时聊天、好友系统、订单管理等功能。

在线访问：[https://34619.github.io](https://34619.github.io)

## 技术栈

- **前端**：原生 HTML / CSS / JavaScript（单文件，无构建工具）
- **后端**：Supabase（认证、PostgreSQL 数据库、实时订阅、对象存储）
- **部署**：GitHub Pages

## 功能一览

### 论坛系统
- 多版块分类、发帖/评论（支持 Markdown）
- 帖子标签、精华帖、置顶帖
- 点赞、收藏、分享（复制链接）
- 编辑历史记录
- @提及通知

### 社交功能
- 好友系统（搜索、添加、删除）
- 一对一即时聊天（实时消息）
- 通知中心（评论、点赞、@提及、好友请求）

### 用户系统
- 邮箱注册 / 登录 / 找回密码
- 个人资料编辑（昵称、头像、性别、年龄、简介）
- 用户主页（查看帖子、评论）
- 积分与等级（签到获取积分，自动计算等级徽章）
- 每日签到（连续签到奖励）

### 管理后台
- 数据看板（用户数、帖子数、评论数、今日签到）
- 用户管理
- 帖子管理（置顶、精华、删除）
- 举报处理（实时红点提醒）

### 其他
- 深色 / 浅色主题切换
- 背景音乐播放器（键盘快捷键、拖拽进度条）
- 响应式布局（适配移动端）
- 回到顶部按钮
- SEO 优化（Open Graph 标签）

## 快速开始

### 1. 创建 Supabase 项目

前往 [Supabase](https://supabase.com) 创建项目，获取 Project URL 和 anon Key。

### 2. 配置前端

编辑 `index.html`，替换开头的配置：

```javascript
var SUPABASE_URL = '你的项目URL';
var SUPABASE_KEY = '你的anon Key';
```

### 3. 执行数据库迁移

在 Supabase SQL Editor 中按顺序执行 `supabase-schema.sql` 中的 SQL 语句。

### 4. 部署

推送到 GitHub 仓库，开启 GitHub Pages 即可。

## 数据库表结构

| 表名 | 说明 |
|------|------|
| `profiles` | 用户资料（昵称、头像、积分等） |
| `posts` | 帖子 |
| `comments` | 评论 |
| `post_likes` | 帖子点赞 |
| `comment_likes` | 评论点赞 |
| `post_tags` | 帖子标签 |
| `edit_history` | 编辑历史 |
| `bookmarks` | 收藏 |
| `friendships` | 好友关系 |
| `messages` | 聊天消息 |
| `notifications` | 通知 |
| `reports` | 举报 |
| `checkins` | 签到记录 |
| `admins` | 管理员 |
| `orders` | 跟单数据 |

## RPC 函数

| 函数 | 说明 |
|------|------|
| `fn_checkin` | 每日签到 |
| `fn_report` | 处理举报 |
| `fn_site_stats` | 获取站点统计 |
| `fn_admin_get_reports` | 管理员获取举报列表 |
| `fn_admin_delete_content` | 管理员删除内容 |
| `fn_admin_pending_reports_count` | 待处理举报数量 |
| `fn_inc_views` | 增加浏览量 |
| `fn_inc_comments` | 增加评论数 |
| `fn_dec_comments` | 减少评论数 |

## 项目结构

```
34619.github.io/
├── index.html          # 全部前端代码（CSS + HTML + JS）
├── supabase-schema.sql # 数据库迁移脚本
└── README.md
```

## 许可

MIT
