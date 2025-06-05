---
title: 集成系统健康
sidebar_label: "系统健康"
---

系统健康平台允许集成提供信息，帮助用户了解集成的状态。这可以包括端点的可用性、集成当前连接的服务器、剩余的请求配额等详细信息。

用户可以通过转到 **设置** > **维修**，然后在三个点的菜单中选择 **系统信息** 来查找汇总的系统健康信息。

## 实现系统健康平台

在集成中添加一个 `system_health.py` 文件，并实现 `async_register` 方法，以注册信息回调：

```python
"""为系统健康提供信息。"""

from homeassistant.components import system_health
from homeassistant.core import HomeAssistant, callback

@callback
def async_register(hass: HomeAssistant, register: system_health.SystemHealthRegistration) -> None:
    """注册系统健康回调。"""
    register.async_register_info(system_health_info)
```

信息回调应返回一个字典，其值可以是任何类型，包括协程。如果字典条目设置了协程，前端将显示一个等待指示器，并在协程完成并提供结果后自动更新。

```python
async def system_health_info(hass: HomeAssistant) -> dict[str, Any]:
    """获取信息页面的信息。"""
    config_entry: ExampleConfigEntry = hass.config_entries.async_entries(DOMAIN)[0]
    quota_info = await config_entry.runtime_data.async_get_quota_info()

    return {
        "consumed_requests": quota_info.consumed_requests,
        "remaining_requests": quota_info.requests_remaining,
        # 检查 URL 可能需要一些时间，因此在信息字典中设置协程
        "can_reach_server": system_health.async_check_can_reach_url(hass, ENDPOINT),
    }
```

:::tip
system_health 组件提供了 `async_check_can_reach_url` 辅助方法，可以轻松实现检查 URL 可用性。
:::


通过使用 `strings.json` 文件中的 `system_health` 部分翻译信息字典中的每个键，以提供良好的描述：

```json
  "system_health": {
    "info": {
      "can_reach_server": "可以连接到示例服务器",
      "remaining_requests": "剩余允许的请求"
    }
  }