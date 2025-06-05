---
title: "重现状态"
---

Home Assistant 支持场景。场景是一组（部分）实体状态。当一个场景被激活时，Home Assistant 将尝试调用正确的服务操作以使指定场景处于其指定状态。

集成负责为 Home Assistant 添加支持，以便能够调用正确的服务操作来重现场景中的状态。

## 添加支持

为新的集成快速添加重现状态支持的最简单方法是使用我们内置的脚手架模板。在 Home Assistant 开发环境中运行 `python3 -m script.scaffold reproduce_state` 并按照说明进行操作。

如果您更喜欢手动操作，请在您的集成文件夹中创建一个名为 `reproduce_state.py` 的新文件，并实现以下方法：

```python
import asyncio
from typing import Iterable, Optional
from homeassistant.core import Context, HomeAssistant, State


async def async_reproduce_states(
    hass: HomeAssistant, states: Iterable[State], context: Optional[Context] = None
) -> None:
    """重现组件状态。"""
    # TODO 重现状态