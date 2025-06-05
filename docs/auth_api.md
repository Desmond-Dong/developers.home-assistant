---
title: "身份验证 API"
sidebar_label: API
---

本页面将描述应用程序授权与 Home Assistant 实例进行集成所需的步骤。[查看演示](https://hass-auth-demo.glitch.me)，由我们的助手库 [home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket) 提供支持。

每个用户拥有自己的 Home Assistant 实例，这使得每个用户能够控制自己的数据。然而，我们也希望方便第三方开发者创建应用程序，允许用户与 Home Assistant 集成。为此，我们采用了 [OAuth 2 规范][oauth2-spec]，结合 [OAuth 2 IndieAuth 扩展][indieauth-spec] 来生成客户端。

## 客户端

在您要求用户授权与您的应用程序连接他们的实例之前，您需要一个客户端。在传统的 OAuth2 中，服务器需要在用户授权之前生成一个客户端。然而，由于每个服务器属于一个用户，我们采用了与 [IndieAuth][indieauth-clients] 略有不同的方法。

您需要使用的客户端 ID 是您应用程序的网站。重定向 URL 必须与客户端 ID 的主机和端口相同。例如：

- 客户端 ID: `https://www.my-application.io`
- 重定向 URI: `https://www.my-application.io/hass/auth_callback`

如果您需要不同的重定向 URL（即构建原生应用时），您可以在您应用程序网站（客户端 ID）的内容中添加一个 HTML 标签，用于批准的重定向 URL。例如，添加这个到您的网站以将重定向 URI `hass://auth` 列入白名单：

```html
<link rel='redirect_uri' href='hass://auth'>
```

Home Assistant 会扫描网站的前 10kB 以寻找链接标签。

## 授权

<a href='https://www.websequencediagrams.com/?lz=dGl0bGUgQXV0aG9yaXphdGlvbiBGbG93CgpVc2VyIC0-IENsaWVudDogTG9nIGludG8gSG9tZSBBc3Npc3RhbnQKABoGIC0-IFVzZXI6AEMJZSB1cmwgAD4JACgOOiBHbyB0bwAeBWFuZCBhAC0ICgBQDgB1DACBFw5jb2RlAHELAE4RZXQgdG9rZW5zIGZvcgAoBgBBGlQAJQUK&s=qsd'>
<img class='invertDark' src='/img/en/auth/authorize_flow.png' alt='不同部分如何交互的概述' />
</a>

:::info
 此处所有示例 URL 的显示仅为展示目的而添加了额外的空格和换行。
:::

授权 URL 应该包含 `client_id` 和 `redirect_uri` 作为查询参数。

```txt
http://your-instance.com/auth/authorize?
    client_id=https%3A%2F%2Fhass-auth-demo.glitch.me&
    redirect_uri=https%3A%2F%2Fhass-auth-demo.glitch.me%2F%3Fauth_callback%3D1
```

您还可以选择性地包含一个 `state` 参数，这将被添加到重定向 URI。状态非常适合存储您正在进行身份验证的实例 URL。例如：

```txt
http://your-instance.com/auth/authorize?
    client_id=https%3A%2F%2Fhass-auth-demo.glitch.me&
    redirect_uri=https%3A%2F%2Fhass-auth-demo.glitch.me%2Fauth_callback&
    state=http%3A%2F%2Fhassio.local%3A8123
```

用户将导航到此链接，并看到有关登录和授权您应用程序的说明。一旦获得授权，用户将被重定向回传入的重定向 URI，授权代码和状态将作为查询参数的一部分返回。例如：

```txt
https://hass-auth-demo.glitch.me/auth_callback?
    code=12345&
    state=http%3A%2F%2Fhassio.local%3A8123
```

该授权代码可以通过发送到令牌端点进行交换（请参阅下一部分）。

## 令牌

令牌端点返回给定有效授权的令牌。此授权可以是从授权端点检索的授权代码或刷新令牌。在使用刷新令牌的情况下，令牌端点也能够撤销令牌。

与此端点的所有交互都需要使用 HTTP POST 请求到 `http://your-instance.com/auth/token`，请求体编码为 `application/x-www-form-urlencoded`。

### 授权代码

:::tip
所有对令牌端点的请求都需要包含与重定向用户到授权端点时使用的完全相同的客户端 ID。
:::

使用授权类型 `authorization_code` 在用户成功完成授权步骤后检索令牌。请求体为：

```txt
grant_type=authorization_code&
code=12345&
client_id=https%3A%2F%2Fhass-auth-demo.glitch.me
```

返回的响应将包含访问令牌和刷新令牌：

```json
{
    "access_token": "ABCDEFGH",
    "expires_in": 1800,
    "refresh_token": "IJKLMNOPQRST",
    "token_type": "Bearer"
}
```

访问令牌是一个短期令牌，可以用于访问 API。刷新令牌可以用于获取新的访问令牌。`expires_in` 值是访问令牌有效的秒数。

如果发出无效请求，将返回 400 的 HTTP 状态代码。如果请求了一个非活动用户的令牌，HTTP 状态代码将是 403。

```json
{
    "error": "invalid_request",
    "error_description": "无效的客户端 ID",
}
```

### 刷新令牌

一旦您通过授权类型 `authorization_code` 检索到刷新令牌，您可以使用它来获取新的访问令牌。请求体为：

```txt
grant_type=refresh_token&
refresh_token=IJKLMNOPQRST&
client_id=https%3A%2F%2Fhass-auth-demo.glitch.me
```

返回的响应将包含一个访问令牌：

```json
{
    "access_token": "ABCDEFGH",
    "expires_in": 1800,
    "token_type": "Bearer"
}
```

如果发出无效请求，将返回 400 的 HTTP 状态代码。

```json
{
    "error": "invalid_request",
    "error_description": "无效的客户端 ID",
}
```

### 撤销刷新令牌

:::tip
`client_id` 不是撤销刷新令牌所必需的
:::
令牌端点也能够撤销刷新令牌。撤销刷新令牌将立即撤销该刷新令牌及其曾授予的所有访问令牌。要撤销刷新令牌，请发出以下请求：

```txt
token=IJKLMNOPQRST&
action=revoke
```

该请求将始终以空正文和 HTTP 状态 200 响应，无论请求是否成功。

## 长期访问令牌

长期访问令牌有效期为 10 年。这些令牌适用于与第三方 API 和 webhook 风格的集成。长期访问令牌可以使用用户 Home Assistant 配置文件页面底部的 **"长期访问令牌"** 部分创建。

您还可以使用 WebSocket 命令 `auth/long_lived_access_token` 生成长期访问令牌，此命令将为当前用户创建一个长期访问令牌。访问令牌字符串不会保存在 Home Assistant 中；您必须将其记录在安全的地方。

```json
{
    "id": 11,
    "type": "auth/long_lived_access_token",
    "client_name": "GPS Logger",
    "client_icon": null,
    "lifespan": 365
}
```

响应包含一个长期访问令牌：

```json
{
    "id": 11,
    "type": "result",
    "success": true,
    "result": "ABCDEFGH"
}
```

## 进行身份验证请求

一旦您拥有访问令牌，您就可以对 Home Assistant API 进行身份验证请求。

对于 WebSocket 连接，请在 [身份验证消息](/api/websocket.md#authentication-phase) 中传递访问令牌。

对于 HTTP 请求，将令牌类型和访问令牌作为授权头传递：

```http
Authorization: Bearer ABCDEFGH
```

### 示例：cURL

```shell
curl -X GET \
  https://your.awesome.home/api/error/all \
  -H 'Authorization: Bearer ABCDEFGH'
```

### 示例：Python

```python
import requests

url = "https://your.awesome.home/api/error/all"
headers = {
    "Authorization": "Bearer ABCDEFGH",
}
response = requests.request("GET", url, headers=headers)

print(response.text)
```

### 示例：NodeJS

```javascript
fetch('https://your.awesome.home/api/error/all', {
  headers: { Authorization: 'Bearer ABCDEFGH' }
}).then(function (response) {
  if (!response.ok) {
    return Promise.reject(response);
  }
  return response.text();
}).then(function (body ) {
  console.log(body);
});
```

如果访问令牌不再有效，您将收到 HTTP 状态码 401 未授权的响应。这意味着您需要刷新令牌。如果刷新令牌无效，则令牌不再有效，因此用户也不再登录。您应该清除用户的数据，并要求用户重新授权。

[oauth2-spec]: https://tools.ietf.org/html/rfc6749
[indieauth-spec]: https://indieauth.spec.indieweb.org/
[indieauth-clients]: https://indieauth.spec.indieweb.org/#client-identifier

## 签名路径

有时您想要用户对 Home Assistant 发起 GET 请求以下载数据。在这种情况下，正常的身份验证系统无法执行，因为我们无法将用户链接到包含身份验证头的 API。在这种情况下，签名路径可以提供帮助。

签名路径是我们服务器上的正常路径，例如 `/api/states`，但附有安全身份验证签名。用户可以导航到此路径，并将被授权为创建签名路径的访问令牌。签名路径可以通过 WebSocket 连接创建，旨在短期使用。默认过期时间为 30 秒。

获取签名路径有两种方法。

如果您正在创建一个集成，则从 `homeassistant.components.http.auth` 导入 `async_sign_path`。如果在 HTTP 请求或 WebSocket 连接的上下文中调用，方法将自动采用刷新令牌。如果两者都不可用（即因为在自动化中），它将使用特殊的“Home Assistant 内容”用户。

如果您正在与前端交互，您可以使用以下 WebSocket 命令创建签名路径：

```js
{
  "type": "auth/sign_path",
  "path": "/api/states",
  // 可选，过期时间（单位：秒）。默认为 30 秒
  "expires": 20
}
```

响应将包含签名路径：

```js
{
  "path": "/api/states?authSig=ABCDEFGH"
}
```

关于签名路径的一些注意事项：

- 如果刷新令牌被删除，签名 URL 将不再有效。
- 如果用户被删除，签名 URL 将不再有效（因为刷新令牌将被删除）。
- 如果 Home Assistant 被重启，签名 URL 将不再有效。
- 访问仅在请求收到时进行验证。如果响应的处理时间超过了过期时间（例如，下载大文件），下载将在过期后继续。