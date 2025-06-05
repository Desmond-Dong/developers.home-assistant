---
title: "Android 检查工具"
sidebar_label: "检查工具"
---

## 什么是检查工具？

检查工具是一个静态代码分析器，帮助识别代码中的众所周知的问题和潜在的改进。它超越了编译器的功能，通过确保语言的正确使用和遵循最佳实践来提升代码质量。虽然编译器通过语法验证代码，但检查工具专注于代码的质量和架构。

:::note
没有检查工具的投诉并不意味着一切都完美。仍然需要另一位开发者进行审查以进行双重检查。
:::

## 为什么使用检查工具？

使用检查工具可以确保：

- **一致性**：强制执行标准的代码风格，类似于我们的 [代码风格](/docs/android/codestyle)。
- **专注**：使审查者能够专注于逻辑，而不是格式或琐碎的问题。
- **预防**：通过捕捉常见错误来帮助避免崩溃和错误，例如使用不受目标 Android API 级别支持的 API。

例如，在使用不受支持的 API 之前未检查 Android API 版本可能会导致崩溃。

## 项目中使用的检查工具

### KTLint

我们使用 [KTLint](https://pinterest.github.io/ktlint) 作为我们的 Kotlin 检查工具，集成通过 [Gradle 插件](https://github.com/JLLeitschuh/ktlint-gradle)。配置位于主要的 `build.gradle.kts` 文件中。我们主要使用默认配置，但启用 [SARIF](/docs/android/tips/sarif_reports) 报告以在 GitHub Actions 中注释拉取请求中的问题。

#### 忽略问题

始终尝试修复问题，而不是忽略它们。如果必须忽略，请遵循以下步骤：

1. 对特定结构使用 `@Suppress` 注解：
   ```kotlin
   @Suppress("trailing-comma-on-call-site")
    fun myCallSiteExample() {
        myFunction(
            "value1",
            "value2", // 这个尾随逗号通常会导致警告
        )
    }
   ```

2. 对于整个项目的抑制，请按照 [本指南](https://pinterest.github.io/ktlint/0.49.1/faq/#how-do-i-globally-disable-a-rule-without-editorconfig) 更新 `.editorconfig` 文件。打开一个专门的 PR，并解释禁用规则的原因：
    ```editorconfig
    ...
    # 允许尾随逗号，但不强制遵循 Kotlin 约定
    ktlint_standard_trailing-comma-on-call-site = disabled
    ij_kotlin_allow_trailing_comma_on_call_site = true
    ktlint_standard_trailing-comma-on-declaration-site = disabled
    ij_kotlin_allow_trailing_comma = true
    ```

#### 在本地运行 KTLint

运行以下命令检查版本库中的所有代码：

```bash
./gradlew ktlintCheck :build-logic:convention:ktlintCheck --continue
```

:::note
使用 `--continue` 可以获取所有 Gradle 模块中的问题，而不是在第一个失败时停止。
:::

您可以通过运行以下命令将此检查添加到 git [预提交钩子](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) 以自动运行

```bash
./gradlew addKtlintCheckGitPreCommitHook
```

### Android 检查工具

Android 检查工具已为所有变体启用，以确保全面检查。其配置位于 `build-logic/convention/src/main/kotlin/AndroidCommonConventionPlugin.kt`。为 GitHub Actions 生成 SARIF 报告，以注释拉取请求中的问题。

#### 忽略问题

按照以下步骤忽略问题：

1. 对特定结构使用 `@Suppress` 注解。
2. 将问题添加到 `lint-baseline.xml` 文件中。（查看 [如何](#updating-the-baseline)）
3. 直接在 lint 设置中禁用该问题。

如果您禁用问题，请打开一个专门的 PR 进行解释。

#### 在本地运行 Android 检查工具

运行以下命令：

```bash
./gradlew lintDebug --continue
```

:::note
使用 `--continue` 可以获取所有 Gradle 模块中的问题，而不是在第一个失败时停止。
:::

## 管理 lint 规则

### 更改问题的 lint 级别

Android 检查工具附带了捆绑在 Android Gradle 插件中的预定义规则。一些库，例如 [Timber](https://github.com/JakeWharton/timber)，还提供自定义 lint 规则。

要更改规则的严重性，请在 `build-logic/convention/src/main/kotlin/AndroidCommonConventionPlugin.kt` 中更新 Gradle 配置：

```kotlin
lint {
    ...
    disable += "MissingTranslation"
    error += "LogNotTimber"
}
```

- **`LogNotTimber`**：从警告提升为错误，以强制使用 Timber 而不是传统记录器。
- **`MissingTranslation`**：因翻译仅在 CI 发布构建时添加而禁用。

对于 lint 级别的更改，应在 PR 中进行，并附上清晰的解释。

## 基准管理

### 基准是什么？

基准是每个 Gradle 模块中的 XML 文件 (`lint-baseline.xml`)，列出了被忽略的错误。它是在第一次启用检查工具时创建的，以避免修复数百个已有问题。

:::note
一个很好的首次贡献是通过修复问题从基准中删除它们。
:::

### 更新基准

在更新 Android Gradle 插件时，可能会出现新的 lint 问题，或现有问题可能会有所变化。要重新生成基准：

```bash
./gradlew updateLintBaseline
```

更新后，请审查被忽略的错误，以确定它们是现在解决还是稍后解决。根据需要打开 GitHub PR 或问题。

## 扩展 lint 规则

我们鼓励您提出针对我们项目的新的检查工具规则。这些规则可以帮助识别 API 的误用或强制执行设计模式。

## 贡献者提示

- 尽可能修复 lint 问题，而不是忽略它们。
- 在 PR 中为任何 lint 配置或基准的更改提供清晰的解释。
- 在本地使用检查工具以提前捕捉问题，节省 CI 资源。

祝检查顺利！ 🚀