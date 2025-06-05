---
title: "支持配置项卸载"
related_rules:
  - entity-event-setup
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

集成应该支持配置项的卸载。这允许 Home Assistant 在运行时卸载集成，使用户能够移除该集成或在不必重启 Home Assistant 的情况下重新加载它。

这改善了用户体验，因为用户可以在不必重启 Home Assistant 的情况下进行更多操作。

## 示例实现

在 `async_unload_entry` 接口函数中，集成应该清理任何订阅并关闭在集成设置期间打开的任何连接。

在这个例子中，我们有一个监听器，存储在配置项的 `runtime_data` 中，我们希望清理它以避免内存泄漏。

`__init__.py`:
```python showLineNumbers
async def async_unload_entry(hass: HomeAssistant, entry: MyConfigEntry) -> bool:
    """卸载配置项。"""
    if (unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS))
        entry.runtime_data.listener()
    return unload_ok
```

:::info
集成可以使用 `entry.async_on_unload` 来注册回调函数，当配置项被卸载或者设置失败时，这些回调将被调用。这对于清理资源非常有用，而无需自己跟踪移除方法。
如果以下情况发生，将调用注册的回调：
 - `async_setup_entry` 引发 `ConfigEntryError`、`ConfigEntryAuthFailed` 或 `ConfigEntryNotReady`
 - `async_unload_entry` 成功，即返回 True 并且不引发异常。

请注意，集成始终需要实现 `async_unload_entry` 以支持配置项的卸载，仅调用 `entry.async_on_unload` 是不够的。
:::

## 附加资源

有关配置项及其生命周期的更多信息，可以在 [配置项文档](/docs/config_entries_index) 中找到。

## 例外情况

此规则没有例外情况。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>