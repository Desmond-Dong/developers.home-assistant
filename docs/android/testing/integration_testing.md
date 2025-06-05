---
title: "Android 集成测试"
sidebar_label: "集成测试"
---

## 为什么要进行集成测试？

[单元测试](/docs/android/testing/unit_testing) 很好，并且应该是您编写测试时的主要选择。然而，集成测试确保应用程序在真实 Android 环境中的行为得到验证。集成测试通过模拟器在真实的 Android 操作系统上运行，使用最终用户将使用的相同 JVM。

### 在真实 JVM 上测试

在开发过程中，您可能只在最新的 Android 操作系统版本或您本地安装的 JVM 上进行测试，可能是 JDK 21。然而，请记住以下几点：

- Android API 21 仅部分支持 [Java 8 语言特性](https://developer.android.com/studio/write/java8-support)。
- Android 使用一个专用的 [运行时](https://source.android.com/docs/core/runtime)，与您开发环境中使用的运行时不同（通常用于执行单元测试）。

#### 具体示例

考虑 [Jackson 库](https://github.com/FasterXML/jackson)。从版本 2.14 开始，它要求至少 Android 版本为 26。遗憾的是，这个错误仅在运行时出现，这意味着捕获它的唯一方法是通过仪器测试或用户报告的崩溃。您可以在这个 [PR](https://github.com/home-assistant/android/pull/5108) 中看到这个问题的具体示例。

### 有 UI 还是没有 UI？

集成测试不总是涉及显示 UI。它们也用于测试 [前台服务](https://developer.android.com/develop/background-work/services/fgs)，在这些情况下，不显示 UI。在这些情况下，我们只验证数据和与系统的交互。

### 使用相应的 Home Assistant Core 版本进行测试

:::note
这些测试目前正在开发中
:::

我们的目标是针对最新版本的 Home Assistant Core 运行集成测试。这确保当前代码与核心版本无缝协作。

### 在没有 Home Assistant Core 的情况下进行测试

我们的测试大多数不应依赖 Home Assistant Core，以避免引入额外的错误源。这些测试设计用于验证用户交互期间屏幕的行为。为此，我们使用 [Espresso](https://developer.android.com/training/testing/espresso) 框架。

在这种情况下，与核心的交互可以使用 [mockk](https://mockk.io/) 的模拟进行替换，甚至更好，使用假对象来控制行为。

## Android 模拟器的脆弱性

Android 模拟器 notoriously unreliable。偶尔，平台可能因未知原因而失败。唯一的解决方案是重新启动作业。请注意，只有维护者可以重新运行作业。

## 在 Android 5 (API 21) 上进行测试

如果您的测试需要 WebView，您可能需要遵循这些 [Lollipop 模拟器的提示](/docs/android/tips/lollipop_emulator.md)。