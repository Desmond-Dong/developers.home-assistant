---
title: "设备触发器"
sidebar_label: 触发器
---

设备触发器是与特定设备及事件或状态变化相关的自动化触发器。示例包括“灯光开启”或“检测到水”。

设备触发器可以由提供设备的集成（例如 ZHA、deCONZ）或设备的实体集成（例如灯光、开关）提供。前者的一个例子是与实体无关的事件，例如遥控器或触摸面板上的按键按下，而后者的一个例子可能是灯已被打开。

要添加对设备触发器的支持，集成需要有一个 `device_trigger.py` 文件，并且：

- *定义一个 `TRIGGER_SCHEMA`*: 一个表示触发器的字典，例如设备和事件类型
- *创建触发器*: 创建包含设备或实体及其支持的事件或状态变化的字典，按照模式定义。
- *附加触发器*: 将触发器配置与事件或状态变化关联，例如在事件总线中触发的消息。
- *添加文本和翻译*: 给每个触发器一个易读的名称。

请勿手动应用静态模式。如果触发器模式在集成的 `device_trigger.py` 模块中定义为常量，核心将应用该模式。

如果触发器需要动态验证，而静态的 `TRIGGER_SCHEMA` 无法提供，可以实现一个 `async_validate_trigger_config` 函数。

```py
async def async_validate_trigger_config(hass: HomeAssistant, config: ConfigType) -> ConfigType:
    """验证配置。"""
```

Home Assistant 包含一个模板，以便开始使用设备触发器。要开始，请在开发环境中运行 `python3 -m script.scaffold device_trigger`。

该模板将在您的集成文件夹中创建一个新的 `device_trigger.py` 文件和一个匹配的测试文件。该文件包含以下函数和常量：

#### 定义一个 `TRIGGER_SCHEMA`

设备触发器定义为字典。这些字典由您的集成创建，并由您的集成使用以附加触发器。

这是一个严格的模式，验证特定的触发器字典是否代表您的集成可以处理的配置。这应该扩展 `device_automation/__init__.py` 中的 `TRIGGER_BASE_SCHEMA`。

```python
from homeassistant.const import (
    CONF_ENTITY_ID,
    CONF_TYPE,
)

TRIGGER_TYPES = {"water_detected", "noise_detected"}

TRIGGER_SCHEMA = TRIGGER_BASE_SCHEMA.extend(
    {
        vol.Required(CONF_TYPE): vol.In(TRIGGER_TYPES),
    }
)
```

此示例具有一个 `type` 字段，指示支持的事件类型。

#### 创建触发器

`async_get_triggers` 方法返回设备或任何相关实体支持的触发器列表。这些是用户用于创建自动化的触发器。

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

    # 确定此 device_id 支持哪些触发器 ...

    triggers.append({
        # TRIGGER_BASE_SCHEMA 的必需字段
        CONF_PLATFORM: "device",
        CONF_DOMAIN: "mydomain",
        CONF_DEVICE_ID: device_id,
        # TRIGGER_SCHEMA 的必需字段
        CONF_TYPE: "water_detected",
    })

    return triggers
```

#### 附加触发器

要连接起来：给定 `TRIGGER_SCHEMA` 配置，确保在触发器被触发时调用 `action`。

例如，您可能会通过集成将触发器和动作附加到 [触发的事件](integration_events.md) 上的事件总线。

```python
async def async_attach_trigger(hass, config, action, trigger_info):
    """附加触发器。"""
    event_config = event_trigger.TRIGGER_SCHEMA(
        {
            event_trigger.CONF_PLATFORM: "event",
            event_trigger.CONF_EVENT_TYPE: "mydomain_event",
            event_trigger.CONF_EVENT_DATA: {
                CONF_DEVICE_ID: config[CONF_DEVICE_ID],
                CONF_TYPE: config[CONF_TYPE],
            },
        }
    )
    return await event_trigger.async_attach_trigger(
        hass, event_config, action, trigger_info, platform_type="device"
    )
```

返回值是一个断开触发器的函数。

#### 添加文本和翻译

自动化用户界面将在设备自动化中显示与事件类型映射的人类可读字符串。更新 `strings.json` 以包含您支持的触发器类型和子类型：

```json
{
   "device_automation": {
    "trigger_type": {
      "water_detected": "检测到水",
      "noise_detected": "检测到噪声"
    }
}
```

要在开发期间测试您的翻译，请运行 `python3 -m script.translations develop`。