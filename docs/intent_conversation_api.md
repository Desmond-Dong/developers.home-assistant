---
title: "对话 API"
sidebar_label: "对话 API"
---

意图可以通过文本被识别并使用[对话集成](https://www.home-assistant.io/integrations/conversation/)触发。

一个 API 端点可用于接收输入句子并生成[对话响应](#conversation-response)。通过传递 Home Assistant 生成的[对话 ID](#conversation-id)，可以在多个输入和响应之间跟踪一个“对话”。

该 API 可通过 REST API 和 WebSocket API 访问。

一个句子可以通过 POST 到 `/api/conversation/process`，例如：

```json
{
  "text": "打开客厅的灯",
  "language": "zh"
}
```

或者通过 WebSocket API 发送，例如：

```json
{
  "type": "conversation/process",
  "text": "打开客厅的灯",
  "language": "zh"
}
```

以下输入字段可用：

| 名称               | 类型   | 描述                                                                                 |
|-------------------|--------|-------------------------------------------------------------------------------------|
| `text`            | 字符串 | 输入句子。                                                                         |
| `language`        | 字符串 | 可选。输入句子的语言（默认为配置的语言）。                                         |
| `agent_id`        | 字符串 | 可选。处理请求的对话代理（默认为 _home_assistant_）。                             |
| `conversation_id` | 字符串 | 可选。唯一 ID，用于[跟踪对话](#conversation-id)。由 Home Assistant 生成。          |


## 对话响应

从 `/api/conversation/process` 返回的 JSON 响应包含触发意图的效果的信息，例如：

```json
{
  "continue_conversation": true,
  "response": {
    "response_type": "action_done",
    "language": "zh",
    "data": {
      "targets": [
        {
          "type": "area",
          "name": "客厅",
          "id": "living_room"
        },
        {
          "type": "domain",
          "name": "灯光",
          "id": "light"
        }
      ],
      "success": [
        {
          "type": "entity",
          "name": "我的灯",
          "id": "light.my_light"
        }
      ],
      "failed": []
    },
    "speech": {
      "plain": {
        "speech": "已打开客厅的灯"
      }
    }
  },
  "conversation_id": "<generated-id-from-ha>"
}
```

在 `"response"` 对象中可用的属性：

| 名称             | 类型         | 描述                                                                                |
|-----------------|--------------|-------------------------------------------------------------------------------------|
| `response_type` | 字符串      | 可能为 `action_done`、`query_answer` 或 `error`（参见[响应类型](#response-types)）。 |
| `data`          | 字典        | 每种[响应类型](#response_types)的相关数据。                                       |
| `language`      | 字符串      | 意图和响应的语言。                                                                  |
| `speech`        | 字典        | 可选。要对用户说的响应文本（参见[语音](#speech)）。                              |


[对话 ID](#conversation-id)与对话响应一起返回。

如果 `continue_conversation` 设置为 true，对话代理会期望用户的后续输入。


## 响应类型

### 动作完成

意图在 Home Assistant 中产生了一项行动，例如打开灯。响应的 `data` 属性包含一个 `targets` 列表，其中每个目标如下所示：

| 名称       | 类型    | 描述                                                                            |
|------------|---------|--------------------------------------------------------------------------------|
| `type`     | 字符串  | 目标类型。可能为 `area`、`domain`、`device_class`、`device`、`entity` 或 `custom`。 |
| `name`     | 字符串  | 受影响目标的名称。                                                             |
| `id`       | 字符串  | 可选。目标的 ID。                                                               |

还包含两个附加目标列表，包含成功或失败的设备或实体：

```json
{
  "response": {
    "response_type": "action_done",
    "data": {
      "targets": [
        (area 或 domain)
      ],
      "success": [
        (成功的实体/设备)
      ],
      "failed": [
        (失败的实体/设备)
      ]
    }
  }
}
```

一个意图可以有多个目标，这些目标按顺序应用。目标必须从一般到具体地排序：

* `area`
  * 一个[注册区域](https://developers.home-assistant.io/docs/area_registry_index/)
* `domain`
  * Home Assistant 集成域，例如“light”
* `device_class`
  * 域的设备类别，例如“cover”域的“garage_door”
* `device`
  * 一个[注册设备](https://developers.home-assistant.io/docs/device_registry_index)
* `entity`
  * 一个[Home Assistant 实体](https://developers.home-assistant.io/docs/architecture/devices-and-services)
* `custom`
  * 一个自定义目标

大多数意图最终有 0、1 或 2 个目标。当前只有在涉及设备类时才会发生 3 个目标。目标组合的示例：

 * “关闭所有灯”
     * 1 个目标: `domain:light`
 * “打开厨房的灯”
     * 2 个目标: `area:kitchen`, `domain:light`
 * “打开厨房的窗帘”
     * 3 个目标: `area:kitchen`, `domain:cover`, `device_class:blind`


### 查询回答

响应是对问题的回答，例如“温度是多少？”参见[语音](#speech)属性以获取答案文本。

```json
{
  "response": {
    "response_type": "query_answer",
    "language": "zh",
    "speech": {
      "plain": {
        "speech": "温度是 65 度"
      }
    },
    "data": {
      "targets": [
        {
          "type": "domain",
          "name": "气候",
          "id": "climate"
        }
      ],
      "success": [
        {
          "type": "entity",
          "name": "Ecobee",
          "id": "climate.ecobee"
        }
      ],
      "failed": []
    }
  },
  "conversation_id": "<generated-id-from-ha>"
}
```


### 错误

在意图识别或处理期间发生了错误。请参见 `data.code` 以获取特定类型错误，以及[语音](#speech)属性以获取错误信息。

```json
{
  "response": {
    "response_type": "error",
    "language": "zh",
    "data": {
      "code": "no_intent_match"
    },
    "speech": {
      "plain": {
        "speech": "对不起，我听不懂"
      }
    }
  }
}
```

`data.code` 是一个字符串，可以是以下之一：

* `no_intent_match` - 输入文本未匹配任何意图。
* `no_valid_targets` - 目标区域、设备或实体不存在。
* `failed_to_handle` - 处理意图时发生了意外错误。
* `unknown` - 在意图处理范围之外发生了错误。


## 语音

对用户的口头响应存储在响应的 `speech` 属性中。可以是普通文本（默认）或[SSML](https://www.w3.org/TR/speech-synthesis11/)。

对于普通文本语音，响应看起来像：

```json
{
  "response": {
    "response_type": "...",
    "speech": {
      "plain": {
        "speech": "...",
        "extra_data": null
      }
    }
  },
  "conversation_id": "<generated-id-from-ha>"
}
```

如果语音是[SSML](https://www.w3.org/TR/speech-synthesis11/)，则看起来如下所示：

```json
{
  "response": {
    "response_type": "...",
    "speech": {
      "ssml": {
        "speech": "...",
        "extra_data": null
      }
    }
  },
  "conversation_id": "<generated-id-from-ha>"
}
```

## 对话 ID

如果回答的对话代理支持，则可以根据 Home Assistant 内部生成的唯一 ID 跟踪对话。要继续对话，请从 HTTP API 响应中检索 `conversation_id`（与[对话响应](#conversation-response)一起）并将其添加到下一个输入句子中：

初始输入句子：

```json
{
  "text": "初始输入句子。"
}
```

JSON 响应包含对话 ID：

```json
{
  "conversation_id": "<generated-id-from-ha>",
  "response": {
    (对话响应)
  }
}
```

使用下一个输入句子进行 POST：

```json
{
  "text": "相关输入句子。",
  "conversation_id": "<generated-id-from-ha>"
}
```


## 预加载句子

可以使用 WebSocket API 预加载某种语言的句子：

```json
{
  "type": "conversation/prepare",
  "language": "zh"
}
```

以下输入字段可用：

| 名称       | 类型   | 描述                                                                    |
|------------|--------|--------------------------------------------------------------------------|
| `language` | 字符串 | 可选。要加载的句子的语言（默认为配置的语言）。                         |