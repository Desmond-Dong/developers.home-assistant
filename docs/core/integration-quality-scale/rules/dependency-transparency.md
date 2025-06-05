---
title: "依赖透明性"
related_rules:
  - async-dependency
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

Home Assistant 使用了许多依赖项以便正常工作。
这些依赖项将与 Home Assistant 的新版本一起发布。
为了使项目信任这些依赖项，我们有一系列期望依赖项满足的要求。

- 依赖项的源代码必须在一个 OSI 批准的许可证下可用。
- 依赖项必须可在 PyPI 上获取。
- 发布到 PyPI 的包应该在一个公共 CI 管道中构建并发布。
- 在 PyPI 上发布的依赖项版本应与公开在线仓库中的一个标记版本对应。

## 例外

此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>