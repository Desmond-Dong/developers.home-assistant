---
title: "Jetpack Compose 101"
sidebar_label: "Jetpack Compose 101"
---

## 如何在现有应用中创建新屏幕并快速迭代

要在应用中创建新屏幕并快速迭代，请按照以下步骤操作：

1. **提取 Compose UI 屏幕**：  
   为您的 Compose UI 屏幕创建一个专用的 Kotlin 文件。使用 `@Preview` 注解来启用 IDE 中的预览功能。这还使屏幕与 [截图测试](/docs/android/testing/screenshot_testing) 兼容。

2. **利用热重载**：  
   在应用的第一次构建后，导航到您的屏幕。Jetpack Compose 提供开箱即用的热重载功能，允许您实时查看更改。但是，请注意存在一些限制，例如无法重新加载某些结构元素的更改。

3. **有效使用预览**：  
   使用多个 `@Preview` 注解来测试您的屏幕在不同配置下的效果（例如，浅色/深色模式、不同屏幕尺寸）。这有助于确保您的 UI 能够适应各种场景。

## 主题/设计系统

我们使用自定义 Compose 主题 `io.homeassistant.companion.android.util.compose.HomeAssistantAppTheme`，它基于 [Material Design 2](https://m2.material.io/)。您必须使用此主题以确保与应用整体 UI 的一致性。

### 关键点

- **Material Design 2**：该主题遵循 Material Design 2 原则，确保整体外观和感觉的一致性。
- **自定义组件**：如果需要创建自定义组件，请确保它们与现有主题和设计系统相一致。
- **深色模式支持**：该主题支持浅色和深色模式。请在这两种模式下测试您的屏幕，以确保样式正确。

## 与 Jetpack Compose 一起工作的最佳实践

- **保持 UI 代码模块化**：将您的 UI 拆分成小的、可重用的可组合函数。这提高了可读性，并使测试变得更容易。
- **使用状态提升**：遵循 [状态提升模式](https://developer.android.com/jetpack/compose/state#state-hoisting) 有效管理状态。这确保您的可组合函数保持无状态且可重用。
- **使用预览进行测试**：使用 `@Preview` 注解在隔离状态下测试您的可组合函数。添加参数以模拟不同的状态和配置。
- **遵循无障碍指导方针**：确保您的 UI 可访问，通过提供有意义的内容描述并使用无障碍工具进行测试。
- **使用样式**：对文本组件应用适当的样式。

## 示例：创建新屏幕

以下是如何创建新 Compose 屏幕并进行预览的示例：

```kotlin
// filepath: /path/to/your/screen/MyNewScreen.kt

@Composable
fun MyNewScreen(
    title: String,
    onButtonClick: () -> Unit
) {
    HomeAssistantAppTheme {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = title, style = MaterialTheme.typography.h4)
            Spacer(modifier = Modifier.height(16.dp))
            Button(onClick = onButtonClick) {
                Text(text = "点击我")
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MyNewScreenPreview() {
    MyNewScreen(
        title = "欢迎来到 Home Assistant",
        onButtonClick = {}
    )
}