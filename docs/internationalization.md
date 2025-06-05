---
title: "国际化"
---

Home Assistant 国际化项目包括为本地化准备平台和前端，以及实际翻译本地化字符串。

一些组件和平台将有需要为该平台特别本地化的字符串。这些字符串在核心 [home-assistant](https://github.com/home-assistant/core) 仓库中管理。Home Assistant 后端将根据正在运行的实例中加载的组件向客户端提供字符串。

还有一些仅存在于前端的可本地化字符串。这些字符串在 [home-assistant frontend](https://github.com/home-assistant/frontend) 仓库中管理。这些字符串与前端存储在一起，不依赖于后端配置。

| 类型              | 位置     |
| ----------------- | -------- |
| 实体状态         | 核心     |
| 配置流程         | 核心     |
| 选项流程         | 核心     |
| 设备自动化       | 核心     |
| UI中的文本       | 前端     |

我们的字符串由社区使用在线翻译工具 [Lokalise](https://lokalise.co/) 翻译。