---
title: "实现诊断"
---

## 理由

诊断是用户收集有关集成数据的简单方式，并且在调试集成时可能非常有用。

我们认为实施诊断是一种良好的实践。
需要记住的是，诊断不应暴露任何敏感信息，例如密码、令牌或坐标。

## 示例实现

在以下示例中，我们提供了包括来自各种来源的数据的诊断，例如配置和集成的当前状态。
由于配置可能包含敏感信息，因此在返回诊断之前，我们会对敏感信息进行审查。

`diagnostics.py`:
```python showLineNumbers
TO_REDACT = [
    CONF_API_KEY,
    CONF_LATITUDE,
    CONF_LONGITUDE,
]

async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: MyConfigEntry
) -> dict[str, Any]:
    """返回配置项的诊断信息。"""

    return {
        "entry_data": async_redact_data(entry.data, TO_REDACT),
        "data": entry.runtime_data.data,
    }
```

## 额外资源

要了解有关诊断的更多信息，请查看[诊断文档](/docs/core/integration_diagnostics)。

## 例外情况

对此规则没有例外。