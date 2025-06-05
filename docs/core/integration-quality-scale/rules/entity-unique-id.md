---
title: "实体具有唯一的ID"
related_rules:
  - unique-config-entry
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

在过去，实体并没有被持久化。
Home Assistant 并没有跟踪它已知的实体与未知实体。
为了允许对实体进行自定义，比如重命名实体或更改计量单位，Home Assistant 需要一种方法来跟踪每个个体实体在重启过程中的状态。

为了解决这个问题，Home Assistant 引入了实体注册表。
实体注册表是 Home Assistant 跟踪所有已知实体的中心位置。
实体注册表中的每个实体都有一个唯一的ID，该ID在每个集成域和每个平台域中都是唯一的。

如果一个实体没有唯一的ID，用户对该实体的控制会减少。
因此，确保实体具有唯一的ID可以改善用户体验。

## 示例实现

在这个示例中，有一个温度传感器使用简写符号设置其唯一ID。

`sensor.py`:
```python {6} showLineNumbers
class MySensor(SensorEntity):
    """传感器的表示。"""

    def __init__(self, device_id: str) -> None:
        """初始化传感器。"""
        self._attr_unique_id = f"{device_id}_temperature"
```

## 额外资源

关于唯一标识符要求的更多信息可以在[文档](/docs/entity_registry_index#unique-id-requirements)中找到。

## 例外情况

对此规则没有例外情况。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>