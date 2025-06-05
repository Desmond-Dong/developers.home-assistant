---
title: "实体使用 has_entity_name = True"
related_rules:
  - entity-translations
  - entity-device-class
  - devices
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

`has_entity_name` 是一个实体属性，用于改善 Home Assistant 中实体的命名。
它的引入是为了根据名称显示的上下文向用户展示更好的实体名称。

我们认为这是一个良好的实践，因为它允许集成之间保持命名的一致性。

## 示例实现

在下面的示例中，如果设备的名称为 "My device"，字段为 "temperature"，则实体的名称将显示为 "My device temperature"。

`sensor.py`
```python {4} showLineNumbers
class MySensor(SensorEntity):
    """传感器的表示。"""

    _attr_has_entity_name = True

    def __init__(self, device: Device, field: str) -> None:
        """初始化传感器。"""
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device.id)},
            name=device.name,
        )
        self._attr_name = field
```

然而，当实体的名称设置为 `None` 时，设备的名称将被用作实体的名称。
在这种情况下，锁实体将只被称为 "My device"。
这应该在设备的主要功能中完成。

`lock.py`
```python {4-5,11} showLineNumbers
class MyLock(LockEntity):
    """锁的表示。"""

    _attr_has_entity_name = True
    _attr_name = None

    def __init__(self, device: Device) -> None:
        """初始化锁。"""
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device.id)},
            name=device.name,
        )
```

## 附加资源

关于实体命名的更多信息可以在 [entity](/docs/core/entity#has_entity_name-true-mandatory-for-new-integrations) 文档中找到。
关于设备的更多信息可以在 [device](/docs/device_registry_index) 文档中找到。

## 例外情况

此规则没有例外情况。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>