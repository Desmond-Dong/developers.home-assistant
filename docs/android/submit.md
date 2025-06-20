---
title: "Android 提交贡献"
sidebar_label: "提交贡献"
---

## 提交你的首次贡献

首先，感谢你的贡献！现在是时候获取反馈，并将你的工作准备好给真正的用户。请遵循 [GitHub 文档](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) 从你的分叉创建一个拉取请求（PR）。

### 提交 PR 的检查清单

在创建 PR 时，GitHub 会预填充描述，并附带一个检查清单。确保你遵循所有步骤。以下是一个扩展的检查清单，以帮助你：

- **PR 描述**：提供对你更改的清晰和完整的描述。
- **测试**：按照我们的 [测试指南](/docs/android/testing/introduction) 添加所有必要的测试。
- **文档**：确保你的代码有适当的文档。
- **UI 更改**：如果 UI 被修改，请包含屏幕截图。
- **用户文档**：如果用户文档需要更新，请在 [GitHub](https://github.com/home-assistant/companion.home-assistant) 上打开 PR。
- **开发者文档**：如果此文档需要更新，请在 [GitHub](https://github.com/home-assistant/developers.home-assistant/) 上打开 PR。
- **构建**：验证所有内容是否在本地正确构建（应用程序、汽车、佩戴设备）。
- **最佳实践**：遵循 [最佳实践](/docs/android/best_practices)。
- **代码风格**：遵循 [代码风格](/docs/android/codestyle)。
- **Linting**：确保没有引入 lint 问题 ([linter](/docs/android/linter))。

### 打开草稿 PR

如果你的 PR 尚未准备好进行正式审查，但你希望获得反馈，可以选择**草稿模式**打开。这在处理 CI 相关更改或未完成功能时特别有用。

#### CI 触发

如果你是新贡献者，每次 CI 运行都必须获得维护者的批准。

:::warning
**避免不必要的 CI 运行**  
运行 CI 工作流会消耗大量资源。如果你的工作尚未完成，请推迟打开 PR（即使是草稿模式），除非必要。让我们关注资源使用和我们的地球。🌍 但这并不妨碍你定期推送以避免丢失你的工作。
:::

### 审查过程

#### 谁可以审查？

每个人都可以对你的 PR 发表评论，因为它是公开的。我们鼓励通过审查来贡献。审查可能比编码更快，甚至 10 分钟的审查也可以非常有价值。

如果你对**审查**不自信，你仍然可以通过以下方式提供帮助：

- 通过安装 APK（可在 PR 的检查标签中找到；你必须登录你的 GitHub 账户才能访问）测试功能。
- 提供有关 UI/UX 的反馈。
- 报告崩溃或漏洞。

#### 获取维护者的批准

一旦你的 PR 满足检查清单的要求，请等待维护者进行审查。请记住，维护者是自愿在闲暇时间做出贡献的人。要尊重、耐心和友善。

维护者的反馈将以以下形式出现：

- **评论**：对代码的建议或所需更改。
- **问题**：关于功能如何工作的提问。

### 收到反馈后的步骤

#### 重新请求审查

如果你已经处理了反馈并推送了更改到你的 PR，可以请求维护者进行重新审查。在这样做之前，确保 CI 状态正常。

### 合并你的 PR

- 保持你的 PR 与 `main` 分支同步。  
- 一旦一切都正常并得到维护者的批准，他们将合并你的 PR。你不需要采取任何进一步的行动。

### 自动问题和 PR 关闭

我们的机器人在 **90 天** 无活动后将问题/PR 标记为过时。如果在 **7 天** 后仍无活动，问题/PR 将被自动关闭。

---

感谢你对 Home Assistant 的贡献！ 🎉