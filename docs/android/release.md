---
title: "Android 发布流程"
sidebar_label: "发布流程"
---

## Android 发布流程

本文档概述了将 Android 应用程序从您机器上的开发转移到最终用户生产环境的步骤。它还涵盖了 CI/CD 管道、内部测试、Beta 测试和 Google Play 商店验证的角色。

## 发布工作流程：从调试到生产

### 开发和调试构建

- 在开发期间，您通常会在本地机器上构建 **调试应用程序**。
- 一旦您的更改准备就绪，您将 **拉取请求（PR）** 推送到代码库。

### 持续集成（CI）

- CI 系统会自动：
  - 构建应用程序。
  - 运行检查工具和测试以确保代码质量。
- 如果 PR 得到批准并合并到 `main` 分支：
  - CI 会构建 **发布应用程序**。
  - 发布构建被推送到 Google Play 商店和 Firebase 的 **内部测试者组**。

:::note
您可以从 [GitHub Actions 页面](https://github.com/home-assistant/android/actions/workflows/onPush.yml) 下载 `main` 分支上每个提交的预构建 APK。
:::

### 内部测试

- 内部测试人员验证发布构建以确保功能正常。
- 由于应用程序的复杂性，并非所有功能都能在此阶段进行全面测试。

### 每周 Beta 发布

- 每周，`main` 分支的最新版本会推送到 **公开 Beta** 渠道。
- 公开 Beta 用户帮助测试应用程序在真实场景中的表现并报告问题。

:::note
您可以通过 [Google Play 商店](https://play.google.com/apps/testing/io.homeassistant.companion.android) 直接加入 Beta 计划。
:::

### 生产发布

如果 Beta 版本稳定且经过维护者批准，则会提升为 **生产** 版本，使所有用户可用。

:::note
您可以在 [Google Play 商店](https://play.google.com/store/apps/details?id=io.homeassistant.companion.android) 找到该应用。
:::

## Google Play 商店验证

- Google 在将应用程序推送到 **公开 Beta** 阶段时会进行验证。
- 验证时间可能会有所不同：
  - 在某些情况下，可能需要超过一周的时间。
  - 由于发布是每周进行的，之前的 Beta 发布可能在提交新 Beta 时仍处于验证中。如果发生这种情况，之前的 Beta 会被移除，并且不会被 Google 验证。
- 这种延迟不会阻碍发布流程，但需要仔细规划以确保及时更新。