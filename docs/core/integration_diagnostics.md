---
title: 集成诊断
sidebar_label: "诊断"
---

集成可以提供诊断，以帮助用户收集数据以协助故障排除。诊断可以为配置条目提供，但也可以单独为每个设备条目提供。

用户可以从集成页面的配置条目选项菜单中下载配置条目诊断。对于设备诊断，用户可以从设备信息部分（或根据集成从其菜单中）下载。请注意，如果某个集成未实现设备诊断，则设备页面将提供配置条目诊断。

:::warning
确保不暴露任何敏感数据至关重要。这包括但不限于：
- 密码和API密钥
- 认证令牌
- 位置信息
- 个人信息

Home Assistant提供了`async_redact_data`实用程序函数，您可以使用它安全地从诊断输出中删除敏感数据。
:::

以下是如何实现配置条目和设备条目诊断的示例：

```python
TO_REDACT = [
    CONF_API_KEY,
    APPLIANCE_CODE
]

async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: MyConfigEntry
) -> dict[str, Any]:
    """返回配置条目的诊断。"""

    return {
        "entry_data": async_redact_data(entry.data, TO_REDACT),
        "data": entry.runtime_data.data,
    }

async def async_get_device_diagnostics(
    hass: HomeAssistant, entry: MyConfigEntry, device: DeviceEntry
) -> dict[str, Any]:
    """返回设备的诊断。"""
    appliance = _get_appliance_by_device_id(hass, device.id)
    return {
        "details": async_redact_data(appliance.raw_data, TO_REDACT),
        "data": appliance.data,
    }
```

一个集成可以提供这两种类型的诊断，也可以只提供其中一种。