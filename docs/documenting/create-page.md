---
title: "创建一个新页面"
---

对于平台或集成页面，最快的方法是复制现有页面并进行编辑。[集成概述](https://www.home-assistant.io/integrations/)和[示例部分](https://www.home-assistant.io/cookbook/)是自动生成的，因此无需为这些页面添加链接。

请遵循我们为文档制定的[标准](documenting/standards.md)。

如果你从头开始创建页面，需要添加一个标题。文档的不同部分可能需要不同的标题。

```text
---
title: "优秀传感器"
description: "home-assistant.io 网络存在"
ha_release: "0.38"
ha_category: Sensor
ha_iot_class: "本地轮询"
ha_quality_scale: silver
ha_config_flow: true
ha_codeowners:
  - '@balloob'
ha_domain: awesome
related:
  - docs: /voice_control/s3_box_voice_assistant/
    title: 创建一个 ESP32-S3-BOX-3 语音助手
  - url: https://esphome.io/projects/index.html
    title: ESPHome 项目网站
---

内容... 用 markdown 编写。

### 标题头部
...
```

文件头部的附加键：

- `title`: 这个标题应该与集成清单文件中写的集成名称匹配。
- `ha_release`: 集成包含的版本，例如“0.38”。如果当前版本是0.37，则将`ha_release`设为0.38。如果是0.30或0.40，请用 `' '` 包含它。
- `ha_category`: 该条目用于在[集成概述](https://www.home-assistant.io/integrations/)中对集成进行分组。
- `ha_iot_class`: [IoT 类别](https://www.home-assistant.io/blog/2016/02/12/classifying-the-internet-of-things)是设备行为的分类器。
- `ha_quality_scale`: [质量标准](https://www.home-assistant.io/docs/quality_scale/)是集成质量的表示。
- `ha_config_flow`: 如果集成具有[数据输入流](/data_entry_flow_index.md)，将其设置为`true`，否则省略。
- `ha_codeowners`: 对于负责该集成的 GitHub 用户名或团队名称（以 `@` 开头）。这应与集成清单文件中列出的代码所有者匹配。
- `ha_domain`: 集成在 Home Assistant Core 中的域。这必须与集成清单文件中的名称匹配。
- `related`: 可选。为页面末尾添加一个与相关主题链接的部分。使用 `docs` 进行本地链接，使用 `url` 进行外部链接。当使用 `docs` 时，`title` 键是可选的。如果未设置，将使用你指向的页面的标题。

有[预定义变量](https://jekyllrb.com/docs/variables/)可用，但通常在编写文档时不需要使用它们。

需要记住的一些要点：

- 如果需要，请记录获取第三方服务或设备的 API 密钥或访问令牌所需的步骤。
- 添加截图以在合适的地方支持用户。
- 当你知道有多种设备存在时，添加你测试过的设备类型（包括固件）。

### 配置

每个平台页面应包含一个配置示例。该示例必须仅包含 **必需** 变量，以便用户方便地复制粘贴到他们的 `configuration.yaml` 文件中。

**配置变量** 部分必须使用 `{% configuration %} ... {% endconfiguration %}` 标签。

```text
{% configuration %}
api_key:
  description: 访问该服务的 API 密钥。
  required: true
  type: string
name:
  description: 前端使用的名称。
  required: false
  default: 前端使用的默认名称。
  type: string
monitored_conditions:
  description: 前端显示的条件。
  required: true
  type: map
  keys:
    weather:
      description: 人类可读的文本摘要。
    temperature:
      description: 当前温度。
{% endconfiguration %}
```

可用键：

- **`description:`**: 该变量的内容。
- **`required:`**: 如果该变量是必需的。

```text
required: true            #=> 必需
required: false           #=> 可选
required: inclusive       #=> 包含
required: exclusive       #=> 排外
required: any string here #=> 此处任何字符串
```

- **`type:`**: 变量的类型。允许的条目有: `action`, `boolean`, `string`, `integer`, `float`, `time`, `template`, `device_class`, `icon`, `map`/`list`（用于条目列表），`date`, `datetime`, `selector` 和 `any`。对于多种可能性，请使用 `[string, integer]`。如果你使用 `map`/`list`，则应定义 `keys:`（请参见 [`template` 传感器](https://www.home-assistant.io/integrations/sensor.template/) 的示例）。如果你使用 `boolean`，则必须定义 `default:`。

### 嵌入代码

你可以使用[默认的 markdown 语法](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#code)生成语法高亮的代码。对于内联代码，请用反引号括起来。

当你编写将在终端上执行的代码时，不要在前面加 `$`，因为这样会使命令难以复制和粘贴。然而，当需要区分输入的命令和命令输出时，命令前加 `$` 是必要的。

### 模板

对于[配置模板](https://www.home-assistant.io/docs/configuration/templating/)使用[Jinja](http://jinja.pocoo.org/)。有关更多信息，请查看[文档标准](documenting/standards.md)。

如果你不转义模板，它们将被呈现并在网站上显示为空白。

### HTML

直接使用 HTML 是支持的，但不推荐。备注框是例外。

```html
<div class='note warning'>
  你需要在路由器上启用 telnet。
</div>
```

请注意，如果你想在 HTML 块中使用 Markdown，它必须被新行包围。

```html
<div class='note warning'>
  
  你需要在路由器上启用 [**telnet**](https://en.wikipedia.org/wiki/Telnet)。
  
</div>
```

### 图片、图标和徽标

为集成提供徽标可以使集成在最终用户中快速识别。
从文档的角度来看，启用徽标的使用无需特定配置，
但是，徽标必须存在于我们的品牌库中。

要为你的集成添加徽标和图标，请在[Home Assistant Brands](https://github.com/home-assistant/brands)提交拉取请求。

页面上显示的其他图像根据其用途存储在不同的目录中：

| 类型        | 位置                      |
| :---------- | :------------------------ |
| blog        | source/images/blog        |
| screenshots | source/images/integration |

### 从侧边栏链接

如果你正在添加一个需要从侧边栏链接的新页面，你需要编辑 `source/_includes/asides/docs_navigation.html` 文件中的 `docs_navigation.html`。