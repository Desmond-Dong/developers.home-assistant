---
title: "Hass 对象"
sidebar_label: "介绍"
---

在开发 Home Assistant 时，你会看到一个无处不在的变量：`hass`。这是 Home Assistant 实例，它将让你访问系统的各个部分。

### `hass` 对象

Home Assistant 实例包含四个对象，帮助你与系统进行交互。

| 对象 | 描述 |
| ------ | ----------- |
| `hass` | 这是 Home Assistant 的实例。允许启动、停止和排队新的任务。 |
| `hass.config` | 这是 Home Assistant 的核心配置，暴露位置、温度偏好和配置目录路径。 |
| `hass.states` | 这是状态机。它允许你设置状态并跟踪状态何时被更改。[查看可用的方法。](https://developers.home-assistant.io/docs/dev_101_states) |
| `hass.bus` | 这是事件总线。它允许你触发和侦听事件。[查看可用的方法。](https://developers.home-assistant.io/docs/dev_101_events) |
| `hass.services` | 这是服务注册表。它允许你注册服务操作。[查看可用的方法。](https://developers.home-assistant.io/docs/dev_101_services) |

<img class='invertDark'
  alt='Home Assistant 核心架构概述'
  src='/img/en/architecture/ha_architecture.svg'
/>

### 在哪里找到 `hass`

根据你正在编写的内容，`hass` 对象的可用方式不同。

**组件**
传入 `setup(hass, config)` 或 `async_setup(hass, config)`。

**平台**
传入 `setup_platform(hass, config, add_entities, discovery_info=None)` 或 `async_setup_platform(hass, config, async_add_entities, discovery_info=None)`。

**实体**
一旦通过平台内的 `add_entities` 回调添加，作为 `self.hass` 可用。