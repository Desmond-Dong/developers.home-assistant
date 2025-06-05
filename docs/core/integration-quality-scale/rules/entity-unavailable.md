---
title: "如果合适则标记实体为不可用"
related_rules:
  - log-when-unavailable
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

如果我们无法从设备或服务中获取数据，我们应该将其标记为不可用。
这样做是为了反映出更好的状态，而不仅仅是显示最后已知的状态。

如果我们能够成功获取数据，但暂时缺少一些数据，我们应该将实体状态标记为未知。

## 示例实现

由于可以实现此功能的方式有很多，我们将只提供使用协调器的集成的示例，以及通过 `async_update` 更新的实体。

### 使用协调器的集成示例

在这个例子中，我们有一个使用协调器来获取数据的集成。
协调器在与 `CoordinatorEntity` 结合时，其可用性逻辑是内置的。
如果需要任何额外的可用性逻辑，请务必结合 `super().available` 值。
在示例中的传感器中，当更新失败或该设备的数据缺失时，我们将实体标记为不可用。

`coordinator.py`
```python {18} showLineNumbers
class MyCoordinator(DataUpdateCoordinator[dict[str, MyDevice]]):
    """用于管理数据获取的类。"""

    def __init__(self, hass: HomeAssistant, client: MyClient) -> None:
        """初始化协调器。"""
        super().__init__(
            hass,
            logger=LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=1),
        )
        self.client = client

    async def _async_update_data(self) -> dict[str, MyDevice]:
        try:
            return await self.client.get_data()
        except MyException as ex:
            raise UpdateFailed(f"服务不可用: {ex}")
```

`sensor.py`
```python {6} showLineNumbers
class MySensor(SensorEntity, CoordinatorEntity[MyCoordinator]):

    @property
    def available(self) -> bool:
        """返回实体是否可用的 True 或 False。"""
        return super().available and self.identifier in self.coordinator.data
```

### 通过 `async_update` 更新的实体示例

在这个例子中，我们有一个通过 `async_update` 更新其值的传感器。
如果我们无法获取数据，我们使用简写标注将实体设置为不可用。
如果我们能够获取数据，我们将实体设置为可用并更新其值。

`sensor.py`
```python {7,9} showLineNumbers
class MySensor(SensorEntity):

    async def async_update(self) -> None:
        try:
            data = await self.client.get_data()
        except MyException as ex:
            self._attr_available = False
        else:
            self._attr_available = True
            self._attr_native_value = data.value
```

## 其他资源

有关管理集成状态的更多信息，请参阅 [文档](/docs/integration_fetching_data)。

## 异常

该规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>