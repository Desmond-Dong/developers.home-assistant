---
title: "开发检查清单"
sidebar_label: 介绍
---

在提交任何更改之前，请根据以下要求检查您的工作：

- 所有与外部设备或服务的通信必须封装在托管于 [pypi](https://pypi.org/) 的外部 Python 库中。
  - 该库必须提供源分发包；不允许依赖仅具有二进制分发包的包。
  - 必须为与外部设备或服务进行通信的外部 Python 库启用问题跟踪器。
  - 如果该库主要用于 Home Assistant 并且您是该集成的代码拥有者，建议使用带有链接到 [Home Assistant 核心问题](https://github.com/home-assistant/core/issues) 的问题模板选择器。例如：[zwave-js-server-python - 新问题](https://github.com/home-assistant-libs/zwave-js-server-python/issues/new/choose)
- 新依赖项添加到 `requirements_all.txt`（如适用），使用 `python3 -m script.gen_requirements_all`
- 新代码拥有者添加到 `CODEOWNERS`（如适用），使用 `python3 -m script.hassfest`
- `.strict-typing` 文件已更新，包含您的代码（如果它提供了完全类型提示的源代码）。
- 代码使用 Ruff 格式化（`ruff format`）。
- 为 [home-assistant.io](https://home-assistant.io/) 开发文档。
  - 访问 [网站文档](/documenting.md)，获取有关为 [home-assistant.io](https://github.com/home-assistant/home-assistant.io) 贡献的更多信息。