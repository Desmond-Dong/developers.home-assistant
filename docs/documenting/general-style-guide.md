---
title: "通用风格指南"
---

文档应遵循 [微软风格指南](https://learn.microsoft.com/style-guide/welcome/)。

在审查中产生的一些最常见情况列在下面：

- 文档的语言应为美式英语。
- 句号后不要加两个空格。
- 在三项或更多项目的列表中，在连接词前使用序列逗号（也称为牛津逗号）。例如，“通过使用额外的适配器，Home Assistant 允许使用 Zigbee、Z-Wave 和其他协议”。
- 行长度没有限制。你可以以流畅的文本风格书写。这样将来在使用 GitHub 在线编辑器时会更容易。
- 要客观，不要性别偏见、极端分化、与种族相关或忽视宗教。未遵循此规则的贡献可能违反我们的 [行为准则](https://github.com/home-assistant/core/blob/master/CODE_OF_CONDUCT.md)。
- 品牌名称、服务、协议、集成和平台的大小写必须与其各自的对应项一致。例如，“Z-Wave” _而不是_ “Zwave”、“Z-wave”、“Z Wave”或“ZWave”。此外，“Input Select” _而不是_ “input select”或“Input select”。
- 不要使用全部大写字母来强调 - 而是使用 _斜体_。
- 在标题中也使用 [句子式大小写](https://learn.microsoft.com/en-us/style-guide/capitalization)。
- 使用 **粗体** 标记 UI 字符串，例如：
  - 在 **设置** 下，选择三个点的菜单。然后，选择 **重启 Home Assistant** > **快速重新加载**。
- 不要使用“e.g.”。相反，使用 _例如_、_如_ 或 _像_。
- 所有包含 Jinja2 模板的示例应在代码 markdown 外部用 `{% raw %}` 标签包裹。

## 表格

- 避免使用表格。请改用列表。如果无法避免表格，尽量减少列数并将文本量保持在最短：
  - 宽幅表格在手持设备上可能难以浏览。
  - 内容较少使表格更易读。
- 当限制文本量不可行时，考虑使用其他数据结构来表示信息。例如，可以使用列表或 `{% configuration_basic %}`。

## Markdown

有关在此文档中使用 markdown 的几点说明：

### Markdown 列表

- 对于无序列表，请使用 `-`，而不是 `*`。
- 对于有序列表，请使用递增数字。

## YAML 和模板

我们有一个单独的 YAML 风格指南以及在 YAML 中使用 Jinja2 模板的指南。

[YAML 风格指南](documenting/yaml-style-guide.md)