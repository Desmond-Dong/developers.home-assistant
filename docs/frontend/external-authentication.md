---
title: "外部认证"
---

默认情况下，前端将处理自己的认证令牌。如果未找到任何令牌，它将重定向用户到登录页面，并负责更新令牌。

如果您希望将 Home Assistant 前端嵌入到外部应用中，您需要在应用内存储认证信息，但也要使其对前端可用。为了支持这种情况，Home Assistant 暴露了一个外部认证 API。

要激活此 API，请在 URL 后附加 `?external_auth=1` 加载前端。如果传入此参数，Home Assistant 将期望定义 `window.externalApp`（用于 Android）或 `window.webkit.messageHandlers`（用于 iOS），并包含下面描述的方法。

## 获取访问令牌

_此 API 在 Home Assistant 0.78 中引入。_

当前端加载时，它将从外部认证请求一个访问令牌。它通过调用以下方法之一并传递一个选项对象来做到这一点。选项对象定义了用于处理响应的回调方法，以及一个可选的 `force` 布尔值，如果访问令牌应被刷新（无论是否已过期），则设置为 `true`。

`force` 布尔值在 Home Assistant 0.104 中引入，并可能并不总是可用。

```js
window.externalApp.getExternalAuth({
  callback: "externalAuthSetToken",
  force: true
});
// 或
window.webkit.messageHandlers.getExternalAuth.postMessage({
  callback: "externalAuthSetToken",
  force: true
});
```

响应应包含一个布尔值，指示请求是否成功以及一个包含访问令牌和其有效期（秒数）的对象。将响应传递给在选项对象中定义的函数。

```js
// 由外部应用调用
window.externalAuthSetToken(true, {
  access_token: "qwere",
  expires_in: 1800
});

// 如果无法获取新访问令牌
window.externalAuthSetToken(false);
```

前端将在页面首次加载时以及每当需要有效令牌但先前接收到的令牌已过期时调用此方法。

## 撤销令牌

_此 API 在 Home Assistant 0.78 中引入。_

当用户在个人资料页面按下注销按钮时，外部应用将必须 [撤销刷新令牌](auth_api.md#revoking-a-refresh-token)，并将用户注销。

```js
window.externalApp.revokeExternalAuth({
  callback: "externalAuthRevokeToken"
});
// 或
window.webkit.messageHandlers.revokeExternalAuth.postMessage({
  callback: "externalAuthRevokeToken"
});
```

完成后，外部应用必须调用选项对象中定义的函数。

```js
// 由外部应用调用
window.externalAuthRevokeToken(true);

// 如果无法注销
window.externalAuthRevokeToken(false);