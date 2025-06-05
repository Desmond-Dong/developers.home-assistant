---
title: 语音转文本实体
sidebar_label: 语音转文本
---

语音转文本（STT）实体允许其他集成或应用程序将语音数据流式传输到 STT API，并获取文本。

语音转文本实体来源于 [`homeassistant.components.stt.SpeechToTextEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/stt/__init__.py)。

## 属性

:::tip
属性应始终仅从内存中返回信息，而不进行 I/O（如网络请求）。
:::

| 名称 | 类型 | 默认 | 描述
| ---- | ---- | ------- | -----------
| supported_languages | list[str] | **必需** | STT 服务支持的语言。
| supported_formats | list[AudioFormats] | **必需** | STT 服务支持的音频格式，wav 或 ogg。
| supported_codecs | list[AudioCodecs] | **必需** | STT 服务支持的音频编码，pcm 或 opus。
| supported_bit_rates | list[AudioBitRates] | **必需** | STT 服务支持的音频比特率，8、16、24 或 32。
| supported_sample_rates | list[AudioSampleRates] | **必需** | STT 服务支持的音频采样率。
| supported_channels | list[AudioChannels] | **必需** | STT 服务支持的音频通道，1 或 2。

## 方法

### 处理音频流

处理音频流方法用于将音频发送到 STT 服务并获取文本。

```python
class MySpeechToTextEntity(SpeechToTextEntity):
    """表示一个语音转文本实体。"""

    async def async_process_audio_stream(self) -> None:
        """将音频流处理到 STT 服务。

        仅允许流式内容！
        """