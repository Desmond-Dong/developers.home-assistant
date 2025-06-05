---
title: "辅助卫星实体"
sidebar_label: 辅助卫星
---

辅助卫星实体代表设备的基于辅助管道的语音助手功能。具有此类实体的设备可以允许用户通过声音控制家庭助理。

辅助卫星实体派生自 [`homeassistant.components.assist_satellite.AssistSatelliteEntity`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/assist_satellite/__init__.py)。

## 属性

| 名称                     | 类型                      | 默认值              | 描述                                                               |
|--------------------------|---------------------------|---------------------|--------------------------------------------------------------------|
| `pipeline_entity_id`     | <code>str; None</code>   | <code>None</code>   | 带有 [pipeline id](/docs/voice/pipelines/) 的 `select` 实体的 Id 或 `None`。 |
| `vad_sensitivity_entity_id` | <code>str; None</code>   | <code>None</code>   | 带有 [语音活动检测敏感度](https://github.com/home-assistant/core/blob/dev/homeassistant/components/assist_pipeline/vad.py) 的 `select` 实体的 Id 或 `None`。 |
| `tts_options`            | <code>dict; None</code>  | <code>None</code>   | 响应时传递给 [文本转语音系统](https://www.home-assistant.io/integrations/tts/) 的选项。 |


## 状态

`AssistSatelliteEntity` 的状态遵循其当前运行的 [管道](/docs/voice/pipelines/)。 `AssistSatelliteState` 枚举存储可能的状态。

:::tip
当文本到语音响应 **播放完成** 时，您必须在实体上调用 `tts_response_finished` 方法以返回到 `IDLE` 状态。
:::

| 常量        | 描述                                                              |
|-------------|-------------------------------------------------------------------|
| `IDLE`      | 设备正在等待用户输入，例如唤醒词或按钮按下。                        |
| `LISTENING` | 设备正在与家庭助理流式传输语音命令。                               |
| `PROCESSING` | 家庭助理正在处理语音命令。                                       |
| `RESPONDING` | 设备正在说出响应。                                               |

## 支持的功能

支持的功能通过使用 `AssistSatelliteEntityFeature` 枚举中的值进行定义，并使用按位或 (`|`) 运算符进行组合。

| 值          | 描述                                             |
|-------------|---------------------------------------------------|
| `ANNOUNCE`  | 设备支持远程触发的公告。实现 `async_announce` 方法以播放提供的 `media_id` 来自 `AssistSatelliteAnnouncement`。该方法应仅在公告在设备上播放完成后返回。 |
| `START_CONVERSATION` | 设备支持远程触发的对话，先播放公告，然后监听一个或多个语音命令。实现 `async_start_conversation` 方法以播放提供的 `media_id` 来自 `AssistSatelliteAnnouncement`，然后监听语音命令。该方法应仅在公告播放完成后返回。 |

## 方法

### 运行管道和处理事件

卫星实体应仅使用 `async_accept_pipeline_from_satellite` 方法运行 [辅助管道](/docs/voice/pipelines/)。 [管道中的事件](/docs/voice/pipelines/#events) 通过实现 `on_pipeline_event` 方法进行处理。

卫星实体的 [状态](#states) 在运行管道时会自动更新，但 `RESPONDING` 到 `IDLE` 的情况除外。开发者必须在卫星在设备上完成响应播放后调用 `tts_response_finished` 方法。

### 获取配置

`async_get_configuration` 方法必须返回 (缓存的) `AssistSatelliteConfiguration`。如果实体必须与设备通信以获取配置，则应在初始化期间进行。

可以使用 [websocket 命令](#getting-the-satellite-configuration) 来获取实体的配置。

### 设置配置

`async_set_configuration` 方法更新设备的配置，必须在设备和家庭助理的 `AssistSatelliteConfiguration` 同步后返回。

可以使用 [websocket 命令](#setting-the-active-wake-words) 来设置活动唤醒词。

### 公告

如果设备具有 `ANNOUNCE` [支持的功能](#supported-features)，则应实现 `async_announce` 方法来在 `AssistSatelliteAnnouncement` 中宣布提供的 `media_id`。如果提供了 `preannouncement_media_id`，则应在 `media_id` 之前播放。
`async_announce` 方法仅应在设备上播放完成时返回。

有可用于自动化公告的 [announce action](https://home-assistant.io/integrations/assist_satellite#action-assist_satelliteannounce)。

### 开始对话

如果设备具有 `START_CONVERSATION` [支持的功能](#supported-features)，则应实现 `async_start_conversation` 方法来：

1. 在 `AssistSatelliteAnnouncement` 中宣布 `preannouncement_media_id`，如果提供
2. 在 `AssistSatelliteAnnouncement` 中宣布提供的 `media_id`，然后
3. 监听一个或多个后续语音命令

`async_start_conversation` 方法仅应在设备上公告播放完成时返回。对话将在用户和卫星之间继续进行。

有可用于自动化对话的 [start conversation action](https://home-assistant.io/integrations/assist_satellite#action-assist_satellitestart_conversation)。

## WebSocket API

### 拦截唤醒词

该集成提供一个 websocket API 用于拦截唤醒词检测并将其宣布给用户。这被语音向导用于帮助用户入门并熟悉唤醒词。

```json
{
  "type": "assist_satellite/intercept_wake_word",
  "entity_id": "assist_satellite.living_room"
}
```

实体 ID 必须是支持 `ANNOUNCE` 功能的辅助卫星实体。

一旦检测到唤醒词，将返回如下响应：

```json
{
  "wake_word_phrase": "okay nabu"
}
```

### 获取卫星配置

可以通过以下方式检索卫星的当前配置，包括可用和活动的唤醒词：

```json
{
  "type": "assist_satellite/get_configuration",
  "entity_id": ENTITY_ID
}
```

将返回如下响应：

```json
{
  "active_wake_words": [
    "1234"
  ],
  "available_wake_words": [
    {
      "id": "1234",
      "trained_languages": [
        "en"
      ],
      "wake_word": "okay nabu"
    },
    {
      "id": "5678",
      "trained_languages": [
        "en"
      ],
      "wake_word": "hey jarvis"
    }
  ],
  "max_active_wake_words": 1,
  "pipeline_entity_id": "select.pipeline_entity",
  "vad_entity_id": "select.vad_entity"
}
```

`active_wake_words` 列表包含来自 `available_wake_words` 的唤醒词的 ID。

`pipeline_entity_id` 包含控制设备将运行的管道的选择实体的 ID。
`vad_entity_id` 包含具有语音活动检测器 (VAD) 敏感度级别的选择实体的 ID。

### 设置活动唤醒词

使用以下方式设置活动唤醒词：

```json
{
  "type": "assist_satellite/set_wake_words",
  "entity_id": ENTITY_ID,
  "wake_word_ids": ["1234", "5678"]
}
```

`wake_word_ids` 必须包含来自 `assist_satellite/get_configuration` 命令的 `available_wake_words` 列表中的 ID。`wake_word_ids` 的大小也不应超过 `max_active_wake_words`。
