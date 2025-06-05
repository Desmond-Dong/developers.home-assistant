---
title: "提示和技巧"
---

此页面提供了一些提示和技巧，可能会帮助您作为 Home Assistant 的贡献者。这里的列表绝对不是详尽无遗的，如果您获得了任何其他未经文档记录的提示和技巧，请打开 PR 将它们添加到此处。

## 提示和技巧

### 保持 PR 简洁

请查看 [组件检查列表](/docs/creating_component_code_review#5-make-your-pull-request-as-small-as-possible) 以了解 PR 的期望。

### 在 Home Assistant 中测试包依赖更改

有关更多信息，请查看 [API 库文档](/docs/api_lib_index#trying-your-library-inside-home-assistant)。

### 在您的生产 Home Assistant 环境中测试核心集成更改

要在您的生产 Home Assistant 环境中测试核心集成更改：
1. 将集成文件夹复制到 `/config/custom_components`。
2. 在 `manifest.json` 中添加一个 **version** 字段（例如，`"version": "0.0.0"`）。
3. 如果集成使用本地化字符串，请根据 [自定义集成本地化](/docs/internationalization/custom_integration) 的描述，将 `strings.json` 复制到集成文件夹中的 `translations/en.json`。
4. 重启 Home Assistant。

Home Assistant 将始终优先考虑 `custom_components` 中的集成，而不是核心集成。测试完成后不要忘记将其删除；否则，您将停留在该版本上。

### 添加配置流程时，请注意前端

Home Assistant 前端缓存非常激进，因此，第一次使用您的新更改运行 Home Assistant 时，您可能不会在集成列表中看到集成。检查日志以确保没有错误，如果没有，请对您的浏览器窗口执行强制刷新，然后再试一次；在许多情况下，这将解决您的问题。

### 获取额外支持

在 Home Assistant [Discord](https://www.home-assistant.io/join-chat/) 服务器上的 `#developers` 是提出问题的好地方。专业提示：在您发布问题之前，将您正在处理的代码推送到一个分支，并将该分支推送到某个公共位置，并在您的问题中粘贴一个链接，以便帮助您的人员可以看到您的代码。请不要在频道中粘贴代码块，因为这很难阅读，并且会掩盖其他问题/讨论。

如果您看到可以改善开发者文档的方法，请将其转发并提交一个 PR 以更新文档。有关更多详细信息，请参见下一个提示。

### 开发者文档中的信息缺失

Home Assistant 的维护者努力保持开发者文档的最新，但我们也依赖像您这样的贡献者来帮助我们纠正、改进和扩展现有文档。像 Home Assistant 一样，这份 [文档是开源的](https://github.com/home-assistant/developers.home-assistant)，欢迎 PR。如果有疑问，请单击左下角的 `编辑此页面` 按钮以访问源文件并直接在 GitHub 上编辑该文件。无需命令行！