---
title: "如果互联网/设备/服务不可用，记录一次不可用信息和一次重新连接时的信息"
related_rules:
  - entity-unavailable
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

当设备或服务无法连接时，实体通常会变为不可用。
为了让用户了解发生了什么，集成应该在这种情况发生时记录日志。
要确保总共只记录一次，以避免日志信息过多。

当设备或服务再次可用时，集成也应该记录这一点。
这对于使用日志找出设备或服务何时不可用以及何时重新上线非常有用。

:::info
日志记录应处于 `info` 级别。
:::

## 示例实现

由于可以有多种不同的实现方式，我们将仅提供使用协调器的集成和通过 `async_update` 更新的实体的示例。

### 使用协调器的集成示例

在这个示例中，我们有一个使用协调器获取数据的集成。
协调器内置了只记录一次的逻辑。
您只需在协调器中在设备或服务不可用时引发 `UpdateFailed`。

`coordinator.py`
```python {18} showLineNumbers
class MyCoordinator(DataUpdateCoordinator[MyData]):
    """用于管理获取数据的类。"""

    def __init__(self, hass: HomeAssistant, client: MyClient) -> None:
        """初始化协调器。"""
        super().__init__(
            hass,
            logger=LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=1),
        )
        self.client = client
    
    async def _async_update_data(self) -> MyData:
        try:
            return await self.client.get_data()
        except MyException as ex:
            raise UpdateFailed(f"设备不可用: {ex}")
```

### 通过 `async_update` 更新的实体示例

在这个示例中，我们有一个通过 `async_update` 更新其值的传感器。
示例将记录传感器不可用时的信息，并记录传感器重新上线时的信息。
请注意，使用实例属性来跟踪是否已记录该消息，以避免日志信息过多。

`sensor.py`
```python {10-12,16-18} showLineNumbers
class MySensor(SensorEntity):

    _unavailable_logged: bool = False

    async def async_update(self) -> None:
        try:
            data = await self.client.get_data()
        except MyException as ex:
            self._attr_available = False
            if not self._unavailable_logged:
                _LOGGER.info("传感器不可用: %s", ex)
                self._unavailable_logged = True
        else:
            self._attr_available = True
            self._attr_native_value = data.value
            if self._unavailable_logged:
                _LOGGER.info("传感器已重新上线")
                self._unavailable_logged = False
```

## 其他资源

有关管理集成状态的更多信息，请参阅 [文档](/docs/integration_fetching_data)

## 例外情况

此规则没有例外情况。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>