---
title: "LeakCanary 🐤"
sidebar_label: "LeakCanary"
---

## 如何在调试构建中禁用 LeakCanary

[LeakCanary](https://square.github.io/leakcanary/) 是一个强大的工具，用于检测 Android 应用程序中的内存泄漏。然而，在某些情况下，您可能希望禁用它，例如在准备性能测试的调试构建时，或者当不需要它时。

### 通过 Gradle 命令禁用 LeakCanary

您可以通过在 Gradle 命令中传递 `-PnoLeakCanary` 标志手动禁用 LeakCanary。例如：

```bash
./gradlew app:assembleFullDebug -PnoLeakCanary
```

此标志确保 LeakCanary 被排除在构建之外。

### 通过属性文件禁用 LeakCanary

或者，您可以通过在 gradle.properties 文件中设置 noLeakCanary 属性来禁用 LeakCanary。这可以在项目级别或主目录级别完成。

```properties
noLeakCanary=true
```

::::warning
如果您禁用 LeakCanary，需要更新锁定文件；否则，Gradle 会对依赖性问题发出警告。

[如何更新锁定文件](/docs/android/tips/dependencies#updating-dependencies-and-lockfiles).
::::

## 使用 LeakCanary 的最佳实践

- **定期监测内存泄漏**：在开发过程中使用 LeakCanary 以尽早识别和修复内存泄漏。
- **记录已知泄漏**：如果内存泄漏是由第三方库引起并且无法立即修复，请记录以备将来参考。
- **报告泄漏**：如果 LeakCanary 报告了泄漏，请打开 GitHub 问题。