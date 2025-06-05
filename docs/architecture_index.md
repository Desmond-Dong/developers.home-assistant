---
title: "架构概述"
---

Home Assistant 提供了一个家庭控制和家庭自动化的平台。Home Assistant 不仅仅是一个应用程序：它是一个嵌入式系统，提供了类似其他消费品的体验：入门、配置和更新都通过一个易于使用的界面完成。

- [操作系统](operating-system.md) 提供了运行 Supervisor 和 Core 的最基本的 Linux 环境。
- [Supervisor](supervisor.md) 管理操作系统。
- [Core](architecture/core.md) 与用户、Supervisor 以及物联网设备和服务进行交互。

<img
  src='/img/en/architecture/full.svg'
  alt='Home Assistant 的完整图'
/>

## 运行堆栈的部分组件

用户对于家庭自动化平台的需求各不相同。这就是为什么可以仅运行 Home Assistant 堆栈的一部分。有关更多信息，请参见 [安装说明](https://www.home-assistant.io/installation/)。