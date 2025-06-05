---
title: "Android 风味"
sidebar_label: "风味"
---

:::info
只有 `:app` 和 `:automotive` 模块受到这些风味的影响。
:::

## 概述

Android 应用程序有两个风味：`full` 和 `minimal`。这些风味允许我们迎合不同用户的偏好。本文档解释了风味之间的差异、它们的特性以及实施背后的原因。

## 应用风味

### 共享代码

我们尽可能地将所有内容保留在风味的源集无关的 `main` 中，以便每个人都能受益于新功能。我们将始终优先考虑开源解决方案（如果可以的话）。

### 完整风味

`full` 风味使用 **Google Play 服务**，启用以下功能：

- 位置追踪
- 推送通知
- 与 Wear OS 设备的通信

此风味是通过 Google Play 商店分发的。

### 最小风味

`minimal` 风味旨在为那些偏好或需要不使用 **Google Play 服务** 的用户而设计。它有以下限制：

- ❌ 无法进行 [存在检测](https://www.home-assistant.io/getting-started/presence-detection/#adding-zone-presence-detection-with-a-mobile-phone) 的位置追踪
- ❌ 无推送通知（除非通过 WebSocket 使用 [本地通知](https://companion.home-assistant.io/docs/notifications/notification-local#requirements)）
- ❌ 无法与 Wear OS 设备通信
- ❌ 无崩溃报告

尽管有这些限制，`minimal` 风味使我们能够将应用程序提供给更广泛的受众，包括不支持 Google Play 服务的设备用户。如果找到可行的开源替代方案以替代 Google Play 服务的功能，则可能会考虑将其纳入 `minimal` 风味以消除这些限制。

此风味用于，例如：

- 通过手动下载 APK 或通过 F-Droid。
- 用于 Meta Quest 设备。
- 用于 OEM 的汽车构建。