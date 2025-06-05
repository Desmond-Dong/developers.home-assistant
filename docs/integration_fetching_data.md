---
title: "获取数据"
---

你的集成需要从 API 中获取数据，以便能够将其提供给 Home Assistant。这个 API 可以通过网络（本地或云）、套接字、通过 USB 驱动器暴露的串口等方式提供。

## 推送与轮询

API 有许多不同的形状和形式，但其核心分为两类：推送和轮询。

通过推送，我们订阅一个 API，当新的数据可用时，API 会通知我们。它将更改推送给我们。推送 API 非常不错，因为它们消耗的资源更少。当发生更改时，我们可以收到更改的通知，而不必重新获取所有数据并寻找更改。由于实体可以被禁用，因此您应该确保您的实体在 `async_added_to_hass` 回调内部订阅并在移除时取消订阅。

通过轮询，我们将在指定的时间间隔从 API 获取最新数据。然后，您的集成将把这些数据提供给它的实体，这些数据将写入 Home Assistant。

由于轮询非常常见，Home Assistant 默认假设您的实体基于轮询。如果情况不是这样，请从 `Entity.should_poll` 属性返回 `False`。当您禁用轮询时，您的集成将负责调用其中一个方法，以通知 Home Assistant 该是时候将实体状态写入 Home Assistant 了：

- 如果您是在异步函数中执行，并且不需要调用您的实体更新方法，请调用 `Entity.async_write_ha_state()`。这是一个异步回调，将在让出事件循环的同时写入状态到状态机。
- `Entity.schedule_update_ha_state(force_refresh=False)` / `Entity.async_schedule_update_ha_state(force_refresh=False)` 将调度实体的更新。如果 `force_refresh` 被设置为 `True`，Home Assistant 将在写入状态之前调用您的实体更新方法（`update()` / `async_update()`）。

## 轮询 API 端点

我们将解释几种不同的 API 类型以及在 Home Assistant 中集成它们的最佳方法。请注意，一些集成将遇到以下这些组合。

### 协调、单个 API 轮询所有实体的数据

这个 API 将有一个单一的方法来获取您在 Home Assistant 中拥有的所有实体的数据。在这种情况下，我们希望在这个端点上进行一个定期轮询，然后在新数据可用时立即通知实体。

Home Assistant 提供了一个 DataUpdateCoordinator 类，以帮助您尽可能高效地管理这一过程。

使用 DataUpdateCoordinator 时，轮询的数据通常期望基本保持不变。例如，如果您正在轮询一个每周仅开启一次的灯光，则该数据几乎一直是相同的。默认行为是在数据更新时始终调用回调监听者，即使数据没有更改。如果从 API 返回的数据可以通过 Python 的 `__eq__` 方法进行比较，创建 DataUpdateCoordinator 时将 `always_update` 设置为 `False`，以避免不必要的回调和写入状态机。

