---
title: 按钮实体
sidebar_label: 按钮
---

按钮实体是一个可以向设备或服务触发事件/执行操作的实体，但从 Home Assistant 的角度来看，它是无状态的。
它可以与真实的短暂开关、按钮或其他形式的无状态开关进行比较。但是，它不适合实现实际的物理按钮；按钮实体的唯一目的是提供一个虚拟按钮在 Home Assistant 内部。

开关按钮实体派生自 [`homeassistant.components.button.ButtonEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/button/__init__.py)，
对于控制设备功能（如，但不限于）是很有帮助的：

- 升级固件
- 重启/重新启动设备
- 泡一杯咖啡
- 重置某些东西（如计数器、过滤器使用）

如果您想表示可以开启和关闭（因此具有实际状态）的东西，您应该使用 `switch` 实体。如果您想在 Home Assistant 中集成一个真实的、物理的、无状态的按钮设备，您可以通过触发自定义事件来实现。这种实体按钮实体不适合这些情况。

## 属性

由于此集成是无状态的，因此它不为自身提供任何特定属性。
其他所有实体共有的属性，如 `device_class`、`icon`、`name` 等仍然适用。

## 方法

### 按下

按下方法可用于向设备或服务触发一个操作。
当用户按下按钮或调用按下按钮的操作时，Home Assistant 会调用它。

```python
class MyButton(ButtonEntity):
    # 实现以下这些方法之一。

    def press(self) -> None:
        """处理按钮按下事件。"""

    async def async_press(self) -> None:
        """处理按钮按下事件。"""
```

### 可用的设备类别

可选地指定它是什么类型的实体。它可能映射到 Google 设备类型。

| 常量 | 描述
| ----- | -----------
| `ButtonDeviceClass.IDENTIFY` | 按钮实体识别设备。
| `ButtonDeviceClass.RESTART` | 按钮实体重启设备。
| `ButtonDeviceClass.UPDATE` | 按钮实体更新设备的软件。应避免使用此设备类别，请考虑改用 [`update`](/docs/core/entity/update) 实体。