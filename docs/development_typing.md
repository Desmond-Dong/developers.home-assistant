---
title: "为您的代码添加类型提示"
---

Python中的类型提示是对变量和函数的静态注解，以便让人类更容易理解代码。请参见标准库的 [文档](https://docs.python.org/3/library/typing.html) 和这场PyCascades 2018年的 [演讲](https://youtu.be/zKre4DKAB30)。

目前在Home Assistant中，并不是所有模块都需要类型提示，但我们旨在尽可能涵盖所有模块。为了改善和鼓励这一点，我们在持续集成过程中对所有代码进行类型检查，并假设所有内容都经过类型检查，除非明确排除在类型检查之外。

向现有代码库添加类型提示可能是一项艰巨的任务。为了加快这一进程并帮助开发人员完成此任务，Instagram创建了 [`monkeytype`](https://pypi.org/project/MonkeyType/) 程序。它将在运行时分析调用，并尝试为代码分配正确的类型提示。

请参见 [这篇Instagram博客文章](https://instagram-engineering.com/let-your-code-type-hint-itself-introducing-open-source-monkeytype-a855c7284881)，了解使用monkeytype程序的工作流程描述。

我们添加了一个脚本，以启动我们的测试套件或测试模块的运行，并告诉`monkeytype`程序分析该运行。

### 基本工作流程

1. 运行 `script/monkeytype tests/path/to/your_test_module.py`。
2. 运行 `monkeytype stub homeassistant.your_actual_module`。
3. 查看来自monkeytyped类型存根的输出。如果不是很糟糕，将存根应用到您的模块。您可能需要在最后一步手动编辑类型。
4. 运行 `monkeytype apply homeassistant.your_actual_module`。
5. 检查差异，如果需要，手动更正类型。提交、推送分支并创建PR。

**注意：**
将monkeytyped存根应用于已经存在类型注解的模块可能会出错并且无法工作。此工具对完全未类型的模块最为有用。

### 包含模块以进行严格类型检查

虽然我们鼓励使用类型提示，但目前不要求我们的集成使用它们。
默认情况下，我们的CI会静态检查类型提示。如果某个模块已经完全类型化，则可以
通过将该模块添加到位于Home Assistant Core项目根目录下的 `.strict-typing` 文件中来标记为启用严格检查。