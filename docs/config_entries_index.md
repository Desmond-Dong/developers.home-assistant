---
title: 配置条目
---

配置条目是由Home Assistant持久存储的配置数据。配置条目由用户通过用户界面创建。用户界面的流程由集成定义的[配置流程处理程序](config_entries_config_flow_handler.md)支持。

一旦创建，配置条目可以由用户删除。可选地，配置条目可以通过[重新配置步骤](config_entries_config_flow_handler.md#reconfigure)或[选项流程处理程序](config_entries_options_flow_handler.md)进行更改，这也由集成定义。

### 配置子条目

配置条目可以在逻辑上将存储的配置数据分隔成子条目，这些子条目可以由用户通过用户界面添加到现有的配置条目中。一个例子是一个提供天气预报的集成，其中配置条目存储身份验证详细信息，每个需要提供天气预报的位置作为子条目存储。

与配置条目类似，子条目也可选地支持重新配置步骤。

## 生命周期

| 状态 | 描述 |
| ----- | ----------- |
| 未加载 | 配置条目尚未加载。这是在创建配置条目或重启Home Assistant时的初始状态。 |
| 设置中 | 在尝试加载配置条目时的中间状态。 |
| 已加载 | 配置条目已被加载。 |
| 设置错误 | 在尝试设置配置条目时发生错误。 |
| 设置重试 | 配置条目的依赖项尚未准备好。Home Assistant将在将来自动重试加载此配置条目。尝试之间的时间将自动增加。 |
| 迁移错误 | 配置条目必须迁移到更新版本，但迁移失败。 |
| 卸载中 | 在尝试卸载配置条目时的中间状态。 |
| 卸载失败 | 尝试卸载配置条目，但这要么不被支持，要么引发了异常。 |

有关错误呈现和请求重试的更多信息，请参见[处理设置失败](integration_setup_failures.md#integrations-using-async_setup_entry)。

## 设置条目

在启动期间，Home Assistant首先调用[正常集成设置](/creating_component_index.md)，
然后对每个条目调用方法`async_setup_entry(hass, entry)`。如果在运行时创建了新的配置条目，Home Assistant还会调用`async_setup_entry(hass, entry)`（[示例](https://github.com/home-assistant/core/blob/f18ddb628c3574bc82e21563d9ba901bd75bc8b5/homeassistant/components/hassio/__init__.py#L522)）。

### 对于平台

如果集成包括平台，它将需要将配置条目设置转发到平台。这可以通过调用配置条目管理器上的转发函数来完成（[示例](https://github.com/home-assistant/core/blob/f18ddb628c3574bc82e21563d9ba901bd75bc8b5/homeassistant/components/hassio/__init__.py#L529)）:

```python
await hass.config_entries.async_forward_entry_setups(config_entry, ["light", "sensor", "switch"])
```

对于平台支持配置条目，需要添加一个设置条目功能（[示例](https://github.com/home-assistant/core/blob/f18ddb628c3574bc82e21563d9ba901bd75bc8b5/homeassistant/components/hassio/__init__.py#L522)）:

```python
async def async_setup_entry(hass, config_entry, async_add_entities):
    """设置条目。"""
```

## 卸载条目

集成可以选择支持卸载配置条目。在卸载条目时，集成需要清理所有实体，取消订阅任何事件监听器并关闭所有连接。要实现这一点，请在您的集成中添加`async_unload_entry(hass, entry)`（[示例](https://github.com/home-assistant/core/blob/f18ddb628c3574bc82e21563d9ba901bd75bc8b5/homeassistant/components/hassio/__init__.py#L534)）。在调用`async_unload_entry`之前，配置条目的状态设置为`ConfigEntryState.UNLOAD_IN_PROGRESS`。

对于每个平台，您需要转发卸载。

```python
async def async_unload_entry(hass: HomeAssistant, entry: MyConfigEntry) -> bool:
    """卸载配置条目。"""
```

如果您需要清理平台中用于实体的资源，请让实体实现[`async_will_remove_from_hass`](core/entity.md#async_will_remove_from_hass)方法。

## 移除条目

如果集成需要在条目被移除时清理代码，可以定义一个移除函数`async_remove_entry`。在调用`async_remove_entry`之前，从`hass.config_entries`中删除配置条目。

```python
async def async_remove_entry(hass, entry) -> None:
    """处理条目的移除。"""
```

## 将配置条目迁移到新版本

如果配置条目版本发生更改，必须实现`async_migrate_entry`以支持旧条目的迁移。这在[配置流程文档](/config_entries_config_flow_handler.md#config-entry-migration)中有详细文档。

```python
async def async_migrate_entry(hass: HomeAssistant, config_entry: ConfigEntry) -> bool:
    """迁移旧条目。"""
```

## 修改配置条目

`ConfigEntry`对象，包括数据和选项，绝不能直接被集成修改，而是集成必须调用`async_update_entry`，其用法在[配置流程文档](/config_entries_config_flow_handler.md#config-entry-migration)中有所说明。

## 订阅配置条目状态更改

如果您希望在`ConfigEntry`更改其`state`时收到通知（例如，从`ConfigEntryState.LOADED`更改为`ConfigEntryState.UNLOAD_IN_PROGRESS`），您可以添加一个监听器，该监听器将被通知到`async_on_state_change`。此助手还返回一个可以调用的回调，以再次移除监听器。因此，在条目卸载之前订阅更改将是`entry.async_on_unload(entry.async_on_state_change(notify_me))`。