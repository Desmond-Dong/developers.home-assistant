---
title: "设备操作"
sidebar_label: 操作
---

设备操作允许用户让设备执行某项操作。示例包括打开灯光或打开门。

设备操作被定义为字典。这些字典由您的集成创建，并传递给您的集成以创建执行该操作的功能。

设备操作可以由提供设备的集成（例如 ZHA、deCONZ）或设备所拥有的实体的实体集成提供（例如灯、开关）。
前者的一个例子可能是重启设备，而后者的一个例子则可能是打开灯光。

如果操作需要动态验证而静态 `ACTION_SCHEMA` 无法提供，可以实现一个 `async_validate_action_config` 函数。

```py
async def async_validate_action_config(hass: HomeAssistant, config: ConfigType) -> ConfigType:
    """验证配置。"""
```

Home Assistant 包含一个模板以便于开始设备操作。要开始，请在开发环境中运行 `python3 -m script.scaffold device_action`。

该模板将在您的集成文件夹中创建一个新的文件 `device_action.py` 和一个匹配的测试文件。该文件包含以下函数和常量：

#### `ACTION_SCHEMA`

这是操作的模式。基础模式应扩展自 `homeassistant.helpers.config_validation.DEVICE_ACTION_BASE_SCHEMA`。请勿手动应用模式。如果操作模式在集成的 `device_action.py` 模块中被定义为常量，核心将自动应用该模式。

#### `async_get_actions`

```py
async def async_get_actions(hass: HomeAssistant, device_id: str) -> list[dict]:
    """列出设备支持的设备操作。"""
```

返回该设备支持的操作列表。

#### `async_call_action_from_config`

```py
async def async_call_action_from_config(
    hass: HomeAssistant, config: dict, variables: dict, context: Context | None
) -> None:
    """执行设备操作。"""
```

执行传入的操作。