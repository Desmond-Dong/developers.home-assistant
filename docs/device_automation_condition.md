---
title: "设备条件"
sidebar_label: 条件
---

设备条件允许用户检查某个条件是否满足。例如，灯是否亮着或地板是否潮湿。

设备条件被定义为字典。这些字典由您的集成创建，并传递给您的集成以创建一个检查条件的函数。

设备条件可以由提供设备的集成提供（例如，ZHA、deCONZ），或者设备拥有实体的实体集成提供（例如，灯、湿度传感器）。
后者的一个例子可以是检查灯是否亮着或地板是否潮湿。

如果条件需要动态验证，而静态的 `CONDITION_SCHEMA` 无法提供，则可以实现 `async_validate_condition_config` 函数。

```py
async def async_validate_condition_config(hass: HomeAssistant, config: ConfigType) -> ConfigType:
    """验证配置。"""
```

Home Assistant 包含一个模板以开始使用设备条件。要开始，请在开发环境中运行 `python3 -m script.scaffold device_condition`。

该模板将在您的集成文件夹中创建一个新的文件 `device_condition.py` 及一个匹配的测试文件。该文件包含以下函数和常量：

#### `CONDITION_SCHEMA`

这是条件的模式。基本模式应从 `homeassistant.helpers.config_validation.DEVICE_CONDITION_BASE_SCHEMA` 扩展。

#### `async_get_conditions`

```py
async def async_get_conditions(
    hass: HomeAssistant, device_id: str
) -> list[dict[str, str]]:
    """列出设备的设备条件。"""
```

返回该设备支持的条件列表。

#### `async_condition_from_config`

```py
@callback
def async_condition_from_config(
    config: ConfigType, config_validation: bool
) -> condition.ConditionCheckerType:
    """创建一个函数以测试设备条件。"""
```

从一个函数创建一个条件函数。条件函数应为一个异步友好的回调，以评估条件并返回 `bool`。

`config_validation` 参数将由核心用于有条件地应用定义的 `CONDITION_SCHEMA` 的配置验证。