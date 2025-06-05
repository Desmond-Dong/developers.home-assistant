---
title: "发送数据到家"
---

一旦您在移动应用组件中注册了您的应用，您就可以通过提供的 webhook 信息开始与 Home Assistant 进行交互。

## 通过 Rest API 发送 webhook 数据

第一步是将返回的 webhook ID 转换为完整的 URL: `<instance_url>/api/webhook/<webhook_id>`。这将是我们所有交互所需的唯一 URL。webhook 端点不需要身份验证请求。

如果您在注册时提供了 Cloudhook URL，您应该默认使用该 URL，只有在该请求失败时才回退到上面描述的构造 URL。

如果您在注册时提供了远程 UI URL，您应该在构建 URL 时使用该 URL，只有在远程 UI URL 失败时才回退到用户提供的 URL。

总结一下，以下是如何发出请求：

1. 如果您有 Cloudhook URL，请在请求失败之前使用它。当请求失败时，转到第 2 步。
2. 如果您有远程 UI URL，请使用它来构造 webhook URL: `<remote_ui_url>/api/webhook/<webhook_id>`。当请求失败时，转到第 3 步。
3. 使用在设置期间提供的实例 URL 构造 webhook URL: `<instance_url>/api/webhook/<webhook_id>`。

## 通过 WebSocket API 发送 webhook 数据

Webhooks 也可以通过 WebSocket API 发送 `webhook/handle` 命令来传递：

```json
{
  "type": "webhook/handle",
  "id": 5,
  "method": "GET",
  // 以下字段是可选的
  "body": "{\"hello\": \"world\"}",
  "headers": {
    "Content-Type": "application/json"
  },
  "query": "a=1&b=2"
}
```

响应将如下所示：

```json
{
  "type": "result",
  "id": 5,
  "result": {
    "body": "{\"ok\": true}",
    "status": 200,
    "headers": {"Content-Type": response.content_type}
  }
}
```

## 关于实例 URL 的简短说明

一些用户已经配置 Home Assistant 以便在他们的家庭网络之外可用，使用动态 DNS 服务。有些路由器不支持发夹 / NAT 循环：一个设备从路由器网络内部发送数据，通过外部配置的 DNS 服务，发送到 Home Assistant，这也位于本地网络内。

为了解决这个问题，应用应该记录哪个 WiFi SSID 是用户的家庭网络，并在连接到家庭 WiFi 网络时使用直接连接。

## 交互基础

### 请求

所有交互都将通过对 webhook URL 发出 HTTP POST 请求来完成。这些请求不需要包含身份验证。

有效载荷格式取决于交互类型，但它们都共享一个共同的基础：

```json
{
  "type": "<消息类型>",
  "data": {}
}
```

如果您在注册时收到 `secret`，您 **必须** 加密您的消息并将其放入有效载荷中，如下所示：

```json
{
  "type": "encrypted",
  "encrypted": true,
  "encrypted_data": "<加密消息>"
}
```

### 响应

作为一般规则，预计所有请求将收到 200 响应。在某些情况下，您将收到其他代码：

- 如果您的 JSON 无效，您将收到 400 状态代码。然而，如果加密 JSON 无效，您不会收到此错误。
- 创建传感器时，您将收到 201 响应。
- 如果收到 404，则 `mobile_app` 组件很可能未加载。
- 收到 410 表示集成已被删除。您应该通知用户，并很可能需要重新注册。

## 实施加密

