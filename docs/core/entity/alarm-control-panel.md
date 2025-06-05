---
title: 警报控制面板实体
sidebar_label: 警报控制面板
---

警报控制面板实体控制一个警报。 从 [`homeassistant.components.alarm_control_panel.AlarmControlPanelEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/alarm_control_panel/__init__.py) 派生平台实体。

## 属性

:::tip
属性应始终只返回来自内存的信息，而不进行 I/O（如网络请求）。 实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------- | -----------
| alarm_state | <code>AlarmControlPanelState &#124; None</code> | **必需** | 在 **states** 中列出的警报值之一。
| code_arm_required | bool | `True` | 是否需要代码进行臂膀操作。
| code_format | <code>CodeFormat &#124; None</code> | `None` | 在 **代码格式** 部分列出的状态之一。
| changed_by | <code>str &#124; None</code> | `None` | 最后触发的变更。

### 状态

设置状态应返回 `alarm_state` 属性中的 `AlarmControlPanelState` 的枚举值。

| 值 | 描述
| ----- | -----------
| `DISARMED` | 警报已解除(`off`)。
| `ARMED_HOME` | 警报处于家庭模式。
| `ARMED_AWAY` | 警报处于离开模式。
| `ARMED_NIGHT` | 警报处于夜间模式。
| `ARMED_VACATION` | 警报处于假期模式。
| `ARMED_CUSTOM_BYPASS` | 警报处于旁路模式。
| `PENDING` | 警报待定（指向 `triggered`）。
| `ARMING` | 正在设置警报。
| `DISARMING` | 正在解除警报。
| `TRIGGERED` | 警报已触发。

## 支持的功能

支持的功能通过使用 `AlarmControlPanelEntityFeature` 枚举中的值定义，并通过按位或（`|`）运算符组合。

| 常量 | 描述 |
|----------|--------------------------------------|
| `AlarmControlPanelEntityFeature.ARM_AWAY` | 警报支持在离开模式下设置。
| `AlarmControlPanelEntityFeature.ARM_CUSTOM_BYPASS` | 警报支持进行旁路设置。
| `AlarmControlPanelEntityFeature.ARM_HOME` | 警报支持在家庭模式下设置。
| `AlarmControlPanelEntityFeature.ARM_NIGHT` | 警报支持在夜间模式下设置。
| `AlarmControlPanelEntityFeature.ARM_VACATION` | 警报支持在假期模式下设置。
| `AlarmControlPanelEntityFeature.TRIGGER` | 警报可以被远程触发。

### 代码格式

支持的代码格式通过使用 `CodeFormat` 枚举中的值定义。

| 值 | 描述
| ----- | -----------
| `None` | 无需代码。
| `CodeFormat.NUMBER` | 代码为数字（在前端显示数字键盘）。
| `CodeFormat.TEXT` | 代码为字符串。

## 方法

### 警报解除

发送解除警报命令。

```python
class MyAlarm(AlarmControlPanelEntity):
    # 实现这些方法之一。

    def alarm_disarm(self, code: str | None = None) -> None:
        """发送解除警报命令。"""

    async def async_alarm_disarm(self, code: str | None = None) -> None:
        """发送解除警报命令。"""
```

### 警报设在家

发送在家设置命令。

```python
class MyAlarm(AlarmControlPanelEntity):
    # 实现这些方法之一。

    def alarm_arm_home(self, code: str | None = None) -> None:
        """发送在家设置命令。"""

    async def async_alarm_arm_home(self, code: str | None = None) -> None:
        """发送在家设置命令。"""
```

### 警报设在外

发送在外设置命令。

```python
class MyAlarm(AlarmControlPanelEntity):
    # 实现这些方法之一。

    def alarm_arm_away(self, code: str | None = None) -> None:
        """发送在外设置命令。"""

    async def async_alarm_arm_away(self, code: str | None = None) -> None:
        """发送在外设置命令。"""
```

### 警报设在夜间

发送在夜间设置命令。

```python
class MyAlarm(AlarmControlPanelEntity):
    # 实现这些方法之一。

    def alarm_arm_night(self, code: str | None = None) -> None:
        """发送在夜间设置命令。"""

    async def async_alarm_arm_night(self, code: str | None = None) -> None:
        """发送在夜间设置命令。"""
```

### 警报设在假期

发送在假期设置命令。

```python
class MyAlarm(AlarmControlPanelEntity):
    # 实现这些方法之一。

    def alarm_arm_vacation(self, code: str | None = None) -> None:
        """发送在假期设置命令。"""

    async def async_alarm_arm_vacation(self, code: str | None = None) -> None:
        """发送在假期设置命令。"""
```

### 警报触发

发送警报触发命令。

```python
class MyAlarm(AlarmControlPanelEntity):
    # 实现这些方法之一。

    def alarm_trigger(self, code: str | None = None) -> None:
        """发送警报触发命令。"""

    async def async_alarm_trigger(self, code: str | None = None) -> None:
        """发送警报触发命令。"""
```

### 警报自定义旁路

发送臂膀自定义旁路命令。

```python
class MyAlarm(AlarmControlPanelEntity):
    # 实现这些方法之一。

    def alarm_arm_custom_bypass(self, code: str | None = None) -> None:
        """发送臂膀自定义旁路命令。"""

    async def async_alarm_arm_custom_bypass(self, code: str | None = None) -> None:
        """发送臂膀自定义旁路命令。"""