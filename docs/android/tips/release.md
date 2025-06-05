---
title: "构建发布版本"
sidebar_label: "构建发布版本"
---

:::warning
确保密钥库安全存储，并且不包括在版本控制中。凭证也适用此原则。
:::

## 构建发布版本

要发布应用程序，您需要对其进行签名。请遵循以下步骤：

### 第1步：创建或使用现有的密钥库

在构建应用程序之前，您必须有一个密钥库。您可以创建一个新的或使用现有的密钥库。

#### 创建密钥库

您可以直接从 Android Studio 创建密钥库：

1. 转到 **菜单** > **构建** > **生成签名 APK**。
2. 选择创建新密钥库的选项。
3. **记住密码和密钥别名** 以备将来使用。

#### 使用现有的密钥库

如果您已经有一个密钥库，请确保其名为 `release_keystore.keystore` 并放置在以下文件夹中：
- `app`
- `wear`

或者，您可以通过设置 `KEYSTORE_PATH` 环境变量来指定自定义位置。

---

### 第2步：构建应用程序

您可以使用 Android Studio 或命令行（CLI）来构建应用程序。

#### 从 Android Studio

1. 打开 Android Studio。
2. 转到 **菜单** > **构建** > **生成签名 APK**。
3. 选择您创建的密钥库或现有的密钥库。
4. 按照步骤构建应用程序。

#### 从 CLI

1. **设置环境变量**  
   定义 `app/build.gradle.kts` 中使用的以下环境变量：
   - `KEYSTORE_PASSWORD`
   - `KEYSTORE_ALIAS`
   - `KEYSTORE_ALIAS_PASSWORD`
   - `KEYSTORE_PATH`（如果您的密钥库位于自定义位置）

2. **构建应用程序**  
   要构建 APK，请运行：

   ```bash
   ./gradlew assembleRelease # 构建所有应用程序
   # 或
   ./gradlew :<GRADLE_MODULE>:assembleRelease # 构建特定模块，例如 :app、:automotive 或 :wear
   ```

   要构建 AAB，请运行：

   ```bash
   ./gradlew bundleRelease # 构建所有应用程序
   # 或
   ./gradlew :<GRADLE_MODULE>:bundleRelease # 构建特定模块，例如 :app、:automotive 或 :wear