---
title: "将常见模式放入公共模块"
---

## 理由

Home Assistant 代码库中有一些随着时间推移而产生的常见模式。
例如，大多数新集成使用协调器来集中数据提取。
协调器应放置在 `coordinator.py` 中。
这增加了集成之间的一致性，使得更容易找到特定集成的协调器。

第二个常见模式是基本实体。
由于许多集成提供更多类型的实体，基本实体可以有效减少代码重复。
基本实体应放置在 `entity.py` 中。

为了提高集成之间的一致性所做的努力对代码库的质量和开发者体验产生了积极影响。

## 示例实现

在这个示例中，我们有一个协调器，存储在 `coordinator.py` 中，还有一个基本实体，存储在 `entity.py` 中。

`coordinator.py`
```python showLineNumbers
class MyCoordinator(DataUpdateCoordinator[MyData]):
    """管理数据提取的类。"""

    def __init__(self, hass: HomeAssistant, client: MyClient) -> None:
        """初始化协调器。"""
        super().__init__(
            hass,
            logger=LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=1),
        )
        self.client = client
```

`entity.py`
```python showLineNumbers
class MyEntity(CoordinatorEntity[MyCoordinator]):
    """MyIntegration 的基本实体。"""

    _attr_has_entity_name = True

    def __init__(self, coordinator: MyCoordinator) -> None:
        """初始化实体。"""
        super().__init__(coordinator)
        self._attr_device_info = ...
```

## 例外

此规则没有例外。