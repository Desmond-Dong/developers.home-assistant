---
title: "获取蓝牙数据"
---

## 选择获取数据的方法

如果设备的主要更新通知方式是蓝牙广告，并且其主要功能是传感器、二进制传感器或触发事件：

- 如果所有传感器通过蓝牙广告更新：[`PassiveBluetoothProcessorCoordinator`](#passivebluetoothprocessorcoordinator)
- 如果某些传感器需要主动连接：[`ActiveBluetoothProcessorCoordinator`](#activebluetoothprocessorcoordinator)

如果设备的主要更新通知方式是蓝牙广告，并且其主要功能**不是**传感器、二进制传感器或触发事件：

- 如果所有实体通过蓝牙广告更新：[`PassiveBluetoothCoordinator`](#passivebluetoothcoordinator)
- 如果需要主动连接：[`ActiveBluetoothCoordinator`](#activebluetoothcoordinator)

如果您的设备仅通过主动蓝牙连接进行通信，并且不使用蓝牙广告：

- [`DataUpdateCoordinator`](/docs/integration_fetching_data)

## BluetoothProcessorCoordinator

`ActiveBluetoothProcessorCoordinator`和`PassiveBluetoothProcessorCoordinator`显著减少了创建主要作为传感器、二进制传感器或触发事件的集成所需的代码。通过将传递到处理器协调器的数据格式化为`PassiveBluetoothDataUpdate`对象，框架可以按需创建实体，并允许最小化的`sensor`和`binary_sensor`平台实现。

这些框架要求来自库的数据被格式化为`PassiveBluetoothDataUpdate`，如下所示：

```python
@dataclasses.dataclass(frozen=True)
class PassiveBluetoothEntityKey:
    """被动蓝牙实体的键。

    例子：
    key: temperature
    device_id: outdoor_sensor_1
    """

    key: str
    device_id: str | None

@dataclasses.dataclass(frozen=True)
class PassiveBluetoothDataUpdate(Generic[_T]):
    """通用蓝牙数据。"""

    devices: dict[str | None, DeviceInfo] = dataclasses.field(default_factory=dict)
    entity_descriptions: Mapping[
        PassiveBluetoothEntityKey, EntityDescription
    ] = dataclasses.field(default_factory=dict)
    entity_names: Mapping[PassiveBluetoothEntityKey, str | None] = dataclasses.field(
        default_factory=dict
    )
    entity_data: Mapping[PassiveBluetoothEntityKey, _T] = dataclasses.field(
        default_factory=dict
    )
```

### PassiveBluetoothProcessorCoordinator

使用`PassiveBluetoothProcessorCoordinator`的集成`__init__.py`的示例`async_setup_entry`：

```python
import logging
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.components.bluetooth import BluetoothScanningMode
from homeassistant.components.bluetooth.passive_update_processor import (
    PassiveBluetoothProcessorCoordinator,
)
from .const import DOMAIN
from homeassistant.const import Platform

PLATFORMS: list[Platform] = [Platform.SENSOR]

from your_library import DataParser

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """从配置条目设置示例BLE设备。"""
    address = entry.unique_id
    data = DataParser()
    coordinator = hass.data.setdefault(DOMAIN, {})[
        entry.entry_id
    ] = PassiveBluetoothProcessorCoordinator(
        hass,
        _LOGGER,
        address=address,
        mode=BluetoothScanningMode.ACTIVE,
        update_method=data.update,
    )
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(
        # 仅在所有平台都有机会订阅后开始
        coordinator.async_start()
    )
    return True
```

示例`sensor.py`：

```python
from homeassistant import config_entries
from homeassistant.components.bluetooth.passive_update_processor import (
    PassiveBluetoothDataProcessor,
    PassiveBluetoothDataUpdate,
    PassiveBluetoothEntityKey,
    PassiveBluetoothProcessorCoordinator,
    PassiveBluetoothProcessorEntity,
)
from homeassistant.components.sensor import SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN


def sensor_update_to_bluetooth_data_update(parsed_data):
    """将传感器更新转换为蓝牙数据更新。"""
    # 此函数必须将parsed_data从您库的update_method转换为`PassiveBluetoothDataUpdate`
    # 参见上述结构
    return PassiveBluetoothDataUpdate(
        devices={},
        entity_descriptions={},
        entity_data={},
        entity_names={},
    )


async def async_setup_entry(
    hass: HomeAssistant,
    entry: config_entries.ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """设置示例BLE传感器。"""
    coordinator: PassiveBluetoothProcessorCoordinator = hass.data[DOMAIN][
        entry.entry_id
    ]
    processor = PassiveBluetoothDataProcessor(sensor_update_to_bluetooth_data_update)
    entry.async_on_unload(
        processor.async_add_entities_listener(
            ExampleBluetoothSensorEntity, async_add_entities
        )
    )
    entry.async_on_unload(coordinator.async_register_processor(processor))


class ExampleBluetoothSensorEntity(PassiveBluetoothProcessorEntity, SensorEntity):
    """示例BLE传感器的表示。"""

    @property
    def native_value(self) -> float | int | str | None:
        """返回原始值。"""
        return self.processor.entity_data.get(self.entity_key)

```

### ActiveBluetoothProcessorCoordinator

`ActiveBluetoothProcessorCoordinator`的功能与`PassiveBluetoothProcessorCoordinator`几乎相同，但还会建立主动连接，根据`needs_poll_method`和`poll_method`函数轮询数据，当设备的蓝牙广告发生变化时调用。`sensor.py`的实现与`PassiveBluetoothProcessorCoordinator`相同。

使用`ActiveBluetoothProcessorCoordinator`的集成`__init__.py`的示例`async_setup_entry`：

```python
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import CoreState, HomeAssistant
from homeassistant.components.bluetooth import BluetoothScanningMode

from homeassistant.components.bluetooth import (
    BluetoothScanningMode,
    BluetoothServiceInfoBleak,
    async_ble_device_from_address,
)
from homeassistant.const import Platform

from homeassistant.components.bluetooth.active_update_processor import (
    ActiveBluetoothProcessorCoordinator,
)
PLATFORMS: list[Platform] = [Platform.SENSOR]

from your_library import DataParser

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """从配置条目设置示例BLE设备。"""
    address = entry.unique_id
    assert address is not None
    data = DataParser()

    def _needs_poll(
        service_info: BluetoothServiceInfoBleak, last_poll: float | None
    ) -> bool:
        return (
            hass.state == CoreState.running
            and data.poll_needed(service_info, last_poll)
            and bool(
                async_ble_device_from_address(
                    hass, service_info.device.address, connectable=True
                )
            )
        )

    async def _async_poll(service_info: BluetoothServiceInfoBleak):
        if service_info.connectable:
            connectable_device = service_info.device
        elif device := async_ble_device_from_address(
            hass, service_info.device.address, True
        ):
            connectable_device = device
        else:
            # 我们没有蓝牙控制器在设备的范围内
            # 进行轮询
            raise RuntimeError(
                f"未找到可连接的设备 {service_info.device.address}"
            )
        return await data.async_poll(connectable_device)

    coordinator = hass.data.setdefault(DOMAIN, {})[
        entry.entry_id
    ] = ActiveBluetoothProcessorCoordinator(
        hass,
        _LOGGER,
        address=address,
        mode=BluetoothScanningMode.PASSIVE,
        update_method=data.update,
        needs_poll_method=_needs_poll,
        poll_method=_async_poll,
        # 我们将从不可连接的设备中获取广告
        # 因为如果我们需要对其进行轮询，我们将用可连接的设备替换BLEDevice
        connectable=False,
    )
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(
        # 仅在所有平台都有机会订阅后开始
        coordinator.async_start()
    )
    return True
```

## BluetoothCoordinator

`ActiveBluetoothCoordinator`和`PassiveBluetoothCoordinator`协调器的功能类似于`DataUpdateCoordinators`，但它们由传入的广告数据驱动，而不是轮询。

### PassiveBluetoothCoordinator

以下是`PassiveBluetoothDataUpdateCoordinator`的示例。通过`_async_handle_bluetooth_event`接收传入数据，并由集成的库处理。

```python
import logging
from typing import TYPE_CHECKING

from homeassistant.components import bluetooth
from homeassistant.components.bluetooth.active_update_coordinator import (
    PassiveBluetoothDataUpdateCoordinator,
)
from homeassistant.core import CoreState, HomeAssistant, callback

if TYPE_CHECKING:
    from bleak.backends.device import BLEDevice


class ExamplePassiveBluetoothDataUpdateCoordinator(
    PassiveBluetoothDataUpdateCoordinator[None]
):
    """用于管理获取示例数据的类。"""

    def __init__(
        self,
        hass: HomeAssistant,
        logger: logging.Logger,
        ble_device: BLEDevice,
        device: YourLibDevice,
    ) -> None:
        """初始化示例数据协调器。"""
        super().__init__(
            hass=hass,
            logger=logger,
            address=ble_device.address,
            mode=bluetooth.BluetoothScanningMode.ACTIVE,
            connectable=False,
        )
        self.device = device

    @callback
    def _async_handle_unavailable(
        self, service_info: bluetooth.BluetoothServiceInfoBleak
    ) -> None:
        """处理设备变为不可用的情况。"""

    @callback
    def _async_handle_bluetooth_event(
        self,
        service_info: bluetooth.BluetoothServiceInfoBleak,
        change: bluetooth.BluetoothChange,
    ) -> None:
        """处理蓝牙事件。"""
        # 您的设备应该处理传入的广告数据

```

### ActiveBluetoothCoordinator

以下是`ActiveBluetoothDataUpdateCoordinator`的示例。传入的数据通过`_async_handle_bluetooth_event`接收，并由集成的库处理。

传递给`needs_poll_method`的方法在每次蓝牙广告变化时调用，以确定是否应该调用传递给`poll_method`的方法，以建立与设备的主动连接以获取附加数据。

```python
import logging
from typing import TYPE_CHECKING

from homeassistant.components import bluetooth
from homeassistant.components.bluetooth.active_update_coordinator import (
    ActiveBluetoothDataUpdateCoordinator,
)
from homeassistant.core import CoreState, HomeAssistant, callback

if TYPE_CHECKING:
    from bleak.backends.device import BLEDevice


class ExampleActiveBluetoothDataUpdateCoordinator(
    ActiveBluetoothDataUpdateCoordinator[None]
):
    """用于管理获取示例数据的类。"""

    def __init__(
        self,
        hass: HomeAssistant,
        logger: logging.Logger,
        ble_device: BLEDevice,
        device: YourLibDevice,
    ) -> None:
        """初始化示例数据协调器。"""
        super().__init__(
            hass=hass,
            logger=logger,
            address=ble_device.address,
            needs_poll_method=self._needs_poll,
            poll_method=self._async_update,
            mode=bluetooth.BluetoothScanningMode.ACTIVE,
            connectable=True,
        )
        self.device = device

    @callback
    def _needs_poll(
        self,
        service_info: bluetooth.BluetoothServiceInfoBleak,
        seconds_since_last_poll: float | None,
    ) -> bool:
        # 仅在hass正在运行时需要轮询，我们需要轮询，
        # 并且我们实际上有连接设备的方式
        return (
            self.hass.state == CoreState.running
            and self.device.poll_needed(seconds_since_last_poll)
            and bool(
                bluetooth.async_ble_device_from_address(
                    self.hass, service_info.device.address, connectable=True
                )
            )
        )

    async def _async_update(
        self, service_info: bluetooth.BluetoothServiceInfoBleak
    ) -> None:
        """轮询设备。"""

    @callback
    def _async_handle_unavailable(
        self, service_info: bluetooth.BluetoothServiceInfoBleak
    ) -> None:
        """处理设备变为不可用的情况。"""

    @callback
    def _async_handle_bluetooth_event(
        self,
        service_info: bluetooth.BluetoothServiceInfoBleak,
        change: bluetooth.BluetoothChange,
    ) -> None:
        """处理蓝牙事件。"""
        # 您的设备应该处理传入的广告数据