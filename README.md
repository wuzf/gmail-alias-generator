# Gmail Alias Generator

一个基于纯前端静态页面的 Gmail alias / 变体生成工具，适合部署到 **Cloudflare Pages**。

## 在线访问

- 生产地址：<https://main.gmail-alias-generator.pages.dev>

## Highlights

- 纯前端、无后端依赖
- 支持 dot / plus / case / domain 规则组合
- 支持最多 `10000` 条结果生成与分页预览
- 支持多语言界面
- 可直接部署到 Cloudflare Pages

当前支持：

- 自定义生成数量
- 结果分页预览，避免一次性渲染过多内容导致页面卡顿
- 多语言界面
- 本地冒烟测试与语法检查

## Quick Start

```powershell
npm install
npm run dev
```

打开本地预览后，输入 Gmail 用户名前缀，选择规则并生成结果。

## 免责声明

- 本项目与 **Google / Gmail** 没有任何官方关联。
- 本工具用于生成基于 Gmail 常见投递规则的地址变体，便于测试、分类和演示。
- `大小写变换`、`gmail.com / googlemail.com` 等规则更适合视为**等价投递形式**，不应理解为完全独立的新邮箱账户。

## 目录结构

- `public/`：Cloudflare Pages 的发布目录
  - `index.html`
  - `styles.css`
  - `app.js`
  - `alias-generator.js`
- `test-alias-generator.js`：核心逻辑冒烟测试
- `wrangler.toml`：Cloudflare Pages / Wrangler 配置
- `package.json`：本地开发、检查、部署脚本

## 环境要求

- Node.js 20 或更高版本
- npm 10 或更高版本（建议随 Node.js 一起安装）

## 可用脚本

| Script | 说明 |
| --- | --- |
| `npm run dev` | 本地启动 Cloudflare Pages 预览 |
| `npm run test` | 运行核心逻辑冒烟测试 |
| `npm run check` | 运行语法检查与冒烟测试 |
| `npm run deploy` | 通过 Wrangler 部署 `public/` |

## 本地开发

安装依赖：

```powershell
npm install
```

本地预览：

```powershell
npm run dev
```

运行检查：

```powershell
npm run check
```

## 部署到 Cloudflare Pages

### 方式 1：Cloudflare Dashboard 连接 Git 仓库

创建 Pages 项目时使用：

- **Framework preset**: `None`
- **Build command**: 留空，或填 `npm run build`
- **Build output directory**: `public`

> 当前项目是纯静态站点，不需要额外构建步骤。

### 方式 2：Wrangler 直接部署

先登录：

```powershell
npx wrangler login
```

部署：

```powershell
npm run deploy
```

如果你想换成自己的 Pages 项目名，修改 `wrangler.toml` 里的 `name` 即可。

## 开源说明

- 许可证：`MIT`，见 [`LICENSE`](./LICENSE)
- 贡献指南：见 [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- 安全策略：见 [`SECURITY.md`](./SECURITY.md)

欢迎提交 issue 和 PR，但请保持变更聚焦、可复现，并同步更新必要文档。

## Limitations

- 本项目只生成地址变体，不验证邮箱真实可用性
- 不同规则的实际投递表现以 Gmail 当前行为为准
- 不提供账号注册、收件测试或自动化滥用相关能力
