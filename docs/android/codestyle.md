---
title: "Android 代码风格"
sidebar_label: "代码风格"
---

## 为什么要强制代码风格

我们旨在维护一个 **一致和标准的代码库**。通过强制执行代码风格：

- 我们减少 PR 上不必要的评论，使审查者可以专注于逻辑而不是格式。
- 我们确保代码更易于阅读和维护。

## 语言指南

- 所有代码必须用 **英语** 编写。
- 避免拼写错误和语法错误。虽然错误是可以接受的（因为许多贡献者不是母语者），但鼓励审查者建议更正。
- 使用拼写检查工具来帮助纠正错误。

## KTLint 格式化工具

我们使用 [KTLint](https://pinterest.github.io/ktlint) 来强制执行 Kotlin 代码风格。它已集成到我们的 Gradle 模块中，并通过 `.editorconfig` 文件进行配置。

### 自定义规则

在必要时，我们会覆盖一些 KTLint 规则。要启用或禁用某个规则：

1. 提交一个 **专用的 PR**，并对更改进行适当的解释。
2. 如果更改影响代码库，请创建 **两个提交**：
   - 一个用于更新规则。
   - 另一个用于应用更改。

:::note
在被覆盖的规则上方的 `.editorconfig` 文件中添加备注，解释为什么更改了它。如果需要更多解释，可以链接到 GitHub 问题。
:::

### 运行 KTLint

您可以通过 Gradle 使用 KTLint 自动重新格式化代码：

```bash
./gradlew :build-logic:convention:ktlintFormat ktlintFormat
```

### CI 集成

如果检测到 KTLint 错误，CI 将失败，GitHub 会使用生成的 [SARIF](/docs/android/tips/sarif_reports.md) 报告在 PR 中报告该错误。

## Yamllint

我们使用 [Yamllint](https://github.com/adrienverge/yamllint) 来强制执行 YAML 格式。所有 YAML 文件遵循 `github` 格式。

### 运行 Yamllint

在存储库根目录运行以下命令以检查 YAML 格式：

```bash
yamllint --strict --format github .
```

:::note
Yamllint 不会重新格式化您的代码；它仅报告需要修复的错误。使用您的 IDE 代码格式化工具或手动修复问题。
:::

### CI 集成

如果 YAML 格式无效，CI 将阻止 PR。

## 避免使用 TODO

代码中的 TODO 在时间推移中往往被遗忘。当某人稍后阅读它们时，它们通常已经过时或不相关。我们建议您在代码中避免使用 TODO。然而，如果在审查过程中，您和审查者一致认为某些内容需要稍后处理，则应创建一个 `TODO`。为了正确跟踪 TODO，请始终将其与 GitHub 问题关联。

### 示例

```bash
// TODO 缺失功能（链接问题 #404）
```

## 常量

### 命名约定

我们遵循 [Kotlin 属性命名指南](https://kotlinlang.org/docs/coding-conventions.html#property-names)。

### 避免魔法数字和字符串

代码中的魔法数字或字符串会使理解值的目的变得困难，从而导致维护性差。始终用命名常量替换魔法数字或字符串。

#### ❌ 不要这样做

```kotlin
if (value == 42) {
  // 做一些事情
}
```

在这个例子中，不清楚为什么使用值 42。至少，您应该添加一个注释来解释它的目的。将其定义为常量更好，因为它提供了一个清晰的描述性名称，使代码更易于阅读、理解和维护。此外，在一个地方定义该值有助于在代码库的其他地方重用，比如在测试或在函数、类或其他模块中。这种方法简化了未来的更改，因为在一个地方更新常量会自动在使用它的地方传播更改。它还允许您使用 IDE 轻松找到常量的使用位置，避免搜索“42”时产生不相关的结果。

#### ✅ 这样做

```kotlin
// 关于我们为什么选择 42 的解释或链接
const val SUPER_IMPORTANT_THRESHOLD = 42

if (value == SUPER_IMPORTANT_THRESHOLD) {
    // 做一些事情
}
```

### 组织常量

常量应当有条理地组织，以确保清晰性、可维护性和一致性。遵循以下指南来确定在何处以及如何定义常量：

1. 如果常量暴露在文件外部，它在导入时应易于识别，或者通过自己的名称或其父级的名称。
2. 大多数常量应在与之关联的类的同一文件中定义（如果可能，放在 `companion object` 外）。
3. 如果文件中的常量太多，请将它们移动到一个专用文件中，并以 `object` 分组以提供命名空间。

:::note
这一指南是最近引入的，目的是标准化代码库中常量的使用。因此，您可能会遇到违反此指南的实例。请随时在遇到这些问题时进行纠正，以帮助提升代码质量。
:::

#### 与类一起

对于与特定类紧密关联的常量，在与类同一文件中定义它们。避免使用 `companion object`，除非绝对必要。相反，将私有常量放在文件顶部，类定义之外。这种方法减少了样板代码，使类更专注。

**示例：**

```kotlin
// 文件路径: UserRepository.kt
package io.homeassistant.companion.android.user

private const val DEFAULT_USER_ID = "guest"

class UserRepository {
    fun getUserById(userId: String = DEFAULT_USER_ID): User {
        // 这里的实现
    }
}
```

:::note
如果您在测试中需要常量而不想将其暴露给其他生产代码，请使用 `VisibleForTesting` 注解。

```kotlin
@VisibleForTesting
const val DEFAULT_USER_ID = "guest"
```

:::

#### 使用伴生对象

何时使用伴生对象：

- **进行外部使用的命名空间**：当常量或工具函数必须被外部访问时（例如，公开或内部）。
- **有意的命名冲突**：当同一文件中的多个类或实体共享同名称的概念相似的常量时（例如，EMPTY、DEFAULT）。

**示例：**

```kotlin
// 文件路径: ApiClient.kt
package io.homeassistant.companion.android.network

class RestApiClient {
    companion object {
        val DEFAULT_TIMEOUT = 60.seconds
    }
}

class WSClient {
    companion object {
        val DEFAULT_TIMEOUT = 10.seconds
    }
}
```

#### 在专用文件中使用对象

如果文件中有太多常量，或者常量在多个类或模块之间共享，请将其移动到专用文件中。使用对象对相关常量进行分组并提供命名空间。文件应以 `*Constants.kt` 为后缀。

```kotlin
// 文件路径: NetworkConstants.kt
package io.homeassistant.companion.android.network

object NetworkConstants {
    val TIMEOUT = 30.seconds
    const val BASE_URL = "https://api.example.com"
}

object WSConstants {
    val KEEP_ALIVE_INTERVAL = 5.seconds
}