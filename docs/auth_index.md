---
title: "身份验证"
sidebar_label: 介绍
---

Home Assistant 具有内置的身份验证系统，允许不同的用户与 Home Assistant 进行交互。身份验证系统由多个部分组成。

<img class='invertDark' src='/img/en/auth/architecture.png'
  alt='不同部分之间交互的概述' />

## 身份验证提供者

身份验证提供者用于用户进行身份验证。身份验证提供者可以选择身份验证的方法和使用的后端。默认情况下，我们启用内置的 Home Assistant 身份验证提供者，该提供者将用户安全地存储在您的配置目录中。

Home Assistant 将使用的身份验证提供者在 `configuration.yaml` 中指定。可以同时激活同一身份验证提供者的多个实例。在这种情况下，每个实例将通过唯一标识符进行标识。同类型的身份验证提供者将不共享凭据。

## 凭据

凭据存储与特定身份验证提供者的用户身份验证信息。它在用户成功进行身份验证时生成。它将使系统能够在我们的系统中找到用户。如果用户不存在，将创建一个新用户。该用户将不会被激活，但需要获得所有者的批准。

用户可以拥有多个与其相关联的凭据。然而，每个特定身份验证提供者只能拥有一个凭据。

## 用户

每个人都是系统中的用户。要以特定用户身份登录，请使用与该用户关联的任何身份验证提供者进行身份验证。当用户登录时，它将获得一个刷新令牌和一个访问令牌，以便向 Home Assistant 发起请求。

### 所有者

在引导期间创建的用户将被标记为“所有者”。所有者能够管理其他用户，并始终拥有所有权限的访问权。

## 组

用户是一个或多个组的成员。组成员资格是用户获得权限的方式。

## 权限策略

这是描述组访问哪些资源的权限策略。有关权限和政策的更多信息，请参见 [权限](auth_permissions.md)。

## 访问和刷新令牌

想要访问 Home Assistant 的应用程序将要求用户启动授权流程。用户成功授权应用程序与 Home Assistant 后，该流程将产生一个授权代码。此代码可用于检索访问令牌和刷新令牌。访问令牌将具有有限的有效期，而刷新令牌在用户将其删除之前将保持有效。

访问令牌用于访问 Home Assistant API。刷新令牌用于检索新的有效访问令牌。

### 刷新令牌类型

刷新令牌有三种不同类型：

- *正常*: 当用户授权应用程序时生成的令牌。应用程序将代表用户保存这些令牌。
- *长期访问令牌*: 这些是支持长期访问令牌的刷新令牌。它们在内部创建，并且从未暴露给用户。
- *系统*: 这些令牌限于由系统用户（如 Home Assistant OS 和 Supervisor）生成和使用。它们从未暴露给用户。