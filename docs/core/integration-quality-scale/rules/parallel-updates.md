---
title: "指定并行更新的数量"
---

## 理由

某些设备或服务不喜欢同时接收大量请求。  
为了避免这种情况，Home Assistant 内置了一个功能，以限制同时发送到设备或服务的请求数量。

这将适用于实体更新和动作调用。

我们认为显式设置并行更新的数量是一种良好的实践。

## 示例实现

在下面的示例中，我们将并行更新的数量设置为 1。  
这意味着如果传感器平台上有更多实体，它们将逐个更新。  
如果不需要限制并行更新的数量，可以将其设置为 0。

`sensor.py`
```python {1} showLineNumbers
PARALLEL_UPDATES = 1

class MySensor(SensorEntity):
    """传感器的表示。"""

    def __init__(self, device: Device) -> None:
        """初始化传感器。"""
        ...
```

### 使用协调器时

使用协调器时，您已经集中管理数据更新。  
这意味着您可以为只读平台（`binary_sensor`、`sensor`、`device_tracker`、`event`）设置 `PARALLEL_UPDATES = 0`，  
并且只有动作调用会考虑设置适当的并行更新数量。

`sensor.py`
```python {1,2} showLineNumbers
# 使用协调器集中管理数据更新
PARALLEL_UPDATES = 0

class MySensor(CoordinatorEntity, SensorEntity):
    """传感器的表示。"""

    def __init__(self, device: Device) -> None:
        """初始化传感器。"""
        ...
```

## 额外资源

有关请求并行性的更多信息，请查看 [文档](/docs/integration_fetching_data#request-parallelism)。

## 例外

对此规则没有例外。