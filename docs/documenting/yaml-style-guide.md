---
title: "YAML 风格指南"
---

除了我们一般的 [文档标准](/documenting/standards.md) 外，
我们还有一套用于记录 YAML 片段的标准。本页面描述的标准
适用于项目中的所有基于 YAML 的代码，主要关注文档。

我们的 YAML 标准为最终用户提供了一致的外观，最佳
实践和统一的问题解决方法。

## YAML

本节介绍基本的 YAML 用法，因此不特定于家庭助理。

### 缩进

必须使用 2 个空格缩进。

```yaml
# 好
example:
  one: 1

# 坏
example:
    bad: 2
```

### 布尔值

我们应避免在 YAML 中使用真值布尔值。它们通常会让新手感到困惑。因此，我们只允许使用小写的 `true` 和 `false` 作为布尔值。

这也保持了与 YAML 1.2 规范的兼容性，因为该版本去掉了对多个非引号真值布尔的支持（例如 `y`、`n`、`yes`、`no`、`on`、`off` 等）。

```yaml
# 好
one: true
two: false

# 坏
one: True
two: on
three: yes
```

### 注释

为 YAML 块添加注释可以帮助读者更好地理解示例。

注释的缩进级别必须与当前缩进级别匹配。最好将注释放在所适用行的上方，否则在小显示器上，行可能变得难以阅读。

注释应以大写字母开头，并在注释哈希 `#` 和注释开头之间留一个空格。

```yaml
# 好
example:
  # 注释
  one: true

# 可接受，但更愿意使用上面的形式
example:
  one: true # 注释

# 坏
example:
# 注释
  one: false
  #注释
  two: false
  # 注释
  three: false
```

### 序列

YAML 中的序列也称为列表或数组。在家庭助理的世界中，我们在最终用户文档中称它们为列表。这源于家庭助理核心开发用的 Python 语言。

序列可以用两种不同的样式书写；块样式和流样式。我们更倾向于使用块样式序列。

#### 块样式序列

块样式序列需要在它们所属的键下缩进。

```yaml
# 好
example:
  - 1
  - 2
  - 3

# 坏
example:
- 1
- 2
- 3
```

#### 流样式序列

应避免使用流样式。虽然简单、短小且清晰，但在包含较长数据时，阅读起来更困难。

如果使用流样式，逗号 `,` 后面应该有空格，并且在开闭括号前后没有空白：

```yaml
# 好
example: [1, 2, 3]

# 坏
example: [ 1,2,3 ]
example: [ 1, 2, 3 ]
example: [1,2,3]
example: ["light.living_room_window", "light.living_room_corner", "light.living_room_table"]
```

### 映射

YAML 中的映射也称为关联数组、哈希表、键/值对、集合或字典。在家庭助理的世界中，我们在最终用户文档中称它们为映射。

映射可以用不同的样式书写，但我们只允许使用块样式映射。不允许使用流样式（看起来像 JSON）。

```yaml
# 好
example:
  one: 1
  two: 2

# 坏
example: { one: 1, two: 2 }
```

### 空值

空值应隐式标记。应避免使用显式空值（`~` 和 `null`）。

```yaml
# 好
example:

# 坏
example: ~
example: null
```

### 字符串

字符串最好用双引号（`"`）引起来。

```yaml
# 好
example: "Hi there!"

# 避免
example: Hi there!

# 坏
example: 'Hi there!'
```

#### 多行字符串

在 YAML 配置中尽可能避免使用 `\n` 或其他换行符。避免长的单行字符串也是如此。

相反，使用字面量样式（保留换行）和折叠样式（不保留换行）字符串。

```yaml
# 好
literal_example: |
  这个示例是 YAML 中字面块标量样式的例子。
  它允许你将字符串拆分成多行。
folded_example: >
  这个示例是 YAML 中折叠块标量样式的例子。
  它允许你将字符串拆分成多行，但会神奇地
  移除你 YAML 中放置的所有换行符。

# 坏
literal_example: "这个示例是 YAML 中字面块标量样式的例子。\n它允许你将字符串拆分成多行。\n"
folded_example_same_as: "这个示例是 YAML 中折叠块标量样式的例子。它允许你将字符串拆分成多行，但会神奇地移除你 YAML 中放置的所有换行符。\n"
```

在上述示例中未使用任何切割运算符（`|`、`>`）。这更受欢迎，除非示例需要不同的换行处理。在这些情况下，可以使用切除运算符（`|-`、`>-`：无尾部换行，移除结尾的任何额外换行符）或保留运算符（`|+`、`>+`：尾部换行，并保留结尾的所有额外换行符）。

### 额外的字符串指导

家庭助理 YAML 部分提供了关于如何在家庭助理配置示例中处理字符串的附加指导。

## 家庭助理 YAML

在家庭助理中，我们还有一些可以用不同方式完成的事情，同时仍遵循上述设定的样式。这部分正是为了解决这个问题。

### 默认值

使用默认值的配置选项，不应成为示例的一部分。
除非示例专门用于教育该选项。

例如，我们的自动化中的 `condition` 选项是可选的，默认是空列表 `[]`。

```yaml
# 好
- alias: "测试"
  triggers:
    - trigger: state
      entity_id: binary_sensor.motion

# 坏
- alias: "测试"
  triggers:
    - trigger: state
      entity_id: binary_sensor.motion
  condition: []
```

### 字符串（续）

正如第一章所写，字符串最好用双引号引起来。然而，以下值类型不在此规则之内，
因为它使我们的示例更易读：

