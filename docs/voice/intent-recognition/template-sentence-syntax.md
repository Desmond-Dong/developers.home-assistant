---
title: "模板句子语法"
---

模板句子在 YAML 文件中定义，使用 [Hassil， 我们的模板匹配器](https://github.com/home-assistant/hassil) 的格式。我们的模板句子存储在 [GitHub](https://github.com/home-assistant/intents/tree/main/sentences) 上，并通过为每种语言提供一个文件夹来组织，路径为 `sentences/<language>/`：

 - `_common.yaml` - 列出可在所有模板句子中使用的列表、扩展规则和跳过的词。
 - `<domain>_<intent>.yaml` - 针对单个意图和域的模板句子。

除了 `_common.yaml` 中的数据外，模板句子还可以使用列表 `name` 和 `area`。这些列表在意图识别期间由 Home Assistant 提供。

```yaml
# 示例 light_HassTurnOn.yaml
language: "en"
intents:
  HassTurnOn:  # 意图名称
    data:
      - sentences:
          - "<turn> on [all] [the] (light | lights) in [the] {area}"
          - "<turn> on [all] [the] {area} (light | lights)"
          - "<turn> [all] [the] (light | lights) in [the] {area} on"
        # 可选；用于在意图匹配时设置固定槽值
        slots:
          domain: "light"
```

上面的示例将句子 `turn on all the lights in the living room` 匹配到意图 `HassTurnOn`，并提取出区域 `living room`。域值设置为 `light`。在 Home Assistant 中，当执行该意图时，它将打开位于 `living room` 区域的所有 `light` 类型的实体。

## 响应

句子模板文件可以包含一组句子的响应 "key"：

```yaml
# 示例 light_HassLightSet.yaml
language: "en"
intents:
  HassTurnOn:
    data:
      - sentences:
          - "set {name} brightness to maximum"
        slots:
          brightness: 100
        response: "brightness"
```

在上面的示例中，响应键 "brightness" 指的是文件 `responses/en/HassLightSet.yaml` 中的模板：

```yaml
language: en
responses:
  intents:
    HassLightSet:
      brightness: '{{ slots.name }} brightness set to {{ slots.brightness }}'
```

如果没有提供响应键，则假定为 `"default"`。

响应模板使用 [Jinja2 语法](https://jinja.palletsprojects.com/en/latest/templates/) 并可能引用 `slots` 对象，其属性为匹配意图的槽值。

查看所有 [翻译的响应](https://github.com/home-assistant/intents/tree/main/responses) 以获取更多示例。

## 句子模板语法

* 替代词、短语或词的一部分
  * `(red | green | blue)`
  * `turn(ed | ing)`
* 可选词、短语或词的一部分
  * `[the]`
  * `[this | that]`
  * `light[s]`
* 槽列表
  * `{list_name}`
  * `{list_name:slot_name}`（如果意图槽命名不同）
  * 列表中的每个值都是一个不同的选项
  * 在 YAML 中，`list_name` 应在 `lists` 下
  * 使用 `values` 处理文本列表，使用 `range` 处理数字列表
* 扩展规则
  * `<rule_name>`
  * 规则的主体会替换 `<rule_name>`
  * 在 YAML 中，`rule_name` 应在 `expansion_rules` 下。如果 `rule_name` 包裹了一个槽名称，它应该与槽名称匹配。否则，它应该用母语书写。
* [排列](https://en.wikipedia.org/wiki/Permutation) 两个或更多项的变体
  * `(patience;you must have)`
  * 排列项目始终用空格填充以防止新词形成
  * 限制项目数量为 2-4，因为 `n` 个项目的排列数随 `n` 的增加而快速增加，这个数字为 `n! == 1 * 2 * ... * n`

## 公共文件

公共文件 `_common.yaml` 包含在所有意图和域的模板句子中使用的列表、扩展规则和跳过的词。

### 列表

列表是槽的可能值。槽是我们想要从句子中提取的数据。例如，我们可以创建一个列表 `color` 来匹配可能的颜色。

```yaml
lists:
  color:
    values:
      - "white"
      - "red"
      - "orange"
```

Home Assistant 中的意图处理器期望颜色以英语定义。为了允许其他语言定义颜色，列表支持进出格式。这允许您用母语定义值列表，但意图处理器将以英语接收这些值。

```yaml
lists:
  color:
    values:
      - in: "rood"
        out: "red"
      - in: "oranje"
        out: "orange"
```

列表也可以是数字范围。这对于定义您希望匹配的亮度值或温度范围非常有用。

```yaml
lists:
  brightness:
    range:
      type: "percentage"
      from: 0
      to: 100
```

特定数字也可以通过列表进行匹配，比如从关键字最大值返回 100。要使用此列表在句子中设置亮度，请使用以下语法：`{brightness_level:brightness}`。这将从列表中获取值，但将其放入亮度槽中。

```yaml
lists:
  brightness_level:
    values:
      - in: (max | maximum | highest)
        out: 100
      - in: (minimum | lowest)
        out: 1
```

#### 通配符

通配符列表可以匹配任何文本，例如：

```yaml
language: en
intents:
  PlayAlbum:
    data:
      - sentences:
          - play {album} by {artist}
lists:
  artist:
    wildcard: true
  album:
    wildcard: true
```

将匹配句子，例如 "play the white album by the beatles"。`PlayAlbum` 意图将有一个 `album` 槽，其值为 "the white album "（注意后面的空格）和一个 `artist` 槽，其值为 "the beatles"。

#### 局部列表

有时您不需要为所有意图和句子提供的槽列表，因此您可以在本地定义一个，只在它被定义的意图数据（如句子集）上下文中使用。例如：

```yaml
language: en
intents:
  AddListItem:
    data:
      - sentences:
          - add {item} to [my] shopping list
        lists:
          item:
            wildcard: true
```

### 扩展规则

许多模板句子可以以类似的方式编写。为了避免重复相同的匹配结构，我们可以定义扩展规则。例如，用户可能会在区域名称前加上 "the"，也可能不会。我们可以定义一个扩展规则以匹配这两种情况。

扩展规则可以包含槽、列表和其他扩展规则。

```yaml
expansion_rules:
  name: "[the] {name}"
  area: "[the] {area}"
  what_is: "(what's | whats | what is)"
  brightness: "{brightness} [percent]"
  turn: "(turn | switch)"
```

#### 局部扩展规则

扩展规则也可以在句子列表旁本地定义，并且只在这些模板内可用。这允许您为不同情况编写类似的模板。例如：

```yaml
language: en
intents:
  GetLocked:
    data:
      - sentences:
          - is the door <state>
        requires_context:
          domain: binary_sensor
        expansion_rules:
          state: "{binary_state}"

      - sentences:
          - is the door <state>
        requires_context:
          domain: lock
        expansion_rules:
          state: "{lock_state}"

lists:
  binary_state:
    values:
      - in: "locked"
        out: "off"
      - in: "unlocked"
        out: "on"
  lock_state:
    values:
      - "locked"
      - "unlocked"

```

同一个模板 `is the door <state>` 被用于二进制传感器和常规锁，但局部的 `state` 扩展规则引用了不同的列表。

### 跳过词

跳过词是在识别过程中意图识别器将跳过的词。这对于那些不属于意图，但在句子中常用的词非常有用。例如，用户在句子中可能会使用 "please" 这个词，但它不是意图的一部分。

```yaml
skip_words:
  - "please"
  - "can you"
```

### 需要/排除上下文

Hassil 返回它可以找到的第一个意图匹配，因此如果相同句子可能产生多个匹配，则可能需要额外的 **上下文**。

例如，考虑以下模板：

```yaml
language: "en"
intents:
  HassLightSet:
    data:
      - sentences:
          - "set {name} brightness to maximum"
          - "set {area} brightness to maximum"
        slots:
          brightness: 100
```

如果您有一个名为 "kitchen light" 的实体，那么您就可以说 "set kitchen light brightness to maximum"。同样，如果您有一个名为 "kitchen" 的区域，则 "set kitchen brightness to maximum" 也能正常工作。

但是，如果您有一个名为 "kitchen" 的媒体播放器呢？相同的句子可能匹配区域或媒体播放器。Hassil 将需要更多的上下文来知道该怎么做：

```yaml
language: "en"
intents:
  HassLightSet:
    data:
      - sentences:
          - "set {name} brightness to maximum"
        requires_context:
          domain: "light"
        slots:
          brightness: 100
      - sentences:
          - "set {area} brightness to maximum"
        slots:
          brightness: 100
```

我们将句子分成了两组。第一组用于单个实体，现在具有 `requires_context` 和 `domain` 为 `light`。这确保 Hassil 仅在 `{name}` 中的实体具有正确的域时才会产生匹配。由于区域没有域，我们需要将 `{area}` 句子移动到其自己的组中。

上下文在您希望在同一意图中获得不同响应时也很有用：

```yaml
language: "en"
intents:
  HassTurnOn:
    data:
      - sentences:
          - "activate {name}"
        excludes_context:
          domain: "cover"
        response: "default"
      - sentences:
          - "activate {name}"
        requires_context:
          domain: "cover"
        response: "cover"
```

第一组句子使用 `excludes_context` 跳过 `cover` 实体，而第二组则特定于 `cover` 实体并使用不同的 [响应](#responses)。