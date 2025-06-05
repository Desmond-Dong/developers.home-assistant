---
title: "实体具有翻译名称"
related_rules:
  - has-entity-name
  - entity-device-class
  - icon-translations
  - exception-translations
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

家庭助理被世界各地的人使用。
为了使非英语使用者更容易使用家庭助理，实体具有翻译名称是非常重要的。
这使人们更容易理解实体的含义。

## 示例实现

在这个示例中，传感器的英文名称是“Phase voltage”。
结合设备名称，这个实体将自我命名为“我的设备 Phase voltage”。

`sensor.py`:
```python {5} showLineNumbers
class MySensor(SensorEntity):
    """传感器的表示。"""

    _attr_has_entity_name = True
    _attr_translation_key = "phase_voltage"

    def __init__(self, device_id: str) -> None:
        """初始化传感器。"""
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device_id)},
            name="我的设备",
        )
```

`strings.json`:
```json {5} showLineNumbers
{
    "entity": {
        "sensor": {
            "phase_voltage": {
                "name": "Phase voltage"
            }
        }
    }
}
```

:::info
如果实体的平台是 `binary_sensor`、`number`、`sensor` 或 `update` 并且设置了设备类，并且您希望实体与设备类拥有相同的名称，您可以省略翻译键，因为实体将自动使用设备类名称。
:::

## 其他资源

有关翻译过程的更多信息，请参阅[翻译](/docs/internationalization/core)文档，它还包含有关[实体翻译](/docs/internationalization/core#name-of-entities)的信息。
有关实体命名的更多信息，请参阅[实体](/docs/core/entity#has_entity_name-true-mandatory-for-new-integrations)文档。

## 例外

此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>