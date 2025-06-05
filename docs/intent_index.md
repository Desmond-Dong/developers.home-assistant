---
title: "意图"
sidebar_label: "介绍"
---

意图是用户意图的描述。意图是由用户行为生成的，比如请求亚马逊回声设备打开灯光。

<a href='https://docs.google.com/drawings/d/1i9AsOQNCBCaeM14QwEglZizV0lZiWKHZgroZc9izB0E/edit'>
  <img class='invertDark'
    src='/img/en/intents/overview.png'
    alt='Home Assistant 中意图的架构概述'
  />
</a>

意图由接收来自外部源/服务的组件触发。Conversation、Alexa、API.ai 和 Snips 当前正在提供意图。

任何组件都可以处理意图。这使得开发人员能够非常轻松地与所有语音助手集成。

意图使用 `homeassistant.helpers.intent.Intent` 类实现。它包含以下属性：

| 名称          | 类型           | 描述                                                                           |
|---------------|----------------|--------------------------------------------------------------------------------|
| `hass`        | Home Assistant | 触发意图的 Home Assistant 实例。                                               |
| `platform`    | string         | 触发意图的平台                                                               |
| `intent_type` | string         | 意图的类型（名称）                                                            |
| `slots`       | dictionary     | 包含以槽名称为键的槽值。                                                      |
| `text_input`  | string         | 可选。发起意图的原始文本输入。                                                 |
| `language`    | string         | 可选。文本输入的语言（默认为配置的语言）。                                     |

槽字典值的描述。

| 名称  | 类型     | 描述            |
|-------|----------|------------------|
| 值    | anything | 槽的值。        |