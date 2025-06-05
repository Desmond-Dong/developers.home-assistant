---
title: "过时设备被移除"
related_rules:
  - dynamic-devices
---
import RelatedRules from './_includes/related_rules.jsx'

## 推理

当设备从中心或账户中移除时，它也应该从 Home Assistant 中移除。
这样，用户界面就不会显示不再可用的设备。

我们应该只移除我们确信不再可用的设备。
如果你不能确定一个设备是否仍然可用，请确保实现 `async_remove_config_entry_device`。
这允许用户手动从设备注册表中删除设备。

## 示例实现

在这个示例中，我们有一个协调器从服务中获取数据。
当数据更新时，我们检查是否有任何设备被移除。
如果有，我们将它们从设备注册表中移除。
这还会导致与设备关联的所有实体被移除。

`coordinator.py`
```python {13,20-30} showLineNumbers
class MyCoordinator(DataUpdateCoordinator[dict[str, MyDevice]]):
    """管理收集数据的类。"""

    def __init__(self, hass: HomeAssistant, client: MyClient) -> None:
        """初始化协调器。"""
        super().__init__(
            hass,
            logger=LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=1),
        )
        self.client = client
        self.previous_devices: set[str] = set()

    async def _async_update_data(self) -> dict[str, MyDevice]:
        try:
            data = await self.client.get_data()
        except MyException as ex:
            raise UpdateFailed(f"服务不可用: {ex}")
        current_devices = set(data)
        if (stale_devices := self.previous_devices - current_devices):
            device_registry = dr.async_get(self.hass)
            for device_id in stale_devices:
                device = device_registry.async_get_device(identifiers={(DOMAIN, device_id)})
                if device:
                    device_registry.async_update_device(
                        device_id=device.id,
                        remove_config_entry_id=self.config_entry.entry_id,
                    )
        self.previous_devices = current_devices
        return data
```

为了展示第二个示例，其中用户可以手动从设备注册表中删除设备，我们在 `__init__.py` 中实现 `async_remove_config_entry_device`。
定义这个函数将启用用户界面的设备页面上的删除按钮。
在这个示例中，集成仅能够获取设备的更新，而无法获取连接设备的完整列表，因此它无法自动删除设备。
在 `async_remove_config_entry_device` 中，我们应该实现一个检查设备是否仍然可用的函数。
如果不可用，我们返回 `True` 以允许用户手动删除设备。
在此，我们假设如果我们一段时间没有收到设备的更新，则设备不可用。

`__init__.py`
```python showLineNumbers
async def async_remove_config_entry_device(
    hass: HomeAssistant, config_entry: MyConfigEntry, device_entry: dr.DeviceEntry
) -> bool:
    """从设备中移除配置条目。"""
    return not any(
        identifier
        for identifier in device_entry.identifiers
        if identifier[0] == DOMAIN
        and identifier[1] in config_entry.runtime_data.data
    )
```

## 额外资源

有关设备的更多信息，请查看 [设备注册表文档](/docs/device_registry_index)。

## 异常

此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>