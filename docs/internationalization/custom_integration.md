---
title: "自定义集成本地化"
---

## 翻译字符串

与合并在 `home-assistant` 仓库中的本地化字符串不同，自定义集成无法利用 Lokalise 进行用户提交的翻译。然而，自定义集成的作者仍然可以将翻译包含在他们的集成中。这些翻译将从与集成源代码相邻的 `translations` 目录中读取。它们在 `translations` 目录中的命名格式为 `<language_code>.json`，例如，对于德语翻译为 `de.json`。

该文件将包含自定义集成提供的不同可翻译字符串，这些字符串需要被翻译。这些文件遵循与 [后端翻译字符串文件](internationalization/core.md) 相同的格式，但每种翻译语言将存在一份副本。

语言代码遵循 [BCP47](https://tools.ietf.org/html/bcp47) 格式。

为了确保您的翻译文件是正确的，请使用我们的集成验证工具 Hassfest 进行测试。[在此查看设置说明。](https://developers.home-assistant.io/blog/2020/04/16/hassfest)