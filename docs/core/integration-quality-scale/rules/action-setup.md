---
title: "服务操作在 async_setup 中注册"
related_rules:
  - action-exceptions
---
import RelatedRules from './_includes/related_rules.jsx'

## 理由

集成可以向 Home Assistant 添加自己的服务操作。
在过去，这些操作经常在 `async_setup_entry` 方法中注册，并在 `async_unload_entry` 方法中移除。
这样导致的结果是，服务操作仅在存在加载的条目时可用。
这并不理想，因为这样我们无法验证用户创建的使用这些服务操作的自动化，因为配置条目可能无法加载。

我们更希望集成在 `async_setup` 方法中设置它们的服务操作。
这样，如果目标配置条目未加载，我们可以让用户知道服务操作为什么没有工作。
验证应该发生在服务操作内部，并在输入无效时抛出 `ServiceValidationError`。

## 示例实现

以下示例是一个在 `async_setup` 方法中注册服务操作的代码片段。
在此示例中，服务调用需要一个配置条目 ID 作为参数。
这用于首先获取配置条目，然后检查其是否已加载。
如果配置条目不存在或找到的配置条目未加载，我们将引发相关错误并显示给用户。

`__init__py`:
```python {13-19} showLineNumbers
async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """设置我的集成."""

    async def async_get_schedule(call: ServiceCall) -> ServiceResponse:
        """获取特定范围的日程安排."""
        if not (entry := hass.config_entries.async_get_entry(call.data[ATTR_CONFIG_ENTRY_ID])):
            raise ServiceValidationError("条目未找到")
        if entry.state is not ConfigEntryState.LOADED:
            raise ServiceValidationError("条目未加载")
        client = cast(MyConfigEntry, entry).runtime_data
        ...

    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_SCHEDULE,
        async_get_schedule,
        schema=SERVICE_GET_SCHEDULE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
```

## 其他资源

有关如何设置服务操作的更多信息，请参见 [服务文档](/docs/dev_101_services)。

## 例外情况

此规则没有例外。

## 相关规则

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>