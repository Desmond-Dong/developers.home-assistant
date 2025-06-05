---
title: "助手管道"
---

[助手管道](https://www.home-assistant.io/integrations/assist_pipeline) 集成运行语音助手的常见步骤：

1. 唤醒词检测
2. 语音转文本
3. 意图识别
4. 文本转语音

管道通过 WebSocket API 运行：

```json
{
  "type": "assist_pipeline/run",
  "start_stage": "stt",
  "end_stage": "tts",
  "input": {
    "sample_rate": 16000
  }
}
```

以下输入字段可用：

| 名称              | 类型   | 描述                                                                                                                                                                                                                                                                                    |
|-------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `start_stage`     | enum   | 必填。要运行的第一个阶段。可以是 `wake_word`、`stt`、`intent`、`tts` 中的一个。                                                                                                                                                                                                                        |
| `end_stage`       | enum   | 必填。要运行的最后一个阶段。可以是 `stt`、`intent`、`tts` 中的一个。                                                                                                                                                                                                                                |
| `input`           | dict   | 取决于 `start_stage`： <ul><li>`wake_word` 仅:<ul><li>`timeout` - 唤醒词检测超时前的秒数（整数，默认: 3）</li><li>`noise_suppression_level` - 噪声抑制程度（整数，0 = 禁用，4 = 最大）</li><li>`auto_gain_dbfs` - 自动增益（整数，0 = 禁用，31 = 最大）</li><li>`volume_multiplier` - 固定音量放大（浮点数，1.0 = 无变化，2.0 = 声音加倍）</li></ul></li><li>`wake_word` 和 `stt`:<ul><li>`sample_rate` - 进入音频的采样率（整数，赫兹）</li></ul></li><li>`intent` 和 `tts`:<ul><li>`text` - 输入文本（字符串）</li></ul></li></ul> |
| `pipeline`        | string | 可选。管道的 ID（使用 `assist_pipeline/pipeline/list` 获取名称）。                                                                                                                                                                                                               |
| `conversation_id` | string | 可选。 [会话的唯一 ID](/docs/intent_conversation_api#conversation-id)。                                                                                                                                                                                                         |
| `device_id`      | string | 可选。启动管道的设备的 Home Assistant 设备注册表中的设备 ID。                                                                                                                                                                                                                           |
| `timeout`         | number | 可选。管道超时前的秒数（默认: 300）。                                                                                                                                                                                                                           |

## 事件

在管道运行时，它通过 WebSocket 连接发出事件。
可以发出的事件如下：

| 名称           | 描述                    | 发出        | 属性                                                                                                                                                                                                                                                              |
|----------------|------------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `run-start`    | 管道运行开始        | 总是     | `pipeline` - 管道的 ID<br />`language` - 用于管道的语言<br />`runner_data` - 额外的 WebSocket 数据: <ul><li>`stt_binary_handler_id` 是发送语音数据的前缀。</li><li>`timeout` 是整个管道的最大运行时间。</li></ul><br />`tts_output` - TTS 输出数据<ul><li>`token` - 生成音频的令牌</li><li>`url` - 生成音频的 URL</li><li>`mime_type` - 生成音频的 MIME 类型</li><li>`stream_response` - 如果 TTS 能在响应生成时进行流式处理。</li></ul> |
| `run-end`      | 管道运行结束          | 总是     |                                                                                                                                                                                                                                                                         |
| `wake_word-start`   | 唤醒词检测开始 | 仅音频 | `engine`: 使用的唤醒引擎<br />`metadata`: 进入的音频<br />`timeout`: 唤醒词超时的秒数元数据                                                                                                                                                                                                     |
| `wake_word-end`     | 唤醒词检测结束   | 仅音频 | `wake_word_output` - 检测结果数据: <ul><li>`wake_word_id` 是检测到的唤醒词的 ID</li><li>`timestamp` 是相对于音频流开始的检测时间（毫秒，可选）</li></ul>                                                                             |
| `stt-start`    | 语音转文本开始      | 仅音频 | `engine`: 使用的 STT 引擎<br />`metadata`: 进入的音频元数据                                                                                                                                                                                                      |
| `stt-vad-start`    | 语音命令开始      | 仅音频 | `timestamp`: 相对于音频流开始的时间（毫秒） |
| `stt-vad-end`    | 语音命令结束      | 仅音频 | `timestamp`: 相对于音频流开始的时间（毫秒） |
| `stt-end`      | 语音转文本结束        | 仅音频 | `stt_output` - 包含 `text` 的对象，检测到的文本。                                                                                                                                                                                                                   |
| `intent-start` | 意图识别开始  | 总是     | `engine` - [代理](/docs/intent_conversation_api) 使用的引擎<br />`language`: 处理语言。 <br /> `intent_input` - 输入文本到代理                                                                                                                         |
| `intent-progress`   | 意图识别的中间更新    | 取决于对话代理     | `chat_log_delta` - 来自 [聊天日志](/docs/core/entity/conversation#chat-log) 的增量对象                                                                                                                                                                          |
| `intent-end`   | 意图识别结束    | 总是     | `intent_output` - [对话响应](/docs/intent_conversation_api#conversation-response)                                                                                                                                                                          |
| `tts-start`    | 文本转语音开始      | 仅音频 | `engine` - 使用的 TTS 引擎<br />`language`: 输出语言。<br />`voice`: 输出声音。 <br />`tts_input`: 要讲话的文本。                                                                                                                                              |
| `tts-end`      | 文本转语音结束        | 仅音频 | `token` - 生成音频的令牌<br />`url` - 生成音频的 URL<br />`mime_type` - 生成音频的 MIME 类型<br />                                                                                                                   |
| `error`        | 管道中的错误            | 发生错误   | `code` - 错误代码 ([见下文](#error-codes))<br />`message` - 错误信息                                                                                                                                                                                                                      |

## 错误代码

以下代码从管道 `error` 事件返回：

* `wake-engine-missing` - 没有安装唤醒词引擎
* `wake-provider-missing` - 配置的唤醒词提供者不可用
* `wake-stream-failed` - 唤醒词检测过程中发生意外错误
* `wake-word-timeout` - 唤醒词未在超时内检测到
* `stt-provider-missing` - 配置的语音转文本提供者不可用
* `stt-provider-unsupported-metadata` - 语音转文本提供者不支持音频格式（采样率等）
* `stt-stream-failed` - 语音转文本过程中发生意外错误
* `stt-no-text-recognized` - 语音转文本未返回转录
* `intent-not-supported` - 配置的对话代理不可用
* `intent-failed` - 意图识别过程中发生意外错误
* `tts-not-supported` - 配置的文本转语音提供者不可用或选项不受支持
* `tts-failed` - 文本转语音过程中发生意外错误

## 发送语音数据

在以 `stt` 作为运行的第一个阶段启动管道后，并接收到 `stt-start` 事件，可以通过 WebSocket 连接以二进制数据的形式发送语音数据。音频应该尽快发送，一块块地，前缀加上一个字节的 `stt_binary_handler_id`。

例如，假设 `stt_binary_handler_id` 为 `1`，音频块为 `a1b2c3`，则消息将为（以十六进制表示）：

```
stt_binary_handler_id
||
01a1b2c3
  ||||||
   音频
```

为了表示发送语音数据的结束，发送包含单个字节的二进制消息，携带 `stt_binary_handler_id`。

## 唤醒词检测

当 `start_stage` 设置为 `wake_word` 时，管道不会运行，直到检测到唤醒词。客户端应避免不必要的音频流通过使用本地语音活动检测器（VAD），仅在检测到人声时开始流式传输。

对于 `wake_word`，`input` 对象应包含一个 `timeout` 浮点值。这是检测唤醒词期间在管道超时之前的静音秒数（错误代码 `wake-word-timeout`）。
如果 Home Assistant 内部的 VAD 检测到足够的语音，超时将不断重置。

### 音频增强

当 `start_stage` 设置为 `wake_word` 时，以下设置作为 `input` 对象的一部分可用：

* `noise_suppression_level` - 噪声抑制程度（0 = 禁用，4 = 最大）
* `auto_gain_dbfs` - 自动增益控制（0 = 禁用，31 = 最大）
* `volume_multiplier` - 音频样本乘以常数（1.0 = 无变化，2.0 = 声音加倍）

如果设备的麦克风相对较安静，推荐的设置为：

* `noise_suppression_level` - 2
* `auto_gain_dbfs` - 31
* `volume_multiplier` - 2.0

增加 `noise_suppression_level` 或 `volume_multiplier` 可能会导致音频失真。