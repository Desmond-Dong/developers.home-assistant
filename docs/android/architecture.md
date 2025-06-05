---
title: "Android架构"
sidebar_label: "架构"
---

## 介绍

Home Assistant的Android项目始于2019年。从那时起，Android生态系统发生了显著变化，许多贡献者塑造了这个项目。因此，您可能会遇到不符合当前最佳实践的遗留代码。本文档作为应用架构和开发实践的真实来源。

Home Assistant在[PWA](https://en.wikipedia.org/wiki/Progressive_web_app)开发方面一直处于领先地位，这一理念在原生应用中得到了体现。应用的核心是一个[WebView](https://developer.android.com/reference/android/webkit/WebView)，它与Home Assistant的前端集成。随着时间的推移，增加了本地功能，例如后台传感器数据收集。

## 核心原则

### Kotlin优先

整个代码库使用[Kotlin](https://kotlinlang.org)编写，确保现代、简洁和类型安全的开发。

### Android版本支持

- **目标SDK**：我们旨在跟上最新的Android SDK发布，并在新版本发布时进行测试。
- **最小SDK**：为了确保广泛兼容性，应用支持Android [Lollipop](https://en.wikipedia.org/wiki/Android_Lollipop)（API 21）。

## 应用架构

我们遵循谷歌推荐的[Android架构](https://developer.android.com/topic/architecture)，并从[NowInAndroid仓库](https://github.com/android/nowinandroid)中汲取灵感。

### 构建逻辑

该项目使用多个Gradle模块。共享逻辑集中在一个名为`build-logic`的单独Gradle项目中，通过`includeBuild`包含在主项目中。

### 共享Gradle模块

为了在不同应用之间共享代码，我们使用一个名为`:common`的共享Gradle模块。

## 用户界面开发

### 原生用户界面

所有新的UI组件都是使用[Jetpack Compose](https://developer.android.com/compose)构建的，确保以现代和声明性的方法进行UI开发。

### 遗留用户界面

应用中仍然存在一些遗留的XML布局、`databinding`和`viewbinding`。这些应该在持续的现代化工作中替换为Compose。

### 主题

该应用使用多个主题，以支持遗留的XML和基于Compose的用户界面。所有新的组件应该使用`HomeAssistantAppTheme`，该主题基于[Material Design](https://developer.android.com/develop/ui/compose/components)。

## 关键特性

### 依赖注入（DI）

我们广泛使用[Hilt](https://developer.android.com/training/dependency-injection/hilt-android)进行依赖注入，确保代码模块化和可测试。

### 并发

所有并发都使用[Kotlin协程](https://kotlinlang.org/docs/coroutines-overview.html)进行处理，提供了一种结构化和高效的方式来管理异步任务。

### 服务

我们使用[前台服务](https://developer.android.com/develop/background-work/services/fgs)来检索传感器值并异步上传到Home Assistant Core。

### WebSocket

应用维持与Home Assistant Core的WebSocket的直接连接，使用[OkHttp](https://square.github.io/okhttp/)。这对于助手和实时讨论等功能至关重要。

### REST API

与Home Assistant的REST API的通信使用[Retrofit](https://square.github.io/retrofit/)处理，便于与后端的无缝交互。

### 本地存储

- **Room**：用户数据使用[Room](https://developer.android.com/training/data-storage/room)在本地存储，提供了强大的数据库解决方案。
- **SharedPreferences**：对于应用特定的设置，我们使用带有抽象层的[SharedPreferences](https://developer.android.com/reference/android/content/SharedPreferences)，该抽象层名为`LocalStorage`。

### 深度链接

该应用支持使用`homeassistant://` URLs进行深度链接，以导航到应用的特定部分。有关更多详细信息，请参阅[用户文档](https://companion.home-assistant.io/docs/integrations/url-handler/)。

## 特定平台的功能

### 汽车

汽车应用重用了`:app`模块的源代码，简化了开发。

### Wear OS

Wear OS应用与移动应用通信，以获取Home Assistant服务器的凭证和其他配置，使用[消息API](https://developer.android.com/training/wearables/data/messages)。它仅适用于`full`风味，因为它需要Google Play服务。一旦初始设置完成，所有后续通信都将通过WebSocket和为应用创建的[webhook](/docs/api/native-app-integration/sending-data)直接与Home Assistant进行处理。