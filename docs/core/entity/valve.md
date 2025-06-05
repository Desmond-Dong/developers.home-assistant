---
title: 阀门实体
sidebar_label: 阀门
---

阀门实体控制诸如家中的水阀或燃气阀之类的阀门设备。从 [`homeassistant.components.valve.ValveEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/valve/__init__.py) 派生一个平台实体。

## 属性

:::tip
属性应始终仅从内存返回信息，而不执行 I/O（如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认值 | 描述
| ----------------------- | ---- | ------- | -----------
| current_valve_position | <code>int &#124; None</code> | `None` | 阀门的当前位置，0表示关闭，100表示完全打开。该属性是具有 `reports_position = True` 的阀门所必需的，用于确定状态。
| is_closed | <code>bool &#124; None</code> | `None` | 阀门是否关闭。用于确定不报告位置的阀门的 `state`。
| is_closing | <code>bool &#124; None</code> | `None` | 阀门是否正在关闭。用于确定 `state`。
| is_opening | <code>bool &#124; None</code> | `None` | 阀门是否正在打开。用于确定 `state`。
| reports_position | <code>bool</code> | **必需** | 阀门是否知道其位置。

### 设备分类

| 常量 | 描述
|----------|-----------------------|
| `ValveDeviceClass.WATER` | 控制水阀。
| `ValveDeviceClass.GAS` | 控制燃气阀。

### 状态

状态通过设置其属性来定义。结果状态使用 `ValveState` 枚举返回以下成员之一。

| 值      | 描述                                                        |
|----------|--------------------------------------------------------------------|
| `OPENING`| 阀门正在打开以达到设定位置的过程。    |
| `OPEN`   | 阀门已达开的位置。                           |
| `CLOSING`| 阀门正在关闭以达到设定位置的过程。    |
| `CLOSED` | 阀门已达闭的位置。                         |

## 支持的功能

支持的功能通过在 `ValveEntityFeature` 枚举中使用值定义，并使用按位或 (`|`) 运算符组合。

| 值               | 描述                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| `OPEN`              | 阀门支持打开。                                                 |
| `CLOSE`             | 阀门支持关闭。                                                 |
| `SET_POSITION`      | 阀门支持移动到打开和关闭之间的特定位置。      |
| `STOP`              | 阀门支持停止当前操作（打开、关闭、设置位置）       |

## 方法

### 打开阀门

仅在标志 `SUPPORT_OPEN` 被设置时实现此方法。对于可以设置位置的阀门，此方法应保持未实现，仅需 `set_valve_position`。

```python
class MyValve(ValveEntity):
    # 实现这些方法之一。

    def open_valve(self) -> None:
        """打开阀门。"""

    async def async_open_valve(self) -> None:
        """打开阀门。"""
```

### 关闭阀门

仅在标志 `SUPPORT_CLOSE` 被设置时实现此方法。对于可以设置位置的阀门，此方法应保持未实现，仅需 `set_valve_position`。

```python
class MyValve(ValveEntity):
    # 实现这些方法之一。

    def close_valve(self) -> None:
        """关闭阀门。"""

    async def async_close_valve(self) -> None:
        """关闭阀门。"""
```

### 设置阀门位置

仅在标志 `SUPPORT_SET_POSITION` 被设置时实现此方法。此方法必须在可以设置位置的阀门中实现。

```python
class MyValve(ValveEntity):
    # 实现这些方法之一。

    def set_valve_position(self, position: int) -> None:
        """将阀门移动到特定位置。"""

    async def async_set_valve_position(self, position: int) -> None:
        """将阀门移动到特定位置。"""
```

### 停止阀门

仅在标志 `SUPPORT_STOP` 被设置时实现此方法。

```python
class MyValve(ValveEntity):
    # 实现这些方法之一。

    def stop_valve(self) -> None:
        """停止阀门。"""

    async def async_stop_valve(self) -> None:
        """停止阀门。"""