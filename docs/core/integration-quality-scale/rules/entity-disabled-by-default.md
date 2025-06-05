---
title: "集成禁用不太受欢迎（或嘈杂）的实体"
related_rules:
  - appropriate-polling
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

Home Assistant 跟踪实体状态的变化。
这样做是为了能够在用户界面中显示实体的历史记录。
每个被跟踪的状态都会占用一些资源。
状态变化频繁的实体（嘈杂实体），相比于状态变化较少的实体，会更频繁地使用这些资源。

我们认为默认禁用不太受欢迎或嘈杂的实体是一个良好的做法。
如果用户有使用此类实体的情况，他们可以启用它。
这样，用户在没有使用实体的情况下，就不必承受跟踪实体状态的成本。

对于什么被认为是受欢迎的实体没有严格的规则，因为这取决于集成和设备。
例如，一个蓝牙温度传感器可以有一个表示设备信号强度的实体。
对大多数用户来说，这个实体不是很有用，因此应该默认禁用。
而如果有一个集成提供了一个测量信号强度的设备，那么这个实体对大多数用户来说会很有用，并且应该默认启用。

## 示例实现

在下面的示例中，实体默认是禁用的。

`sensor.py`
```python {8} showLineNumbers
class MySignalStrengthSensor(SensorEntity):
    """传感器的表示。"""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_device_class = SensorDeviceClass.SIGNAL_STRENGTH
    _attr_native_unit_of_measurement = SIGNAL_STRENGTH_DECIBELS_MILLIWATT
    _attr_entity_registry_enabled_default = False

    def __init__(self, device: Device) -> None:
        """初始化传感器。"""
        ...
```

## 其他资源

要了解有关实体注册表属性的更多信息，请查看有关它的 [文档](/docs/core/entity#registry-properties)。

## 例外情况

对此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>