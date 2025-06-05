---
title: "设备自动化"
sidebar_label: 介绍
---

设备自动化为用户提供了一个以设备为中心的层，建立在Home Assistant的核心概念之上。在创建自动化时，用户不再需要处理状态和事件等核心概念。相反，他们将能够选择一个设备，然后从预定义的触发器、条件和动作列表中进行选择。

集成可以通过公开函数来生成预定义的触发器、条件、动作并拥有能够监听触发器、检查条件和执行动作的函数来挂钩此系统。

设备自动化并未暴露额外的功能，而是为用户提供了一种无需学习新概念的方式。设备自动化在后台使用事件、状态和服务动作助手。

### 次要设备自动化

某些设备可能会暴露很多设备自动化。为了不让用户感到不知所措，可以将设备自动化标记为次要。标记为次要的设备自动化仍会显示给用户，但可能会在其他设备自动化之后显示，或可能需要用户选择“显示更多”选项或类似选项。

如果设备自动化通过`entity_id`键引用了一个实体，则如果引用的实体被隐藏或引用的实体的实体类别不为`None`，则次要标志将自动设置为`True`。以下示例显示了如何将设备自动化标记为次要。

```python
from homeassistant.const import (
    CONF_DEVICE_ID,
    CONF_DOMAIN,
    CONF_PLATFORM,
    CONF_TYPE,
)
from homeassistant.helpers import device_registry as dr

async def async_get_triggers(hass, device_id):
    """返回触发器列表。"""

    device_registry = dr.async_get(hass)
    device = device_registry.async_get(device_id)

    triggers = []

    # 确定此device_id支持哪些触发器 ...

    triggers.append({
        # TRIGGER_BASE_SCHEMA的必填字段
        CONF_PLATFORM: "device",
        CONF_DOMAIN: "mydomain",
        CONF_DEVICE_ID: device_id,
        # TRIGGER_SCHEMA的必填字段
        CONF_TYPE: "less_important_trigger",
        # 将触发器标记为次要
        "metadata": {"secondary": True},
    })

    return triggers