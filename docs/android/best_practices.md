---
title: "Android 最佳实践"
sidebar_label: "最佳实践"
---

## 一般原则

一般来说，我们应该遵循标准的开发原则，例如：

- **SOLID**：单一职责、开闭原则、里氏替换、接口分隔、依赖反转。了解更多请查看 [Kotlin SOLID 原则示例](https://medium.com/huawei-developers/kotlin-solid-principles-tutorial-examples-192bf8c049dd)
- **KISS**：保持简单，愚蠢。
- **DRY**：不要重复自己
- **社区指南**：遵循 [NowInAndroid](https://github.com/android/nowinandroid) 资源库中展示的实践。

## 文档

代码中的文档应带来价值并随代码库的演变而演变。请记住以下几点：

- **保持最新**：文档必须在代码更改时进行更新。
- **平衡注释**：避免过多注释，但不要忘记在必要的地方添加注释。
- **面向未来**：问问自己，“*在六个月后，我会理解我所做的事情吗？*”

:::info
文档应该提供帮助，而不是阻碍。
:::

## 日志

日志是必不可少的，但应谨慎使用。正如 Jake Wharton 在他的 [Timber](https://github.com/JakeWharton/timber) 库中所说：

> 每次你在生产环境中记录日志时，一只小狗就会死去。

- 避免在生产环境中记录过多日志。
- 使用结构化和有意义的日志消息。
- 利用像 Timber 这样的工具有效管理日志。

## 时间和持续时间

处理时间、日期或持续时间时，避免使用原始类型。相反，使用强类型以防止单位混淆。

### ❌ 不要这样做

```kotlin
const val THRESHOLD = 600000

fun main() {
    val now = System.currentTimeMillis()
    
    if (now > THRESHOLD) {
        // 做一些事情
    }
}
```

### ✅ 这样做

```kotlin
val THRESHOLD = Instant.ofEpochSecond(60)

fun main() {
    val now = Instant.now()

    if (now > THRESHOLD) {
        // 做一些事情
    }
}
```

:::warning
如果必须使用原始类型，请确保变量名包含单位（例如，`THRESHOLD_MS` 而不是 `THRESHOLD`），以减少歧义。
:::

- 将相同的逻辑应用于日期、持续时间和时间戳。
- 对于使用 `long` 作为时间戳的 API（例如，毫秒与秒），请尽早将值转换为强类型，以最小化对无类型单位的暴露。

## 并发

并发很强大，但需要谨慎处理，以避免诸如内存泄漏和竞争条件等问题。

### 协程作用域

将协程绑定到 Android 生命周期（例如，`viewModelScope` 或 `lifecycleScope`）以防止内存泄漏。

### 并发访问

- 确保在协程之外访问的任何引用是线程安全的。
- 如果引用不安全，要么使其安全，要么不使用它。
- 调试并发问题（例如，竞争条件）可能非常具有挑战性，因此请谨慎设计。

有关竞争条件的更多细节，请参见 [竞争条件](https://en.wikipedia.org/wiki/Race_condition#In_software)。

## 代码组织

### 保持类小巧

- 大类往往有太多职责，使其更难以审查、测试和维护。
- 目标是构建小类，适当地分离关注点和抽象。

### 保持函数小且有意义

- 函数应该小且专注于单一职责。
- 函数的名称应清楚地描述其功能。如果命名困难，该函数可能做得太多。
- 命名良好的小函数减少了对文档的需求，使代码自解释。

:::note
命名很难，但小函数使选择有意义的名称变得更容易。
:::

## 保持你的 PR 小巧

- **为什么？** 较小的 PR 更容易审查，减少延迟，并降低挫败感。
- **如何？** 将大型更改拆分为较小的逻辑块。

有关更多细节，请参见 [提交](/docs/android/submit)。

## 其他说明

- **测试**：为关键功能编写 [单元测试](/docs/android/testing/unit_testing)，以确保可靠性。
- **代码审查**：始终审查代码以确保遵循这些最佳实践。