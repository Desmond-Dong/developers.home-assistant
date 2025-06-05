---
title: Home Assistant 监督者
sidebar_label: 介绍
---

监督者允许用户从 Home Assistant 管理他们的 Home Assistant 安装。监督者具有以下职责：

- 运行 Home Assistant Core
- 更新 Home Assistant Core。如果更新失败，自动回滚。
- 进行和恢复备份
- 附加组件
- 统一音频系统
- 更新 Home Assistant 操作系统（在监督安装中禁用）

## 架构

<img class='invertDark' src='/img/en/architecture/ha_architecture_2020.png'
  alt='Home Assistant 的架构概述' />

<!--
  https://docs.google.com/drawings/d/13-72kr05yK31HrQEMpt7Y45jPqKsMxBeFYX1PUatTuE/edit?usp=sharing
-->

- **Home Assistant Core**: 家庭自动化平台
- **附加组件**: 用户希望在其服务器上运行的额外应用程序
- **DNS**: 允许核心和附加组件之间进行通信
- **音频**: 允许核心和附加组件播放音频
- **mDNS**: 帮助发现和连接网络中的设备和服务
- **监督者**: 管理系统的所有部分并保持其更新
- **Docker**: 运行应用程序的容器服务。
- **操作系统**: 基于 Linux 的操作系统
- **D-Bus**: 控制操作系统中部分内容（如网络管理） 的通信系统