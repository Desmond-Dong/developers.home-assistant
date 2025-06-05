---
title: "实体尽可能使用设备类别"
related_rules:
  - has-entity-name
  - entity-translations
  - icon-translations
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

设备类别是为实体提供上下文的一种方式。
这些被Home Assistant用于多种目的，例如：
- 允许用户切换到设备提供的不同计量单位。
- 用于语音控制，以询问问题，例如“客厅的温度是多少？”。
- 用于将实体暴露给基于云的生态系统，如Google Assistant和Amazon Alexa。
- 用于调整Home Assistant UI中的表示。
- 可以用于设置实体的默认名称，以减轻我们翻译者的负担。

由于这些原因，尽可能使用设备类别是很重要的。

## 示例实现

在下面的示例中，我们有一个温度传感器，它使用设备类别`temperature`。
这个实体的名称将是`My device temperature`。

`sensor.py`
```python {5} showLineNumbers
class MyTemperatureSensor(SensorEntity):
    """传感器的表示。"""

    _attr_has_entity_name = True
    _attr_device_class = SensorDeviceClass.TEMPERATURE

    def __init__(self, device: Device) -> None:
        """初始化传感器。"""
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device.id)},
            name="My device",
        )
```

## 附加资源

可用的设备类别列表可以在[实体](/docs/core/entity)页面下的实体页面中找到。
有关实体命名的更多信息，请参见[实体](/docs/core/entity#has_entity_name-true-mandatory-for-new-integrations)文档。

## 异常

此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>