```python
"""使用 DataUpdateCoordinator 的示例集成。"""

from datetime import timedelta
import logging

import async_timeout

from homeassistant.components.light import LightEntity
from homeassistant.core import callback
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
    UpdateFailed,
)

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass, config_entry, async_add_entities):
    """配置条目的示例。"""
    # 假设此处由 __init__.py 存储的 API 对象
    my_api = hass.data[DOMAIN][config_entry.entry_id]
    coordinator = MyCoordinator(hass, config_entry, my_api)

    # 获取初始数据，以便在实体订阅时我们有数据
    #
    # 如果刷新失败，async_config_entry_first_refresh 将
    # 引发 ConfigEntryNotReady，setup 将稍后重试
    #
    # 如果您不想在失败时重试设置，请使用
    # coordinator.async_refresh() 代替
    #
    await coordinator.async_config_entry_first_refresh()

    async_add_entities(
        MyEntity(coordinator, idx) for idx, ent in enumerate(coordinator.data)
    )


class MyCoordinator(DataUpdateCoordinator):
    """我的自定义协调器。"""

    def __init__(self, hass, config_entry, my_api):
        """初始化我的协调器。"""
        super().__init__(
            hass,
            _LOGGER,
            # 数据的名称。用于记录目的。
            name="我的传感器",
            config_entry=config_entry,
            # 轮询间隔。只有在有订阅者时才会进行轮询。
            update_interval=timedelta(seconds=30),
            # 如果从 API 返回的数据可以通过 `__eq__` 比较，则将 always_update 设置为 `False`
            # 以避免将重复更新发送到监听者
            always_update=True
        )
        self.my_api = my_api
        self._device: MyDevice | None = None

    async def _async_setup(self):
        """设置协调器

        这是设置协调器的地方，
        或者仅需加载一次的数据。

        此方法将在
        coordinator.async_config_entry_first_refresh 期间自动调用。
        """
        self._device = await self.my_api.get_device()

    async def _async_update_data(self):
        """从 API 端点获取数据。

        这是预处理数据以用于查找表的地方，
        以便实体可以快速查找它们的数据。
        """
        try:
            # 注意：asyncio.TimeoutError 和 aiohttp.ClientError 已由数据更新协调器处理。
            async with async_timeout.timeout(10):
                # 抓取活动上下文变量，以限制从 API 提取所需的数据
                # 注意：如果没有必要或能力限制从 API 检索的数据，则不需要使用上下文。
                listening_idx = set(self.async_contexts())
                return await self.my_api.fetch_data(listening_idx)
        except ApiAuthError as err:
            # 引发 ConfigEntryAuthFailed 将取消未来更新
            # 并启动配置流程，使用 SOURCE_REAUTH (async_step_reauth)
            raise ConfigEntryAuthFailed from err
        except ApiError as err:
            raise UpdateFailed(f"与 API 通信时出错：{err}")


class MyEntity(CoordinatorEntity, LightEntity):
    """使用 CoordinatorEntity 的实体。

    CoordinatorEntity 类提供：
      should_poll
      async_update
      async_added_to_hass
      available

    """

    def __init__(self, coordinator, idx):
        """将协调器传递给 CoordinatorEntity。"""
        super().__init__(coordinator, context=idx)
        self.idx = idx

    @callback
    def _handle_coordinator_update(self) -> None:
        """处理来自协调器的更新数据。"""
        self._attr_is_on = self.coordinator.data[self.idx]["state"]
        self.async_write_ha_state()

    async def async_turn_on(self, **kwargs):
        """打开灯光。

        请求数据更新的示例方法。
        """
        # 执行打开操作。
        # ...

        # 更新数据
        await self.coordinator.async_request_refresh()
```

### 每个独立实体单独轮询

一些 API 将为每个设备提供一个端点。有时无法将您 API 中的设备映射到单个实体。如果您从一个 API 设备端点创建多个实体，请参见上一部分。

如果您可以精确将一个设备端点映射到一个实体，则可以在 `update()` / `async_update()` 方法内部获取该实体的数据。确保将轮询设置为 `True`，并且 Home Assistant 会定期调用此方法。

如果您的实体需要在首次写入 Home Assistant 之前获取数据，请将 `update_before_add=True` 传递给 `add_entities` 方法：`add_entities([MyEntity()], update_before_add=True)`。

您可以通过在您的平台中定义一个 `SCAN_INTERVAL` 常量来控制集成的轮询间隔。设置得太低要小心。它将在 Home Assistant 中占用资源，可能会压垮托管 API 的设备或使您被云 API 阻止。允许的最小值为 5 秒。

```python
from datetime import timedelta

SCAN_INTERVAL = timedelta(seconds=5)
```

## 推送 API 端点

如果您有一个推送数据的 API 端点，您仍然可以使用数据更新协调器。如果想要这样做，请不要将轮询参数 `update_method` 和 `update_interval` 传递给构造函数。

当新数据到达时，使用 `coordinator.async_set_updated_data(data)` 将数据传递给实体。如果在轮询的协调器上使用此方法，它将重置下一次轮询数据的时间。

## 请求并行性

:::info
这是一个高级主题。
:::

Home Assistant 内置逻辑以确保集成不会大量请求 API 并消耗 Home Assistant 中的所有可用资源。这一逻辑基于限制并行请求的数量自动使用。在服务动作调用和实体更新期间会自动使用此逻辑。

Home Assistant 通过为每个集成维护一个[信号量](https://docs.python.org/3/library/asyncio-sync.html#asyncio.Semaphore)来控制并行更新的数量（对 `update()` 的调用）。例如，如果信号量允许 1 个并行连接，则更新和服务动作调用在一个正在进行时将等待。如果值为 0，则集成本身负责在必要时限制并行请求的数量。

平台的并行请求默认值是根据第一个添加到 Home Assistant 的实体决定的。如果实体定义了 `async_update` 方法，则为 0，否则为 1。（这是一个遗留决策）

平台可以通过在其平台中定义 `PARALLEL_UPDATES` 常量来覆盖默认值（例如 `rflink/light.py`）。