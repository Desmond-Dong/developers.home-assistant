---
title: "蓝牙 API"
---

### 订阅蓝牙发现

某些集成可能需要立即知道设备何时被发现。蓝牙集成提供了一个注册 API，它可以在发现匹配特定键值的新设备时接收回调。用于匹配的格式与 [`manifest.json`](../../creating_integration_manifest#bluetooth) 中的 `bluetooth` 相同。除了在 `manifest.json` 中使用的匹配器外，`address` 也可以作为匹配器使用。

提供了 `bluetooth.async_register_callback` 函数来实现此功能。该函数返回一个回调，用于在调用时取消注册。

以下示例演示了如何注册以获取 Switchbot 设备附近时的回调。

```python
from homeassistant.components import bluetooth

...

@callback
def _async_discovered_device(service_info: bluetooth.BluetoothServiceInfoBleak, change: bluetooth.BluetoothChange) -> None:
    """订阅蓝牙变化。"""
    _LOGGER.warning("新 service_info: %s", service_info)

entry.async_on_unload(
    bluetooth.async_register_callback(
        hass, _async_discovered_device, {"service_uuid": "cba20d00-224d-11e6-9fb8-0002a5d5c51b", "connectable": False}, bluetooth.BluetoothScanningMode.ACTIVE
    )
)
```

以下示例演示了如何注册以获取 HomeKit 设备的回调。

```python
from homeassistant.components import bluetooth

...

entry.async_on_unload(
    bluetooth.async_register_callback(
        hass, _async_discovered_homekit_device, {"manufacturer_id": 76, "manufacturer_data_first_byte": 6}, bluetooth.BluetoothScanningMode.ACTIVE
    )
)
```

以下示例演示了如何注册以获取 Nespresso Prodigio 的回调。

```python
from homeassistant.components import bluetooth

...

entry.async_on_unload(
    bluetooth.async_register_callback(
        hass, _async_nespresso_found, {"local_name": "Prodigio_*")}, bluetooth.BluetoothScanningMode.ACTIVE
    )
)
```

以下示例演示了如何注册以获取地址为 `44:33:11:22:33:22` 的设备的回调。

```python
from homeassistant.components import bluetooth

...

entry.async_on_unload(
    bluetooth.async_register_callback(
        hass, _async_specific_device_found, {"address": "44:33:11:22:33:22")}, bluetooth.BluetoothScanningMode.ACTIVE
    )
)
```

### 获取共享的 BleakScanner 实例

需要 `BleakScanner` 实例的集成应调用 `bluetooth.async_get_scanner` API。该 API 返回一个围绕单个 `BleakScanner` 的包装器，使集成能够共享而不造成系统过负荷。

```python
from homeassistant.components import bluetooth

scanner = bluetooth.async_get_scanner(hass)
```

### 确定扫描器是否在运行

蓝牙集成可能已经设置，但没有可连接的适配器或遥控器。可以使用 `bluetooth.async_scanner_count` API 来确定是否有正在运行的扫描器，该扫描器能够接收广告或生成可用于连接设备的 `BLEDevice`。如果没有能够生成可连接 `BLEDevice` 对象的扫描器，集成可能希望在设置期间引发更加有用的错误。

```python
from homeassistant.components import bluetooth

count = bluetooth.async_scanner_count(hass, connectable=True)
```

### 订阅不可用的回调

要在蓝牙堆栈无法再看到设备时获取回调，请调用 `bluetooth.async_track_unavailable` API。出于性能原因，一旦设备不再被看到，获取回调可能需要长达五分钟的时间。

如果将 `connectable` 参数设置为 `True`，则如果任何可连接的控制器可以达到设备，则设备将被视为可用。如果只有不可连接的控制器可以达到设备，则设备将被视为不可用。如果参数设置为 `False`，则如果任何控制器可以看到设备，则设备将被视为可用。

```python
from homeassistant.components import bluetooth

def _unavailable_callback(info: bluetooth.BluetoothServiceInfoBleak) -> None:
    _LOGGER.debug("%s 不再被看到", info.address)

cancel = bluetooth.async_track_unavailable(hass, _unavailable_callback, "44:44:33:11:23:42", connectable=True)
```

### 查找可用性超时

可用性根据设备最后已知广播后的时间来确定。此超时会根据设备的常规广播模式自动学习。您可以使用 `bluetooth.async_get_learned_advertising_interval` API 找到这一点。

```python
from homeassistant.components import bluetooth

learned_interval = bluetooth.async_get_learned_advertising_interval(hass, "44:44:33:11:23:42")
```

如果广告间隔尚未知道，这将返回 `None`。在这种情况下，不可用性跟踪将尝试该地址的回退间隔。以下示例返回集成手动设置的间隔：

```python
from homeassistant.components import bluetooth

bluetooth.async_set_fallback_availability_interval(hass, "44:44:33:11:23:42", 64.0)

fallback_interval = bluetooth.async_get_fallback_availability_interval(hass, "44:44:33:11:23:42")
```

如果设备没有学习到的间隔或回退间隔，将使用硬编码的安全默认间隔：

```python
from homeassistant.components import bluetooth

default_fallback_interval = bluetooth.FALLBACK_MAXIMUM_STALE_ADVERTISEMENT_SECONDS
```

### 从 `address` 获取 bleak `BLEDevice`

集成应避免通过调用 `bluetooth.async_ble_device_from_address` API 启动额外扫描器以解析地址，该 API 返回最近配置的可以达到设备的 `bluetooth` 适配器的 `BLEDevice`。如果没有适配器可以达到设备，则 `bluetooth.async_ble_device_from_address` API 将返回 `None`。

假设集成想要从可连接和不可连接控制器接收数据。在这种情况下，它可以在想要进行外部连接时，用 `connectable` 的 `BLEDevice` 交换 `BLEDevice`，只要至少有一个可连接控制器处于范围内。

```python
from homeassistant.components import bluetooth

ble_device = bluetooth.async_ble_device_from_address(hass, "44:44:33:11:23:42", connectable=True)
```

### 获取设备的最新 `BluetoothServiceInfoBleak`

最新的广告和设备数据可以通过 `bluetooth.async_last_service_info` API 获取，该 API 返回来自最强 RSSI 的可连接类型的 `BluetoothServiceInfoBleak`。

```python
from homeassistant.components import bluetooth

service_info = bluetooth.async_last_service_info(hass, "44:44:33:11:23:42", connectable=True)
```

### 检查设备是否存在

要确定设备是否仍然存在，请调用 `bluetooth.async_address_present` API。如果您的集成需要设备存在才能视其为可用，则此调用非常有用。

```python
from homeassistant.components import bluetooth

bluetooth.async_address_present(hass, "44:44:33:11:23:42", connectable=True)
```

### 获取所有已发现的设备

要访问以前发现的设备列表，请调用 `bluetooth.async_discovered_service_info` API。只有仍然存在的设备会在缓存中。

```python
from homeassistant.components import bluetooth

service_infos = bluetooth.async_discovered_service_info(hass, connectable=True)
```

### 获取每个蓝牙适配器的所有已发现设备和广告数据

要独立访问以前发现的设备列表和每个适配器接收到的广告数据，请调用 `bluetooth.async_scanner_devices_by_address` API。该调用返回一个 `BluetoothScannerDevice` 对象的列表。相同的设备和广告数据可能会多次出现，每个达到它的蓝牙适配器一次。

```python
from homeassistant.components import bluetooth

device = bluetooth.async_scanner_devices_by_address(hass, "44:44:33:11:23:42", connectable=True)
# device.ble_device 是一个 bleak `BLEDevice`
# device.advertisement 是一个 bleak `AdvertisementData`
# device.scanner 是找到设备的扫描器
```

### 触发设备的重新发现

当从 Home Assistant 中删除配置条目或设备时，触发其地址的重新发现，以确保它们可以在不重启 Home Assistant 的情况下进行设置。如果您的集成管理每个配置条目的多个设备，您可以利用设备注册表的蓝牙连接属性。

```python
from homeassistant.components import bluetooth

bluetooth.async_rediscover_address(hass, "44:44:33:11:23:42")
```

### 等待特定广告

要等待特定广告，请调用 `bluetooth.async_process_advertisements` API。

```python
from homeassistant.components import bluetooth

def _process_more_advertisements(
    service_info: BluetoothServiceInfoBleak,
) -> bool:
    """等待包含 323 的 manufacturer_data 的广告。"""
    return 323 in service_info.manufacturer_data

service_info = await bluetooth.async_process_advertisements(
    hass,
    _process_more_advertisements,
    {"address": discovery_info.address, "connectable": False},
    BluetoothScanningMode.ACTIVE,
    ADDITIONAL_DISCOVERY_TIMEOUT
)
```

### 注册外部扫描器

提供蓝牙适配器的集成应在它们的 [`manifest.json`](../../creating_integration_manifest) 中将 `bluetooth` 添加到 [`dependencies`](../../creating_integration_manifest#dependencies) 中，并添加到 [`after_dependencies`](../../creating_integration_manifest#after-dependencies) 到 `bluetooth_adapters` 集成中。

要注册外部扫描器，请调用 `bluetooth.async_register_scanner` API。扫描器必须继承自 `BaseHaScanner`。

如果扫描器需要连接插槽管理以避免过载适配器，则通过 `connection_slots` 参数以整数值传递连接插槽的数量。

```python
from homeassistant.components import bluetooth

cancel = bluetooth.async_register_scanner(hass, scanner, connection_slots=slots)
```

扫描器需要以 `BluetoothServiceInfoBleak` 对象的形式将广告数据馈送给中央蓝牙管理器。通过 `bluetooth.async_get_advertisement_callback` API，可以获得将数据发送到中央管理器所需的回调。

```python
callback = bluetooth.async_get_advertisement_callback(hass)

callback(BluetoothServiceInfoBleak(...))
```

### 移除外部扫描器

要永久移除外部扫描器，请调用 `bluetooth.async_remove_scanner` API 并传入扫描器的 `source`（MAC 地址）。这将删除与扫描器相关的任何广告历史记录。

```python
from homeassistant.components import bluetooth

bluetooth.async_remove_scanner(hass, source)