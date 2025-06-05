---
title: "提交你的工作"
---

:::tip
始终基于当前的 **`dev`** 分支而不是 `master` 创建你的 Pull Requests。
:::

将您的改进、修复和新功能逐一提交给 Home Assistant，使用 GitHub [Pull Requests](https://docs.github.com/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)。以下是步骤：

1. 从您分叉的 dev 分支创建一个新分支来保存您的更改：

    `git checkout -b some-feature`

2. 进行更改，创建一个 [新平台](creating_platform_index.md)，开发一个 [新集成](creating_component_index.md)，或修复 [问题](https://github.com/home-assistant/core/issues)。

3. [测试您的更改](development_testing.md) 并检查样式违规。  
    考虑添加测试以确保您的代码正常工作。

4. 如果一切看起来都不错，按照这些 [要求](development_checklist.md) 提交您的更改：

    `git add .`

    `git commit -m "添加一些功能"`

     - 编写有意义的提交消息，而不仅仅是像 `更新` 或 `修复` 之类的内容。
     - 用大写字母开头写您的提交消息，并且不要以句号（全句）结束。
     - 不要在提交消息前加上 `[bla.bla]` 或 `platform:`。
     - 使用祈使语气写提交消息，例如 `添加一些功能` 而不是 `添加了一些功能`。
     

5. 将您的提交更改推送回 GitHub 上的分叉：

    `git push origin HEAD`

6. 按照 [这些步骤](https://docs.github.com/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) 创建您的 pull request。

    - 在 GitHub 上，导航到 [Home Assistant 存储库的主页](https://github.com/home-assistant/core)。
    - 在“分支”菜单中，选择包含您提交的分支（来自您的分叉）。
    - 在分支菜单右侧，点击 **新建 pull request**。
    - 使用基础分支下拉菜单选择您希望合并更改的分支，然后使用比较分支下拉菜单选择您做更改的主题分支。确保 Home Assistant 分支与您的分叉分支（`dev`）匹配，否则您将提议两个分支之间的所有提交。
    - 输入标题并完整填写提供的 pull request 模板。
    - 点击 **创建 pull request**。

7. 检查您的 pull request 上的评论和建议，并关注 [CI 输出](https://github.com/home-assistant/core/actions)。

:::info
如果这是您第一次提交 pull request，CI 将在维护者批准运行之前不会运行。请耐心等待，维护者会最终来审批它。
:::