---
title: "严格类型"
related_rules:
  - 运行时数据
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

Python是一种动态类型语言，这可能是许多错误的源头。
通过使用类型提示，您可以早期发现错误，避免引入它们。

类型提示由mypy检查，mypy是Python的静态类型检查器。
由于Python中的类型工作方式，以及Python中类型提示是可选的，mypy将仅检查它知道带有类型注解的代码。
为了改进这一点，我们建议全面类型化您的库并使其符合PEP-561。
这意味着您需要向库中添加一个`py.typed`文件。
该文件告诉mypy您的库是全面类型化的，此后它可以读取您库中的类型提示。

在Home Assistant代码库中，您可以将集成添加到[`.strict-typing`](https://github.com/home-assistant/core/blob/dev/.strict-typing)文件中，这将为您的集成启用严格类型检查。

:::warning
如果集成实现了`runtime-data`，则需要使用自定义类型的`MyIntegrationConfigEntry`，并且必须在整个过程中使用。
:::

## 额外资源

要了解有关`py.typed`文件的更多信息，请参阅[PEP-561](https://peps.python.org/pep-0561/)。

## 例外

此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>