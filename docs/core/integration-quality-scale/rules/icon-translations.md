---
title: "实体实现图标翻译"
related_rules:
  - entity-translations
  - entity-device-class
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

在过去，图标是集成状态的一部分。
这实际上并不是必要的，因为它们通常是静态的或具有固定的状态集。

为了减轻状态机的负担，引入了图标翻译。
这个功能的名称听起来有些奇怪，因为它并不是在翻译图标本身，而是通过翻译键引用一个图标。
图标翻译的理念是，集成在一个文件中定义图标，然后由前端使用该文件来显示图标。
这也增加了对状态属性值不同图标的支持，例如气候实体的可能预设模式。

:::info
请注意，实体也可以从设备类别获取图标。
如果实体的上下文与设备类别完全相同，我们不应该覆盖这个图标，以保持集成之间的一致性。
例如，PM2.5传感器实体不会获得自定义图标，因为设备类别已经在相同上下文中提供了它。
:::

## 示例实现

### 基于状态的图标

在这个例子中，我们定义了一个具有翻译键的传感器实体。
在 `icons.json` 文件中，我们为传感器实体和状态 `高` 定义了图标。
因此，当实体的状态为 `高` 时，我们将显示图标 `mdi:tree-outline`，否则我们将显示 `mdi:tree`。

`sensor.py`

```python {5} showLineNumbers
class MySensor(SensorEntity):
    """传感器的表示。"""

    _attr_has_entity_name = True
    _attr_translation_key = "tree_pollen"
```

`icons.json`

```json
{
  "entity": {
    "sensor": {
      "tree_pollen": {
        "default": "mdi:tree",
        "state": {
          "high": "mdi:tree-outline"
        }
      }
    }
  }
}
```

### 基于范围的图标

对于数值实体，您可以定义基于数值范围变化的图标。此功能消除了在您的集成代码中自定义逻辑的需要，并提供了一种一致的方式来视觉表示变化的传感器值。

基于范围的图标翻译对于以下情况特别有用：
- 电池电量指示器
- 信号强度计
- 温度传感器
- 空气质量指示器
- 液位传感器

#### 配置

在 `icons.json` 文件中，按照升序定义范围及其对应图标：

```json
{
  "entity": {
    "sensor": {
      "battery_level": {
        "default": "mdi:battery",
        "range": {
          "0": "mdi:battery-outline",
          "10": "mdi:battery-10",
          "20": "mdi:battery-20",
          "30": "mdi:battery-30",
          "40": "mdi:battery-40",
          "50": "mdi:battery-50",
          "60": "mdi:battery-60",
          "70": "mdi:battery-70",
          "80": "mdi:battery-80",
          "90": "mdi:battery-90",
          "100": "mdi:battery"
        }
      }
    }
  }
}
```

系统选择与实体当前数值状态小于或等于的最高范围值相关联的图标。例如，在上述配置中：

- 值为 15 将显示 `mdi:battery-10` 图标（15 大于 10 但小于 20）
- 值为 45 将显示 `mdi:battery-40` 图标（45 大于 40 但小于 50）
- 值为 100 将显示 `mdi:battery` 图标（100 等于最高定义范围）
- 值为 5 将显示 `mdi:battery-outline` 图标（5 大于 0 但小于 10）
- 值为 -10 将显示 `mdi:battery` 默认图标（值超出了定义的范围）
- 值为 120 将显示 `mdi:battery` 默认图标（值超过所有定义的范围）

实现基于范围的图标时：

- 范围值必须是数值，并且必须按升序定义
- 支持整数（"0"、"100"）和小数（"0.5"、"99.9"）范围值
- 给定状态的图标是从小于或等于实体当前值的最高范围值中选择的
- 当以下情况发生时使用默认图标：
  - 实体的状态值超出所有定义的范围
  - 实体不可用
  - 实体的状态无法解析为有效的数字
- 如果在同一个翻译键中同时定义了基于状态的图标和基于范围的图标，基于状态的图标优先于基于范围的图标
- 没有限制您可以定义多少个范围，但请考虑性能和可读性

## 其他资源

有关图标翻译的更多信息，请查看 [entity](/docs/core/entity#icon-translations) 文档。

## 例外情况

此规则没有例外情况。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>