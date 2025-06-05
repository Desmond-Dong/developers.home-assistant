---
title: "处理意图"
---

任何组件都可以注册以处理意图。这使得单个组件能够处理来自多个语音助手触发的意图。

一个组件必须为每种类型的意图注册一个意图处理器，以进行处理。意图处理器必须扩展 `homeassistant.helpers.intent.IntentHandler`

```python
from homeassistant.helpers import intent

DATA_KEY = "example_key"


async def async_setup(hass, config):
    hass.data[DATA_KEY] = 0
    intent.async_register(hass, CountInvocationIntent())


class CountInvocationIntent(intent.IntentHandler):
    """处理 CountInvocationIntent 意图。"""

    # 要处理的意图类型
    intent_type = "CountInvocationIntent"

    description = "计算它被调用的次数"

    # 可选。插槽的验证架构
    # slot_schema = {
    #     'item': cv.string
    # }

    async def async_handle(self, intent_obj):
        """处理意图。"""
        intent_obj.hass.data[DATA_KEY] += 1
        count = intent_obj.hass.data[DATA_KEY]

        response = intent_obj.create_response()
        response.async_set_speech(
            f"此意图已被调用 {count} 次"
        )
        return response