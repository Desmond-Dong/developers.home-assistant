---  
title: "Android 单元测试"  
sidebar_label: "单元测试"  
---  

## 为什么我们要进行单元测试？

单元测试帮助你自信地构建功能，并确保你的代码按预期行为运作。它应该是辅助开发的工具，而不是负担。[测试驱动开发 (TDD)](https://en.wikipedia.org/wiki/Test-driven_development) 是一种著名的方法论，其中在实际代码之前或同时编写测试。这种方法让你可以快速验证代码，而不必等待整个应用程序运行。

:::info  
不要仅仅为了写测试而写测试。测试应该在开发过程中帮助你，或帮助未来的开发者维护代码库。  
:::  

单元测试专注于测试 **你的代码**。除非绝对必要，否则避免测试外部库的行为。如果你发现自己在测试库的行为，考虑为该库贡献代码，并在其中添加测试。

:::note  
此规则有例外。在某些情况下，我们增加测试以确保库的行为不会随着时间而变化。在这种情况下，明确记录测试的原因。  
:::  

## 测试公共接口

专注于测试你类的 **公共 API**，而不是每个单独的函数。为所有函数，尤其是小函数编写测试，可能会导致数量庞大的测试，这些测试难以维护。通过专注于公共接口，确保你的测试保持相关性并能抵御内部变化。

当你需要访问类的私有部分进行测试时，考虑使用 [VisibleForTesting](https://developer.android.com/reference/kotlin/androidx/annotation/VisibleForTesting) 注解。这个注解允许你仅出于测试目的暴露私有方法或属性。[linter](/docs/android/linter) 确保这种暴露仅限于测试范围。

:::note  
除非绝对必要，否则避免使用 `VisibleForTesting`。更好的做法是设计你的代码，使其不需要暴露私有成员。  
:::  

## 测试框架和模拟

项目配置为使用 [JUnit 5](https://junit.org/junit5/)，这应该是你的主要测试框架。

### 模拟

在编写单元测试时，你通常需要通过模拟其依赖关系来隔离待测代码。项目使用 [MockK](https://mockk.io/)。使用此工具为外部依赖创建模拟或虚假对象，确保你的测试专注于你的代码行为。

### 在 Gradle 模块之间共享代码

项目包括一个名为 `:testing-unit` 的 Gradle 模块，用于在其他 Gradle 模块之间共享代码。如果该代码在多个模块中使用，请将代码添加到此模块。确保 `:testing-unit` 保持与 `:common` 等模块独立，以避免循环依赖。

## 使用 Android API 进行测试

对于与无法适当地模拟或虚拟的 Android API 交互的代码，项目包括 [Robolectric](https://robolectric.org/)。Robolectric 允许你在 JVM 环境中运行特定于 Android 的测试，避免了使用模拟器的需要。

### 何时使用 Robolectric

- 当测试难以模拟或虚拟的 Android API 时使用 Robolectric。
- 尽可能优先使用 Robolectric 而不是仪器测试，因为仪器测试需要更多资源且设置更复杂。

### 注意事项

- Robolectric 不与 JUnit 5 一起使用（请关注 [问题](https://github.com/robolectric/robolectric/issues/3477)）。为了解决这个问题，项目为需要 Robolectric 的测试包含了 JUnit 4 的依赖。
- 确保你正在测试的代码不依赖于 Android API 的状态，因为这可能导致不可靠的测试。如果是这种情况，请考虑编写 [仪器测试](/docs/android/testing/integration_testing)。

## 单元测试的最佳实践

- **与代码一起编写测试**：在开发时编写测试确保你的代码是可测试的，并降低了错误的风险。
- **关注行为**：测试你的代码的行为，而不是其实现细节。
- **保持测试简洁且专注**：每个测试应验证单一行为或情景。
- **使用描述性的测试名称**：测试名称应清楚地描述正在测试的情景及预期结果。
- **模拟外部依赖**：使用模拟或虚假对象来隔离待测代码。
- **避免过度测试**：除非对功能至关重要，否则不要为琐碎方法或内部实现细节编写测试。

## 示例：编写单元测试

以下是一个使用 JUnit 5 和 MockK 的结构良好的单元测试示例：

```kotlin
@Test
fun `Given a valid user ID when fetching user details then return user data`() {
    // Given
    val userId = "12345"
    val expectedUser = User(id = userId, name = "John Doe")
    every { userRepository.getUser(userId) } returns expectedUser

    // When
    val result = userService.getUserDetails(userId)

    // Then
    assertEquals(expectedUser, result)
}
```  