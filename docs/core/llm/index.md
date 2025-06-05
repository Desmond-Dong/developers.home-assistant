---
title: "Home Assistant API 用于大型语言模型"
sidebar_label: "LLM API"
---

Home Assistant 可以与大型语言模型 (LLM) 进行交互。通过向 LLM 暴露 Home Assistant API，LLM 可以获取数据或控制 Home Assistant，以更好地帮助用户。Home Assistant 提供了内置的 LLM API，但自定义集成可以注册自己的 API，以提供更高级的功能。

## 内置助手 API

Home Assistant 提供了一个内置 API，该 API 向 LLM 暴露了助手 API。此 API 允许 LLM 通过 [意图](../../intent_builtin) 与 Home Assistant 进行交互，并可以通过注册意图进行扩展。

助手 API 等同于内置对话代理可访问的功能和实体。无法执行任何管理任务。

## 支持 LLM API

LLM API 需要在您的集成中集成两个地方。用户需要能够配置应使用哪些 API，并且 API 提供的工具应在与 LLM 交互时传递给 LLM。

### 选项流

所选择的 API 应存储在配置条目的选项中。它应包含一个字符串或所选 API ID 的列表（如果有）。如果未选择任何 API，则必须省略该键。

在您的选项流中，您应向用户提供一个选择器，以选择应使用哪个 API。

```python
from types import MappingProxyType

from homeassistant.const import CONF_LLM_HASS_API
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import llm
from homeassistant.helpers.selector import (
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
)


@callback
def async_get_options_schema(
    hass: HomeAssistant,
    options: MappingProxyType[str, Any],
) -> vol.Schema:
    """返回选项架构。"""
    apis: list[SelectOptionDict] = [
        SelectOptionDict(
            label=api.name,
            value=api.id,
        )
        for api in llm.async_get_apis(hass)
    ]

    return vol.Schema(
        {
            vol.Optional(
                CONF_LLM_HASS_API,
                description={"suggested_value": options.get(CONF_LLM_HASS_API)},
            ): SelectSelector(SelectSelectorConfig(options=apis, multiple=True)),
        }
    )
```


### 获取工具

与 LLM 交互时，提供的 `ChatLog` 将使所选工具从所选 API 中可用，并且会话实体应将它们与 API 提供的额外提示一起传递给 LLM。

```python
from homeassistant.const import CONF_LLM_HASS_API
from homeassistant.core import HomeAssistant, callback
from homeassistant.components import conversation
from homeassistant.helpers import intent, llm


class MyConversationEntity(conversation.ConversationEntity):

    def __init__(self, entry: ConfigEntry) -> None:
        """初始化代理。"""
        self.entry = entry

    ...

    async def _async_handle_message(
        self,
        user_input: conversation.ConversationInput,
        chat_log: conversation.ChatLog,
    ) -> conversation.ConversationResult:
        """调用 API。"""

        try:
            await chat_log.async_update_llm_data(
                DOMAIN,
                user_input,
                self.entry.options.get(CONF_LLM_HASS_API),
                self.entry.options.get(CONF_PROMPT),
            )
        except conversation.ConverseError as err:
            return err.as_conversation_result()

        tools: list[dict[str, Any]] | None = None
        if chat_log.llm_api:
            tools = [
                _format_tool(tool)  # TODO 格式化工具以符合您的 LLM 期望
                for tool in chat_log.llm_api.tools
            ]

        messages = [
            m
            for content in chat_log.content
            for m in _convert_content(content)  # TODO 格式化消息
        ]

        # 与 LLM 交互并传递工具
        request = user_input.text
        for _iteration in range(10):
            response = ... # 向 LLM 发送请求并获取流式响应

            messages.extend(
                [
                    _convert_content(content)  # TODO 格式化消息
                    async for content in chat_log.async_add_delta_content_stream(
                        user_input.agent_id, _transform_stream(response)  # TODO 调用工具并流式响应
                    )
                ]
            )

            if not chat_log.unresponded_tool_results:
                break

        # 将最终响应发送给用户
        intent_response = intent.IntentResponse(language=user_input.language)
        intent_response.async_set_speech(chat_log.content[-1].content or "")
        return conversation.ConversationResult(
            response=intent_response,
            conversation_id=chat_log.conversation_id,
            continue_conversation=chat_log.continue_conversation,
        )
```

## 创建您自己的 API

要创建您自己的 API，您需要创建一个继承自 `API` 的类，并实现 `async_get_tools` 方法。`async_get_tools` 方法应返回表示您想向 LLM 暴露的功能的 `Tool` 对象列表。

### 工具

