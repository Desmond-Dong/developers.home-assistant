---
title: 热水器实体
sidebar_label: 热水器
---

从 [`homeassistant.components.water_heater.WaterHeaterEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/water_heater/__init__.py) 派生实体平台

## 属性

:::tip
属性应始终仅返回内存中的信息，而不进行输入/输出（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称                   | 类型        | 默认值      | 描述
| --------------------- | ----------- | --------- | -----------
| `min_temp`            | `float`     | 110°F     | 可设定的最低温度。
| `max_temp`            | `float`     | 140°F     | 可设定的最高温度。
| `current_temperature` | `float`     | `None`    | 当前温度。
| `target_temperature`  | `float`     | `None`    | 我们试图达到的温度。
| `target_temperature_high` | `float` | `None`    | 我们试图达到的温度的上限。
| `target_temperature_low` | `float`  | `None`    | 我们试图达到的温度的下限。
| `target_temperature_step` | `float`  | `None`    | 目标温度可以增加或减少的支持步长。
| `temperature_unit`    | `str`       | `NotImplementedError` | `TEMP_CELSIUS`、`TEMP_FAHRENHEIT` 或 `TEMP_KELVIN` 之一。
| `current_operation`   | `string`    | `None`    | 当前操作模式。
| `operation_list`      | `List[str]` | `None`    | 可能的操作模式列表。
| `supported_features`  | `List[str]` | `NotImplementedError` | 支持的功能列表。
| `is_away_mode_on`     | `bool`      | `None`    | 现状的外出模式。

允许的操作模式是基本组件中指定的状态，水热器组件的实现不能有所不同。

属性必须遵循 `temperature_unit` 中定义的单位。

## 状态

| 状态         | 描述
| ---------- | -----------
| `STATE_ECO` | 节能模式，提供节能和快速加热。
| `STATE_ELECTRIC` | 仅电模式，使用最多的能源。
| `STATE_PERFORMANCE` | 高性能模式。
| `STATE_HIGH_DEMAND` | 满足当热水器规模不足时的高需求。
| `STATE_HEAT_PUMP` | 加热最慢，但使用较少能源。
| `STATE_GAS` | 仅燃气模式，使用最多的能源。
| `STATE_OFF` | 热水器关闭。

## 支持的功能

支持的功能通过使用 `WaterHeaterEntityFeature` 枚举中的值定义，并使用按位或（`|`）运算符组合。

| 值                   | 描述                       |
| -------------------- | ------------------------- |
| `TARGET_TEMPERATURE` | 可以设置温度               |
| `OPERATION_MODE`     | 可以设置操作模式           |
| `AWAY_MODE`          | 可以设置外出模式           |
| `ON_OFF`             | 可以打开或关闭             |

## 方法

### `set_temperature` 或 `async_set_temperature`

设置热水器加热水的温度。

### `set_operation_mode` 或 `async_set_operation_mode`

设置热水器的操作模式。必须出现在操作列表中。

### `turn_away_mode_on` 或 `async_turn_away_mode_on`

将热水器设置为外出模式。

### `turn_away_mode_off` 或 `async_turn_away_mode_off`

将热水器恢复到之前的操作模式。关闭外出模式。

### `turn_on` 或 `async_turn_on`

打开热水器。

### `turn_off` 或 `async_turn_off`

关闭热水器。