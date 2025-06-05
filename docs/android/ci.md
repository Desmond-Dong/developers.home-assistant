---
title: "Android持续集成和交付"
sidebar_label: "持续集成和交付"
---

## Android持续集成和交付

本文档概述了Android项目的持续集成（CI）和持续交付（CD）过程。我们使用**GitHub Actions**作为我们的CI/CD平台，配置多个工作流以确保代码质量、自动化构建和简化部署。

## 概述

我们的CI/CD过程的主要目标是：

- ✅ 验证一切是否按预期工作。
- 🚨 如果出现故障，通知相关人员。
- 🚀 实现应用程序的完全自动化持续交付。
- 🔄 通过将公共代码提取到`.github/actions`下的可重用本地操作中来避免重复。

## 版本管理

我们遵循与核心项目相同的版本管理惯例，使用[CalVer]（日历版本ing）。这确保了所有发布版本的一致性。

## 工作流

### 在拉取请求时

当拉取请求（PR）被打开或更新时，`pr.yml`工作流被触发。其目标是：

- 🧹 验证代码是否符合我们的[代码检查工具](/docs/android/linter)。
- 🔨 确保代码成功构建。
- ✅ 运行所有测试以验证正确性。
- 📦 在GitHub Actions标签中持久化生成的APK以供审查。

如果任何步骤失败：

- CI通知PR所有者。
- PR被阻止合并，直到问题解决。
- 修复必须提交，从而自动重新启动工作流。

:::note
对于给定的PR，一次只运行一个工作流。如果快速连续推送多个提交，CI会取消正在进行的构建，并仅处理最新的提交。
:::

#### 调试构建

要在CI中调试构建应用程序，我们使用位于 `/.github/mock-google-services.json` 的模拟Google服务文件。

### 在推送到`main`时

当一个提交被推送到`main`分支时，`onPush.yml`工作流被触发。其目标是：

- 🌐 从[Lokalise](/docs/translations)下载翻译。
- 📝 生成发布说明。
- 🔧 构建所有应用程序的发布版本。
- 📤 将应用程序部署到Firebase。
- 🛒 部署到Play商店的内部测试版。
- 📦 在GitHub Actions标签中持久化生成的APK。
- 🔐 注入发布所需的机密和文件。

我们使用[Fastlane](https://fastlane.tools/)简化对不同商店的部署。所有Fastlane配置都可以在`fastlane`文件夹中找到。

:::note
此工作流也可以手动触发，并使用`beta`标志将构建推广到商店的beta轨道。
:::

### 每周构建

每周日凌晨4:00 UTC，`weekly.yml`工作流会自动触发。其目标是：

- 🛠 创建每周的GitHub预发布。
- 🚀 调用`onPush.yml`工作流并将`beta`标志设置为`true`。

这确保每周将新版本的应用程序推送到Play商店的beta轨道。

### 每月版本标签

在每个月的第一天，`monthly.yml`工作流运行以创建格式为`YYYY.MM.0`的初始版本标签。这与我们的[CalVer]版本策略保持一致。

### 发布

`release.yml`工作流被手动触发，以将最新的beta构建推广到生产。这确保只有经过稳定测试的构建才会发布给最终用户。

#### 在F-Droid上发布

[F-Droid](https://f-droid.org)商店在我们推送GitHub发布时会自行构建应用程序。此过程使用[metadata](https://gitlab.com/fdroid/fdroiddata/-/blob/master/metadata/io.homeassistant.companion.android.minimal.yml)。

他们使用名为`version_code.txt`的文件，该文件在每次从`main`分支发布时创建，用于应用程序的版本控制。

:::warning
我们不能保证应用程序在发布后何时会在F-Droid上可用。您可以在[此处](https://f-droid.org/packages/io.homeassistant.companion.android.minimal/)找到该应用。
:::

## 工作流摘要

| 工作流             | 触发                       | 目标                                                               |
|---------------------|----------------------------|--------------------------------------------------------------------|
| `pr.yml`           | 在PR打开或更新时          | 代码检查、构建、测试并持久化APK。                                 |
| `onPush.yml`       | 在推送到`main`时         | 构建、部署并发布到Firebase和Play商店。                              |
| `weekly.yml`       | 每周日凌晨4:00            | 创建预发布并将beta构建推送到Play商店。                             |
| `monthly.yml`      | 每月第一天                | 创建初始版本标签（`YYYY.MM.0`）。                                  |
| `release.yml`      | 手动触发                  | 将beta构建推广到生产。                                          |

---

## 注意事项和最佳实践

- 🛠 将公共代码提取到`.github/actions`下的可重用操作中，以避免重复。
- 🕒 注意工作流触发器，以避免不必要的资源使用。
- 🔒 确保在工作流中妥善管理和注入机密及敏感文件。

[CalVer]: https://calver.org/