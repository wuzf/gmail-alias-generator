# Security Policy

## Supported Versions

目前默认只对最新主分支代码提供安全修复支持。

## Reporting a Vulnerability

如果你发现潜在安全问题，请遵循以下方式：

1. **不要**直接在公开 issue 中附带完整漏洞细节或 PoC。
2. 如果仓库启用了 GitHub 的 **Private Vulnerability Reporting** / Security Advisories，请优先使用该渠道。
3. 如果仓库暂未启用私密通道，请先创建一个**不包含利用细节**的 issue，请求安全联系渠道。

## Scope Notes

这是一个纯前端静态项目，不应要求用户输入密码、访问令牌或任何敏感凭据。

如果你发现以下问题，也欢迎报告：

- 复制逻辑导致的意外泄露风险
- 前端注入/XSS 风险
- 文档中可能误导用户暴露凭据的内容
- 依赖项中的高危漏洞
