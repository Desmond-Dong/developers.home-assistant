---
title: 吸尘器实体
sidebar_label: 吸尘器
---

从 [`homeassistant.components.vacuum.StateVacuumEntity`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/components/vacuum/__init__.py) 派生实体平台

## 属性

:::tip
属性应该始终只从内存中返回信息，而不进行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 以获取数据。
:::

:::note
`VacuumEntity` 已被弃用，并将在将来的版本中移除。请使用或迁移到 `StateVacuumEntity`
:::

| 名称 | 类型 | 默认 | 描述
| ---- | ---- | ------- | -----------
| battery_icon | 字符串 | 函数 | 在 UI 中显示的电池图标。
| battery_level | 整数 | `none` | 当前电池电量。
| fan_speed | 字符串 | `none` | 当前风扇速度。
| fan_speed_list | 列表 | `NotImplementedError()` | 可用风扇速度的列表。
| name | 字符串 | **必需** | 实体的名称。
| activity | VacuumActivity | **必需** | 返回在状态部分列出的状态之一。

## 状态

设置状态应返回 `activity` 属性中的 `VacuumActivity` 枚举。

| 值 | 描述
| ----- | -----------
| `CLEANING` | 吸尘器正在清洁中。
| `DOCKED` | 吸尘器当前已停靠，假定停靠也可以意味着充电。
| `IDLE` | 吸尘器未暂停，未停靠且没有任何错误。
| `PAUSED` | 吸尘器正在清洁但暂停，没有返回到停靠点。
| `RETURNING` | 吸尘器清洁完成，正在返回停靠点，但尚未停靠。
| `ERROR` | 吸尘器在清洁时遇到错误。

## 支持的功能

支持的功能由 `VacuumEntityFeature` 枚举中的值定义，并使用按位或 (`|`) 运算符组合。
请注意，所有从 `homeassistant.components.vacuum.StateVacuumEntity` 派生的吸尘器实体平台必须设置 `VacuumEntityFeature.STATE` 标志。

| 值            | 描述                                              |
| -------------- | --------------------------------------------------- |
| `BATTERY`      | 吸尘器支持获取电池状态。                           |
| `CLEAN_SPOT`   | 吸尘器支持点清洁。                                |
| `FAN_SPEED`    | 吸尘器支持设置风扇速度。                          |
| `LOCATE`       | 吸尘器支持定位。                                  |
| `MAP`          | 吸尘器支持获取其地图。                            |
| `PAUSE`        | 吸尘器支持暂停命令。                              |
| `RETURN_HOME`  | 吸尘器支持返回停靠点命令。                        |
| `SEND_COMMAND` | 吸尘器支持向吸尘器发送命令。                      |
| `START`        | 吸尘器支持开始命令。                              |
| `STATE`        | 吸尘器支持返回其状态。                            |
| `STOP`         | 吸尘器支持停止命令。                              |

## 方法

### `clean_spot` 或 `async_clean_spot`

执行点清洁。

### `locate` 或 `async_locate`

定位吸尘器。

### `pause` 或 `async_pause`

暂停清洁任务。

### `return_to_base` 或 `async_return_to_base`

设置吸尘器返回停靠点。

### `send_command` 或 `async_send_command`

向吸尘器发送命令。

### `set_fan_speed` 或 `async_set_fan_speed`

设置风扇速度。

### `start` 或 `async_start`

启动或恢复清洁任务。

### `stop` 或 `async_stop`

停止吸尘器，不返回到基站。