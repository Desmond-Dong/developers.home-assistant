---
title: "重要变化"
---

Home Assistant 不仅收集数据，还将数据导出到各种服务。这些服务并不是对每个变化都有兴趣。为了帮助这些服务过滤无关紧要的变化，您的实体集成可以添加重要变化支持。

此支持是通过创建一个 `significant_change.py` 平台文件，并在其中定义一个函数 `async_check_significant_change` 来添加的。

```python
from typing import Any, Optional
from homeassistant.core import HomeAssistant, callback

@callback
def async_check_significant_change(
    hass: HomeAssistant,
    old_state: str,
    old_attrs: dict,
    new_state: str,
    new_attrs: dict,
    **kwargs: Any,
) -> bool | None:
```

该函数接收一个先前被认为是重要的状态和新的状态。它不仅仅是传递最后两个已知状态。该函数应该返回一个布尔值，指示是否重要，如果函数不知道则返回 `None`。

在决定重要性时，请确保考虑所有已知属性。使用设备类来区分实体类型。

以下是一些无关紧要变化的示例：

 - 电池电量减少 0.1%
 - 温度传感器变化 0.1 摄氏度
 - 灯光亮度变化 2

Home Assistant 将自动处理 `unknown` 和 `unavailable` 等情况。

要为实体集成添加重要状态支持，请运行 `python3 -m script.scaffold significant_change`。