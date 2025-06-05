---
title: "依赖是异步的"
related_rules:
  - inject-websession
---
import RelatedRules from './_includes/related_rules.jsx'

## 推理

Home Assistant 使用 asyncio 来高效处理任务。
为了避免在 asyncio 事件循环和其他线程之间切换上下文，这在性能上是很昂贵的，理想情况下，您的库也应该使用 asyncio。

这不仅会导致更高效的系统，而且代码也更加整洁。

## 其他资源

有关如何创建库的更多信息，请查看 [文档](/docs/api_lib_index)。

## 例外

此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>