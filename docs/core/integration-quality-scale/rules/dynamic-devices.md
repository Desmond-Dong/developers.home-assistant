---
title: "集成设置后添加的设备"
related_rules:
  - stale-devices
---
import RelatedRules from './_includes/related_rules.jsx'

## 推理

正如规则 [stale-devices](/docs/core/integration-quality-scale/rules/stale-devices) 中所解释的，当我们可以确认设备不再连接时，设备应自动被移除。
本规则解释了另一面，一旦新设备连接，我们应该自动为该设备创建相关实体。

这改善了用户体验，因为用户只需将设备添加到集成中，设备会自动在 Home Assistant 中显示。

## 示例实现

在下面的示例中，我们使用协调器从服务中提取所有数据。
每次更新 `_check_device` 将检查是否有新设备需要创建实体并将其添加到 Home Assistant。

`coordinator.py`
```python showLineNumbers
class MyCoordinator(DataUpdateCoordinator[dict[str, MyDevice]]):
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

    async def _async_update_data(self) -> dict[str, MyDevice]:
        try:
            return await self.client.get_data()
        except MyException as ex:
            raise UpdateFailed(f"服务不可用: {ex}")
```

`sensor.py`
```python {9,11-16,18-21} showLineNumbers
async def async_setup_entry(
    hass: HomeAssistant,
    entry: MyConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """根据配置条目设置 My 集成。"""
    coordinator = entry.runtime_data

    known_devices: set[str] = set()

    def _check_device() -> None:
        current_devices = set(coordinator.data)
        new_devices = current_devices - known_devices
        if new_devices:
            known_devices.update(new_devices)
            async_add_entities([MySensor(coordinator, device_id) for device_id in new_devices])

    _check_device()
    entry.async_on_unload(
        coordinator.async_add_listener(_check_device)
    )
```

## 异常

该规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>