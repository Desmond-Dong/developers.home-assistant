---
title: "实体被分配了适当的实体类别"
---

## 理由

实体应该被分配一个适当的实体类别，以确保它们被正确分类并且在默认类别不合适时可以被轻松识别。
实体类别在例如自动生成的仪表板中使用。

## 示例实现

在这个例子中，我们有一个返回诊断值的传感器。

`sensor.py`
```python {4} showLineNumbers
class MySensor(SensorEntity):
    """传感器的表示。"""

    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, ...) -> None:
```

## 额外资源

要了解更多关于注册表属性的信息，请查看 [文档](/docs/core/entity#registry-properties)。

## 例外

此规则没有例外。