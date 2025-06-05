---
title: "标准"
---

为了确保 Home Assistant 的文档对新手和专家用户都一致且易于遵循，我们要求您遵循一套非常严格的文档开发标准。

## 风格指南

文档应遵循 [Microsoft 风格指南](https://learn.microsoft.com/style-guide/welcome/)。有关更多详细信息，请参阅 [通用风格指南](documenting/general-style-guide.md) 和 [YAML 风格指南](documenting/yaml-style-guide.md)。

## 集成和平台页面

- 所有示例应格式化为包括在 `configuration.yaml` 中，除非明确说明。
  - 使用大写字母和 `_` 来表示值需要被替换。例如，`api_key: YOUR_API_KEY` 或 `api_key: REPLACE_ME`。
- 集成和平台名称应链接到各自的文档页面。

### 配置变量

- **配置变量** 部分仅用于 YAML 配置。
- **配置变量** 部分必须使用 `{% configuration %}` 标签。
- 配置变量必须记录要求状态（`false` 或 `true`）。
- 配置变量必须记录默认值（如果有）。
- 配置变量必须记录接受的值类型（请参阅 [配置变量细节](documenting/create-page.md#configuration)）。
  - 对于接受多种类型的配置变量，请用逗号分隔这些类型（即 `string, integer`）。

#### 示例配置变量块

```yaml
{% configuration %}
some_key:
  description: 这是对该键用途的描述。
  required: false
  type: string
  default: 可选的默认值 - 如果没有，则省略
{% endconfiguration %}
```

### UI 变量

- 对于描述 **UI 变量**，可以使用 `{% configuration_basic %}` 部分。

## YAML 和模板

我们为 YAML 及其内部使用 Jinja2 模板提供了单独的样式指南。

[YAML 风格指南](documenting/yaml-style-guide.md)

## 词汇表和术语工具提示

文档应以每个人都能理解的方式编写。为此，我们有一个 [术语词汇表](https://www.home-assistant.io/docs/glossary/)，其中包含 Home Assistant 和我们的文档中使用的术语。

如果您使用了词汇表中没有的术语，请随意添加；或改进现有术语的定义。

此外，我们还有一个可用的术语工具提示，可以添加并在文档中的任何地方使用。此工具提示将在用户将鼠标悬停在其上时显示该术语的定义，并提供更多信息的链接。它为用户可能不熟悉的术语提供了即时上下文。

添加术语工具提示的语法为：

```liquid
{% term <term> [<text>] %}
```

被引用的术语必须当然在我们的词汇表中列出，这是工具提示的来源。

例如，如果您写了关于自动化的文本，您可以添加一个这样的工具提示：

```liquid
这是一个关于 {% term automations %} 的示例文本，用于演示工具提示的使用，
在这种情况下，是为了句子前面提到的术语“automations”。
```

`<text>` 是可选的，如果您想为与术语本身不同的文本添加术语工具提示，可能会很有用。在以下示例中，将自动化术语工具提示添加到“自动化一切”文本中：

```liquid
太棒了，因为这让我能够 {% term automation "自动化一切" %}
在我的家里！我爱它！
```

## 重命名页面

有时集成或平台可能会被重命名，此时文档也需要更新。如果您重命名页面，请在 `_redirects` 文件中添加一个条目，如下所示。请考虑向页面添加详细信息，例如发布号或旧的集成/平台名称，以便在 [注释](/documenting/create-page.md#html) 中进行标注。

```text
---
...
/getting-started/scripts /docs/scripts
---
```

如果您在 [文档](https://www.home-assistant.io/docs/) 中移动内容，添加重定向也适用。