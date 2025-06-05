---
title: "多因素认证模块"
---

多因素认证模块与[认证提供者](auth_auth_provider.md)一起使用，以提供一个完全可配置的认证框架。每个 MFA 模块可以提供一个多因素认证功能。用户可以启用多个 MFA 模块，但在登录过程中只能选择一个模块。

## 定义一个 mfa 认证模块

:::info
我们目前只支持内置的 mfa 认证模块。未来可能会支持自定义的认证模块。
:::

多因素认证模块在 `homeassistant/auth/mfa_modules/<模块名>.py` 中定义。认证模块需要提供 `MultiFactorAuthModule` 类的实现。

有关完整实现的认证模块示例，请参见 [insecure_example.py](https://github.com/home-assistant/core/blob/dev/homeassistant/auth/mfa_modules/insecure_example.py)。

多因素认证模块应扩展 `MultiFactorAuthModule` 类的以下方法。

| 方法 | 必须 | 描述
| ------ | -------- | -----------
| `@property def input_schema(self)` | 是 | 返回定义用户输入表单的模式。
| `async def async_setup_flow(self, user_id)` | 是 | 返回一个 SetupFlow 来处理设置工作流。
| `async def async_setup_user(self, user_id, setup_data)` | 是 | 为使用此认证模块设置用户。
| `async def async_depose_user(self, user_id)` | 是 | 从此认证模块中删除用户信息。
| `async def async_is_user_setup(self, user_id)` | 是 | 返回用户是否已设置。
| `async def async_validate(self, user_id, user_input)` | 是 | 给定用户 ID 和用户输入，返回验证结果。
| `async def async_initialize_login_mfa_step(self, user_id)` | 否 | 在显示登录流程的 MFA 步骤之前调用一次。这不是 MFA 模块的初始化，而是登录流程中的 MFA 步骤。

## 设置流程

在用户可以使用多因素认证模块之前，必须启用或设置该模块。所有可用模块将在用户个人资料页面中列出，用户可以启用想要使用的模块。设置数据输入流程将指导用户完成必要的步骤。

每个 MFA 模块需要实现一个扩展自 `mfa_modules.SetupFlow` 的设置流程处理程序（如果只需要一个简单的设置步骤，也可以使用 `SetupFlow`）。例如，对于 Google Authenticator（基于时间的一次性密码，TOTP）模块，流程需要：

- 生成一个秘密并将其存储在设置流程的实例中
- 返回带有 QR 码的 `async_show_form`（通过 `description_placeholders` 注入为 base64）
- 用户扫描代码并输入代码以验证扫描是否正确并且时钟是否同步
- TOTP 模块将秘密与用户 ID 一起保存，该模块对用户启用

## 工作流程

<img class='invertDark' src='/img/en/auth/mfa_workflow.png'
  alt='多因素认证工作流程' />

<!--
来源: https://drive.google.com/file/d/12_nANmOYnOdqM56BND01nPjJmGXe-M9a/view
-->

## 配置示例

```yaml
# configuration.xml
homeassistant:
  auth_providers:
    - type: homeassistant
    - type: legacy_api_password
  auth_mfa_modules:
    - type: totp
    - type: insecure_example
      users: [{'user_id': 'a_32_bytes_length_user_id', 'pin': '123456'}]
```

在此示例中，用户将首先从 `homeassistant` 或 `legacy_api_password` 认证提供者中进行选择。对于 `homeassistant` 认证提供者，用户首先输入用户名/密码，如果该用户启用了 `totp` 和 `insecure_example`，则用户需要选择一个认证模块，然后根据选择输入 Google Authenticator 代码或输入 PIN 代码。

:::tip
`insecure_example` 仅用于演示目的，请勿在生产环境中使用。
:::

## 验证会话

与认证提供者不同，认证模块使用会话来管理验证。在认证提供者验证后，MFA 模块将创建一个验证会话，包括一个到期时间和来自认证提供者验证结果的用户 ID。多因素认证模块不仅会验证用户输入，还会验证会话是否未过期。验证会话数据存储在您的配置目录中。