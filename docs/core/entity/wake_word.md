---
title: 唤醒词检测实体
sidebar_label: 唤醒词检测
---

唤醒词检测实体允许其他集成或应用程序在音频流中检测唤醒词（也称为热词）。

唤醒词检测实体来源于 [`homeassistant.components.wake_word.WakeWordDetectionEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/wake_word/__init__.py)。

## 属性

:::tip
属性应该始终只从内存中返回信息，而不进行 I/O（如网络请求）。
:::

| 名称                   | 类型               | 默认值        | 描述                                                                                                                  |
|------------------------|-------------------|---------------|----------------------------------------------------------------------------------------------------------------------|
| supported_wake_words   | list[WakeWord]    | **必填**      | 服务支持的唤醒词，包括：<ul><li>ww_id - 唯一标识符</li><li>name - 人类可读名称</li></ul> |

## 方法

### 处理音频流

处理音频流的方法用于检测唤醒词。如果音频流结束而没有检测到唤醒词，则必须返回 `DetectionResult` 或 `None`。

```python
class MyWakeWordDetectionEntity(WakeWordDetectionEntity):
    """表示一个唤醒词检测实体。"""

    async def async_process_audio_stream(
        self, stream: AsyncIterable[tuple[bytes, int]]
    ) -> DetectionResult | None:
        """尝试在带有时间戳的音频流中检测唤醒词。

        音频必须是 16Khz 的采样率，16-bit 单声道 PCM 样本。
        """
```

音频流由形式为 `(timestamp, audio_chunk)` 的元组组成，其中：

- `timestamp` 是自音频流开始以来的毫秒数
- `audio_chunk` 是16位有符号单声道 PCM 样本的音频块，采样率为 16Khz

如果检测到唤醒词，将返回一个 `DetectionResult`，其包含：

- `ww_id` - 检测到的唤醒词的唯一标识符
- `timestamp` - 检测发生时音频块的时间戳
- `queued_audio` - 可选音频块，将被转发给语音转文本（见下文）

在 [Assist pipeline](/docs/voice/pipelines) 中，音频流在唤醒词检测和语音转文本之间共享。这意味着在唤醒词检测过程中移除的任何音频块 **不能被** 语音转文本处理，除非通过 `DetectionResult` 的 `queued_audio` 传回。