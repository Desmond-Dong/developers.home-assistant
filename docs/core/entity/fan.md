---
title: 风扇实体
sidebar_label: 风扇
---

风扇实体是一个控制风扇不同方向（如速度、方向和摆动）的设备。从 ['homeassistant.components.fan.FanEntity'](https://github.com/home-assistant/core/blob/dev/homeassistant/components/fan/__init__.py) 派生实体平台。

## 属性

:::tip
属性应始终只从内存返回信息，而不执行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认 | 描述
| ---- | ---- | ------- | -----------
| current_direction  | <code>str &#124; None</code>       | `None` | 风扇的当前方向。                                                                       |
| is_on              | <code>bool &#124; None</code>      | `None` | 如果风扇开启则为真。                                                                                  |
| oscillating        | <code>bool &#124; None</code>       | `None` | 如果风扇正在摆动则为真。                                                                         |
| percentage         | <code>int &#124; None</code>       | `0`    | 当前的速度百分比。必须是介于 0（关闭）和 100 之间的值。                                  |
| preset_mode        | <code>str &#124; None</code>       | `None` | 当前的预设模式。如果没有激活的预设，则为 `None`。          |
| preset_modes       | <code>list[str] &#124; None</code> | `None` | 支持的预设模式列表。这是一个任意的字符串列表，不应包含任何速度。 |
| speed_count        | `int`                              | 100    | 风扇支持的速度数量。                                                                  |

### 预设模式

风扇可以有预设模式，自动控制速度百分比或其他功能。常见的例子包括 `auto`、`smart`、`whoosh`、`eco` 和 `breeze`。如果没有设置预设模式，则 `preset_mode` 属性必须设置为 `None`。

预设模式不应包括命名（手动）速度设置，因为这些应表示为百分比。

手动设置速度必须禁用任何已设置的预设模式。如果可以在不禁用预设模式的情况下手动设置速度百分比，请创建一个开关或服务动作来表示该模式。

## 支持的功能

支持的功能通过使用 `FanEntityFeature` 枚举中的值来定义，并使用按位或（`|`）操作符进行组合。

| 值           | 描述                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `DIRECTION`   | 风扇支持改变方向。                                 |
| `OSCILLATE`   | 风扇支持摆动。                                            |
| `PRESET_MODE` | 风扇支持预设模式。                                           |
| `SET_SPEED`   | 风扇支持设置速度百分比和可选的预设模式。 |
| `TURN_OFF`    | 风扇支持关闭。                                                                                |
| `TURN_ON`     | 风扇支持开启。                                                                                 |

## 方法

### 设置方向

仅在设置了 `FanEntityFeature.DIRECTION` 标记时实现此方法。

```python
class FanEntity(ToggleEntity):
    # 实现这些方法中的一个。

    def set_direction(self, direction: str) -> None:
        """设置风扇的方向。"""

    async def async_set_direction(self, direction: str) -> None:
        """设置风扇的方向。"""
```

### 设置预设模式

仅在设置了 `FanEntityFeature.PRESET_MODE` 标记时实现此方法。

```python
class FanEntity(ToggleEntity):
    # 实现这些方法中的一个。

    def set_preset_mode(self, preset_mode: str) -> None:
        """设置风扇的预设模式。"""

    async def async_set_preset_mode(self, preset_mode: str) -> None:
        """设置风扇的预设模式。"""
```

### 设置速度百分比

仅在设置了 `FanEntityFeature.SET_SPEED` 标记时实现此方法。

```python
class FanEntity(ToggleEntity):
    # 实现这些方法中的一个。

    def set_percentage(self, percentage: int) -> None:
        """设置风扇的速度百分比。"""

    async def async_set_percentage(self, percentage: int) -> None:
        """设置风扇的速度百分比。"""
```

:::tip 转换速度

Home Assistant 包含了一个用于转换速度的工具。

如果设备有一个命名速度的列表：

```python
from homeassistant.util.percentage import ordered_list_item_to_percentage, percentage_to_ordered_list_item

ORDERED_NAMED_FAN_SPEEDS = ["one", "two", "three", "four", "five", "six"]  # off 不包括在内

percentage = ordered_list_item_to_percentage(ORDERED_NAMED_FAN_SPEEDS, "three")

named_speed = percentage_to_ordered_list_item(ORDERED_NAMED_FAN_SPEEDS, 23)

...

    @property
    def percentage(self) -> Optional[int]:
        """返回当前速度百分比。"""
        return ordered_list_item_to_percentage(ORDERED_NAMED_FAN_SPEEDS, current_speed)

    @property
    def speed_count(self) -> int:
        """返回风扇支持的速度数量。"""
        return len(ORDERED_NAMED_FAN_SPEEDS)
```

如果设备有一个数值范围的速度：

```python
from homeassistant.util.percentage import ranged_value_to_percentage, percentage_to_ranged_value
from homeassistant.util.scaling import int_states_in_range

SPEED_RANGE = (1, 255)  # off 不包括在内

percentage = ranged_value_to_percentage(SPEED_RANGE, 127)

value_in_range = math.ceil(percentage_to_ranged_value(SPEED_RANGE, 50))

...

    @property
    def percentage(self) -> Optional[int]:
        """返回当前速度百分比。"""
        return ranged_value_to_percentage(SPEED_RANGE, current_speed)

    @property
    def speed_count(self) -> int:
        """返回风扇支持的速度数量。"""
        return int_states_in_range(SPEED_RANGE)
```
:::

### 打开

仅在设置了 `FanEntityFeature.TURN_ON` 标记时实现此方法。

```python
class FanEntity(ToggleEntity):
    # 实现这些方法中的一个。

    def turn_on(self, speed: Optional[str] = None, percentage: Optional[int] = None, preset_mode: Optional[str] = None, **kwargs: Any) -> None:
        """打开风扇。"""

    async def async_turn_on(self, speed: Optional[str] = None, percentage: Optional[int] = None, preset_mode: Optional[str] = None, **kwargs: Any) -> None:
        """打开风扇。"""
```

:::tip `speed` 已被弃用。

对于新的集成，`speed` 不应被实现，仅应使用 `percentage` 和 `preset_mode`。

:::

### 关闭

仅在设置了 `FanEntityFeature.TURN_OFF` 标记时实现此方法。

```python
class FanEntity(ToggleEntity):
    # 实现这些方法中的一个。

    def turn_off(self, **kwargs: Any) -> None:
        """关闭风扇。"""

    async def async_turn_off(self, **kwargs: Any) -> None:
        """关闭风扇。"""
```

### 切换

可选。如果未实现，则默认为使用 is_on 属性检查调用哪个方法。
仅在设置了 `FanEntityFeature.TURN_ON` 和 `FanEntityFeature.TURN_OFF` 标记时实现此方法。

```python
class FanEntity(ToggleEntity):
    # 实现这些方法中的一个。

    def toggle(self, **kwargs: Any) -> None:
        """切换风扇。"""

    async def async_toggle(self, **kwargs: Any) -> None:
        """切换风扇。"""
```

### 摆动

仅在设置了 `FanEntityFeature.OSCILLATE` 标记时实现此方法。

```python
class FanEntity(ToggleEntity):
    # 实现这些方法中的一个。

    def oscillate(self, oscillating: bool) -> None:
        """让风扇摆动。"""

    async def async_oscillate(self, oscillating: bool) -> None:
        """让风扇摆动。"""