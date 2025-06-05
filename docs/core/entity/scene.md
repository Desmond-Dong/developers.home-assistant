---
title: 场景实体
sidebar_label: 场景
--- 

场景实体是一个能够为一组实体[再现所需状态](/docs/core/platform/reproduce_state/)的实体。场景实体可以激活场景以控制一组设备，但从 Home Assistant 的角度来看，它依然是无状态的。

场景实体衍生自 [`homeassistant.components.scene.Scene`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/scene/__init__.py)。

如果您想表示可以开关的东西（因此具有实际状态），则应该使用 `switch` 实体。

场景实体还可以通过场景编辑器或 YAML [由用户创建](https://www.home-assistant.io/integrations/scene)。

## 属性

由于该集成是无状态的，因此它没有为自己提供任何特定属性。
所有实体共有的其他属性，如 `icon` 和 `name` 等，仍然适用。

## 方法

### 激活

激活场景。

```python
class MySwitch(Scene):
    # 实现这些方法之一。

    def activate(self, **kwargs: Any) -> None:
        """激活场景。尝试将实体置于请求的状态。"""

    async def async_activate(self, **kwargs: Any) -> None:
        """激活场景。尝试将实体置于请求的状态。"""
```

激活方法可用于激活特定设备或服务的场景。
当用户按下场景 `activate` 按钮或调用 `scene.turn_on` 动作以激活场景时，Home Assistant 会调用它。

### 可用的设备类别

没有特定的设备类别。场景实体上未设置 `device_class` 属性。