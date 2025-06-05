---
title: "集成创建设备"
related_rules:
  - has-entity-name
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

在 Home Assistant 中，设备用于将实体分组，以表示单一物理设备或服务。
这是有用的，因为用户通常认为他们是将设备或服务添加到他们的系统中，而不是单个实体。
Home Assistant 将设备信息存储在设备注册表中。
为了让用户拥有最佳体验，设备的信息应该尽可能完整。

## 示例实现

在这个示例中，有一个传感器实体，定义了它应该添加到设备注册表中的哪个设备，以及一些关于设备的元数据。
这将提供一个丰富的设备信息页面，用户可以通过设备的名称、序列号和其他字段来识别设备。

`sensor.py`:
```python {8-18} showLineNumbers
class MySensor(SensorEntity):
    """传感器的表示。"""

    _attr_has_entity_name = True

    def __init__(self, device: MyDevice) -> None:
        """初始化传感器。"""
        self._attr_device_info = DeviceInfo(
            connections={(CONNECTION_NETWORK_MAC, device.mac)},
            name=device.name,
            serial_number=device.serial,
            hw_version=device.rev,
            sw_version=device.version,
            manufacturer="我的公司",
            model="我的传感器",
            model_id="ABC-123",
            via_device=(DOMAIN, device.hub_id),
        )
```

:::info
如果设备表示服务，请务必在 `DeviceInfo` 对象中添加 `entry_type=DeviceEntryType.SERVICE` 以标记该设备为服务类型。
:::

## 其他资源

有关设备的更多信息，请参阅 [device](/docs/device_registry_index) 文档。

## 例外

对此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>