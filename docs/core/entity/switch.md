---
title: 切换实体
sidebar_label: 切换
---

切换实体用于打开或关闭某些内容，例如继电器。从 [`homeassistant.components.switch.SwitchEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/switch/__init__.py) 派生一个平台实体。
要表示有开或关状态但无法控制的东西，例如一个能传输其状态但无法从 Home Assistant 打开或关闭的墙壁开关，二进制传感器是一个更好的选择。
要表示没有状态的东西，例如门铃按钮，自定义事件或设备触发器是一个更好的选择。

## 属性

:::tip
属性应始终仅从内存返回信息，而不进行 I/O（例如网络请求）。实现 `update()` 或 `async_update()` 来获取数据。
:::

| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------- | -----------
| is_on | 布尔值 | `None` | 切换当前是否处于开启或关闭状态。

## 方法

### 打开

打开开关。

```python
class MySwitch(SwitchEntity):
    # 实现以下方法之一。

    def turn_on(self, **kwargs) -> None:
        """打开实体。"""

    async def async_turn_on(self, **kwargs):
        """打开实体。"""
```

### 关闭

关闭开关。

```python
class MySwitch(SwitchEntity):
    # 实现以下方法之一。

    def turn_off(self, **kwargs):
        """关闭实体。"""

    async def async_turn_off(self, **kwargs):
        """关闭实体。"""
```

### 切换

可选。如果未实现，将默认检查使用 `is_on` 属性调用哪个方法。

```python
class MySwitch(SwitchEntity):
    # 实现以下方法之一。

    def toggle(self, **kwargs):
        """切换实体。"""

    async def async_toggle(self, **kwargs):
        """切换实体。"""
```

### 可用设备类别

可选。这种类型的设备是什么。它可能会映射到 Google 设备类型。

| 常量 | 描述
| ----- | -----------
| `SwitchDeviceClass.OUTLET` | 设备是用于供电的插座。
| `SwitchDeviceClass.SWITCH` | 设备是某种类型实体的开关。