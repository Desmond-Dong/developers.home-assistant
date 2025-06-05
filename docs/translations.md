---
title: "贡献翻译"
---

Home Assistant 的翻译通过 [Lokalise](https://lokalise.com/) 进行管理，这是一个在线翻译管理工具。我们的翻译分为四个项目：一个用于平台特定翻译的后端项目，一个用于 UI 翻译的前端项目，以及两个官方伴侣应用的项目。点击下面的链接加入这些项目！即使你的语言已经完全翻译，额外的校对也是一种很大的帮助！请随时审查现有的翻译，并为可能更合适的替代方案投票。

- [加入前端翻译团队](https://lokalise.com/signup/3420425759f6d6d241f598.13594006/all/)
- [加入后端翻译团队](https://lokalise.com/signup/130246255a974bd3b5e8a1.51616605/all/)
- [加入 iOS 翻译团队](https://lokalise.com/signup/834452985a05254348aee2.46389241/all/)
- [加入 Android 翻译团队](https://lokalise.com/public/145814835dd655bc5ab0d0.36753359/)

有关翻译编辑器和工具的更多信息，请参见 [Lokalise 翻译与协作文档](https://docs.lokalise.com/en/collections/2909016-translate-and-collaborate)。

翻译会在每次构建时从 Lokalise 下载，因此所有主要、次要、测试版本和夜间构建都将提供最新的翻译。

## 翻译占位符

有些翻译字符串会包含特殊的占位符，这些占位符在运行时会被替换。

在方括号 `[]` 中定义的占位符（在 Lokalise 中以绿色显示）是 [Lokalise 键引用](https://docs.lokalise.com/en/articles/1400528-key-referencing)。这些主要用于链接将要重复的翻译字符串，而不是一次又一次地重新定义相同的翻译。在合理的情况下，翻译应使用这些占位符（可以通过在 Lokalise 编辑模式下点击“Source Alt+0”按钮轻松获取方括号占位符的值）。不同语言可能没有与英语相同的重复项，并且欢迎链接那些在英语中未链接的重复翻译。

在花括号 `{}` 中显示的占位符是 [翻译参数](https://formatjs.github.io/docs/core-concepts/icu-syntax/)，在 Home Assistant 运行时将被替换为实时值。原始字符串中存在的任何翻译参数占位符必须包含在翻译字符串中，并且不得被翻译！这些占位符可以包括用于定义复数或其他替换规则的特殊语法。上述链接的 format.js 指南解释了添加复数定义和其他规则的语法。

## 规则

1. 只有母语人士可以提交翻译。
2. 遵循 [Material Design 指南](https://material.io/design/communication/writing.html)。
3. 不要翻译或更改专有名词，如 `Home Assistant`、`Supervisor` 或 `Hue`。
4. 对于特定区域的翻译，与基础翻译相同的键应克隆源字符串。您可以使用 **Ctrl+Insert** 或在界面中选择 **Insert Source** 来做到这一点。这有助于跟踪已审阅和未审阅的内容，同时简化工作流程。
5. `state_badge` 键下的翻译将用于通知徽章显示。这些翻译应足够简短，以适应徽章标签而不溢出。您可以通过使用浏览器的开发工具编辑标签文本，或者使用 Home Assistant UI 中的开发者工具的 States 选项卡进行测试。在 UI 中，输入新的实体 ID (`device_tracker.test`)，并在状态中输入您想测试的文本。
6. 如果文本将在不同翻译键之间重复，请尽可能使用 Lokalise 键引用功能。基础翻译在 `states` 翻译下提供了此方面的示例。有关更多详细信息，请参见 [Lokalise 键引用](https://docs.lokalise.com/articles/1400528-key-referencing) 文档。

## 添加新语言

如果您的语言未列出，可以在 [GitHub](https://github.com/home-assistant/frontend/discussions/new?category=localization) 上请求。请同时提供您的语言的英文名称和本地名称。例如：

```txt
英文名称: 德语
本地名称: Deutsch
```

:::info
特定区域的翻译 (`en-US`, `fr-CA`) 仅在与基础语言翻译需要不同的情况下才会包含。
:::

### 维护者添加新语言的步骤

1. 语言标签必须遵循 [BCP 47](https://tools.ietf.org/html/bcp47)。可以在这里找到大多数语言标签的列表：[IANA 子标签注册](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)。示例：`fr`，`fr-CA`，`zh-Hans`。仅在包含国家特定覆盖的情况下，包括国家代码，并且基础语言已经翻译。
2. 在 `src/translations/translationMetadata.json` 中添加语言标签和本地名称。示例：“Français”，“Français (CA)”
3. 在 Lokalize 中添加新语言。
注意：有时您需要在 Lokalise 中更改标签（语言 -> 语言设置 -> 自定义 ISO 代码）。

## 语言特定指南

大多数语言对一个句子有多种可能的翻译。请查看您语言的指南，在那里您还可以找到一些典型的错误以加以防范。
各部分用相应语言撰写，这样更容易解释语法，只有母语人士应提交翻译（见 [规则](#rules)）。

### 德语

- Du/Sie: 在翻译中使用 Du 形式，不要使用正式的 “Sie”。

#### 典型错误

- 注意正确的命令式。命令式是命令的形式，例如“Gib mir das Wasser”。错误的形式是：“Gebe mir das Wasser”（请参阅 [命令式的形成](https://www.duden.de/sprachwissen/sprachratgeber/Bildung-des-Imperativs)）。

### 法语

- *Blueprint*: 决定不翻译该词并将其视为专用名词。这避免了与 *map* 和 *template* 的翻译混淆，并且有助于在互联网上搜索要导入的 Blueprint。因此始终使用大写的 `Blueprint`。