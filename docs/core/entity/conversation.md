---
title: 对话实体
sidebar_label: 对话
---

对话实体允许用户与 Home Assistant 对话。

对话实体基于 [`homeassistant.components.conversation.ConversationEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/conversation/entity.py) 进行派生。

## 属性

:::tip
属性应始终仅从内存中返回信息，而不进行 I/O（如网络请求）。
:::

| 名称 | 类型 | 默认值 | 描述
| ---- | ---- | ------- | -----------
| supported_languages | `list[str]` \| `Literal["*"]` | **必需** | 服务支持的语言。如果支持所有语言，返回 `"*"`。

## 支持的功能

支持的功能通过使用 `ConversationEntityFeature` 枚举中的值来定义，并使用按位或（`|`）操作符组合。

| 值                         | 描述
| -------------------------- | -------------------------------------------------------------------------------------------
| `CONTROL`       | 实体能够控制 Home Assistant。

## 方法

### 处理消息

此方法用于处理传入的聊天消息。

```python
from homeassistant.components.conversation import ChatLog, ConversationEntity

class MyConversationEntity(ConversationEntity):
    """表示一个对话实体。"""

    async def _async_handle_message(
        self,
        user_input: ConversationInput,
        chat_log: ChatLog,
    ) -> ConversationResult:
        """调用 API。"""
        # 将响应添加到聊天记录中。
        chat_log.async_add_assistant_content_without_tools(
            AssistantContent(
                agent_id=user_input.agent_id,
                content="测试响应",
            )
        )
        response = intent.IntentResponse(language=user_input.language)
        response.async_set_speech("测试响应")
        return agent.ConversationResult(
            conversation_id=None,
            response=response,
            continue_conversation=False,
        )
```

`ConversationInput` 对象包含以下数据：

| 名称 | 类型 | 描述
| ---- | ---- | -----------
| `text` | `str` | 用户输入
| `context` | `Context` | 附加到 HA 动作的 HA 上下文
| `conversation_id` | `Optional[str]` | 可用于跟踪多轮对话。如果不支持返回 None
| `language` | `str` | 文本的语言。如果用户未提供，则设置为 HA 配置的语言。
| `continue_conversation` | `bool` | 如果代理期望用户响应。如果未设置，假定为 False。

_我们之前推广使用 `async_process` 作为处理消息的方法。这已更改为 `_async_handle_message` 以自动包含聊天记录。此更改向后兼容。_

#### 聊天记录

聊天记录对象允许对话实体读取对话历史并向其中添加消息和工具调用。

查看 [Python 接口](https://github.com/home-assistant/core/blob/dev/homeassistant/components/conversation/chat_log.py) 以获取完整的类型化 API。

### 准备

一旦 Home Assistant 知道请求即将到来，我们将让对话实体为其做好准备。这可以用于加载语言模型或其他资源。此功能是可选实现的。

```python
class MyConversationEntity(ConversationEntity):
    """表示一个对话实体。"""

    async def async_prepare(self, language: str | None = None) -> None:
        """准备处理的语言。"""