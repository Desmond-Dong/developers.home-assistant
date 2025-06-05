---
title: "触发意图"
---

如果您的代码将用户的语音或文本与意图匹配，您可以让 Home Assistant 处理该意图。这可以在您自己的集成内部完成，或者通过通用的意图处理 API。

当您触发一个意图时，您将收到一个响应或引发一个错误。由您的代码决定将结果返回给用户。

## HTTP API

当意图集成被加载时，HTTP API 端点可在 `/api/intent/handle` 访问。您可以向其 POST JSON 数据，包含一个意图名称及其数据：

```json
{
  "name": "HassTurnOn",
  "data": {
    "name": "厨房灯"
  }
}
```

## Home Assistant 集成

在 Home Assistant 中处理意图的示例代码。

```python
from homeassistant.helpers import intent

intent_type = "TurnLightOn"
slots = {"entity": {"value": "厨房"}}

try:
    intent_response = await intent.async_handle(
        hass, "example_component", intent_type, slots
    )

except intent.UnknownIntent as err:
    _LOGGER.warning("接收到未知意图 %s", intent_type)

except intent.InvalidSlotInfo as err:
    _LOGGER.error("接收到无效的槽数据: %s", err)

except intent.IntentError:
    _LOGGER.exception("处理 %s 请求时出错", intent_type)
```

意图响应是 `homeassistant.helpers.intent.IntentResponse` 的一个实例。

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `intent` | Intent | 触发响应的意图实例。 |
| `speech` | 字典 | 语音响应。每个键是一个类型。允许的类型为 `plain` 和 `ssml`。 |
| `reprompt` | 字典 | 重提问响应。每个键是一个类型。允许的类型为 `plain` 和 `ssml`。<br />这用于在需要用户响应时保持会话开放。在这些情况下，`speech` 通常是一个问题。 |
| `card` | 字典 | 卡片响应。每个键是一个类型。 |

语音字典值：

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `speech` | 字符串 | 要说的文本 |
| `extra_data` | 任何 | 与此语音相关的额外信息。 |

重提问字典值：

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `reprompt` | 字符串 | 当用户反应太慢时要说的文本 |
| `extra_data` | 任何 | 与此语音相关的额外信息。 |

卡片字典值：

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `title` | 字符串 | 卡片的标题 |
| `content` | 任何 | 卡片的内容 |