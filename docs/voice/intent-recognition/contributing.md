---
title: "贡献模板句子"
sidebar_label: "贡献句子"
---

模板句子需要贡献到我们的 [GitHub Intents 仓库](https://github.com/home-assistant/intents)。句子将由 [语言负责人](../language-leaders) 进行审核，如果正确将进行合并。您可以贡献新的句子或改进现有的句子。

Intent 仓库的结构如下：

- `sentences/<language>/` - 每种语言的模板句子 - [了解更多](template-sentence-syntax)
- `tests/<language>/` - 每种语言的测试 - [了解更多](test-syntax)

我们更喜欢大量小的贡献，而不是少量大的贡献。包含大量更改的贡献很难审核。这就是为什么我们希望每个贡献限制在单一语言和单一领域内。

句子和测试的文件名格式为 `<domain>_<intent>.yaml`。因此，如果您要为封面领域作贡献，您需要更新以下文件：

- `sentences/<language>/cover_HassCoverOpen.yaml`
- `sentences/<language>/cover_HassCoverClose.yaml`
- `tests/<language>/cover_HassCoverOpen.yaml`
- `tests/<language>/cover_HassCoverClose.yaml`

## 如何贡献

所有贡献通过 GitHub 上的 Pull Requests 完成。我们推荐的方式是使用 GitHub CodeSpaces。 [按照此教程开始。](https://github.com/home-assistant/intents/blob/main/docs/codespace/README.md)

我们的仓库有很多检查，您可以用来确保您贡献的句子是有效的。您可以通过 VS Code 的 `terminal -> run task` 在本地运行它们。

当您创建 Pull Request 时，这些检查也会自动运行。如果检查失败，则无法接受贡献。

## 添加新语言

新语言应基于 `python3 -m script.intentfest add_language <language code> <language name>` 的输出，该命令生成一个包含新语言所需所有文件的空语言目录。

将第一次贡献限制为翻译 `_common.yaml` 中的错误句子以及为 `homeassistant` 领域添加句子和测试。

如果您无法在本地运行 add_language 脚本，请在 Discord 中请求维护者为您运行。