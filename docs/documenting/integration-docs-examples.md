---
title: 文档结构和示例文本
---

此页面展示了可用的文档功能示例（例如内联图标、文本框、相关主题的链接和词汇表条目）。它还展示了文档结构。

使用此模板并结合以下文档：

- 在 home-assistant.io 仓库中的集成文档模板，路径为 [/_integrations/_integration_docs_template.markdown](https://github.com/home-assistant/home-assistant.io/tree/current/source/_integrations/_integration_docs_template.markdown)。
- [文档标准](/docs/documenting/standards)。
- [通用风格指南](/docs/documenting/general-style-guide)。
- [集成质量标准](/docs/core/integration-quality-scale/) 的文档规则。

## 内联文本元素

此部分展示了您可以在文本中使用的元素。

### 我的链接

要指示 UI 中的位置，可以使用 [我的链接](https://www.home-assistant.io/docs/tools/quick-bar/#my-links)。选择一个我的链接会在其自己的 Home Assistant 安装中打开该页面。

例如：`"前往 {% my integrations title="**设置** > **设备与服务**" %} 并选择您的集成。"`

<p class='img'>
<img class='invertDark'
    src='/img/en/documentation/my-links_formatting.png'
    alt='显示我的链接样式的截图'
  />
  显示我的链接样式的截图
</p>

#### 示例

```markdown
- {% my areas title="**设置** > **区域、标签和区块**" %}
- {% my automations title="**设置** > **自动化与场景**" %}
- {% my backup title="**设置** > **系统** > **备份**" %}
- {% my general title="**设置** > **系统** > **常规**" %}
- {% my logs title="**设置** > **系统** > **日志**" %}
- {% my network title="**设置** > **系统** > **网络**" %}
- {% my profile title="**用户配置文件**" %}
```

要识别一个我的链接，在 Home Assistant 中，打开感兴趣的页面并按 `m` 键。

### 格式化

- 提及 UI 字符串时使用粗体：**设置**，**区域、标签和区块**
- 提及文件路径、文件名、变量名或您在字段中输入的文本时使用反引号：`/boot/config.txt` 文件，`this` 变量，输入 `/newbot`。

### 词汇表术语引用

一些 Home Assistant 术语和概念在词汇表中进行了说明。如果您添加了对该术语定义的引用，则术语定义将作为工具提示显示。

<p class='img'>
<img class='invertDark'
    src='/img/en/documentation/glossary-term_tooltip.png'
    alt='显示词汇表术语工具提示样式的截图'
  />
  显示词汇表术语工具提示样式的截图
</p>

#### 示例

```markdown
{% term integration %}
{% term entity %}
{% term "configuration.yaml" %}
{% term "Home Assistant 操作系统" %}
```

您可以在 [词汇表](https://www.home-assistant.io/docs/glossary/) 页面找到完整的词汇表术语列表。要了解更多关于词汇表术语的信息，请参阅 [词汇表的开发者文档](/docs/documenting/standards#glossary--terminology-tooltips)。

### 缩写和首字母缩略词

如果可能，尽量避免使用缩写和首字母缩略词。

如果您想使用缩写或首字母缩略词，可以添加缩写标签以显示完整术语作为工具提示。

<p class='img'>
<img class='invertDark'
    src='/img/en/documentation/abbreviation_tooltip.png'
    alt='显示缩写工具提示样式的截图'
  />
  显示缩写工具提示样式的截图
</p>

#### 示例

```markdown
<abbr title="音频和视频">A/V</abbr>,
<abbr title="电流变压器">CT</abbr>,
<abbr title="荷兰智能电表要求">DSMR</abbr>,
<abbr title="嵌入式多媒体卡">eMMC</abbr>,
<abbr title="Flash视频">FLV</abbr>,
<abbr title="大型语言模型">LLMs</abbr>,
<abbr title="模型上下文协议">MCP</abbr>,
<abbr title="平移、倾斜和缩放">PTZ</abbr>,
<abbr title="实时消息协议">RTMP</abbr>,
<abbr title="实时流协议">RTSP</abbr>,
或 <abbr title="USB随插随用">USB-OTG</abbr>。
```

### 内联图标

要引用 UI 中的图标，可以使用 [Iconify 库](https://icon-sets.iconify.design/mdi/) 中的图标。

<p class='img'>
<img class='invertDark'
    src='/img/en/documentation/inline_icons.png'
    alt='显示一些内联图标的截图'
  />
  显示一些内联图标的截图
</p>

#### 示例

```markdown
- 三个点的菜单：{% icon "mdi:dots-vertical" %}
- 汉堡菜单：{% icon "mdi:menu" %}
- 编辑：{% icon "mdi:edit" %}
- 恢复 {% icon "mdi:restore" %}
- 眼睛：{% icon "mdi:eye" %}
- 垃圾桶：{% icon "mdi:trash" %}
- 齿轮：{% icon "mdi:cog" %}
- 齿轮轮廓：{% icon "mdi:cog-outline" %}
- 拖拽：{% icon "mdi:drag" %}
- 移动光标：{% icon "mdi:cursor-move" %}
- 左箭头：{% icon "mdi:arrow-left-bold" %}
- 右箭头：{% icon "mdi:arrow-right-bold" %}
- 复选框列表：{% icon "mdi:order-checkbox-ascending" %}
- 上传网络：{% icon "mdi:upload-network" %}
- 安全网络：{% icon "mdi:security-network" %}
- 路由：{% icon "mdi:routes" %}
```

## 可折叠文本块

使用 details 块使文本块可折叠：

<p class='img'>
<img class='invertDark'
    src='/img/en/documentation/collapsible_text_block.webp'
    alt='显示一个可折叠文本块的截图'
  />
  显示一个可折叠文本块的截图
</p>

### 示例

```markdown
{% details "生成客户端 ID 和客户端密钥" %}

1. 您的 Fitbit 帐户必须在 [Fitbit 开发者门户](https://dev.fitbit.com) 注册为开发者帐户，并具有验证过的电子邮件地址。
2. 访问 [fitbit 开发者页面](https://dev.fitbit.com/apps/new) 来注册一个应用程序。
3. 输入您选择的 **应用名称**，例如 **Home Assistant**。
4. ...
{% enddetails %}
```

## 文本框

<p class='img'>
  <img class='invertDark'
      src='/img/en/documentation/text_boxes.png'
      alt='显示文本框的截图'
    />
    显示文本框的截图：
</p>

### 示例

```markdown

{% tip %}
您可以使用提示来推荐某个建议。
{% endtip %}

{% note %}
您可以使用注释来突出某个部分。
{% endnote %}

{% important %}
您可以使用“重要”来突出某个您认为非常重要的部分。
{% endimportant %}
```

## 可重用文本

对于某些主题，有一些预定义的文本元素可以重用。

### 配置

<p class='img'>
<img class='invertDark'
    src='/img/en/documentation/config_flow.png'
    alt='显示预定义配置文本块的截图'
  />
  显示预定义配置文本块的截图
</p>

要使用此元素，请添加以下行：

```markdown
{% include integrations/config_flow.md %}
```

#### configuration_basic 块

使用 `configuration_basic` 块描述配置选项，如果您的集成通过配置流设置。

<p class='img'>
  <img class='invertDark'
      src='/img/en/documentation/configuration_variables_ui.png'
      alt='显示 UI 中配置变量块的截图'
    />
    显示 UI 中配置变量块的截图
</p>

```markdown
{% configuration_basic %}
主机：
    description: "您的桥的 IP 地址。您可以在路由器或在集成应用程序的 **桥设置** > **本地 API** 中找到它。"
本地访问令牌：
    description: "您桥的本地访问令牌。您可以在集成应用程序的 **桥设置** > **本地 API** 中找到它。"
{% endconfiguration_basic %}
```

#### 仅对 YAML 集成的配置块

使用 `configuration` 块描述配置选项，如果您的集成仅通过 YAML 设置。

<p class='img'>
  <img class='invertDark'
      src='/img/en/documentation/configuration_variables_yaml.png'
      alt='显示 YAML 集成中配置变量块的截图'
    />
    显示 YAML 集成中配置变量块的截图
</p>

```markdown
{% configuration %}
主机：
    description: "您的桥的 IP 地址。您可以在路由器或在集成应用程序的 **桥设置** > **本地 API** 中找到它。"
    required: false
    type: string
本地访问令牌：
    description: "您桥的本地访问令牌。您可以在集成应用程序的 **桥设置** > **本地 API** 中找到它。"
    required: false
    type: string
{% endconfiguration %}
```

## 图像

一般来说，使用 Markdown 语法添加图像。例如，当添加图像以说明某个步骤时：

<img class='invertDark'
    src='/img/en/documentation/image_in_step.png'
    alt='显示用于说明步骤的图像的截图'
  />

Markdown 语法添加图像：

```markdown
1. 要调整光的温度和亮度，移动滑块：
    ![显示功能的瓷砖卡的截图](/images/dashboards/features/screenshot-tile-feature-grid.png)
2. 然后执行此操作 ...
```

要添加带标题的图像，您可以使用 HTML 语法：

<img class='invertDark'
    src='/img/en/documentation/image_with_legend.png'
    alt='显示带有图像标题的图像的截图'
  />

HTML 语法添加图像的示例：

```html
<p class='img'><img src='/images/dashboards/features/screenshot-tile-feature-grid.png' alt="显示功能的瓷砖卡的截图。">
显示功能的瓷砖卡的截图。
</p>
```

## 视频

使用以下语法引用 YouTube 视频。使用 `videoStartAt` 使其在视频中从特定时间开始播放：

```html
<lite-youtube videoid="ZgoaoTpIhm8" videoStartAt="3907" videotitle="介绍 Home Assistant Voice Preview Edition - Voice: 第 8 章"></lite-youtube>
```

<p class='img'>
<img class='invertDark'
    src='/img/en/documentation/youtube_ref_start_at.webp'
    alt='显示以特定时间开始引用 Youtube 的屏幕录像'
  />
  显示以特定时间开始引用 Youtube 的屏幕录像
</p>

## 文档结构

此部分概述了高层次的文档结构。要查看示例文本，请参考 `homeassistant.io` 仓库中的集成文档模板，路径为 `/_integrations/_integration_docs_template.md`。示例文本包括一些可重用的文本块（包括）以及样式元素，例如 `include integrations/config_flow.md` 和 `configuration_basic`。

这些示例取自 [集成质量标准](/docs/core/integration-quality-scale/)。

### 基本结构

- 引言
  - 用例
- 支持/不支持的设备
- 先决条件
- 配置
- 配置选项
- 支持的功能
- 操作
- 示例
- 数据更新
- 已知局限性
- 故障排除
- 社区笔记
- 移除集成