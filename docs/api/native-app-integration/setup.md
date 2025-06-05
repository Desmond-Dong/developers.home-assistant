---
title: "连接到实例"
---

当用户首次打开应用程序时，他们需要连接到本地实例以进行身份验证和设备注册。

## 身份验证用户

如果 Home Assistant 配置了 [zeroconf 集成]，则可以通过搜索 `_home-assistant._tcp.local.` 来发现本地实例。如果未配置，则需要询问用户他们实例的本地地址。

当已知实例的地址时，应用程序将要求用户通过 [OAuth2 与 Home Assistant] 进行身份验证。Home Assistant 使用 IndieAuth，这意味着为了能够重定向到触发您应用程序的 URL，您需要采取一些额外的步骤。确保彻底阅读“客户端”部分的最后一段。

[zeroconf 集成]: https://www.home-assistant.io/integrations/zeroconf  
[OAuth2 与 Home Assistant]: auth_api.md

## 注册设备

_这需要 Home Assistant 0.90 或更高版本。_

Home Assistant 有一个 `mobile_app` 组件，允许应用程序注册自己并与实例交互。这是一个通用组件，用于处理大多数常见的移动应用程序任务。如果您的应用程序需要比此组件提供的更多类型的交互，则可以通过自定义交互进行扩展。

一旦您拥有用于以用户身份进行身份验证的令牌，就可以开始通过 Home Assistant 中的移动应用集成注册应用程序。

### 准备工作

首先，您必须确保 `mobile_app` 集成已加载。可以通过两种方式做到这一点：

- 您可以发布一个 Zeroconf/Bonjour 记录 `_hass-mobile-app._tcp.local.` 来触发 `mobile_app` 集成的自动加载。发布记录后，您应该等待至少 60 秒再继续。
- 您可以要求用户在他们的 configuration.yaml 中添加 `mobile_app` 并重启 Home Assistant。如果用户已经在配置中有 `default_config`，那么 `mobile_app` 将已经被加载。

您可以通过检查 [`/api/config` REST API 调用](/api/rest.md#get-apiconfig) 的 `components` 数组来确认 `mobile_app` 组件是否已加载。如果您继续进行设备注册并收到 404 状态码，则可能还未加载。

### 注册设备

要注册设备，请向 `/api/mobile_app/registrations` 发出经过身份验证的 POST 请求。[有关发出身份验证请求的更多信息.](/auth_api.md#making-authenticated-requests)

发送到注册端点的示例有效负载：

```json
{
  "device_id": "ABCDEFGH",
  "app_id": "awesome_home",
  "app_name": "Awesome Home",
  "app_version": "1.2.0",
  "device_name": "Robbies iPhone",
  "manufacturer": "Apple, Inc.",
  "model": "iPhone X",
  "os_name": "iOS",
  "os_version": "iOS 10.12",
  "supports_encryption": true,
  "app_data": {
    "push_notification_key": "abcdef"
  }
}
```

| 键                    | 必需 | 类型    | 描述                                                                                                                                    |
| --------------------- | ---- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `device_id`           | V    | string  | 此设备的唯一标识符。在 Home Assistant 0.104 中新增                                                                                     |
| `app_id`              | V    | string  | 该应用程序的唯一标识符。                                                                                                              |
| `app_name`            | V    | string  | 移动应用程序的名称。                                                                                                                  |
| `app_version`         | V    | string  | 移动应用程序的版本。                                                                                                                 |
| `device_name`         | V    | string  | 运行该应用程序的设备名称。                                                                                                            |
| `manufacturer`        | V    | string  | 运行该应用程序的设备的制造商。                                                                                                        |
| `model`               | V    | string  | 运行该应用程序的设备的型号。                                                                                                          |
| `os_name`             | V    | string  | 运行该应用程序的操作系统名称。                                                                                                        |
| `os_version`          | V    | string  | 运行该应用程序的设备的操作系统版本。                                                                                                |
| `supports_encryption` | V    | bool    | 应用程序是否支持加密。另见 [加密部分](/api/native-app-integration/sending-data.md#implementing-encryption)。              |
| `app_data`            |      | Dict    | 如果应用程序具有支持的组件扩展 `mobile_app` 功能，则可以使用应用数据。                                                                |

当您获得 200 响应时，移动应用已在 Home Assistant 中注册。响应是一个 JSON 文档，将包含如何与 Home Assistant 实例交互的 URL。您应该永久存储此信息。

```json
{
  "cloudhook_url": "https://hooks.nabu.casa/randomlongstring123",
  "remote_ui_url": "https://randomlongstring123.ui.nabu.casa",
  "secret": "qwerty",
  "webhook_id": "abcdefgh"
}
```

| 键               | 类型    | 描述                                                                                                                                                             |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudhook_url`  | string  | Home Assistant Cloud 提供的 cloudhook URL。只有在用户主动订阅 Nabu Casa 时才会提供。                                                                                   |
| `remote_ui_url`  | string  | Home Assistant Cloud 提供的远程 UI URL。只有在用户主动订阅 Nabu Casa 时才会提供。                                                                                    |
| `secret`         | string  | 用于加密通信的密钥。只有在应用程序和 Home Assistant 实例都支持加密时才会包含。[更多信息](/api/native-app-integration/sending-data.md#implementing-encryption)。 |
| `webhook_id`     | string  | 可用于发送数据回传的 webhook ID。                                                                                                                                  |