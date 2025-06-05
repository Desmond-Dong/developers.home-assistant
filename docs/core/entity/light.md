---
title: 灯光实体
sidebar_label: 灯光
---


灯光实体控制光源的亮度、色调和饱和度颜色值、白色值、色温和效果。从 [`homeassistant.components.light.LightEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/light/__init__.py) 派生平台实体。

## 属性

| 名称                     | 类型                                       | 默认   | 描述
|------------------------|------------------------------------------|-------|----
| brightness             | <code>int &#124; None</code>            | `None` | 此灯光的亮度，范围在 1..255 之间
| color_mode             | <code>ColorMode &#124; None</code>      | `None` | 灯光的颜色模式。返回的颜色模式必须存在于 `supported_color_modes` 属性中，除非灯光正在渲染效果。
| color_temp_kelvin      | <code>int &#124; None</code>            | `None` | CT 颜色值，以开尔文为单位。此属性将会在灯光的颜色模式设置为 `ColorMode.COLOR_TEMP` 时复制到灯光的状态属性中，否则将被忽略。
| effect                 | <code>str &#124; None</code>            | `None` | 当前效果。如果灯光支持效果且当前没有渲染效果，则应为 `EFFECT_OFF`。
| effect_list            | <code>list[str] &#124; None</code>      | `None` | 支持的效果列表。
| hs_color               | <code>tuple[float, float] &#124; None</code> | `None` | 色调和饱和度颜色值 (float, float)。此属性将在灯光的颜色模式设置为 `ColorMode.HS` 时复制到灯光的状态属性中，否则将被忽略。
| is_on                  | <code>bool &#124; None</code>           | `None` | 灯光实体是否打开。
| max_color_temp_kelvin  | <code>int &#124; None</code>            | `None` | 此灯光支持的最低色温（开尔文）。
| min_color_temp_kelvin  | <code>int &#124; None</code>            | `None` | 此灯光支持的最高色温（开尔文）。
| rgb_color              | <code>tuple[int, int, int] &#124; None</code> | `None` | RGB 颜色值 (int, int, int)。此属性将在灯光的颜色模式设置为 `ColorMode.RGB` 时复制到灯光的状态属性中，否则将被忽略。
| rgbw_color             | <code>tuple[int, int, int, int] &#124; None</code> | `None` | RGBW 颜色值 (int, int, int, int)。此属性将在灯光的颜色模式设置为 `ColorMode.RGBW` 时复制到灯光的状态属性中，否则将被忽略。
| rgbww_color            | <code>tuple[int, int, int, int, int] &#124; None</code> | `None` | RGBWW 颜色值 (int, int, int, int, int)。此属性将在灯光的颜色模式设置为 `ColorMode.RGBWW` 时复制到灯光的状态属性中，否则将被忽略。
| supported_color_modes  | <code>set[ColorMode] &#124; None</code> | `None` | 标志支持的颜色模式。
| xy_color               | <code>tuple[float, float] &#124; None</code> | `None` | XY 颜色值 (float, float)。此属性将在灯光的颜色模式设置为 `ColorMode.XY` 时复制到灯光的状态属性中，否则将被忽略。

## 颜色模式

新的集成必须实现 `color_mode` 和 `supported_color_modes`。如果一个集成升级以支持颜色模式，则应实现 `color_mode` 和 `supported_color_modes`。

支持的颜色模式通过使用 `ColorMode` 枚举中的值来定义。

如果灯光没有实现 `supported_color_modes`，`LightEntity` 将根据 `supported_features` 属性中的过时标志尝试推测：

 - 从一个空集开始
 - 如果设置了 `SUPPORT_COLOR_TEMP`，则添加 `ColorMode.COLOR_TEMP`
 - 如果设置了 `SUPPORT_COLOR`，则添加 `ColorMode.HS`
 - 如果设置了 `SUPPORT_WHITE_VALUE`，则添加 `ColorMode.RGBW`
 - 如果设置了 `SUPPORT_BRIGHTNESS` 并且尚未添加任何颜色模式，则添加 `ColorMode.BRIGHTNESS`
 - 如果尚未添加任何颜色模式，则添加 `ColorMode.ONOFF`

如果灯光没有实现 `color_mode`，`LightEntity` 将根据哪些属性被设置和哪些是 `None` 来尝试推测：

- 如果 `supported_color_modes` 包含 `ColorMode.RGBW` 并且 `white_value` 和 `hs_color` 都不为 None：`ColorMode.RGBW`
- 否则如果 `supported_color_modes` 包含 `ColorMode.HS` 并且 `hs_color` 不为 None：`ColorMode.HS`
- 否则如果 `supported_color_modes` 包含 `ColorMode.COLOR_TEMP` 并且 `color_temp` 不为 None：`ColorMode.COLOR_TEMP`
- 否则如果 `supported_color_modes` 包含 `ColorMode.BRIGHTNESS` 并且 `brightness` 不为 None：`ColorMode.BRIGHTNESS`
- 否则如果 `supported_color_modes` 包含 `ColorMode.ONOFF`：`ColorMode.ONOFF`
- 否则：ColorMode.UNKNOWN

| 值                          | 描述
|---------------------------|-----------------------
| `ColorMode.UNKNOWN`       | 灯光的颜色模式未知。
| `ColorMode.ONOFF`        | 灯光可以开或关。如果灯光支持此模式，则此模式必须是唯一的支持模式。
| `ColorMode.BRIGHTNESS`   | 灯光可以调光。如果灯光支持此模式，则此模式必须是唯一的支持模式。
| `ColorMode.COLOR_TEMP`   | 灯光可以调光，其色温存在于状态中。
| `ColorMode.HS`           | 灯光可以调光且其颜色可以调整。灯光的亮度可以通过 `brightness` 参数设置，并通过 `brightness` 属性读取。灯光的颜色可以通过 `hs_color` 参数设置，并通过 `hs_color` 属性读取。`hs_color` 是一个 (h, s) 元组（没有亮度）。
| `ColorMode.RGB`          | 灯光可以调光且其颜色可以调整。灯光的亮度可以通过 `brightness` 参数设置，并通过 `brightness` 属性读取。灯光的颜色可以通过 `rgb_color` 参数设置，并通过 `rgb_color` 属性读取。`rgb_color` 是一个 (r, g, b) 元组（未根据亮度进行归一化）。
| `ColorMode.RGBW`         | 灯光可以调光且其颜色可以调整。灯光的亮度可以通过 `brightness` 参数设置，并通过 `brightness` 属性读取。灯光的颜色可以通过 `rgbw_color` 参数设置，并通过 `rgbw_color` 属性读取。`rgbw_color` 是一个 (r, g, b, w) 元组（未根据亮度进行归一化）。
| `ColorMode.RGBWW`        | 灯光可以调光且其颜色可以调整。灯光的亮度可以通过 `brightness` 参数设置，并通过 `brightness` 属性读取。灯光的颜色可以通过 `rgbww_color` 参数设置，并通过 `rgbww_color` 属性读取。`rgbww_color` 是一个 (r, g, b, cw, ww) 元组（未根据亮度进行归一化）。
| `ColorMode.WHITE`        | 灯光可以调光且其颜色可以调整。此外，灯光可以设置为白色模式。灯光的亮度可以通过 `brightness` 参数设置，并通过 `brightness` 属性读取。灯光可以通过使用带有所需亮度作为值的 `white` 参数设置为白色模式。请注意，没有 `white` 属性。如果在服务动作调用中同时存在 `brightness` 和 `white`，则 `white` 参数将被更新为 `brightness` 的值。如果此模式被支持，灯光 *必须* 还支持至少一个 `ColorMode.HS`、`ColorMode.RGB`、`ColorMode.RGBW`、`ColorMode.RGBWW` 或 `ColorMode.XY`，并且 *不能* 支持 `ColorMode.COLOR_TEMP`。
| `ColorMode.XY`           | 灯光可以调光且其颜色可以调整。灯光的亮度可以通过 `brightness` 参数设置，并通过 `brightness` 属性读取。灯光的颜色可以通过 `xy_color` 参数设置，并通过 `xy_color` 属性读取。`xy_color` 是一个 (x, y) 元组。

请注意，在颜色模式 `ColorMode.RGB`、`ColorMode.RGBW` 和 `ColorMode.RGBWW` 中，灯光的 `brightness` 属性和颜色中都有亮度信息。例如，如果灯光的亮度为 128，灯光的颜色为 (192, 64, 32)，那么灯光的整体亮度为：128/255 * max(192, 64, 32)/255 = 38%。

如果灯光处于 `ColorMode.HS`、`ColorMode.RGB` 或 `ColorMode.XY` 模式，灯光的状态属性将包含灯光的颜色，表示为 `hs`、`rgb` 和 `xy` 颜色格式。请注意，当灯光处于 `ColorMode.RGB` 模式时，`hs` 和 `xy` 状态属性仅保留 `rgb` 颜色的色度，因为 `hs` 和 `xy` 对不包含亮度信息。

如果灯光处于 `ColorMode.RGBW` 或 `ColorMode.RGBWW` 模式，灯光的状态属性将包含灯光的颜色，表示为 `hs`、`rgb` 和 `xy` 颜色格式。颜色转换是通过将白色通道添加到颜色中来进行近似。

### 白色颜色模式

有两种白色颜色模式，`ColorMode.COLOR_TEMP` 和 `ColorMode.WHITE`。这两种模式之间的区别在于 `ColorMode.WHITE` 不允许调节色温，而 `ColorMode.COLOR_TEMP` 允许调节色温。

可调色温的灯通常由至少两组 LED 组成，具有不同的色温，通常一组是暖白色 LED，另一组是冷白色 LED。
不可调节色温的灯通常只有一组白色 LED。

### 渲染效果时的颜色模式

在渲染效果时，`color_mode` 应根据效果支持的调整进行设置。如果效果不支持任何调整，则 `color_mode` 应设置为 `ColorMode.ONOFF`。
如果效果允许调节亮度，则 `color_mode` 应设置为 `ColorMode.BRIGHTNESS`。

在渲染效果时，可以将 `color_mode` 设置为比 `supported_color_mode` 属性指示的颜色模式更具限制性的模式：
 - 支持颜色的灯在受效果控制时可以将 `color_mode` 设置为 `ColorMode.ONOFF` 或 `ColorMode.BRIGHTNESS`
 - 支持亮度的灯在受效果控制时可以将 `color_mode` 设置为 `ColorMode.ONOFF`

## 支持的功能

支持的功能通过使用 `LightEntityFeature` 枚举中的值定义，并使用按位或 (`|`) 操作符组合。

| 值            | 描述                                                      |
|---------------|----------------------------------------------------------|
| `EFFECT`      | 控制光源显示的效果                                        |
| `FLASH`       | 控制光源显示闪烁的持续时间                              |
| `TRANSITION`  | 控制颜色和效果之间的过渡持续时间                        |

## 方法

### 打开灯设备

```python
class MyLightEntity(LightEntity):
    def turn_on(self, **kwargs):
        """打开设备。"""

    async def async_turn_on(self, **kwargs):
        """打开设备。"""
```

请注意，`async_turn_on` 方法没有传递 `color_mode`，而是只允许单个颜色属性。
保证集成在 `turn_on` 调用中只接收单个颜色属性，这由根据灯光的 `supported_color_modes` 属性确定。如果灯光不支持相应的颜色模式，则在调用实体的 `async_turn_on` 方法之前，服务动作调用中的颜色将被转换：

| 颜色类型      | 转换
|---------------|-----------------------
| color_temp    | 如果不被支持将从服务动作调用中删除，并转换为 `hs_color`、`rgb_color`、`rgbw_color`、`rgbww_color` 或 `xy_color`（如果灯光支持）。
| hs_color      | 如果不被支持将从服务动作调用中删除，并转换为 `rgb_color`、`rgbw_color`、`rgbww_color` 或 `xy_color`（如果灯光支持）。
| rgb_color     | 如果不被支持将从服务动作调用中删除，并转换为 `rgbw_color`、`rgbww_color`、`hs_color` 或 `xy_color`（如果灯光支持）。
| rgbw_color    | 如果不被支持将从服务动作调用中删除。
| rgbww_color   | 如果不被支持将从服务动作调用中删除。
| xy_color      | 如果不被支持将从服务动作调用中删除，并转换为 `hs_color`、`rgb_color`、`rgbw_color` 或 `rgbww_color`（如果灯光支持）。

:::tip 亮度缩放

Home Assistant 包含一个缩放亮度的工具。

如果灯光支持亮度，有时需要缩放亮度值：

```python
from homeassistant.util.color import value_to_brightness

BRIGHTNESS_SCALE = (1, 1023)

...

    @property
    def brightness(self) -> Optional[int]:
        """返回当前亮度。"""
        return value_to_brightness(BRIGHTNESS_SCALE, self._device.brightness)

```

要将亮度缩放到设备范围：

```python
from homeassistant.util.percentage import percentage_to_ranged_value
BRIGHTNESS_SCALE = (1, 1023)

...

class MyLightEntity(LightEntity):
    async def async_turn_on(self, **kwargs) -> None:
        """打开设备。"""

        ...

        value_in_range = math.ceil(percentage_to_ranged_value(BRIGHTNESS_SCALE, kwargs[ATTR_BRIGHTNESS]))

:::

### 关闭灯设备

```python
class MyLightEntity(LightEntity):
    def turn_off(self, **kwargs):
        """关闭设备。"""

    async def async_turn_off(self, **kwargs):
        """关闭设备。"""