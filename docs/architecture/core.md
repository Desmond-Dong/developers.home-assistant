---
title: 核心架构
sidebar_label: 核心
---

Home Assistant Core 由四个主要部分组成。此外，它还包括许多辅助类，以处理常见场景，如提供实体或处理位置。

- **事件总线**：促使事件的触发和监听——Home Assistant 的跳动心脏。
- **状态机**：跟踪事物的状态，并在状态变化时触发 `state_changed` 事件。
- **服务注册表**：监听事件总线上的 `call_service` 事件，并允许其他代码注册服务操作。
- **计时器**：每 1 秒在事件总线上发送一次 `time_changed` 事件。

<img class='invertDark'
  alt='Home Assistant 核心架构概览'
  src='/img/en/architecture/ha_architecture.svg'
/>