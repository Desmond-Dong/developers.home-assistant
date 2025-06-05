---
title: 事件实体
sidebar_label: 事件
---

事件是当某个事件发生时发出的信号，例如，当用户按下一个物理按钮（如门铃）或当遥控器上的按钮被按下时。事件实体捕获这些物理世界中的事件，并将其作为实体在 Home Assistant 中提供。

事件实体来源于 [`homeassistant.components.event.EventEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/event/__init__.py)。

## 状态

事件实体是无状态的，这意味着您不需要维护状态。相反，当物理世界中发生某些事情时，您可以触发事件。Home Assistant 将会跟踪最后发出的事件，并将其显示为实体的当前状态。

实体的主要状态是最后发出事件的时间戳，此外事件的类型以及可选的随事件提供的额外状态数据也会被跟踪。

## 属性

:::tip
属性应该始终仅从内存中返回信息，而不进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称         | 类型             | 默认        | 描述                                           |
| ------------ | ---------------- | ----------- | ---------------------------------------------- |
| event_types  | `list[str]`     | **必需**    | 此实体可以触发的可能事件类型的列表。         |

其他适用于所有实体的属性，例如 `device_class`、`icon`、`name` 等也是适用的。

## 触发事件

事件实体与其他实体稍有不同。Home Assistant 管理状态，但集成负责触发事件。这是通过在事件实体上调用 `_trigger_event` 方法来完成的。

此方法将事件类型作为第一个参数，并可选地将额外的状态数据作为第二个参数。

```python
class MyEvent(EventEntity):

    _attr_device_class = EventDeviceClass.BUTTON
    _attr_event_types = ["单击", "双击"]

    @callback
    def _async_handle_event(self, event: str) -> None:
        """处理演示按钮事件。"""
        self._trigger_event(event, {"extra_data": 123})
        self.async_write_ha_state()

    async def async_added_to_hass(self) -> None:
        """使用您的设备 API/库注册回调。"""
        my_device_api.listen(self._async_handle_event)
```

只有在 `event_types` 属性中定义的事件类型才能被触发。如果触发了未在 `event_types` 属性中定义的事件类型，将引发 `ValueError`。

:::tip
确保在实体从 Home Assistant 中移除时注销任何回调。
:::

### 可用设备类别

可选地指定它是什么类型的实体。

| 常量                         | 描述                                                |
| ---------------------------- | ---------------------------------------------------- |
| `EventDeviceClass.BUTTON`    | 遥控器的按钮被按下。                                |
| `EventDeviceClass.DOORBELL`  | 专门用于用作门铃的按钮。                            |
| `EventDeviceClass.MOTION`    | 用于运动传感器检测到的运动事件。                    |