---
title: 气候实体
sidebar_label: 气候
---

气候实体控制温度、湿度或风扇，例如空调系统和加湿器。从 [`homeassistant.components.climate.ClimateEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/climate/__init__.py) 派生一个平台实体。

## 属性

:::tip
属性应始终仅从内存中返回信息，而不执行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称                    | 类型                                  | 默认值                                | 描述                                                                      |
| ----------------------- | ------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| current_humidity        | <code>float &#124; None</code>      | `None`                                | 当前湿度。                                                                |
| current_temperature     | <code>float &#124; None</code>      | `None`                                | 当前温度。                                                                |
| fan_mode                | <code>str &#124; None</code>        | **由 SUPPORT_FAN_MODE 要求**          | 当前风扇模式。                                                            |
| fan_modes               | <code>list[str] &#124; None</code>  | **由 SUPPORT_FAN_MODE 要求**          | 可用风扇模式列表。                                                        |
| hvac_action             | <code>HVACAction &#124; None</code> | `None`                                | 当前 HVAC 动作（加热、冷却）                                              |
| hvac_mode               | <code>HVACMode &#124; None</code>   | **必需**                              | 当前操作（例如，加热、冷却、闲置）。用于确定 `state`。                   |
| hvac_modes              | <code>list[HVACMode]</code>         | **必需**                              | 可用操作模式列表。详见下文。                                             |
| max_humidity            | `float`                              | `DEFAULT_MAX_HUMIDITY`（值 == 99）    | 最大湿度。                                                                |
| max_temp                | `float`                              | `DEFAULT_MAX_TEMP`（值 == 35 °C）      | `temperature_unit` 中的最大温度。                                         |
| min_humidity            | `float`                              | `DEFAULT_MIN_HUMIDITY`（值 == 30）    | 最小湿度。                                                                |
| min_temp                | `float`                              | `DEFAULT_MIN_TEMP`（值 == 7 °C）       | `temperature_unit` 中的最小温度。                                         |
| precision               | `float`                              | 根据 `temperature_unit`               | 系统中温度的精度。默认为摄氏度的十分之一，其他情况为整数。               |
| preset_mode             | <code>str &#124; None</code>        | **由 SUPPORT_PRESET_MODE 要求**       | 当前活动预设。                                                            |
| preset_modes            | <code>list[str] &#124; None</code>  | **由 SUPPORT_PRESET_MODE 要求**       | 可用的预设。                                                              |
| swing_mode              | <code>str &#124; None</code>        | **由 SUPPORT_SWING_MODE 要求**        | 摆动设置。                                                                |
| swing_modes             | <code>list[str] &#124; None</code>  | **由 SUPPORT_SWING_MODE 要求**        | 返回可用摆动模式列表，若实现了水平摆动，则仅有垂直模式。                  |
| swing_horizontal_mode    | <code>str &#124; None</code>        | **由 SUPPORT_SWING_HORIZONTAL_MODE 要求** | 水平摆动设置。                                                           |
| swing_horizontal_modes   | <code>list[str] &#124; None</code>  | **由 SUPPORT_SWING_HORIZONTAL_MODE 要求** | 返回可用的水平摆动模式列表。                                              |
| target_humidity         | <code>float &#124; None</code>      | `None`                                | 设备试图达到的目标湿度。                                                  |
| target_temperature      | <code>float &#124; None</code>      | `None`                                | 目前设置要达到的目标温度。                                              |
| target_temperature_high | <code>float &#124; None</code>      | **由 TARGET_TEMPERATURE_RANGE 要求**   | 目标温度的上限。                                                         |
| target_temperature_low  | <code>float &#124; None</code>      | **由 TARGET_TEMPERATURE_RANGE 要求**   | 目标温度的下限。                                                         |
| target_temperature_step | <code>float &#124; None</code>      | `None`                                | 支持的目标温度可以增加或减少的步长。                                      |
| temperature_unit        | <code>str</code>                     | **必需**                             | 系统的温度测量单位（`TEMP_CELSIUS` 或 `TEMP_FAHRENHEIT`）。                |

### HVAC 模式

您只能使用 `HVACMode` 所提供的内置 HVAC 模式。如果想要其他模式，可以添加预设。

| 名称                 | 描述                                                       |
| -------------------- | ---------------------------------------------------------- |
| `HVACMode.OFF`       | 设备已关闭。                                             |
| `HVACMode.HEAT`      | 设备设置为加热到目标温度。                                 |
| `HVACMode.COOL`      | 设备设置为冷却到目标温度。                                 |
| `HVACMode.HEAT_COOL` | 设备设置为加热/冷却到目标温度范围。                       |
| `HVACMode.AUTO`      | 设备设置为定时、学习行为、人工智能。                       |
| `HVACMode.DRY`       | 设备设置为干燥/除湿模式。                                   |
| `HVACMode.FAN_ONLY`  | 设备仅开启风扇。没有加热或冷却操作。                       |

### HVAC 动作

HVAC 动作描述当前的动作。这与模式不同，因为如果设备设置为加热，且目标温度已经达到，设备将不再主动加热。只能使用由 `HVACAction` 枚举提供的内置 HVAC 动作。

| 名称                    | 描述                   |
| ----------------------- | ----------------------- |
| `HVACAction.OFF`        | 设备已关闭。           |
| `HVACAction.PREHEATING` | 设备正在预热。         |
| `HVACAction.HEATING`    | 设备正在加热。         |
| `HVACAction.COOLING`    | 设备正在冷却。         |
| `HVACAction.DRYING`     | 设备正在干燥。         |
| `HVACAction.FAN`        | 设备启用了风扇。       |
| `HVACAction.IDLE`       | 设备处于闲置状态。     |
| `HVACAction.DEFROSTING` | 设备正在除霜。         |

### 预设

设备可以有多个不同的预设，可能想要向用户展示。例如 "离家" 或 "节能"。有一些内置预设会提供翻译，但您也可以添加自定义预设。

| 名称       | 描述                                           |
| ---------- | ----------------------------------------------- |
| `NONE`     | 没有激活预设                                   |
| `ECO`      | 设备正在运行节能模式                           |
| `AWAY`     | 设备处于离家模式                               |
| `BOOST`    | 设备开启所有阀门                               |
| `COMFORT`  | 设备处于舒适模式                               |
| `HOME`     | 设备处于家中模式                               |
| `SLEEP`    | 设备已准备好进入睡眠状态                       |
| `ACTIVITY` | 设备正在响应活动（例如，运动传感器）           |

### 风扇模式

设备的风扇可以有不同的状态。有一些内置风扇模式，但您也可以使用自定义风扇模式。

| 名称          |
| ------------- |
| `FAN_ON`      |
| `FAN_OFF`     |
| `FAN_AUTO`    |
| `FAN_LOW`     |
| `FAN_MEDIUM`  |
| `FAN_HIGH`    |
| `FAN_MIDDLE`  |
| `FAN_FOCUS`   |
| `FAN_DIFFUSE` |

### 摆动模式

设备风扇可以有不同的摆动模式，想要让用户知道/控制。

:::note

对于没有垂直和水平摆动独立控制的集成，所有可能的选项都应在 `swing_modes` 中列出，否则 `swing_modes` 提供垂直支持，`swing_horizontal_modes` 应提供水平支持。

:::

| 名称               | 描述                                         |
| ------------------ | --------------------------------------------- |
| `SWING_OFF`        | 风扇未摆动。                                 |
| `SWING_ON`         | 风扇正在摆动。                               |
| `SWING_VERTICAL`   | 风扇正在垂直摆动。                           |
| `SWING_HORIZONTAL` | 风扇正在水平摆动。                           |
| `SWING_BOTH`       | 风扇同时进行水平和垂直摆动。                 |

### 摆动水平模式

设备风扇可以有不同的水平摆动模式，想要让用户知道/控制。

:::note

只有在集成具有独立的垂直和水平摆动控制时，才应实现此功能。在这种情况下，`swing_modes` 属性将提供垂直支持，而 `swing_horizontal_modes` 将提供水平支持。

:::

| 名称               | 描述                                         |
| ------------------ | --------------------------------------------- |
| `SWING_OFF`        | 风扇未摆动。                                 |
| `SWING_ON`         | 风扇正在摆动。                               |

## 支持的功能

支持的功能通过使用 `ClimateEntityFeature` 枚举中的值定义，并使用按位或（`|`）操作符组合。

| 值                      | 描述                                                                                        |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| `TARGET_TEMPERATURE`       | 设备支持目标温度。                                                                            |
| `TARGET_TEMPERATURE_RANGE` | 设备支持范围目标温度。用于 HVAC 模式 `heat_cool` 和 `auto`                                 |
| `TARGET_HUMIDITY`          | 设备支持目标湿度。                                                                            |
| `FAN_MODE`                 | 设备支持风扇模式。                                                                          |
| `PRESET_MODE`              | 设备支持预设。                                                                                |
| `SWING_MODE`               | 设备支持摆动模式。                                                                            |
| `SWING_HORIZONTAL_MODE`    | 设备支持水平摆动模式。                                                                        |
| `TURN_ON`                 | 设备支持开启。                                                                               |
| `TURN_OFF`                 | 设备支持关闭。                                                                               |

## 方法

### 设置 HVAC 模式

```python
class MyClimateEntity(ClimateEntity):
    # 实现以下任一方法。

    def set_hvac_mode(self, hvac_mode):
        """设置新的目标 HVAC 模式。"""

    async def async_set_hvac_mode(self, hvac_mode):
        """设置新的目标 HVAC 模式。"""
```

### 开启

```python
class MyClimateEntity(ClimateEntity):
    # 实现以下任一方法。
    # `turn_on` 方法应将 `hvac_mode` 设置为任何其他
    # 除了 `HVACMode.OFF`，通过服务操作处理程序乐观地设置
    # 或通过下一个状态更新

    def turn_on(self):
        """开启实体。"""

    async def async_turn_on(self):
        """开启实体。"""
```

### 关闭

```python
class MyClimateEntity(ClimateEntity):
    # 实现以下任一方法。
    # `turn_off` 方法应将 `hvac_mode` 设置为 `HVACMode.OFF`，通过
    # 服务操作处理程序乐观地设置，或通过下一个状态更新

    def turn_off(self):
        """关闭实体。"""

    async def async_turn_off(self):
        """关闭实体。"""
```

### 切换

```python
class MyClimateEntity(ClimateEntity):
    # 实现 `toggle` 方法不是强制性的，因为基类实现将根据当前 HVAC 模式
    # 调用 `turn_on`/`turn_off`。

    # 如果实现，`toggle` 方法应通过服务操作处理程序乐观地设置 `hvac_mode` 为正确的 `HVACMode`
    # 或通过下一个状态更新。

    def toggle(self):
        """切换实体。"""

    async def async_toggle(self):
        """切换实体。"""
```

### 设置预设模式

```python
class MyClimateEntity(ClimateEntity):
    # 实现以下任一方法。

    def set_preset_mode(self, preset_mode):
        """设置新的目标预设模式。"""

    async def async_set_preset_mode(self, preset_mode):
        """设置新的目标预设模式。"""
```

### 设置风扇模式

```python
class MyClimateEntity(ClimateEntity):
    # 实现以下任一方法。

    def set_fan_mode(self, fan_mode):
        """设置新的目标风扇模式。"""

    async def async_set_fan_mode(self, fan_mode):
        """设置新的目标风扇模式。"""
```

### 设置湿度

```python
class MyClimateEntity(ClimateEntity):
    # 实现以下任一方法。

    def set_humidity(self, humidity):
        """设置新的目标湿度。"""

    async def async_set_humidity(self, humidity):
        """设置新的目标湿度。"""
```

### 设置摆动模式

```python
class MyClimateEntity(ClimateEntity):
    # 实现以下任一方法。

    def set_swing_mode(self, swing_mode):
        """设置新的目标摆动操作。"""

    async def async_set_swing_mode(self, swing_mode):
        """设置新的目标摆动操作。"""
```

### 设置水平摆动模式

```python
class MyClimateEntity(ClimateEntity):
    # 实现以下任一方法。

    def set_swing_horizontal_mode(self, swing_mode):
        """设置新的目标水平摆动操作。"""

    async def async_set_swing_horizontal_mode(self, swing_mode):
        """设置新的目标水平摆动操作。"""
```

### 设置温度

:::note
`ClimateEntity` 具有内置验证，确保 `target_temperature_low` 参数小于或等于 `target_temperature_high` 参数。因此，集成无需在其自己的实现中验证此项。
:::

```python
class MyClimateEntity(ClimateEntity):
    # 实现以下任一方法。

    def set_temperature(self, **kwargs):
        """设置新的目标温度。"""

    async def async_set_temperature(self, **kwargs):
        """设置新的目标温度。"""