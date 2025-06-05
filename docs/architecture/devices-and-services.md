---
title: "实体：集成设备和服务"
sidebar_label: "介绍"
---

集成可以在 Home Assistant 中表示设备和服务。数据点被表示为实体。实体通过其他集成标准化，例如 `light`、`switch` 等。标准化实体附带控制的操作，但集成也可以提供自己的服务操作，以防某些内容未标准化。

实体抽象了 Home Assistant 的内部工作。作为集成者，您不必担心服务操作或状态机是如何工作的。相反，您扩展实体类并实现所集成设备类型所需的属性和方法。

<img className='invertDark'
  src='/img/en/architecture/integrating-devices-services.svg'
  alt='集成设备和服务' />

<!--
  https://docs.google.com/drawings/d/1oysZ1VMcPPuyKhY4tequsBWcblDdLydbWxlu6bH6678/edit?usp=sharing
-->

配置由用户通过 [Config Entry](../config_entries_index.md) 提供，或在特殊/遗留情况下通过 [configuration.yaml](../configuration_yaml_index.md) 提供。

设备集成（即 `hue`）将使用此配置建立与设备/服务的连接。它将转发配置条目（遗留使用发现助手）以在其各自的集成（灯光、开关）中设置实体。设备集成还可以注册自己的服务操作，以便处理未标准化的事项。这些操作发布在集成的域下，即 `hue.activate_scene`。

实体集成（即 `light`）负责定义抽象实体类和控制实体的服务。

Entity Component 助手负责将配置分发到平台，转发发现并收集服务调用的实体。

Entity Platform 助手管理平台的所有实体，并在必要时轮询它们以进行更新。在添加实体时，Entity Platform 负责在设备和实体注册表中注册实体。

集成平台（即 `hue.light`）使用配置查询外部设备/服务并创建要添加的实体。集成平台也可以注册实体服务。这些服务将作用于实体集成的设备集成的所有实体（即所有 Hue 灯实体）。这些服务在设备集成域下发布。

## 实体与 Home Assistant 核心的交互

继承自实体基类的集成实体类负责获取数据并处理服务调用。如果禁用轮询，它还负责告诉 Home Assistant 数据何时可用。

<img className='invertDark'
  src='/img/en/architecture/entity-core-interaction.svg'
  alt='实体与核心的交互' />

<!--
  https://docs.google.com/drawings/d/12Z0t6hriYrQZ2L5Ou7BVhPDd9iGvOvFiGniX5sgqsE4/edit?usp=sharing
-->

实体基类（由实体集成定义）负责格式化数据并将其写入状态机。

实体注册表将为任何当前未由实体对象支持的注册实体写入 `unavailable` 状态。

## 实体数据层次结构

<img className='invertDark'
  style={{maxWidth: "200px"}}
  src='/img/en/architecture/entity-data-hierarchy.svg'
  alt='实体层次结构' />

<!--
  https://docs.google.com/drawings/d/1TorZABszaj3m7tgTyf-EMrheYCj3HAvwXB8YmJW5NZ4/edit?usp=sharing
-->

删除、禁用或重新启用任何对象，所有下属对象将相应调整。