`llm.Tool` 类表示 LLM 可以调用的工具。

```python
from homeassistant.core import HomeAssistant
from homeassistant.helper import llm
from homeassistant.util import dt as dt_util
from homeassistant.util.json import JsonObjectType


class TimeTool(llm.Tool):
    """获取当前时间的工具。"""

    name = "GetTime"
    description: "返回当前时间。"

    # 可选。输入参数的 Voluptuous 架构。
    parameters = vol.Schema({
      vol.Optional('timezone'): str,
    })

    async def async_call(
        self, hass: HomeAssistant, tool_input: ToolInput, llm_context: LLMContext
    ) -> JsonObjectType:
        """调用工具。"""
        if "timezone" in tool_input.tool_args:
            tzinfo = dt_util.get_time_zone(tool_input.tool_args["timezone"])
        else:
            tzinfo = dt_util.DEFAULT_TIME_ZONE

        return dt_util.now(tzinfo).isoformat()
```

`llm.Tool` 类具有以下属性：

| 名称             | 类型       | 描述                                                                                                   |
|------------------|------------|--------------------------------------------------------------------------------------------------------|
| `name`           | string     | 工具的名称。必需。                                                                                     |
| `description`    | string     | 帮助 LLM 理解何时以及如何调用工具的描述。可选，但推荐。                                                |
| `parameters`     | vol.Schema | 参数的 Voluptuous 架构。默认为 vol.Schema({})                                                        |

`llm.Tool` 类具有以下方法：

#### `async_call`

在 LLM 调用工具时执行工具的实际操作。这必须是一个异步方法。其参数为 `hass` 和 `llm.ToolInput` 的实例。

响应数据必须是一个 dict，并且可序列化为 JSON [`homeassistant.util.json.JsonObjectType`](https://github.com/home-assistant/home-assistant/blob/master/homeassistant/util/json.py)。

错误必须作为 `HomeAssistantError` 异常（或其子类）引发。响应数据不应包含用于错误处理的错误代码。

`ToolInput` 具有以下属性：

| 名称               | 类型     | 描述                                                                                      |
|--------------------|----------|------------------------------------------------------------------------------------------|
| `tool_name`        | string   | 被调用工具的名称                                                                        |
| `tool_args`        | dict     | LLM 提供的参数。参数使用 `parameters` 架构进行转换和验证。                             |
| `platform`         | string   | 使用工具的对话代理的 DOMAIN                                                              |
| `context`          | Context  | 对话的 `homeassistant.core.Context`                                                       |
| `user_prompt`      | string   | 发起工具调用的原始文本输入                                                              |
| `language`         | string   | 对话代理的语言，或 "*" 表示任何语言                                                     |
| `assistant`        | string   | 用于控制暴露实体的助手名称。目前只支持 `conversation`。                                   |
| `device_id`        | string   | 用户用于发起对话的设备的 device_id。                                                  |

### API

API 对象允许创建 API 实例。API 实例表示将提供给 LLM 的工具的集合。

```python
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helper import llm
from homeassistant.util import dt as dt_util
from homeassistant.util.json import JsonObjectType


class MyAPI(API):
    """我自己的 LLM API。"""

    async def async_get_api_instance(self, llm_context: LLMContext) -> APIInstance:
        """返回 API 的实例。"""
        return APIInstance(
            api=self,
            api_prompt="调用工具以从 Home Assistant 获取数据。",
            llm_context=llm_context,
            tools=[TimeTool()],
        )


async def async_setup_api(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """向 Home Assistant 注册 API。"""
    # 如果 API 与配置条目相关联，卸载配置条目时必须注销 LLM API。
    unreg = llm.async_register_api(
        hass,
        MyAPI(hass, f"my_unique_key-{entry.entry_id}", entry.title)
    )
    entry.async_on_unload(unreg)
```

`llm.API` 类具有以下属性：

| 名称              | 类型     | 描述                                                                                      |
|--------------------|----------|------------------------------------------------------------------------------------------|
| `id`               | string   | API 的唯一标识符。必需。                                                                  |
| `name`             | string   | API 的名称。必需。                                                                        |

`llm.APIInstance` 类具有以下属性：

| 名称               | 类型      | 描述                                                                                     |
|--------------------|-----------|-----------------------------------------------------------------------------------------|
| `api`              | API       | API 对象。必需。                                                                        |
| `api_prompt`       | string    | 对 LLM 使用 LLM 工具的指示。必需。                                                   |
| `llm_context`      | LLMContext | 工具调用的上下文。必需。                                                                  |
| `tools`            | list[Tool] | 此 API 中可用的工具。必需。                                                              |