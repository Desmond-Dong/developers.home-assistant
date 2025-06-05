---
title: "触发事件"
---

某些集成表示具有事件的设备或服务，如检测到运动时或按下瞬时按钮时。集成可以通过在 Home Assistant 中触发这些事件使其可供用户使用。

您的集成应该触发 `<domain>_event` 类型的事件。例如，ZHA 集成触发 `zha_event` 事件。

如果事件与特定设备/服务相关联，则应该进行正确的归属。通过在事件数据中添加一个 `device_id` 属性，将设备注册表中的设备标识符包含在内，以此实现。

```
event_data = {
    "device_id": "my-device-id",
    "type": "motion_detected",
}
hass.bus.async_fire("mydomain_event", event_data)
```

如果设备或服务仅触发事件，您需要[手动在设备注册表中注册它](device_registry_index.md#manual-registration)。

## 使事件对用户可访问

可以根据有效负载将[设备触发器](device_automation_trigger.md)附加到特定事件，并将该事件对用户可用。通过设备触发器，用户将能够查看设备的所有可用事件并在其自动化中使用。

## 不要做的事情

与事件相关的代码不应成为您集成的实体逻辑的一部分。您需要在 `__init__.py` 的 `async_setup_entry` 内部启用将集成事件转换为 Home Assistant 事件的逻辑。

实体状态不应表示事件。例如，当事件发生时，您不希望有一个二进制传感器在 30 秒内处于 `on` 状态。