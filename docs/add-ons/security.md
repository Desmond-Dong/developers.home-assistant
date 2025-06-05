---
title: "附加组件安全性"
---

Home Assistant 根据所需权限对每个附加组件进行评级。评级为 6 的附加组件非常安全。如果附加组件的评级为 1，除非您 100% 确定可以信任该来源，否则您不应运行此附加组件。

## API 角色

要访问 Supervisor API，您需要定义一个角色或以默认模式运行。这仅适用于 Supervisor API，而不适用于 Home Assistant 代理。所有角色已经可以访问默认 API 调用，不需要任何额外设置。

### 可用角色

| 角色     | 描述                             |
|----------|----------------------------------|
| `default`  | 具有对所有 `info` 调用的访问权限 |
| `homeassistant` | 可以访问所有 Home Assistant API 端点 |
| `backup`  | 可以访问所有备份 API 端点       |
| `manager` | 适用于运行 CLI 的附加组件并需要扩展权限 |
| `admin`   | 访问每个 API 调用。这是他们唯一可以禁用/启用附加组件保护模式的角色 |

## Codenotary CAS

您可以对您的镜像进行签名，并验证我们构建的基础镜像，以提供完整的信任链。此功能由我们的 [Builder](https://github.com/home-assistant/builder) 和 [构建配置](/docs/add-ons/configuration#add-on-extended-build) 支持。要在您的附加组件的 Supervisor 上启用此功能，您只需将您的电子邮件地址添加到附加组件配置 `codenotary` 中。

## 保护

默认情况下，所有附加组件在启用保护模式下运行。此模式防止附加组件获得系统上的任何权限。如果附加组件需要更多权限，您可以通过该附加组件的 API 附加组件选项禁用此保护。但是请小心，禁用保护的附加组件可能会破坏您的系统！

## 制作安全的附加组件

作为开发人员，请遵循以下最佳实践以确保您的附加组件安全：

- 不要在主机网络上运行
- 创建一个 AppArmor 配置文件
- 如果不需要写入访问，仅将文件夹映射为只读
- 如果需要任何 API 访问，请确保不授予不需要的权限
- 使用 [Codenotary CAS](https://cas.codenotary.com/) 对镜像进行签名

## 使用 Home Assistant 用户后端

不要允许用户在纯文本配置中设置新的登录凭据，而是使用 Home Assistant [Auth 后端](/docs/api/supervisor/endpoints#auth)。您可以通过将 `auth_api: true` 启用对 API 的访问。现在您可以将登录凭据发送到认证后端并在 Home Assistant 中验证它们。

## 使用入口时认证用户

当通过 Supervisor 的入口访问附加组件时，可以通过其会话令牌识别授权用户。然后，Supervisor 会在每个请求中添加一些标头以识别用户：

| 标头名称                   | 描述                                      |
|---------------------------|------------------------------------------|
| X-Remote-User-Id           | 已认证的 Home Assistant 用户的 ID        |
| X-Remote-User-Name         | 已认证用户的用户名                        |
| X-Remote-User-Display-Name | 已认证用户的显示名称                      |