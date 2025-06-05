---
title: "所有集成模块的测试覆盖率超过95%"
related_rules:
  - config-flow-test-coverage
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

由于我们支持许多不同的集成，我们并没有每个设备或服务可供实际测试。  
为了确保我们不会破坏任何东西，在接受代码更改时，我们需要对所有集成模块有良好的测试覆盖率。  
这可以防止引入错误和回归。

这也使得新开发人员能够理解代码库并进行更改，而不会破坏任何现有用例。

## 其他资源

有关测试和如何计算测试覆盖率的更多信息，请参见[测试您的代码](/docs/development_testing)页面。

## 例外

此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>