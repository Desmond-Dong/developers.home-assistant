---
title: "创建组件的检查清单"
sidebar_label: 组件检查清单
---

添加新组件时需要做的事情清单。

:::info
并非所有现有代码都遵循此检查清单中的要求。这不能作为不遵循它们的理由！
:::

### 0. 通用

 1. 遵循我们的 [风格指南](development_guidelines.md)
 2. 使用来自 [`const.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/const.py) 的现有常量
    - 仅在广泛使用时才将新常量添加到 `const.py`。否则请保持在组件级别

### 1. 外部要求

 1. 已将要求添加到 [`manifest.json`](creating_integration_manifest.md)。 `REQUIREMENTS` 常量已被弃用。
 2. 要求版本必须固定: `"requirements": ['phue==0.8.1']`
 4. 每个要求都符合 [库要求](api_lib_index.md#basic-library-requirements)。

### 2. 配置

1. 提供用于 [配置验证](development_validation.md) 的 Voluptuous 架构
2. 在 voluptuous 架构中指定默认参数，而不是在 `setup(…)` 中
3. 架构使用来自 `homeassistant.const` 的尽可能多的通用配置键
4. 如果你的组件有平台，请定义 `PLATFORM_SCHEMA` 而不是 `CONFIG_SCHEMA`。
5. 如果使用 `PLATFORM_SCHEMA` 与 `EntityComponent` 一起使用，需从 `homeassistant.helpers.config_validation` 导入基础类
6. 永远不要依赖用户添加内容到 `customize` 来配置组件内部的行为。

### 3. 组件/平台通信

1. 你可以通过利用 `hass.data[DOMAIN]` 与你的平台共享数据。
2. 如果组件获取的数据导致其相关平台实体更新，可以使用 `homeassistant.helpers.dispatcher` 中的调度器代码通知它们。

### 4. 与设备/服务的通信

1. 所有特定于 API 的代码必须成为托管在 PyPi 上的第三方库的一部分。 Home Assistant 应仅与对象交互，而不直接调用 API。

    ```python
    # 不好
    status = requests.get(url("/status"))
    # 好
    from phue import Bridge

    bridge = Bridge(...)
    status = bridge.status()
    ```

    [发布自己的 PyPI 包的教程](https://towardsdatascience.com/how-to-open-source-your-first-python-package-e717444e1da0)
    
    发布 Python 包的其他有价值资源：  
    [Cookiecutter 项目](https://cookiecutter.readthedocs.io/)  
    [flit](https://flit.readthedocs.io/)  
    [Poetry](https://python-poetry.org/)  

### 5. 使你的拉取请求尽可能小

将新集成限制为最低所需的功能，以便有人能够从集成中获得价值。这允许审阅者一次签署较少的代码块，使我们能够更快地获取你的新集成/功能。 **包含大量代码转储的拉取请求不会优先审查，可能会被关闭。**

- 限制为单个平台
- 不要添加不必要的功能来直接支持单个平台（例如自定义服务操作）
- 不要在单个拉取请求中混合清理和新功能。
- 不要在单个拉取请求中解决多个问题。
- 不要提交依赖于尚未合并的其他工作拉取请求。

在“现代化”一个有一段时间没有被触及的集成时，想要打开一个大的 PR 可能很诱人，以利用所有最新功能。正确的方法是尽可能将功能拆分为独立的功能更改，并按顺序提交 PR。

处理顺序 PR 的一种策略是为 `next` PR 从 `current` PR 的分支创建一个分支，然后你可以开始编写代码。这种策略的好处在于，如果你将 PR 拆分成一个依赖于前一个的 PR，因为你正在使用的代码将在 PR 合并后位于 `dev` 中。如果由于更改/审查反馈而向 `current` PR 添加额外的提交，你可以对 `next` PR 的分支进行变基，更容易合并任何合并冲突。一旦你的 `current` PR 被合并，将 `current` PR 分支中的提交压缩到 `next` PR 分支，然后在 `dev` 上变基。然后你可以提交你的 `next` PR 分支进行审查，必要时不断重复此过程。

### 6. 事件名称

使用域名为组件事件名称添加前缀。例如，对于 `netatmo` 组件，请使用 `netatmo_person` 而不是 `person`。请注意我们 [数据科学门户](https://data.home-assistant.io/docs/events/#database-table) 中文档记录的数据结构。

### 7. 测试

强烈考虑为你的组件添加测试，以最小化未来的回归。