---
title: "实体事件在正确的生命周期方法中被订阅"
---

## 理由

实体可能需要订阅事件，例如来自集成库的事件，并在新事件到来时更新状态。为了正确地做到这一点，实体应该在实体方法 `async_added_to_hass` 中订阅和注册更新回调。该实体方法在实体被实体平台助手注册后被调用，此时实体将拥有所有可调用的接口，例如 `self.hass` 和 `self.async_write_ha_state`。在此阶段之前注册更新回调会导致错误，例如回调尝试访问 `self.hass` 或写入状态更新。为了避免内存泄漏，实体应该在实体方法 `async_will_remove_from_hass` 中取消订阅事件，即注销更新回调。

## 示例实现

在下面的示例中，`self.client.events.subscribe` 返回一个函数，该函数在被调用时取消实体对事件的订阅。因此，我们在 `async_added_to_hass` 中订阅事件，并在 `async_will_remove_from_hass` 中取消订阅。

`sensor.py`
```python {10-13,15-19} showLineNumbers
class MySensor(SensorEntity):
    """传感器的表示。"""
    
    unsubscribe: Callable[[], None] | None = None

    def __init__(self, client: MyClient) -> None:
        """初始化传感器。"""
        self.client = client
    
    async def async_added_to_hass(self) -> None:
        """订阅事件。"""
        await super().async_added_to_hass()
        self.unsubscribe = self.client.events.subscribe("my_event", self._handle_event)
    
    async def async_will_remove_from_hass(self) -> None:
        """取消订阅事件。"""
        if self.unsubscribe:
            self.unsubscribe()
        await super().async_will_remove_from_hass()
    
    async def _handle_event(self, event: Event) -> None:
        """处理事件。"""
        ...
        self.async_write_ha_state()
```

:::info
上述示例可以使用生命周期函数简化。这省去了在实体中存储回调函数的需要。
```python showLineNumbers
    async def async_added_to_hass(self) -> None:
        """订阅事件。"""
        await super().async_added_to_hass()
        self.async_on_remove(
            self.client.events.subscribe("my_event", self._handle_event)
        )
```
:::

## 例外情况

对此规则没有例外。