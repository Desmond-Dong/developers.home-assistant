---
title: "识别用户输入中的意图"
sidebar_label: "介绍"
---

语音助手围绕意图识别而发展。意图识别尝试从用户的输入中提取用户的意图。这个意图，一种数据格式，随后将由 Home Assistant 执行。

Home Assistant 的意图识别由 [hassil](https://github.com/home-assistant/hassil) 提供支持。Hassil 通过将用户输入与句子模板匹配来识别意图。

句子模板是包含槽位（数据的占位符）的句子，并支持各种语法，以允许单个模板匹配广泛的类似句子。

> `(turn | switch) on [the] {area} lights`

这个示例句子模板匹配 `turn on kitchen lights` 和 `switch on the kitchen lights`。在这两种情况下，它将提取额外的数据 `area`，并设置为 `kitchen`。

在 Home Assistant 中，我们在 [GitHub](https://github.com/home-assistant/intents) 上收集我们的句子模板。该仓库旨在为每种语言和每个 [Home Assistant 中支持的意图](../../intent_builtin) 包含用户可能说出的句子。