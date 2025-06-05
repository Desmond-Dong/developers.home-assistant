---
title: "经过身份验证的 WebView"
---

您的应用程序已经请求用户进行身份验证。这意味着当用户打开 Home Assistant 界面时，您的应用不应再次请求用户进行身份验证。

为了实现这一点，Home Assistant 界面支持 [外部身份验证](frontend/external-authentication.md)。这允许您的应用提供钩子，以便前端可以向您的应用请求访问令牌。

Home Assistant 还通过 [外部总线](frontend/external-bus.md) 支持前端和应用之间的进一步集成。

请注意，此功能需要与实例的直接连接。