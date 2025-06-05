---
title: "Android 开始使用"
sidebar_label: "开始使用"
---

## 开始使用 Home Assistant Android 开发

欢迎来到 Home Assistant Android 开发指南！本文档将帮助您设置您的环境、分叉仓库，并构建您的第一个应用程序。

## 设置开发环境

要开始，安装最新的稳定版 [Android Studio](https://developer.android.com/studio)。这是构建应用程序所需的唯一工具。

## 分叉、克隆和创建分支

### 分叉仓库

1. 打开 [Home Assistant Android 仓库](https://github.com/home-assistant/android)。
2. 点击 **Fork** 创建您自己的仓库副本。

:::tip
如果您遇到任何问题，请参考 [GitHub 关于分叉仓库的文档](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)。
:::

### 克隆您的分叉仓库

一旦您分叉了仓库，使用以下命令将其克隆到本地机器上：

```bash
git clone https://github.com/<your-github-username>/android.git
```

或者，您可以使用 Android Studio：

1. 前往 `File -> New -> Project from Version Control...`。
2. 输入您的仓库 URL 并克隆它。

### 创建分支

在进行任何更改之前，请创建一个有意义的名称的新分支，以反映您正在进行的工作。例如：

```bash
git checkout -b feature/add-new-feature
```

:::tip
如果您是 Git 新手，请查看 [Git 分支指南](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)。您也可以直接在 Android Studio 中创建分支。
:::

## 构建 Home Assistant 应用程序

一旦您在本地克隆了仓库，您可以使用 Android Studio 或终端构建应用程序。

### 从 Android Studio

1. 在 Android Studio 中打开项目。
2. 同步 Gradle 文件。
3. 点击顶部的绿色 **Play** 按钮。Android Studio 将自动创建一个模拟器并为您运行应用程序。

### 从终端

:::info
您需要将 `JAVA_HOME` 环境变量设置为 JDK。我们当前使用 JDK 21。
:::

#### 在 macOS/Linux 上

```bash
./gradlew assembleDebug
```

#### 在 Windows 上

```powershell
gradlew.bat assembleDebug
```

:::info
如果您需要创建发布版本，请按照 [发布版本说明](/docs/android/tips/release) 操作。
:::

## Firebase 设置

Firebase 用于通知。如果您不需要这些功能，您应该使用模拟的 Firebase 配置。

:::info
您仍然可以通过 WebSocket 发送通知，而不使用 Firebase。
:::

### 设置模拟 Firebase 项目

如果您不需要真实的 Firebase 功能，可以使用模拟配置：

1. 复制位于 `/.github/mock-google-services.json` 的文件。
2. 重命名并将该文件的副本放置为 `google-services.json` 在以下每个文件夹中：
   - `/app`
   - `/automotive`
   - `/wear`
3. 完成此步骤后，您的项目中应包含以下文件：
   - `/app/google-services.json`
   - `/automotive/google-services.json`
   - `/wear/google-services.json`

### 设置真实的 Firebase 项目

请遵循我们的 [推送通知指南](/docs/android/tips/fcm_push_notification)，以获取其他设置说明。

## 接下来是什么？

现在您已经构建了应用程序，请浏览其余文档以加深对项目的理解。一个好的起点是 [架构指南](/docs/android/architecture)，其中解释了代码库的一般结构。

## 需要帮助？

如果您遇到困难，请随时寻求帮助！**[加入我们的 Discord 社区](https://discord.gg/c5DvZ4e)**，确保选择开发者角色并前往 **[Android](https://discord.com/channels/330944238910963714/1346948551892009101)** 项目线程以与其他贡献者联系以获得帮助。