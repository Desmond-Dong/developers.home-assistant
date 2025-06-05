---
title: "网络与发现"
sidebar_label: "网络与发现"
---

某些集成可能需要通过 [mDNS/Zeroconf](https://en.wikipedia.org/wiki/Zero-configuration_networking)、[SSDP](https://en.wikipedia.org/wiki/Simple_Service_Discovery_Protocol) 或其他方法在启用后发现网络上的设备。主要用例是查找没有已知固定 IP 地址的设备，或用于能够动态添加和删除任意数量的兼容可发现设备的集成。

Home Assistant 内置了支持 mDNS/Zeroconf 和 SSDP 的助手。如果您的集成使用其他发现方法并需要确定使用哪些网络接口来广播流量，[网络](https://www.home-assistant.io/integrations/network/) 集成提供了一个助手 API 来访问用户的接口偏好设置。

## mDNS/Zeroconf

Home Assistant 使用 [python-zeroconf](https://github.com/python-zeroconf/python-zeroconf) 包来支持 mDNS。由于在单个主机上运行多个 mDNS 实现并不推荐，因此 Home Assistant 提供了内部助手 API 来访问正在运行的 `Zeroconf` 和 `AsyncZeroconf` 实例。

在使用这些助手之前，请确保在集成的 [`manifest.json`](creating_integration_manifest.md) 中将 `zeroconf` 添加到 `dependencies`。

### 获取 `AsyncZeroconf` 对象

```python
from homeassistant.components import zeroconf

...
aiozc = await zeroconf.async_get_async_instance(hass)

```

### 获取 `Zeroconf` 对象

```python
from homeassistant.components import zeroconf

...
zc = await zeroconf.async_get_instance(hass)

```

### 使用 `AsyncZeroconf` 和 `Zeroconf` 对象

`python-zeroconf` 提供了如何使用这两个对象的示例 [examples](https://github.com/jstasiak/python-zeroconf/tree/master/examples)。

## SSDP

Home Assistant 提供通过 SSDP 的内置发现。

在使用这些助手之前，请确保在集成的 [`manifest.json`](creating_integration_manifest.md) 中将 `ssdp` 添加到 `dependencies`。

### 获取发现设备的列表

可以使用以下内置助手 API 获得发现的 SSDP 设备的列表。SSDP 集成提供以下助手 API 以从缓存中查找现有的 SSDP 发现：`ssdp.async_get_discovery_info_by_udn_st`、`ssdp.async_get_discovery_info_by_st`、`ssdp.async_get_discovery_info_by_udn`。

### 查找特定设备

`ssdp.async_get_discovery_info_by_udn_st` API 在提供 `SSDP`、`UDN` 和 `ST` 时返回单个 `discovery_info` 或 `None`。

```
from homeassistant.components import ssdp

...

discovery_info = await ssdp.async_get_discovery_info_by_udn_st(hass, udn, st)
```

### 按 `ST` 查找设备

如果您想查找特定类型的发现设备，调用 `ssdp.async_get_discovery_info_by_st` 将返回与 `SSDP` `ST` 匹配的所有发现设备的列表。以下示例返回网络上发现的每个 Sonos 播放器的发现信息列表。

```
from homeassistant.components import ssdp

...

discovery_infos = await ssdp.async_get_discovery_info_by_st(hass, "urn:schemas-upnp-org:device:ZonePlayer:1")
for discovery_info in discovery_infos:
  ...

```

### 按 `UDN` 查找设备

如果您想查看特定 `UDN` 提供的服务列表，调用 `ssdp.async_get_discovery_info_by_udn` 将返回与 `UPNP` `UDN` 匹配的所有发现设备的列表。

```
from homeassistant.components import ssdp

...

discovery_infos = await ssdp.async_get_discovery_info_by_udn(hass, udn)
for discovery_info in discovery_infos:
  ...

```

### 订阅 SSDP 发现

某些集成可能需要立即了解设备的发现情况。SSDP 集成提供了一个注册 API，以在发现与特定键值匹配的新设备时接收回调。`ssdp` 在 [`manifest.json`](creating_integration_manifest.md) 中使用相同的格式进行匹配。

提供了 `ssdp.async_register_callback` 函数以启用此功能。该函数返回一个回调，当调用时将取消注册。

以下示例展示了在网络上看到 Sonos 播放器时注册以获取回调。

```
from homeassistant.components import ssdp

...

entry.async_on_unload(
    ssdp.async_register_callback(
        hass, _async_discovered_player, {"st": "urn:schemas-upnp-org:device:ZonePlayer:1"}
    )
)
```

以下示例展示了在存在 `x-rincon-bootseq` 头时注册以获取回调。

```
from homeassistant.components import ssdp
from homeassistant.const import MATCH_ALL

...

entry.async_on_unload(
    ssdp.async_register_callback(
        hass, _async_discovered_player, {"x-rincon-bootseq": MATCH_ALL}
    )
)
```

## 网络

对于使用非内置发现方法的集成，并且需要访问用户的网络适配器配置，应使用以下助手 API。

```python
from homeassistant.components import network

...
adapters = await network.async_get_adapters(hass)
```

### 示例 `async_get_adapters` 数据结构

```python
[
    {   
        "auto": True,
        "default": False,
        "enabled": True,
        "ipv4": [],
        "ipv6": [
            {   
                "address": "2001:db8::",
                "network_prefix": 8,
                "flowinfo": 1,
                "scope_id": 1,
            }
        ],
        "name": "eth0",
    },
    {
        "auto": True,
        "default": False,
        "enabled": True,
        "ipv4": [{"address": "192.168.1.5", "network_prefix": 23}],
        "ipv6": [],
        "name": "eth1",
    },
    {
        "auto": False,
        "default": False,
        "enabled": False,
        "ipv4": [{"address": "169.254.3.2", "network_prefix": 16}],
        "ipv6": [],
        "name": "vtun0",
    },
]
```

### 从适配器获取 IP 网络

```python
from ipaddress import ip_network
from homeassistant.components import network

...

adapters = await network.async_get_adapters(hass)

for adapter in adapters:
    for ip_info in adapter["ipv4"]:
        local_ip = ip_info["address"]
        network_prefix = ip_info["network_prefix"]
        ip_net = ip_network(f"{local_ip}/{network_prefix}", False)
```

## USB

USB 集成在启动时、访问集成页面时以及插入时发现新的 USB 设备，前提是底层系统支持 `pyudev`。

### 检查特定适配器是否已插入

调用 `async_is_plugged_in` API 来检查特定适配器是否在系统上。

```python
from homeassistant.components import usb

...

if not usb.async_is_plugged_in(hass, {"serial_number": "A1234", "manufacturer": "xtech"}):
   raise ConfigEntryNotReady("USB 设备缺失")

```

### 知道何时查找新的兼容 USB 设备

调用 `async_register_scan_request_callback` API 以请求在新兼容 USB 设备可能可用时的回调。

```python
from homeassistant.components import usb
from homeassistant.core import callback

...

@callback
def _async_check_for_usb() -> None:
    """检查新的兼容蓝牙 USB 适配器。"""

entry.async_on_unload(
    bluetooth.async_register_scan_request_callback(hass, _async_check_for_usb)
)