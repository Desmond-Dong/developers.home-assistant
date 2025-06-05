---
title: 设备注册表
---

设备注册表是 Home Assistant 跟踪设备的注册表。一个设备在 Home Assistant 中通过一个或多个实体表示。例如，一个电池供电的温湿度传感器可能会暴露出温度、湿度和电池电量的实体。

<img class='invertDark'
  src='/img/en/device_registry/overview.png'
  alt='设备注册表概览'
/>

## 什么是设备？

在 Home Assistant 中，设备代表一个具有自己控制单元的物理设备，或一个服务。控制单元本身不必智能，但它应该控制发生的事情。例如，一个带有 4 个房间传感器的 Ecobee 恒温器在 Home Assistant 中等于 5 个设备，一个是恒温器（包括内部所有传感器），每个房间传感器各占一个设备。每个设备存在于特定的地理区域内，并且在该区域内可能有多个输入或输出。

如果将传感器连接到另一个设备以读取其某些数据，它仍应表示为两个不同的设备。这是因为传感器可以被移动以读取其他设备的数据。

一个提供多个端点的设备，其中设备的部分在不同区域感应或输出，应该分为独立的设备，并通过 `via_device` 属性引用父设备。这允许将独立端点分配到建筑物中的不同区域。

:::info
尽管目前尚不可用，我们可以考虑为用户提供合并设备的选项。
:::

## 设备属性

| 属性                  | 描述                                                                                                                                                                                                                               |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| area_id              | 设备所在的区域。                                                                                                                                                                                                                   |
| config_entries       | 与该设备相关的配置项。                                                                                                                                                                                                             |
| configuration_url    | 可配置设备或服务的 URL，链接到 Home Assistant UI 内部路径可以使用 `homeassistant://<path>`。                                                                                                                                  |
| connections          | `(connection_type, connection identifier)` 的元组集合。连接类型在设备注册模块中定义。集合中的每个项唯一定义一个设备条目，这意味着另一个设备不能具有相同的连接。                                               |
| default_manufacturer | 设备的制造商，如果设置了 `manufacturer`，则会被覆盖。例如，对于显示网络上所有设备的集成，这是有用的。                                                                                                                         |
| default_model        | 设备的型号，如果设置了 `model`，则会被覆盖。例如，对于显示网络上所有设备的集成，这是有用的。                                                                                                                               |
| default_name         | 该设备的默认名称，如果设置了 `name`，则会被覆盖。例如，对于显示网络上所有设备的集成，这是有用的。                                                                                                                            |
| entry_type           | 条目的类型。可能的值是 `None` 和 `DeviceEntryType` 枚举成员（仅 `service`）。                                                                                                                                                  |
| hw_version           | 设备的硬件版本。                                                                                                                                                                                                                   |
| id                   | 设备的唯一 ID（由 Home Assistant 生成）                                                                                                                                                                                            |
| identifiers          | `(DOMAIN, identifier)` 元组的集合。标识符在外部世界中识别设备。例如，一个序列号。集合中的每个项唯一定义一个设备条目，这意味着另一个设备不能具有相同的标识符。                                                             |
| name                 | 该设备的名称                                                                                                                                                                                                                       |
| name_by_user         | 用户配置的设备名称。                                                                                                                                                                                                               |
| manufacturer         | 设备的制造商。                                                                                                                                                                                                                     |
| model                | 设备的型号名称。                                                                                                                                                                                                                   |
| model_id             | 设备的型号标识符。                                                                                                                                                                                                                 |
| serial_number        | 设备的序列号。与 `identifiers` 集合中的序列号不同，此序列号不需要唯一。                                                                                                                                                       |
| suggested_area       | 建议的设备所在区域名称。                                                                                                                                                                                                          |
| sw_version           | 设备的固件版本。                                                                                                                                                                                                                   |
| via_device           | 在该设备和 Home Assistant 之间路由消息的设备的标识符。这类设备的示例是集线器或子设备的父设备。用于在 Home Assistant 中显示设备拓扑。                                                                                        |

## 定义设备

### 通过实体自动注册
:::tip
只有在通过 [配置项](config_entries_index.md) 加载实体并定义了 `unique_id` 属性时，实体设备信息才会被读取。
:::

每个实体都能够通过 `device_info` 属性定义设备。将设备添加到 Home Assistant 时，会读取此属性。一个设备将根据提供的标识符或连接（如序列号或 MAC 地址）与现有设备匹配。如果提供了标识符和连接，设备注册表将首先尝试根据标识符进行匹配。每个标识符和每个连接都是单独匹配的（例如，只需要一个连接匹配即可视为同一设备）。

```python
# 在平台内部
class HueLight(LightEntity):
    @property
    def device_info(self) -> DeviceInfo:
        """返回设备信息。"""
        return DeviceInfo(
            identifiers={
                # 序列号是特定域内的唯一标识符
                (hue.DOMAIN, self.unique_id)
            },
            name=self.name,
            manufacturer=self.light.manufacturername,
            model=self.light.productname,
            model_id=self.light.modelid,
            sw_version=self.light.swversion,
            via_device=(hue.DOMAIN, self.api.bridgeid),
        )
```

除了设备属性外，`device_info` 还可以包括 `default_manufacturer`、`default_model`、`default_name`。如果尚未定义其他值，这些值将添加到设备注册表中。这可以被知道某些信息但不非常具体的集成使用。例如，一个基于 MAC 地址识别设备的路由器。

### 手动注册

组件也可以在没有实体代表它们的情况下注册设备。举例来说，通讯与灯光的集线器。

```python
# 在组件内部
from homeassistant.helpers import device_registry as dr

device_registry = dr.async_get(hass)

device_registry.async_get_or_create(
    config_entry_id=entry.entry_id,
    connections={(dr.CONNECTION_NETWORK_MAC, config.mac)},
    identifiers={(DOMAIN, config.bridgeid)},
    manufacturer="Signify",
    suggested_area="厨房",
    name=config.name,
    model=config.modelname,
    model_id=config.modelid,
    sw_version=config.swversion,
    hw_version=config.hwversion,
)
```

## 移除设备

集成可以选择允许用户从 UI 中删除设备。要实现此功能，集成应该在其 `__init__.py` 模块中实现 `async_remove_config_entry_device` 函数。

```py
async def async_remove_config_entry_device(
    hass: HomeAssistant, config_entry: ConfigEntry, device_entry: DeviceEntry
) -> bool:
    """从设备中移除配置条目。"""
```

当用户点击设备的删除按钮并确认时，将会等待 `async_remove_config_entry_device`，如果返回 `True`，则配置条目将从设备中移除。如果这是设备的唯一配置条目，设备将从设备注册表中移除。

在 `async_remove_config_entry_device` 中，集成应采取必要步骤为设备移除做准备，并在成功时返回 `True`。如果在 `async_remove_config_entry_device` 中进行清理更方便，集成可以选择对 `EVENT_DEVICE_REGISTRY_UPDATED` 采取行动。

## 对设备信息进行分类

设备信息通过查找具有所有设备信息键的第一个设备信息类型进行分类，分为链接、主和次类。

| 分类                 | 键                     |
| -------------------- | ---------------------|
| 链接                 | `connections` 和 `identifiers` |
| 主                   | `configuration_url`、`connections`、`entry_type`、`hw_version`、`identifiers`、`manufacturer`、`model`、`name`、`suggested_area`、`sw_version` 和 `via_device`|
| 次                   | `connections`、`default_manufacturer`、`default_model`、`default_name` 和 `via_device`|

此分类用于对配置条目进行排序，以定义前端将使用的主要集成。

设备信息必须强制匹配其中一个类别。