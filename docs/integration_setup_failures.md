---
title: "处理设置失败"
---

您的集成可能由于多种原因无法设置。最常见的情况是设备或服务离线或凭据不再有效。您的集成必须重试设置，以便在设备或服务重新上线时能够尽快恢复，而无需用户重新启动 Home Assistant。

## 处理离线或不可用的设备和服务

### 使用 `async_setup_entry` 的集成

在集成的 `__init__.py` 中从 `async_setup_entry` 引发 `ConfigEntryNotReady` 异常，Home Assistant 将自动处理稍后重试设置。为了避免疑虑，在平台的 `async_setup_entry` 中引发 `ConfigEntryNotReady` 是无效的，因为此时已为时已晚，无法被配置条目设置捕获。

#### 示例

```python
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """为我的设备设置配置条目。"""
    device = MyDevice(entry.data[CONF_HOST])
    try:
        await device.async_setup()
    except (asyncio.TimeoutError, TimeoutException) as ex:
        raise ConfigEntryNotReady(f"连接 {device.ipaddr} 时超时") from ex
```

如果您使用 [DataUpdateCoordinator](integration_fetching_data#coordinated-single-api-poll-for-data-for-all-entities)，调用 `await coordinator.async_config_entry_first_refresh()` 如果第一次刷新失败，也会自动触发此异常。

如果您的集成支持发现，Home Assistant 会在您的设备或服务被发现后自动重试。

#### 处理重试的日志记录

将错误消息作为第一个参数传递给 `ConfigEntryNotReady`。Home Assistant 将在 `debug` 级别记录。错误消息也会传播到 UI，并显示在集成页面上。假设您在引发 `ConfigEntryNotReady` 时不设置消息；在那种情况下，Home Assistant 会尝试从导致 `ConfigEntryNotReady` 的异常中提取原因，如果它是由另一个异常传播的。

集成不应记录任何与重试相关的非调试消息，而应依赖于内置于 `ConfigEntryNotReady` 的逻辑以避免在日志中产生垃圾信息。

### 使用 `async_setup_platform` 的集成

从 `async_setup_platform` 引发 `PlatformNotReady` 异常，Home Assistant 将自动处理稍后重试设置。

#### 示例

```python
async def async_setup_platform(
    hass: HomeAssistant,
    config: ConfigType,
    async_add_entities: AddEntitiesCallback,
    discovery_info: DiscoveryInfoType | None = None,
) -> None:
    """设置平台。"""
    device = MyDevice(conf[CONF_HOST])
    try:
        await device.async_setup()
    except ConnectionError as ex:
        raise PlatformNotReady(f"连接 {device.ipaddr} 时发生连接错误：{ex}") from ex
```

#### 处理重试的日志记录

将错误消息作为第一个参数传递给 `PlatformNotReady`。Home Assistant 将以 `warning` 级别记录一次重试，后续的重试将以 `debug` 级别记录。假设您在引发 `ConfigEntryNotReady` 时不设置消息；在那种情况下，Home Assistant 会尝试从导致 `ConfigEntryNotReady` 的异常中提取原因，如果它是由另一个异常传播的。

集成不应记录任何与重试相关的非调试消息，而应依赖于内置于 `PlatformNotReady` 的逻辑以避免在日志中产生垃圾信息。

## 处理过期的凭据

引发 `ConfigEntryAuthFailed` 异常，Home Assistant 将自动将配置条目置于失败状态并启动重新验证流程。该异常必须在 `__init__.py` 中的 `async_setup_entry` 或者从 `DataUpdateCoordinator` 中引发，否则将无法有效触发重新验证流程。如果您的集成不使用 `DataUpdateCoordinator`，则可以调用 `entry.async_start_reauth()` 作为启动重新验证流程的替代方法。

`reauth` 流程将使用以下上下文变量启动，这些变量在 `async_step_reauth` 步骤中可用：

- source: 这将始终是 "SOURCE_REAUTH"
- entry_id: 需要重新验证的配置条目的 entry_id
- unique_id: 需要重新验证的配置条目的 unique_id

#### 示例

```python
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """为我的设备设置配置条目。"""
    device = MyDevice(entry.data[CONF_HOST])
    try:
        await device.async_setup()
    except AuthFailed as ex:
        raise ConfigEntryAuthFailed(f"{device.name} 的凭据已过期") from ex
    except (asyncio.TimeoutError, TimeoutException) as ex:
        raise ConfigEntryNotReady(f"连接 {device.ipaddr} 时超时") from ex