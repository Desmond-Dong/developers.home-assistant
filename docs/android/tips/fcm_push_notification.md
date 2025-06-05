---
title: "Android FCM 推送通知"
sidebar_label: "FCM 推送通知"
---

## FCM 推送通知设置

:::note
设置 Firebase Cloud Messaging (FCM) 可能会很复杂。除非您特别需要它，否则考虑在开发过程中通过 WebSocket 使用通知。
:::

如果您希望为推送通知设置自己的 FCM，请按照以下步骤操作：

1. **创建 Firebase 项目**  
   前往 [Firebase 控制台](https://console.firebase.google.com) 并创建一个新的 Firebase 项目。

2. **将 Android 应用添加到 Firebase 项目**  
   将以下包名称作为 Android 应用添加到您的 Firebase 项目中：
   - `io.homeassistant.companion.android`
   - `io.homeassistant.companion.android.debug`
   - `io.homeassistant.companion.android.minimal`
   - `io.homeassistant.companion.android.minimal.debug`

3. **部署推送通知服务**  
   访问 [mobile-apps-fcm-push 仓库](https://github.com/home-assistant/mobile-apps-fcm-push) 并将服务部署到您的 Firebase 项目中。

4. **设置推送通知 URL**  
   一旦您有了部署服务的 `androidV1` URL，请将其添加到您的 `${GRADLE_USER_HOME}/gradle.properties` 文件中。例如：

   ```properties
   homeAssistantAndroidPushUrl=https://mydomain.cloudfunctions.net/androidV1
   ```

   可选地，您还可以定义速率限制功能的 URL：

   ```properties
   homeAssistantAndroidRateLimitUrl=https://mydomain.cloudfunctions.net/checkRateLimits
   ```

5. **下载并放置 `google-services.json` 文件**  
   从您的 Firebase 项目中下载 `google-services.json` 文件，并将其放置在以下文件夹中：
   - `/app`
   - `/automotive`
   - `/wear`

:::note
`google-services.json` 文件必须包含上述所有包名称的客户端 ID。没有这个，FCM 推送通知将无法工作（只有 WebSocket 通知会起作用）。
:::