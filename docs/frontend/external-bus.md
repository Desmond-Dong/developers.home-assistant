---
title: "外部总线"
---

前端能够与嵌入 Home Assistant 前端的外部应用程序设置消息总线。该系统是对 [外部身份验证](frontend/external-authentication.md) 的一种概括，使得将来在应用程序或前端方面添加更多命令变得更容易，而无须进行大量的底层工作。

## 消息交换

与外部身份验证一样，消息交换是通过外部应用程序提供一个 JavaScript 方法来实现的。

消息作为序列化的 JSON 对象传递给外部应用。将被调用的函数接受一个参数：一个字符串。外部应用需要处理该消息并进行相应的处理（或忽略它）。

在 Android 上，您的应用需要定义以下方法：

```ts
window.externalApp.externalBus(message: string)
```

在 iOS 上，您的应用需要定义以下方法：

```ts
window.webkit.messageHandlers.externalBus.postMessage(message: string);
```

要向前端发送消息，请将您的消息序列化为 JSON，并从外部应用调用以下函数：

```ts
window.externalBus(message: string)
```

## 消息格式

消息描述了发送者希望接收者执行或了解的一个动作或一条信息。如果这是一个动作，发送者将期待一个有关该动作结果的响应。对命令的响应可以是成功或失败。

### 动作和信息消息格式

包含或提供信息的消息格式是相同的。它包含一个标识符、一个类型和一个可选的负载（取决于类型）。

结果消息将在响应中重复使用标识符，以表示该响应与哪种动作相关。

消息的基本格式如下：

```ts
{
  id: number;
  type: string;
  payload?: unknown;
}
```

一个示例消息：

```json
{
  "id": 5,
  "type": "config/get"
}
```

### 结果消息格式

如果消息是一个动作，发送者将期待一个包含结果的响应。响应可以是成功或失败。

结果的类型取决于它所响应的消息的类型。例如，如果它是对 `config/get` 的响应，结果应该是描述配置的一个对象。

消息格式：

```ts
interface SuccessResult {
  id: number;
  type: "result";
  success: true;
  result: unknown;
}

interface ErrorResult {
  id: number;
  type: "result";
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

## 支持的消息

### 获取外部配置

可用版本：Home Assistant 0.92
类型：`config/get`
方向：从前端到外部应用。
期望答案：是

查询外部应用的外部配置。外部配置用于自定义前端的体验。

预期的响应负载：

```ts
{
  hasSettingsScreen: boolean;
  canWriteTag: boolean;
}
```

- `hasSettingsScreen` 设置为 true 如果外部应用在收到命令 `config_screen/show` 时会显示配置屏幕。如果是这样，侧边栏将添加一个新选项以触发配置屏幕。
- `canWriteTag` 设置为 true 如果外部应用能够写入标签，因此可以支持 `tag/write` 命令。

### 显示配置屏幕 `config_screen/show`

可用版本：Home Assistant 0.92
类型：`config_screen/show`
方向：从前端到外部应用。
期望答案：否

显示外部应用的配置屏幕。

### 连接状态更新 `connection-status`

可用版本：Home Assistant 0.92
类型：`connection-status`
方向：从前端到外部应用。
期望答案：否

如果前端已连接到 Home Assistant，则通知外部应用。

负载结构：

```ts
{
  event: "connected" | "auth-invalid" | "disconnected";
}
```

### 触发触觉反馈 `haptic`

可用版本：Home Assistant 0.92
类型：`haptic`
方向：从前端到外部应用。
期望答案：否

通知外部应用触发触觉反馈。

负载结构：

```ts
{
  hapticType:
    | "success"
    | "warning"
    | "failure"
    | "light"
    | "medium"
    | "heavy"
    | "selection";

}
```

### 写入标签 `tag/write`

可用版本：Home Assistant 0.115
类型：`tag/write`
方向：从前端到外部应用
期望答案：是

告诉外部应用打开 UI 写入标签。名称是用户输入的标签名称。如果没有设置名称，则名称为 `null`。

```ts
{
  tag: string;
  name: string | null;
}
```

预期的响应负载目前是一个空对象。我们可能会在以后添加更多内容：

```ts
{}