- 实体 ID（例如，`binary_sensor.motion`）
- 实体属性（例如，`temperature`）
- 设备 ID
- 区域 ID
- 平台类型（例如，`light`、`switch`）
- 条件类型（例如，`numeric_state`、`state`）
- 触发器类型（例如，`state`、`time`）
- 动作名称（例如，`light.turn_on`）
- 设备类别（例如，`problem`、`motion`）
- 事件名称
- 接受有限集可能的硬编码值的值。
  例如，自动化中的 `mode`。

```yaml
# 好
actions:
  - action: notify.frenck
    data:
      message: "Hi there!"
  - action: light.turn_on
    target:
      entity_id: light.office_desk
      area_id: living_room
    data:
      transition: 10

# 坏
actions:
  - action: "notify.frenck"
    data:
      message: Hi there!
```

### 服务动作目标

如果您想对实体 ID 触发服务动作调用（例如，打开灯），可以用三种不同的方式完成。

实体 ID 可以作为动作级别的属性、作为服务动作调用中发送的数据的一部分，或作为服务动作目标中的实体来指定。

服务动作目标是最现代的方式，允许将服务动作调用瞄准一个实体、设备或区域。因此，目标是可用选项中最灵活的，应优先使用。

```yaml
# 好
actions:
  - action: light.turn_on
    target:
      entity_id: light.living_room
  - action: light.turn_on
    target:
      area_id: light.living_room
  - action: light.turn_on
    target:
      area_id: living_room
      entity_id: light.office_desk
      device_id: 21349287492398472398

# 坏
actions:
  - action: light.turn_on
    entity_id: light.living_room
  - action: light.turn_on
    data:
      entity_id: light.living_room
```

### 接受标量或标量列表的属性

家庭助理有许多地方同时访问标量值或标量值列表。此外，有时它甚至接受以逗号分隔的字符串值作为列表。

如果接受单个值或标量值列表，则适用以下内容：

- 不应将多个值放在单个标量值中（逗号分隔字符串）。
- 如果使用列表，则必须是块样式。
- 不应使用只有一个标量值的列表。
- 允许使用单个标量值。

```yaml
# 好
entity_id: light.living_room
entity_id:
  - light.living_room
  - light.office

# 坏
entity_id: light.living_room, light.office
entity_id: [light.living_room, light.office]
entity_id:
  - light.living_room
```

### 接受映射或映射列表的属性

家庭助理有接受映射或映射列表的属性。
众所周知的例子有：`condition`、`action`、`sequence`。

如果属性接受单个映射或映射列表，必须使用映射列表，即使只传递一个映射。

这使得更容易理解可以添加更多项，也更容易将单个项复制粘贴到您自己的代码中。

```yaml
# 好
actions:
  - action: light.turn_on
    target:
      entity_id: light.living_room

# 坏
actions:
  action: light.turn_on
  target:
    entity_id: light.living_room
```

### 模板

家庭助理模板功能强大，但对于经验较少的用户可能会很混乱或难以理解。因此，如果有纯 YAML 版本可用，应该避免使用模板。

此外，使用模板会需要在我们的文档中进行了额外的转义，以避免我们网站代码将其误认为 Liquid 语法。
总的来说，避免模板会消除额外转义的需要。

```yaml
# 好
conditions:
  - condition: numeric_state
    entity_id: sun.sun
    attribute: elevation
    below: 4

# 坏
conditions:
  - condition: template
    value_template: "{{ state_attr('sun.sun', 'elevation') < 4 }}"
```

#### 引号风格

模板是字符串，因此是双引号。因此，在模板内部应使用单引号。

```yaml
# 好
example: "{{ 'some_value' == some_other_value }}"

# 坏
example: '{{ "some_value" == some_other_value }}'
```

#### 模板字符串长度

应避免在模板中使用长行，并将其拆分为多行，以便更清晰地了解发生了什么，并保持可读性。

有关多行字符串格式的其他信息，请参见上述字符串章节。

```yaml
# 好
value_template: >-
  {{
    is_state('sensor.bedroom_co_status', 'Ok')
    and is_state('sensor.kitchen_co_status', 'Ok')
    and is_state('sensor.wardrobe_co_status', 'Ok')
  }}

# 坏
value_template: "{{ is_state('sensor.bedroom_co_status', 'Ok') and is_state('sensor.kitchen_co_status', 'Ok') and is_state('sensor.wardrobe_co_status', 'Ok') }}"
```

#### 简短样式条件语法

更喜欢简写样式模板，而不是过于表现的格式，因为它们提供了更清晰的语法。

```yaml
# 好
conditions: "{{ some_value == some_other_value }}"

# 坏
conditions:
  - condition: template
    value_template: "{{ some_value == some_other_value }}"
```

#### 过滤器

过滤器管道符号 ` | ` 周围需要留有空格。如果这使可读性不清晰，则建议使用额外的括号。

```yaml
# 好
conditions:
  - "{{ some_value | float }}"
  - "{{ some_value == (some_other_value | some_filter) }}"

# 坏
conditions:
  - "{{ some_value == some_other_value|some_filter }}"
  - "{{ some_value == (some_other_value|some_filter) }}"
```

#### 访问状态和状态属性

如果有可用的辅助方法，我们不允许直接使用状态对象。

例如；不要使用 `states.sensor.temperature.state`，而是使用 `states('sensor.temperature')`。

```yaml
# 好
one: "{{ states('sensor.temperature') }}"
two: "{{ state_attr('climate.living_room', 'temperature') }}"

# 坏
one: "{{ states.sensor.temperature.state }}"
two: "{{ states.climate.living_room.attributes.temperature }}"
```

这适用于 `states()`、`is_state()`、`state_attr()` 和 `is_state_attr()`，
以避免在实体尚未准备好时出现错误和错误消息
（例如，在家庭助理启动期间）。
