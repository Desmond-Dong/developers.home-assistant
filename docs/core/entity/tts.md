---
title: 文字转语音实体
sidebar_label: 文字转语音
---

一个文字转语音（TTS）实体使 Home Assistant 能够与您对话。

文字转语音实体源自 [`homeassistant.components.tts.TextToSpeechEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/tts/__init__.py)。

## 属性

:::tip
属性应始终仅从内存返回信息，而不进行 I/O（例如网络请求）。
:::

| 名称 | 类型 | 默认 | 描述
| ---- | ---- | ------- | -----------
| supported_languages | list[str] | **必需** | TTS 服务支持的语言。
| default_language | str | **必需** | TTS 服务的默认语言。
| supported_options | list[str] | None | TTS 服务支持的选项，例如声音、情感。
| default_options | Mapping[str, Any] | None | TTS 服务的默认选项。

## 方法

### 获取支持的声音

此方法用于返回 TTS 服务某种语言的支持声音列表。

```python
class MyTextToSpeechEntity(TextToSpeechEntity):
    """表示一个文字转语音实体。"""

    @callback
    def async_get_supported_voices(self, language: str) -> list[str] | None:
        """返回某种语言的支持声音列表。"""
```

### 一次性生成 TTS 音频

此方法接受一个消息和语言作为输入，并返回 TTS 音频。它可以实现为同步或异步，且必须实现。

```python
class MyTextToSpeechEntity(TextToSpeechEntity):
    """表示一个文字转语音实体。"""

    def get_tts_audio(
        self, message: str, language: str, options: dict[str, Any]
    ) -> TtsAudioType:
        """从引擎加载 TTS 音频文件。"""

    async def async_get_tts_audio(
        self, message: str, language: str, options: dict[str, Any]
    ) -> TtsAudioType:
        """从引擎加载 TTS 音频文件。"""
```

### 生成带有消息流的 TTS 音频

大型语言模型以块的形式生成文本。可以使用一系列文本消息调用 TTS 服务，TTS 服务将分块返回音频。

此方法是可选的。当未实现时，TTS 服务将使用最终消息调用一次性方法。

```python
class MyTextToSpeechEntity(TextToSpeechEntity):
    """表示一个文字转语音实体。"""

    async def async_stream_tts_audio(
        self, request: TTSAudioRequest
    ) -> TTSAudioResponse:
        """从传入消息生成语音。"""
```

`TTSAudioRequest` 和 `TTSAudioResponse` 对象的定义如下：

```python
@dataclass
class TTSAudioRequest:
    """获取 TTS 音频的请求。"""

    language: str
    options: dict[str, Any]
    message_gen: AsyncGenerator[str]


@dataclass
class TTSAudioResponse:
    """包含 TTS 音频流的响应。"""

    extension: str
    data_gen: AsyncGenerator[bytes]