`mobile_app` 支持通过 [Sodium](https://libsodium.gitbook.io/doc/) 实现双向加密通信。

:::info
Sodium 是一个现代的、易于使用的软件库，用于加密、解密、签名、密码哈希等。
:::

### 选择库

大多数现代编程语言和平台都有包装 Sodium 的库。Sodium 本身是用 C 语言编写的。

以下是我们建议使用的库，尽管您可以随意使用适合您的任何库。

- Swift/Objective-C: [swift-sodium](https://github.com/jedisct1/swift-sodium) (由 Sodium 开发者维护的官方库)。

对于其他语言，请参见 [Bindings for other languages](https://doc.libsodium.org/bindings_for_other_languages) 的列表。如果可用的选择不止一个，我们建议使用最新更新和最多同行评审的选择（检查项目的 GitHub 星标数是一种简单的方法）。

### 配置

我们使用 Sodium 的 [secret-key cryptography](https://doc.libsodium.org/secret-key_cryptography) 功能来加密和解密有效载荷。所有有效载荷都用 Base64 编码。对于 Base64 类型，请使用 `sodium_base64_VARIANT_ORIGINAL`（即 "original"，无填充，不安全的 URL）。如果有效载荷在未加密时未包含 `data` 键（例如在 [get_config](https://developers.home-assistant.io/docs/api/native-app-integration/sending-data#get-config) 请求时），必须加密一个空的 JSON 对象 (`{}`)。

### 信号加密支持

启用加密支持有两种方式：

- **在初始注册期间** 您设置 `supports_encryption` 为 `true`。
- **在初始注册后** 您调用 `enable_encryption` webhook 操作。

Home Assistant 实例必须能够安装 `libsodium` 才能启用加密。确认您应该通过在初始注册或启用加密响应中出现的 `secret` 键，使所有未来的 webhook 请求都加密。

您必须永远存储此秘密。不能通过 Home Assistant UI 恢复它，您 **不** 应该要求用户调查隐藏存储文件以重新输入加密密钥。如果加密失败，您应该创建新的注册并提醒用户。

由于 Home Assistant Core 端缺乏 Sodium/NaCL，注册可能最初不支持加密。您应该始终努力在可能的情况下加密通信。因此，我们礼貌地请求您不时尝试自动启用加密，或允许用户通过应用中的按钮手动启用加密。这样，他们可以首先尝试修复导致 Sodium/NaCL 无法卸载的任何错误，然后稍后进行加密注册。如果 Sodium/NaCL 无法卸载，Home Assistant Core 将记录确切的细节。

## 更新设备位置

此消息将通知 Home Assistant 新的位置信息。

```json
{
  "type": "update_location",
  "data": {
    "gps": [12.34, 56.78],
    "gps_accuracy": 120,
    "battery": 45
  }
}
```

| 键 | 类型 | 描述
| --- | ---- | -----------
| `location_name` | string | 设备所在区域的名称。
| `gps` | latlong | 当前地理位置的纬度和经度。
| `gps_accuracy` | int | GPS 精度以米为单位。必须大于 0。
| `battery` | int | 设备剩余电池百分比。必须大于 0。
| `speed` | int | 设备速度，以米每秒为单位。必须大于 0。
| `altitude` | int | 设备高度，以米为单位。必须大于 0。
| `course` | int | 设备行进方向，以度数测量，且相对于正北。必须大于 0。
| `vertical_accuracy` | int | 高度值的精度，以米为单位。必须大于 0。

## 调用服务操作

在 Home Assistant 中调用服务操作。

```json
{
  "type": "call_service",
  "data": {
    "domain": "light",
    "service": "turn_on",
    "service_data": {
      "entity_id": "light.kitchen"
    }
  }
}
```

| 键 | 类型 | 描述
| --- | ---- | -----------
| `domain` | string | 服务操作的域
| `service` | string | 服务操作名称
| `service_data` | dict | 要发送到服务操作的数据

## 触发事件

在 Home Assistant 中触发事件。请注意数据结构，如我们在 [Data Science portal](https://data.home-assistant.io/docs/events/#database-table) 中所记录的那样。

```json
{
  "type": "fire_event",
  "data": {
    "event_type": "my_custom_event",
    "event_data": {
      "something": 50
    }
  }
}
```

| 键 | 类型 | 描述
| --- | ---- | -----------
| `event_type` | string | 触发事件的类型
| `event_data` | string | 触发事件的数据

## 渲染模板

渲染一个或多个模板并返回结果。

```json
{
  "type": "render_template",
  "data": {
    "my_tpl": {
      "template": "Hello {{ name }}, you are {{ states('person.paulus') }}.",
      "variables": {
        "name": "Paulus"
      }
    }
  }
}
```

`data` 必须包含一个 `key`: `dictionary` 的映射。结果将像 `{"my_tpl": "Hello Paulus, you are home"}` 一样返回。这允许在一次调用中渲染多个模板。

| 键 | 类型 | 描述
| --- | ---- | -----------
| `template` | string | 要渲染的模板
| `variables` | Dict | 要包含的额外模板变量。

## 更新注册

更新您的应用注册。如果应用版本发生变化或任何其他值更改，请使用此方法。

```json
{
  "type": "update_registration",
  "data": {
    "app_data": {
      "push_token": "abcd",
      "push_url": "https://push.mycool.app/push"
    },
    "app_version": "2.0.0",
    "device_name": "Robbies iPhone",
    "manufacturer": "Apple, Inc.",
    "model": "iPhone XR",
    "os_version": "23.02"
  }
}
```

所有键都是可选的。

| 键 | 类型 | 描述
| --- | --- | --
| `app_data` | Dict | 如果应用有一个支持组件来扩展 mobile_app 功能或希望启用通知平台，则可以使用应用数据。
| `app_version` | string | 移动应用的版本。
| `device_name` | string | 运行应用的设备名称。
| `manufacturer` | string | 运行应用的设备的制造商。
| `model` | string | 运行应用的设备型号。
| `os_version` | string | 运行应用的设备的操作系统版本。

## 获取区域

获取所有启用的区域。

```json
{
  "type": "get_zones"
}
```

## 获取配置

返回 `/api/config` 的版本，其中包含配置您的应用所需的值。

```json
{
  "type": "get_config"
}
```

## 启用加密

_这需要 Home Assistant 0.106 或更高版本。_

为现有注册启用加密支持。

```json
{
  "type": "enable_encryption"
}
```

您可能收到两种错误：

- `encryption_already_enabled` - 此注册已启用加密
- `encryption_not_available` - Sodium/NaCL 无法安装。停止所有未来的加密启用尝试。

## 流式传输摄像头

_这需要 Home Assistant 0.112 或更高版本。_

检索有关如何流式传输摄像头的信息。

```json
{
  "type": "stream_camera",
  "data": {
    "camera_entity_id": "camera.name_here"
  }
}
```

| 键 | 类型 | 描述
| --- | ---- | -----------
| `camera_entity_id` | string | 要检索流媒体信息的摄像头实体


响应将包含通过 HLS 或 MJPEG 图像预览进行流式传输的路径。

```json
{
  "hls_path": "/api/hls/…/playlist.m3u8",
  "mjpeg_path": "/api/camera_proxy_stream/…"
}
```

如果 HLS 流式传输不可用，则 `hls_path` 将为 `null`。有关如何构造完整 URL 的实例 URL 的说明，请参见上文。

## 处理对话

_这需要 Home Assistant 2023.2.0 或更高版本。_

处理对话集成中的句子。

```json
{
  "type": "conversation_process",
  "data": {
    "text": "打开灯",
    "language": "zh",
    "conversation_id": "ABCD"
  }
}
```

有关可用键和响应，请参见 [conversation API documentation](../../intent_conversation_api)。