---
title: "集成架构"
sidebar_label: "集成"
---

Home Assistant Core 可以通过 **集成** 进行扩展。每个集成都负责 Home Assistant 中的特定领域。集成可以监听或触发事件，提供操作，并维护状态。集成由一个组件（基础逻辑）和平台（与其他集成交互的部分）组成。集成是用 Python 编写的，可以利用 Python 提供的所有优点。开箱即用，Home Assistant 提供了一堆 [内置集成](https://www.home-assistant.io/integrations/)。

<img class='invertDark'
src='/img/en/architecture/component-interaction.svg'
alt='显示集成与 Home Assistant 核心之间交互的示意图。' />

Home Assistant 区分以下集成类型：

## 定义物联网领域

这些集成在 Home Assistant 中定义了特定设备类别的物联网设备，例如灯。由 `light` 集成来定义 Home Assistant 中可用的数据以及数据格式。它还提供控制灯的操作。

有关定义领域的列表，请参见 [实体](./core/entity.md)。

要建议一个新领域，请在 [架构仓库](https://github.com/home-assistant/architecture/discussions) 中发起讨论。确保展示您建议的实体将包含哪些数据以及如何控制它。包括多个品牌的示例。

## 与外部设备和服务交互

这些集成与外部设备和服务进行交互，并通过定义 IoT 领域的集成使它们可用于 Home Assistant，例如 `light`。此类集成的一个示例是 Philips Hue。Philips Hue 灯作为光实体在 Home Assistant 中提供。

与外部设备和服务交互的集成通常不允许消费其他集成的实体状态，除非是来自其他集成且具有位置的实体，例如区域和 device_tracker 实体的状态。

有关更多信息，请参见 [实体架构](architecture/devices-and-services.md)。

## 表示虚拟/计算数据点

这些集成表示基于虚拟数据的实体，例如 [`input_boolean` 集成](https://www.home-assistant.io/integrations/input_boolean/)，一种虚拟开关。或者它们根据 Home Assistant 中可用的其他数据推导出数据，例如 [`template` 集成](https://www.home-assistant.io/integrations/template/) 或 [`utility_meter` 集成](https://www.home-assistant.io/integrations/utility_meter/)。

## 用户可以触发的操作或响应事件

这些集成提供小片段的家居自动化逻辑，执行您家中的常见任务。最受欢迎的是 [`automation` 集成](https://www.home-assistant.io/integrations/automation/)，允许用户通过配置格式创建自动化。

它也可以更具体，例如 [`flux` 集成](https://www.home-assistant.io/integrations/flux/)，根据日落控制灯光。