# Contributing

感谢你愿意为这个项目做贡献。

## 提交前建议

- 先阅读 `README.md`
- 优先提交小而明确的改动
- 保持改动可复现、可回滚
- 如果修改了功能、文案或部署方式，请同步更新文档

## 本地开发

安装依赖：

```powershell
npm install
```

本地预览：

```powershell
npm run dev
```

提交前请至少运行：

```powershell
npm run check
```

## 代码与 PR 约定

- 不要一次性混入无关重构
- 尽量保持现有代码风格与命名方式一致
- 涉及 UI 行为变化时，请在 PR 描述中写明变更点
- 涉及文案或多语言文本时，请说明是否需要同步其它语言

## Issue 建议

- Bug：提供复现步骤、预期结果、实际结果、运行环境
- Feature request：说明使用场景、期望行为、替代方案

## 安全问题

如果你发现安全问题，请不要直接公开披露细节。请先阅读 [`SECURITY.md`](./SECURITY.md)。
